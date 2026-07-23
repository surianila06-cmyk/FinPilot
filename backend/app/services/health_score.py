def calculate_financial_score(profile: dict):

    score = 100

    income = profile.get("monthly_income", 0)
    expenses = profile.get("monthly_expenses", 0)
    savings = profile.get("savings", 0)
    loans = profile.get("loans", 0)
    emi = profile.get("monthly_emi", 0)

    # Expense ratio
    if income > 0:
        expense_ratio = expenses / income

        if expense_ratio > 0.7:
            score -= 25
        elif expense_ratio > 0.5:
            score -= 15

    # EMI ratio
    if income > 0:
        emi_ratio = emi / income

        if emi_ratio > 0.4:
            score -= 20
        elif emi_ratio > 0.2:
            score -= 10

    # High loans
    if loans > income * 12:
        score -= 20

    # Savings bonus
    if savings > income * 6:
        score += 10

    score = max(0, min(score, 100))

    return score