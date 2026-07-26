def loan_analysis(profile):

    if not isinstance(profile, dict):
        profile = {}

    income = float(profile.get("monthly_income") or 0)
    loans = float(profile.get("loans") or 0)
    emi = float(profile.get("monthly_emi") or 0)

    emi_ratio = 0

    if income > 0:
        emi_ratio = (emi / income) * 100

    if emi == 0 and loans == 0:

        message = (
            "✅ You currently have no active loans.\n\n"
            "Your financial profile looks healthy in terms of debt.\n\n"
            "If you plan to take a loan, try to keep your EMI below 30% of your monthly income."
        )

    elif emi_ratio > 40:

        message = (
            "❌ Your EMI burden is quite high.\n\n"
            f"Monthly EMI: ₹{emi:,}\n"
            f"Monthly Income: ₹{income:,}\n\n"
            "Avoid taking another loan until your current EMIs reduce."
        )

    elif loans > income * 12:

        message = (
            "⚠ Your existing loans are high compared to your annual income.\n\n"
            "Focus on repaying current loans before applying for another one."
        )

    else:

        message = (
            "✅ Your loan commitments appear manageable.\n\n"
            f"Monthly EMI: ₹{emi:,}\n\n"
            "If needed, you may consider another loan after comparing interest rates and ensuring the EMI remains affordable."
        )

    return {
        "message": message
    }