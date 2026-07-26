def calculate_financial_score(profile) -> int:
    """
    Calculate Financial Health Score (0–100) based on:
    - Expense-to-Income Ratio        (30 pts)
    - EMI Debt-to-Income Ratio       (25 pts)
    - Emergency Savings Reserve      (25 pts)
    - Loan Burden Ratio              (10 pts)
    - Insurance Coverage Bonus       (10 pts)
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
    insurance = float(data.get("insurance") or 0)

    score = 100

    # ── Expense Ratio (up to -30) ──────────────────────────────────────────
    if income > 0:
        expense_ratio = expenses / income
        if expense_ratio > 0.8:
            score -= 30
        elif expense_ratio > 0.7:
            score -= 22
        elif expense_ratio > 0.5:
            score -= 12
        elif expense_ratio < 0.3:
            score += 5   # Bonus for very low spend

    # ── EMI Debt-to-Income (up to -25) ────────────────────────────────────
    if income > 0:
        emi_ratio = emi / income
        if emi_ratio > 0.5:
            score -= 25
        elif emi_ratio > 0.4:
            score -= 18
        elif emi_ratio > 0.25:
            score -= 10

    # ── High Loan Burden (up to -10) ──────────────────────────────────────
    if income > 0 and loans > income * 12:
        score -= 10
    elif income > 0 and loans > income * 6:
        score -= 5

    # ── Emergency Savings (up to +10 or -15) ──────────────────────────────
    if expenses > 0:
        reserve_months = savings / expenses
        if reserve_months >= 6:
            score += 10
        elif reserve_months >= 3:
            score += 3
        elif reserve_months < 1:
            score -= 15
        elif reserve_months < 2:
            score -= 8

    # ── Insurance Coverage Bonus (up to +5) ───────────────────────────────
    if income > 0 and insurance > 0:
        if insurance >= income * 0.05:
            score += 5
        else:
            score += 2

    return max(0, min(int(round(score)), 100))


def score_label(score: int) -> str:
    """Return a human-readable label for a financial score."""
    if score >= 85:
        return "Excellent"
    elif score >= 70:
        return "Good"
    elif score >= 50:
        return "Average"
    elif score >= 30:
        return "Below Average"
    else:
        return "Critical"