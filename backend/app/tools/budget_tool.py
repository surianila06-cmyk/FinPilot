def budget_analysis(profile):

    income = profile.get("monthly_income", 0)
    expenses = profile.get("monthly_expenses", 0)
    savings = profile.get("savings", 0)

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