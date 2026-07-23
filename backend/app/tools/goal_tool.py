from app.services.ai_advisor import generate_advice


def goal_analysis(profile, query):

    income = profile.get("monthly_income", 0)
    savings = profile.get("savings", 0)

    # Default values
    goal_amount = 0
    goal_name = "financial goal"
    years = 1


    # Simple extraction from user query
    query_lower = query.lower()


    if "bike" in query_lower:
        goal_name = "bike"
        goal_amount = 300000
        years = 2

    elif "car" in query_lower:
        goal_name = "car"
        goal_amount = 800000
        years = 3

    elif "house" in query_lower:
        goal_name = "house"
        goal_amount = 5000000
        years = 5

    elif "vacation" in query_lower:
        goal_name = "vacation"
        goal_amount = 100000
        years = 1


    monthly_required = goal_amount / (years * 12)


    affordable = savings >= goal_amount

    context = {
        "goal": goal_name,
        "goal_amount": f"₹{goal_amount:,}",
        "target_duration": f"{years} years",
        "monthly_saving_required": f"₹{round(monthly_required):,}",
        "monthly_income": f"₹{income:,}",
        "current_savings": f"₹{savings:,}",
        "already_affordable": affordable,
        "financial_score": profile.get("financial_score", 0)
    }


    advice = generate_advice(context)


    return {
        "goal": goal_name,
        "goal_amount": goal_amount,
        "monthly_required": round(monthly_required),
        "ai_recommendation": advice
    }