def get_gold_price(profile):

    gold_price = 9800000

    savings = profile.get("savings", 0)
    income = profile.get("monthly_income", 0)

    remaining = max(gold_price - savings, 0)

    monthly_save = income * 0.3

    months = None

    if monthly_save > 0:
        months = round(remaining / monthly_save)

    if savings >= gold_price:

        message = (
            "✅ You can afford this purchase.\n\n"
            f"Gold Price: ₹{gold_price:,}\n"
            f"Current Savings: ₹{savings:,}\n\n"
            "Make sure you still have enough emergency savings after buying."
        )

    else:

        message = (
            "❌ Buying 1 kg of gold is not recommended right now.\n\n"
            f"Gold Price: ₹{gold_price:,}\n"
            f"Current Savings: ₹{savings:,}\n"
            f"Monthly Income: ₹{income:,}\n\n"
            f"Estimated time to save: {months} months.\n\n"
            "Suggestions:\n"
            "• Increase your monthly savings.\n"
            "• Build an emergency fund first.\n"
            "• Consider Gold ETFs or Sovereign Gold Bonds."
        )

    return {
        "message": message
    }