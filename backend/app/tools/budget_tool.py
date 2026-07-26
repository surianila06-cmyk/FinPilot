def budget_analysis(profile):

    if not isinstance(profile, dict):
        profile = {}

    income = float(profile.get("monthly_income") or 0)
    expenses = float(profile.get("monthly_expenses") or 0)
    savings = float(profile.get("savings") or 0)

    monthly_surplus = income - expenses

    expense_ratio = 0

    if income > 0:
        expense_ratio = expenses / income


    if expense_ratio < 0.5:
        message = (
        f"✅ Your spending looks healthy.\n\n"
        f"Monthly Income: ₹{income:,}\n"
        f"Monthly Expenses: ₹{expenses:,}\n"
        f"Monthly Surplus: ₹{monthly_surplus:,}\n\n"
        "Keep saving regularly and consider investing for long-term goals."
    )

    else:
        message = (
        f"⚠ Your expenses are taking up a large portion of your income.\n\n"
        f"Monthly Income: ₹{income:,}\n"
        f"Monthly Expenses: ₹{expenses:,}\n"
        f"Monthly Surplus: ₹{monthly_surplus:,}\n\n"
        "Suggestions:\n"
        "• Reduce unnecessary spending.\n"
        "• Track your monthly budget.\n"
        "• Increase your emergency savings."
    )
    return {
    "message": message
}