import os
import json
import re

try:
    from groq import Groq
except ImportError:
    Groq = None

from fastapi import HTTPException
from app.config.settings import GROQ_API_KEY, APP_ENV


def _safe_float(val) -> float:
    """Coerce any value to float safely (None -> 0.0)."""
    try:
        return float(val or 0)
    except (TypeError, ValueError):
        return 0.0


def _safe_int(val) -> int:
    """Coerce any value to int safely (None -> 0)."""
    try:
        return int(float(val))
    except (TypeError, ValueError):
        return 0


def normalize_profile(data: dict) -> dict:
    """Map the LLM extraction schema to the profile shape used by scoring and the frontend.

    The LLM returns `liquid_savings` / `active_loans`; internal consumers
    (health_score, planner tools, dashboard) expect `savings` / `loans`,
    so both are exposed as aliases for backward compatibility.

    `financial_score` from the LLM is kept for reference only; the upload
    endpoint computes the authoritative score with health_score.py.
    """
    liquid_savings = _safe_float(data.get("liquid_savings"))
    emi = _safe_float(data.get("monthly_emi"))
    active_loans = _safe_int(data.get("active_loans"))

    # Consistency rule (mirrors the prompt): an EMI implies at least one active loan.
    if emi > 0 and active_loans < 1:
        active_loans = 1

    return {
        "document_type": data.get("document_type"),
        "monthly_income": _safe_float(data.get("monthly_income")),
        "monthly_expenses": _safe_float(data.get("monthly_expenses")),
        "insurance": _safe_float(data.get("insurance")),
        "monthly_emi": emi,
        "active_loans": active_loans,
        "liquid_savings": liquid_savings,
        "savings_source": data.get("savings_source"),
        "investments": _safe_float(data.get("investments")),
        "financial_score": data.get("financial_score"),
        "reasoning": data.get("reasoning"),
        "savings": liquid_savings,
        "loans": active_loans,
    }


def _detect_document_type(text_lower: str) -> str:
    if any(kw in text_lower for kw in ["form 16", "form16", "16as", "itr", "income tax return"]):
        return "form_16"
    if any(kw in text_lower for kw in [
        "bank statement", "account statement", "transaction",
        "opening balance", "closing balance", "debit", "credit",
    ]):
        return "bank_statement"
    if any(kw in text_lower for kw in [
        "payslip", "pay slip", "salary slip", "gross earnings",
        "net pay", "take home", "salary",
    ]):
        return "payslip"
    if any(kw in text_lower for kw in ["credit card", "credit card statement"]):
        return "credit_card_statement"
    if any(kw in text_lower for kw in ["loan statement", "loan account", "emi schedule"]):
        return "loan_statement"
    if any(kw in text_lower for kw in ["offer letter", "offer", "ctc"]):
        return "offer_letter"
    return "unknown"


def fallback_extract_profile(text: str) -> dict:
    """Heuristic regex parser used only when the Groq API is unavailable.

    Returns the same enriched schema as the LLM extraction path so the
    frontend and scoring behave consistently regardless of which path ran.
    """
    lines = text.split("\n")
    text_lower = text.lower()

    income = 0.0
    expenses = 0.0
    savings = 0.0
    loans = 0.0
    emi = 0.0
    insurance = 0.0
    investments = 0.0

    document_type = _detect_document_type(text_lower)
    savings_source = None
    if document_type == "bank_statement":
        savings_source = "closing_balance"
    elif document_type == "payslip":
        savings_source = "pf"

    num_pattern = re.compile(r'[\₹\$\s]?(\d[\d,]*\.?\d*)')

    for line in lines:
        line_lower = line.lower()
        numbers = num_pattern.findall(line)
        cleaned = []
        for num in numbers:
            clean = num.replace(",", "").strip()
            if clean and clean.replace(".", "", 1).isdigit():
                try:
                    v = float(clean)
                    if v > 0:
                        cleaned.append(v)
                except ValueError:
                    pass

        if not cleaned:
            continue

        max_val = max(cleaned)

        if any(kw in line_lower for kw in [
            "net pay", "net salary", "take home", "gross salary",
            "gross earnings", "earnings", "income", "salary",
        ]):
            if max_val > income:
                income = max_val
        elif any(kw in line_lower for kw in [
            "deduction", "deductions", "expense", "expenses", "tax",
            "grocery", "rent", "utility", "electricity",
        ]):
            if max_val > expenses:
                expenses = max_val
        elif any(kw in line_lower for kw in ["pf", "provident", "savings", "balance", "nps", "vpf"]):
            if max_val > savings:
                savings = max_val
        elif any(kw in line_lower for kw in ["loan", "principal"]):
            if max_val > loans:
                loans = max_val
        elif any(kw in line_lower for kw in ["emi", "installment"]):
            if max_val > emi:
                emi = max_val
        elif any(kw in line_lower for kw in ["insurance", "lic", "mediclaim"]):
            if max_val > insurance:
                insurance = max_val
        elif any(kw in line_lower for kw in [
            "sip", "mutual fund", "etf", "stock", "recurring deposit",
            "fixed deposit", "invest",
        ]):
            if max_val > investments:
                investments = max_val

    active_loans = 1 if (loans > 0 or emi > 0) else 0

    reasoning = {
        "loan_detection": "loan or EMI keywords detected" if active_loans else "no loan or EMI evidence found",
        "income_detection": "salary/income keywords detected" if income > 0 else "no income evidence found",
        "expense_detection": "expense/deduction keywords detected" if expenses > 0 else "no expense evidence found",
    }

    return normalize_profile({
        "document_type": document_type,
        "monthly_income": income,
        "monthly_expenses": expenses,
        "insurance": insurance,
        "monthly_emi": emi,
        "active_loans": active_loans,
        "liquid_savings": savings,
        "savings_source": savings_source,
        "investments": investments,
        "financial_score": None,
        "reasoning": reasoning,
    })


EXTRACTION_PROMPT = """You are FinPilot's Financial Intelligence Engine.

Your task is to analyze ONE uploaded financial document and extract a structured financial profile.

The document may be:
- Bank Statement
- Salary Slip / Payslip
- Form 16
- Offer Letter
- Loan Statement
- Credit Card Statement
- Investment Statement

Return ONLY valid JSON.

=========================
IMPORTANT PRINCIPLE
=========================

Use TWO phases internally.

Phase 1:
Extract explicit information from the document.

Phase 2:
Infer missing financial information ONLY using the rules below.

Never invent values.

If something cannot be determined,
return null.

=========================
FIELD DEFINITIONS
=========================

monthly_income
---------------
Salary received every month.

Recognize:

Salary
Salary Credit
Payroll
Gross Salary
Net Salary
Gross Earnings
Monthly Income
Monthly Salary
Income

If annual salary is available,
divide by 12.

Otherwise return null.

----------------------------------------

monthly_expenses
----------------

For bank statements, sum every expense transaction including:

Rent
Fuel
Dining
Shopping
Utilities
Medical
Insurance Premium
EMI
Loan Repayment
Credit Card Bill
Subscriptions
Education
Travel
Groceries

Exclude:

Opening Balance
Closing Balance
Salary Credit
Interest Credit
Refunds
Transfers between own accounts

Return total monthly spending.

----------------------------------------

insurance
----------

Recognize:

Health Insurance
Medical Insurance
Life Insurance
Insurance Premium
Mediclaim
ESI
Group Insurance

Return monthly premium.

Otherwise null.

----------------------------------------

monthly_emi
------------

Recognize:

EMI
Loan EMI
Home Loan EMI
Education Loan EMI
Car Loan EMI
Personal Loan EMI
Housing Loan EMI

Return total monthly EMI.

If none exist

return null.

----------------------------------------

active_loans
------------

THIS FIELD MUST BE INFERRED.

Rules:

If any transaction contains:

Home Loan EMI

Car Loan EMI

Personal Loan EMI

Education Loan EMI

Loan Repayment

Loan Recovery

Housing Loan

Mortgage

Vehicle Loan

Student Loan

THEN

active_loans >= 1

Never return zero if an EMI exists.

If two different EMIs exist

Home Loan EMI
Car Loan EMI

Return

2

If one EMI exists

Return

1

If no evidence exists

Return

0

----------------------------------------

liquid_savings
---------------

IMPORTANT

Liquid savings is NOT investment.

Liquid savings means money immediately available.

Rules:

Bank Statement

Use

Closing Balance

ONLY if no separate savings balance exists.

Set

"savings_source":"closing_balance"

Payslip

DO NOT use salary.

Use only

PF
VPF
NPS
Employer Contribution

If savings cannot be determined

return null.

----------------------------------------

investments
------------

Recognize

SIP

Mutual Fund

NPS

PPF

ETF

Stocks

Recurring Deposit

Fixed Deposit

Return total monthly investment.

Do NOT include these in expenses.

----------------------------------------

financial_score
----------------

Calculate only after every field is extracted.

Example logic

Income Stable +20

Insurance +15

Savings +20

EMI less than 30% income +15

Expenses less than 70% income +15

No active loans +15

Cap at 100.

=========================
OUTPUT FORMAT
=========================

{
  "document_type": "",
  "monthly_income": null,
  "monthly_expenses": null,
  "insurance": null,
  "monthly_emi": null,
  "active_loans": 0,
  "liquid_savings": null,
  "savings_source": null,
  "investments": null,
  "financial_score": 0,
  "reasoning": {
      "loan_detection": "",
      "income_detection": "",
      "expense_detection": ""
  }
}

IMPORTANT

Never output

active_loans = 0

when

monthly_emi > 0

That is considered an invalid response.

Before returning the JSON, verify these consistency rules:

Rule 1:
monthly_emi > 0
→ active_loans must be at least 1

Rule 2:
Insurance transaction exists
→ insurance cannot be null

Rule 3:
Salary Credit exists
→ monthly_income cannot be null

Rule 4:
Closing Balance exists
→ liquid_savings should use it if no other savings value exists

Rule 5:
Output only valid JSON.
"""


def extract_financial_profile(text: str) -> dict:
    """Extract a structured financial profile from PDF text using Groq LLM or regex fallback."""
    api_key = GROQ_API_KEY or os.getenv("GROQ_API_KEY", "")

    if api_key and Groq is not None:
        try:
            client = Groq(api_key=api_key)
            prompt = EXTRACTION_PROMPT + "\n\n========================\nFinancial Document:\n" + text
            completion = client.chat.completions.create(
                model="llama-3.3-70b-versatile",
                messages=[{"role": "user", "content": prompt}],
                temperature=0,
            )

            content = completion.choices[0].message.content.strip()

            # Strip markdown code fences if present
            if content.startswith("```"):
                content = re.sub(r"```(?:json)?", "", content).replace("```", "").strip()

            parsed = json.loads(content)

            if not isinstance(parsed, dict):
                raise ValueError("Groq response is not a JSON object.")

            return normalize_profile(parsed)

        except Exception as exc:
            print(f"[gemini_service] Groq API error: {exc}. Falling back to regex parser.")
            if APP_ENV == "production":
                raise HTTPException(
                    status_code=503,
                    detail="LLM extraction temporarily unavailable. Please try again.",
                ) from exc

    return fallback_extract_profile(text)
