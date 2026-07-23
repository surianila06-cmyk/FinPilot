from groq import Groq
from app.config.settings import GROQ_API_KEY
import json

client = Groq(api_key=GROQ_API_KEY)


def extract_financial_profile(text: str):

    prompt = f"""
You are an expert financial document parser.

Extract the following information from the document.

Return ONLY valid JSON.

Schema:

{{
    "monthly_income": number,
    "monthly_expenses": number,
    "savings": number,
    "loans": number,
    "monthly_emi": number,
    "insurance": number
}}

Document:

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