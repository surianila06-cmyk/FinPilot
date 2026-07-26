from groq import Groq
from app.config.settings import GROQ_API_KEY
import json

client = Groq(api_key=GROQ_API_KEY)


def extract_financial_profile(text: str):

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

Extraction Rules:

1. monthly_income
- Prefer Net Salary.
- If Net Salary is unavailable, use Gross Salary.

2. monthly_expenses
- If Total Deductions are present, use that value.
- Otherwise estimate using recurring deductions.
- If impossible to determine, return null.

3. savings
- If PF, savings, investments, bank balance or account balance are available,
  use the best available value.
- Otherwise return null.

4. loans
- Extract outstanding loan amount if present.
- If no loan is mentioned, return 0.

5. monthly_emi
- Extract EMI amount if available.
- Otherwise return 0.

6. insurance
- Extract insurance deduction if available.
- Otherwise return 0.

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
        messages=[
            {
                "role": "user",
                "content": prompt
            }
        ],
        temperature=0
    )

    content = completion.choices[0].message.content.strip()

    # Remove markdown if the model returns ```json ... ```
    if content.startswith("```"):
        content = content.replace("```json", "")
        content = content.replace("```", "")
        content = content.strip()

    return json.loads(content)