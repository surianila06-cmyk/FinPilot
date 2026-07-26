def budget_analysis(profile: dict) -> dict:
    if not isinstance(profile, dict):
        profile = {}

    income = float(profile.get("monthly_income") or 0)
    expenses = float(profile.get("monthly_expenses") or 0)
    savings = float(profile.get("savings") or 0)
    emi = float(profile.get("monthly_emi") or 0)

    monthly_surplus = income - expenses - emi
    expense_ratio = expenses / income if income > 0 else 0

    # Savings reserve months
    reserve_months = round(savings / expenses, 1) if expenses > 0 else 0

    # Classify spending health
    if expense_ratio < 0.3:
        status = "excellent"
        headline = "✅ Exceptional spending control!"
        advice = "Your expense ratio is outstanding. You have significant room to invest and build wealth aggressively."
    elif expense_ratio < 0.5:
        status = "healthy"
        headline = "✅ Your spending looks healthy."
        advice = "Keep saving regularly and consider starting/increasing your SIP contributions."
    elif expense_ratio < 0.7:
        status = "moderate"
        headline = "⚠ Your expenses are moderate."
        advice = "Review discretionary spending. Try the 50/30/20 rule: 50% needs, 30% wants, 20% savings."
    else:
        status = "high"
        headline = "❌ Your expense load is high."
        advice = "Urgent action needed. Track every expense, cut subscriptions, and pause discretionary spending."

    ideal_savings_rate = round((monthly_surplus / income * 100) if income > 0 else 0, 1)

    message = (
        f"{headline}\n\n"
        f"Monthly Income:   ₹{income:,.0f}\n"
        f"Monthly Expenses: ₹{expenses:,.0f}\n"
        f"Monthly EMI:      ₹{emi:,.0f}\n"
        f"Monthly Surplus:  ₹{monthly_surplus:,.0f}\n"
        f"Savings Rate:     {ideal_savings_rate}%\n"
        f"Emergency Buffer: {reserve_months} months\n\n"
        f"{advice}\n\n"
        "Suggestions:\n"
        "• Track daily expenses using a budgeting app.\n"
        "• Automate savings transfers on payday.\n"
        "• Review subscriptions and cut unused ones.\n"
        "• Target a minimum 20% savings rate."
    )

    return {"message": message, "status": status, "expense_ratio": round(expense_ratio, 3)}