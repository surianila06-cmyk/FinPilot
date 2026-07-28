import os
import json
import re

try:
    from groq import Groq
except ImportError:
    Groq = None

from app.config.settings import GROQ_API_KEY


def _safe_float(val) -> float:
    """Coerce any value to float safely."""
    try:
        return float(val or 0)
    except (TypeError, ValueError):
        return 0.0


def fallback_extract_profile(text: str) -> dict:
    """Fallback regex parser to extract financial values when Groq API is unavailable."""
    lines = text.split("\n")

    income = 0.0
    expenses = 0.0
    savings = 0.0
    loans = 0.0
    emi = 0.0
    insurance = 0.0

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

        if any(kw in line_lower for kw in ["net pay", "net salary", "take home", "gross salary", "earnings", "income", "salary"]):
            if max_val > income:
                income = max_val
        elif any(kw in line_lower for kw in ["deduction", "deductions", "expense", "expenses", "tax"]):
            if max_val > expenses:
                expenses = max_val
        elif any(kw in line_lower for kw in ["pf", "provident", "savings", "balance"]):
            if max_val > savings:
                savings = max_val
        elif any(kw in line_lower for kw in ["loan", "principal"]):
            if max_val > loans:
                loans = max_val
        elif any(kw in line_lower for kw in ["emi", "installment"]):
            if max_val > emi:
                emi = max_val
        elif any(kw in line_lower for kw in ["insurance", "lic"]):
            if max_val > insurance:
                insurance = max_val

    return {
    "monthly_income": income,
    "monthly_expenses": expenses,
    "savings": savings,
    "loans": loans,
    "monthly_emi": emi,
    "insurance": insurance,
}


def extract_financial_profile(text: str) -> dict:
    """Extract a structured financial profile from PDF text using Groq LLM or regex fallback."""
    api_key = GROQ_API_KEY or os.getenv("GROQ_API_KEY", "")

    if api_key and Groq is not None:
        try:
            client = Groq(api_key=api_key)
            prompt = f"""You are an expert AI financial document parser.

Analyze the financial document carefully and extract the user's financial profile.

IMPORTANT RULES:
- Return ONLY valid JSON. No markdown, no explanations.
- All amounts must be numeric (no ₹ symbol, no commas, no text).
- Use Indian Rupees (INR). All values must be >= 0.
- If a field is not mentioned in the document, use 0.
- Never invent values not present in the document.

Return ONLY this JSON (no extra keys):
{{
    "monthly_income": 0,
    "monthly_expenses": 0,
    "savings": 0,
    "loans": 0,
    "monthly_emi": 0,
    "insurance": 0
}}

Financial Document:
{text}
"""
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

            # Ensure all values are valid floats >= 0
            safe = {k: _safe_float(v) for k, v in parsed.items()}
            return safe

        except Exception as exc:
            print(f"[gemini_service] Groq API error: {exc}. Falling back to regex parser.")

    return fallback_extract_profile(text)