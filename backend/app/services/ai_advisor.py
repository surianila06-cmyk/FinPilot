import os
from groq import Groq
from app.config.settings import GROQ_API_KEY


def fallback_advice(context):
    """Rule-based fallback advisor when Groq API key is missing or encounters errors."""
    profile = context.get("profile", {}) if isinstance(context, dict) else {}
    question = str(context.get("question", "")) if isinstance(context, dict) else str(context)

    income = float(profile.get("monthly_income") or 50000)
    savings = float(profile.get("savings") or 10000)
    expenses = float(profile.get("monthly_expenses") or 15000)
    
    surplus = income - expenses

    if "gold" in question.lower():
        if savings > 50000:
            return f"✅ Yes, you can consider gold investments.\n\nYour monthly income is ₹{income:,.0f} with savings of ₹{savings:,.0f}.\n\nSuggestions:\n• Allocate at most 10% of portfolio to gold.\n• Consider Sovereign Gold Bonds or Digital Gold.\n\nKeep building healthy financial habits! 💡"
        else:
            return f"⚠ Maybe, but be careful.\n\nYour monthly income is ₹{income:,.0f} and savings are ₹{savings:,.0f}.\n\nSuggestions:\n• Build an emergency fund of 3-6 months expenses first.\n• Start small with Digital Gold SIPs.\n\nYou're making progress—keep saving! 🚀"
    elif "bike" in question.lower() or "car" in question.lower():
        if surplus > 15000:
            return f"✅ Yes, you can afford a vehicle EMI.\n\nYour monthly surplus is around ₹{surplus:,.0f}.\n\nSuggestions:\n• Keep total vehicle EMI under 15% of income.\n• Make a larger down payment to lower interest.\n\nDrive safely and stay financially disciplined! 🚗"
        else:
            return f"⚠ Maybe, but be careful.\n\nYour monthly surplus is ₹{surplus:,.0f}.\n\nSuggestions:\n• Save a higher down payment first.\n• Check pre-owned options.\n\nPlan carefully for long-term stability! 🏍️"
    elif "loan" in question.lower():
        return f"⚠ Be cautious with new loans.\n\nYour current monthly income is ₹{income:,.0f}.\n\nSuggestions:\n• Total EMIs should not exceed 40% of net income.\n• Compare interest rates across multiple lenders.\n\nSmart borrowing leads to financial freedom! 📊"
    else:
        return f"💡 FinPilot Financial Insight:\n\nWith a monthly income of ₹{income:,.0f} and estimated surplus of ₹{surplus:,.0f}:\n\nSuggestions:\n• Save at least 20% of net income every month.\n• Maintain 6 months of expenses in an liquid emergency fund.\n• Start a low-cost Index Fund SIP.\n\nYou're on the right track—keep building your financial future! 🌟"


def generate_advice(context):
    api_key = GROQ_API_KEY or os.getenv("GROQ_API_KEY")
    
    if api_key:
        try:
            client = Groq(api_key=api_key)
            prompt = f"""
You are FinPilot AI, a smart and friendly financial assistant.

Your job is to answer the user's financial question in a simple, conversational way.

Financial Profile:
{context}

Rules:
- Keep the answer under 120 words.
- Use short sentences.
- Do NOT write headings like "Financial Assessment" or "Suggested Next Steps".
- Use emojis where appropriate.
- Mention key numbers.
- End with one encouraging sentence.
"""
            response = client.chat.completions.create(
                model="llama-3.1-8b-instant",
                messages=[{"role": "user", "content": prompt}]
            )
            return response.choices[0].message.content
        except Exception as e:
            print(f"Groq API advisor error: {e}. Using fallback advisor.")

    return fallback_advice(context)