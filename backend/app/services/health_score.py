def calculate_financial_score(profile):
    """
    Calculate Financial Health Score (0 to 100) based on:
    - Expense-to-Income Ratio
    - Debt-to-Income (EMI) Ratio
    - Emergency Savings Reserve Months
    - Loan Burden Ratio
    """
    if hasattr(profile, "model_dump"):
        data = profile.model_dump()
    elif hasattr(profile, "dict"):
        data = profile.dict()
    elif isinstance(profile, dict):
        data = profile
    else:
        data = {}

    income = float(data.get("monthly_income") or 0)
    expenses = float(data.get("monthly_expenses") or 0)
    savings = float(data.get("savings") or 0)
    loans = float(data.get("loans") or 0)
    emi = float(data.get("monthly_emi") or 0)

    score = 100

    # Expense ratio penalty
    if income > 0:
        expense_ratio = expenses / income
        if expense_ratio > 0.7:
            score -= 30
        elif expense_ratio > 0.5:
            score -= 15
        elif expense_ratio < 0.3:
            score += 5

    # EMI ratio penalty
    if income > 0:
        emi_ratio = emi / income
        if emi_ratio > 0.4:
            score -= 25
        elif emi_ratio > 0.2:
            score -= 10

    # High loans penalty
    if loans > income * 12:
        score -= 20

    # Savings reserve bonus / penalty
    if expenses > 0:
        reserve_months = savings / expenses
        if reserve_months >= 6:
            score += 10
        elif reserve_months < 2:
            score -= 15

    return max(0, min(int(round(score)), 100))