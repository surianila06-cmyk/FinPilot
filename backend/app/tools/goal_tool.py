import math


GOALS = {
    "bike": {"amount": 120000, "years": 1, "label": "Bike"},
    "scooter": {"amount": 80000, "years": 1, "label": "Scooter"},
    "car": {"amount": 800000, "years": 3, "label": "Car"},
    "house": {"amount": 5000000, "years": 7, "label": "House"},
    "vacation": {"amount": 100000, "years": 1, "label": "Vacation"},
    "laptop": {"amount": 80000, "years": 1, "label": "Laptop"},
    "education": {"amount": 500000, "years": 2, "label": "Education"},
    "wedding": {"amount": 1000000, "years": 3, "label": "Wedding"},
    "emergency fund": {"amount": None, "years": 1, "label": "Emergency Fund"},  # dynamic
}


def goal_analysis(profile: dict, query: str) -> dict:
    if not isinstance(profile, dict):
        profile = {}

    income = float(profile.get("monthly_income") or 0)
    savings = float(profile.get("savings") or 0)
    expenses = float(profile.get("monthly_expenses") or 0)
    emi = float(profile.get("monthly_emi") or 0)
    surplus = income - expenses - emi

    query_lower = query.lower()

    # Find matching goal
    matched_key = None
    for key in GOALS:
        if key in query_lower:
            matched_key = key
            break

    # Dynamic emergency fund goal
    if matched_key == "emergency fund":
        goal_amount = expenses * 6
        goal_label = "Emergency Fund (6 months)"
        years = 1
    elif matched_key:
        goal = GOALS[matched_key]
        goal_amount = goal["amount"]
        goal_label = goal["label"]
        years = goal["years"]
    else:
        # Generic goal — estimate from query or use conservative default
        goal_amount = 200000
        goal_label = "financial goal"
        years = 2

    months_needed = years * 12
    monthly_required = goal_amount / months_needed if months_needed > 0 else goal_amount

    # Can afford outright?
    if savings >= goal_amount:
        months_to_goal = 0
        message = (
            f"✅ You can afford this {goal_label} from your current savings!\n\n"
            f"Estimated Cost: ₹{goal_amount:,.0f}\n"
            f"Current Savings: ₹{savings:,.0f}\n\n"
            "Make sure you still have 3–6 months of expenses (₹"
            f"{expenses*3:,.0f}–₹{expenses*6:,.0f}) as an emergency buffer after purchase.\n\n"
            "Smart spending leads to greater wealth! 💡"
        )
        status = "affordable"
    elif surplus > 0:
        months_to_goal = math.ceil((goal_amount - savings) / surplus) if surplus > 0 else 9999
        years_to_goal = round(months_to_goal / 12, 1)
        message = (
            f"⚠ Buying a {goal_label} right now may stretch your finances.\n\n"
            f"Estimated Cost: ₹{goal_amount:,.0f}\n"
            f"Current Savings: ₹{savings:,.0f}\n"
            f"Monthly Income: ₹{income:,.0f}\n"
            f"Monthly Surplus: ₹{surplus:,.0f}\n\n"
            f"At your current save rate, you can reach this goal in ~{months_to_goal} months ({years_to_goal} years).\n"
            f"Alternatively, save ₹{monthly_required:,.0f}/month to reach it in {years} year(s).\n\n"
            "Suggestions:\n"
            "• Automate monthly savings transfers.\n"
            "• Reduce discretionary expenses.\n"
            "• Consider EMI if interest rate < 10% p.a.\n\n"
            "Consistent saving today brings tomorrow's goal closer! 🎯"
        )
        status = "save_required"
    else:
        message = (
            f"❌ Your current financial situation makes this {goal_label} purchase risky.\n\n"
            f"Monthly Surplus: ₹{surplus:,.0f} (negative or zero)\n"
            f"Estimated Cost: ₹{goal_amount:,.0f}\n\n"
            "Priority actions:\n"
            "• First reduce existing EMIs and expenses.\n"
            "• Build a positive monthly surplus.\n"
            "• Then start saving for this goal.\n\n"
            "Get the fundamentals right first — everything else will follow! 💪"
        )
        status = "not_feasible"

    return {"message": message, "status": status, "goal_amount": goal_amount, "goal_label": goal_label}