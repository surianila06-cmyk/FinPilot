def loan_analysis(profile):

    income = profile.get("monthly_income",0)
    loans = profile.get("loans",0)
    emi = profile.get("monthly_emi",0)

    if emi > income * 0.4:
        recommendation = (
            "Your EMI burden is high. "
            "Avoid taking additional loans currently."
        )

    elif loans > income * 12:
        recommendation = (
            "Your existing loans are high compared to income."
        )

    else:
        recommendation = (
            "Your current loan position looks manageable."
        )

    return {
        "loan_status": recommendation,
        "financial_score": profile.get(
            "financial_score",
            None
        )
    }