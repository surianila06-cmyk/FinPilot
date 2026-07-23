from app.services.ai_advisor import generate_advice


def get_gold_price(profile):

    # Approximate price of 1kg gold in INR
    gold_price = 9800000

    savings = profile.get("savings", 0)
    income = profile.get("monthly_income", 0)

    remaining_amount = max(gold_price - savings, 0)

    # Assuming user can save 30% of monthly income
    monthly_saving_capacity = income * 0.3

    if monthly_saving_capacity > 0:
        estimated_months = remaining_amount / monthly_saving_capacity
    else:
        estimated_months = None


    context = {
        "goal": "Purchase 1kg gold",
        "gold_price": f"₹{gold_price:,}",
        "current_savings": f"₹{savings:,}",
        "remaining_amount": f"₹{remaining_amount:,}",
        "monthly_income": f"₹{income:,}",
        "monthly_expenses": f"₹{profile.get('monthly_expenses', 0):,}",
        "loans": f"₹{profile.get('loans', 0):,}",
        "monthly_emi": f"₹{profile.get('monthly_emi', 0):,}",
        "financial_score": profile.get("financial_score", 0),
        "estimated_months": round(estimated_months) if estimated_months else "Not calculable"
    }


    advice = generate_advice(context)


    return {
        "gold_price": gold_price,
        "remaining_amount": remaining_amount,
        "estimated_months": round(estimated_months) if estimated_months else None,
        "ai_recommendation": advice
    }