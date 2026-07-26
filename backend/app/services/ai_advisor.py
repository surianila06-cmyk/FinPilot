import os

try:
    from groq import Groq
except ImportError:
    Groq = None

from app.config.settings import GROQ_API_KEY

_SYSTEM_PROMPT = """You are FinPilot AI, an expert and empathetic Indian personal finance advisor.

Your persona:
- Warm, encouraging, and data-driven
- Knowledgeable about Indian financial instruments (SGB, ELSS, PPF, NPS, FD, RD, Mutual Funds, SIPs)
- Fluent with Indian tax rules (80C, 80D, HRA exemptions)

Rules for every response:
- Keep answers under 150 words.
- Use bullet points for suggestions (•).
- Always reference the user's actual numbers (income, savings, EMI, etc.).
- Use emojis sparingly but effectively.
- End every response with one short motivating sentence.
- Do NOT use headings like "Financial Assessment" or "Recommended Steps".
- NEVER give generic advice — always be specific to the user's profile.
"""


def fallback_advice(profile: dict, question: str) -> str:
    """Rule-based fallback when Groq API is unavailable."""
    income = float(profile.get("monthly_income") or 50000)
    savings = float(profile.get("savings") or 10000)
    expenses = float(profile.get("monthly_expenses") or 15000)
    emi = float(profile.get("monthly_emi") or 0)
    surplus = income - expenses - emi
    q = question.lower()

    if "gold" in q or "sgb" in q:
        if savings > 50000:
            return (f"✅ With ₹{savings:,.0f} in savings, you can consider gold investments.\n\n"
                    "• Allocate 5–10% of total savings to Gold.\n"
                    "• Sovereign Gold Bonds (SGB) give 2.5% interest + capital gains tax exemption on maturity.\n"
                    "• Digital Gold SIPs from ₹10/month are a great start.\n\n"
                    "Diversification is the cornerstone of wealth! 💛")
        else:
            return (f"⚠ Your savings of ₹{savings:,.0f} are still building up.\n\n"
                    "• Build a 3-month emergency fund (₹{3*expenses:,.0f}) before investing in gold.\n"
                    "• Start with Digital Gold SIPs at ₹500/month.\n\n"
                    "Every rupee saved is a step forward! 🚀")

    elif any(k in q for k in ["bike", "car", "vehicle", "scooter"]):
        if surplus > 12000:
            return (f"✅ Your monthly surplus of ₹{surplus:,.0f} supports a vehicle EMI.\n\n"
                    "• Keep vehicle EMI under 15% of income (≤ ₹{income*0.15:,.0f}/month).\n"
                    "• Aim for 30%+ down payment to reduce total interest paid.\n"
                    "• Pre-owned vehicles cut cost by 20–40%.\n\n"
                    "Drive smart, stay financially free! 🚗")
        else:
            return (f"⚠ Your current surplus of ₹{surplus:,.0f}/month is tight for a vehicle EMI.\n\n"
                    "• Save a larger down payment over 6 months first.\n"
                    "• Consider pre-owned options to reduce cost.\n\n"
                    "With a little more preparation, you'll be road-ready! 🏍️")

    elif any(k in q for k in ["loan", "emi", "borrow", "credit"]):
        return (f"⚠ Before borrowing, review your current situation.\n\n"
                f"• Monthly Income: ₹{income:,.0f} | Current EMI: ₹{emi:,.0f}\n"
                "• Total EMIs must stay below 40% of net income.\n"
                "• Compare PSU vs private bank interest rates carefully.\n\n"
                "Smart borrowing today means financial freedom tomorrow! 📊")

    elif any(k in q for k in ["sip", "mutual fund", "invest", "index"]):
        sip_amount = max(500, int(surplus * 0.5))
        return (f"💡 Investing is the best decision you can make right now!\n\n"
                f"• Your surplus of ₹{surplus:,.0f} can support a ₹{sip_amount:,}/month SIP.\n"
                "• Nifty 50 Index Funds have delivered ~12% CAGR over 10 years.\n"
                "• Start on Zerodha Coin, Groww, or MFCentral — no commissions.\n\n"
                "Let compounding do the heavy lifting for you! 📈")

    else:
        return (f"💡 FinPilot Financial Snapshot:\n\n"
                f"• Monthly Income: ₹{income:,.0f} | Surplus: ₹{surplus:,.0f}\n"
                f"• Savings: ₹{savings:,.0f}\n"
                "• Save at least 20% of income monthly.\n"
                "• Maintain 6 months of expenses as emergency reserves.\n"
                "• Start a low-cost Nifty Index Fund SIP.\n\n"
                "You're building a great financial future! 🌟")


def generate_advice(context: dict, chat_history: list | None = None) -> str:
    """Generate financial advice using Groq LLM, falling back to rule-based logic."""
    if not isinstance(context, dict):
        context = {}

    profile = context.get("profile", {}) or {}
    question = str(context.get("question", "")).strip()

    api_key = GROQ_API_KEY or os.getenv("GROQ_API_KEY", "")

    if api_key and Groq is not None:
        try:
            client = Groq(api_key=api_key)

            messages = [{"role": "system", "content": _SYSTEM_PROMPT}]

            # Inject financial profile context
            profile_context = (
                f"\nUser's Financial Profile:\n"
                f"- Monthly Income: ₹{float(profile.get('monthly_income') or 0):,.0f}\n"
                f"- Monthly Expenses: ₹{float(profile.get('monthly_expenses') or 0):,.0f}\n"
                f"- Liquid Savings: ₹{float(profile.get('savings') or 0):,.0f}\n"
                f"- Active Loans: ₹{float(profile.get('loans') or 0):,.0f}\n"
                f"- Monthly EMI: ₹{float(profile.get('monthly_emi') or 0):,.0f}\n"
                f"- Insurance Premium: ₹{float(profile.get('insurance') or 0):,.0f}/month\n"
            )
            messages.append({"role": "system", "content": profile_context})

            # Add previous conversation turns
            if chat_history:
                for turn in chat_history[-6:]:  # Last 6 turns for context window efficiency
                    messages.append({
                        "role": turn.get("role", "user"),
                        "content": turn.get("content", ""),
                    })

            messages.append({"role": "user", "content": question})

            response = client.chat.completions.create(
                model="llama-3.1-8b-instant",
                messages=messages,
                max_tokens=300,
            )
            return response.choices[0].message.content.strip()

        except Exception as exc:
            print(f"[ai_advisor] Groq API error: {exc}. Using fallback advisor.")

    return fallback_advice(profile, question)