def goal_analysis(profile, query):

    if not isinstance(profile, dict):
        profile = {}

    income = float(profile.get("monthly_income") or 0)
    savings = float(profile.get("savings") or 0)

    goal_amount = 0
    goal_name = "financial goal"
    years = 1

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

    if affordable:
        advice = (
            f"✅ You can afford the {goal_name}.\n\n"
            f"Estimated Cost: ₹{goal_amount:,}\n\n"
            "Make sure you still have enough emergency savings after the purchase."
        )

    else:
        advice = (
            f"⚠ Buying a {goal_name} right now may not be the best decision.\n\n"
            f"Estimated Cost: ₹{goal_amount:,}\n"
            f"Monthly Income: ₹{income:,}\n"
            f"Current Savings: ₹{savings:,}\n\n"
            f"You should save about ₹{round(monthly_required):,} every month for {years} years.\n\n"
            "Suggestions:\n"
            "• Increase monthly savings.\n"
            "• Reduce unnecessary expenses.\n"
            "• Avoid taking unnecessary loans."
        )

    return {
        "message": advice
    }