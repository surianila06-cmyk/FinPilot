from app.services.ai_advisor import generate_advice


def budget_analysis(profile):

    income = profile.get("monthly_income", 0)
    expenses = profile.get("monthly_expenses", 0)
    savings = profile.get("savings", 0)

    monthly_surplus = income - expenses

    expense_ratio = 0

    if income > 0:
        expense_ratio = expenses / income


    context = {
        "goal": "Optimize monthly budget",
        "monthly_income": f"₹{income:,}",
        "monthly_expenses": f"₹{expenses:,}",
        "monthly_surplus": f"₹{monthly_surplus:,}",
        "current_savings": f"₹{savings:,}",
        "expense_ratio": f"{round(expense_ratio * 100,2)}%"
    }


    advice = generate_advice(context)


    return {
        "monthly_surplus": monthly_surplus,
        "expense_ratio": round(expense_ratio * 100, 2),
        "ai_recommendation": advice
    }