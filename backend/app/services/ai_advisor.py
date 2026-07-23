from groq import Groq
import os

client = Groq(
    api_key=os.getenv("GROQ_API_KEY")
)


def generate_advice(context):

    prompt = f"""
You are an expert personal finance advisor AI.

Analyze the user's financial situation and provide realistic,
personalized financial advice.

Important rules:
- All monetary values are in Indian Rupees (INR ₹).
- Never convert INR values into dollars or any other currency.
- monthly_income represents monthly income, not yearly income.
- Use the exact financial numbers provided in the data.
- Do not give unrealistic saving timelines.
- Consider inflation and future price changes for long-term financial goals.
- If a goal is unaffordable compared to the user's income, savings, or financial capacity, clearly mention it.
- Avoid recommending unnecessary loans or debt for purchases.
- If the user has strong financial health, focus on wealth creation and smart allocation of money rather than only reducing expenses.
- Consider emergency funds, investments, and long-term stability when giving advice.
- Give practical recommendations suitable for a normal user.
- Avoid generic financial advice; make suggestions based on the user's actual profile.
- If current savings already cover the goal amount, clearly mention that the user can afford it and focus on maintaining emergency savings.

Financial Data:
{context}

Provide the response in this format:

1. Financial Assessment:
Summarize the user's current financial position using the given numbers.

2. Recommendation:
Clearly state whether the user should proceed, delay, or avoid the decision.

3. Reason:
Explain the recommendation using income, savings, affordability, and timeline.

4. Suggested Next Steps:
Give 3-5 practical actions.

Keep the response concise, clear, and user-friendly.
"""

    response = client.chat.completions.create(
        model="llama-3.1-8b-instant",
        messages=[
            {
                "role": "user",
                "content": prompt
            }
        ]
    )

    return response.choices[0].message.content