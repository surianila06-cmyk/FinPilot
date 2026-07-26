import os
import json
import re
from groq import Groq
from app.config.settings import GROQ_API_KEY


def fallback_extract_profile(text: str):
    """Fallback parser to extract financial values using regex if Groq API is unavailable."""
    lines = text.split("\n")
    
    income = 0
    expenses = 0
    savings = 0
    loans = 0
    emi = 0
    insurance = 0
    
    # Try finding numeric values associated with keywords
    for line in lines:
        line_lower = line.lower()
        numbers = re.findall(r'[\₹\$\s]?(\d[\d,]*\.?\d*)', line)
        cleaned_numbers = []
        for num in numbers:
            clean = num.replace(",", "").strip()
            if clean and clean.replace('.', '', 1).isdigit():
                try:
                    val = float(clean)
                    if val > 0:
                        cleaned_numbers.append(val)
                except ValueError:
                    pass
        
        if not cleaned_numbers:
            continue
            
        max_val = max(cleaned_numbers)
        
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

    # Default fallback defaults if no numbers extracted
    if income == 0:
        income = 50000.0
    if expenses == 0:
        expenses = 15000.0
    if savings == 0:
        savings = 10000.0

    return {
        "monthly_income": income,
        "monthly_expenses": expenses,
        "savings": savings,
        "loans": loans,
        "monthly_emi": emi,
        "insurance": insurance
    }


def extract_financial_profile(text: str):
    api_key = GROQ_API_KEY or os.getenv("GROQ_API_KEY")
    
    if api_key:
        try:
            client = Groq(api_key=api_key)
            prompt = f"""
You are an expert AI financial document parser.

Analyze the financial document carefully and extract the user's financial profile.

IMPORTANT RULES:
- Return ONLY valid JSON.
- Do not include markdown.
- Do not include explanations.
- All amounts must be numeric (no ₹, commas or text).
- Use Indian Rupees (INR).
- Never invent unrealistic values.

Return ONLY this JSON format:
{{
    "monthly_income": 0,
    "monthly_expenses": null,
    "savings": null,
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
                temperature=0
            )

            content = completion.choices[0].message.content.strip()

            if content.startswith("```"):
                content = content.replace("```json", "").replace("```", "").strip()

            return json.loads(content)
        except Exception as e:
            print(f"Groq API error during PDF extraction: {e}. Utilizing fallback parser.")
            
    return fallback_extract_profile(text)