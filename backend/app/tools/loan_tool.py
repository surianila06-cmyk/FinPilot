def loan_analysis(profile: dict) -> dict:
    if not isinstance(profile, dict):
        profile = {}

    income = float(profile.get("monthly_income") or 0)
    loans = float(profile.get("loans") or 0)
    emi = float(profile.get("monthly_emi") or 0)
    expenses = float(profile.get("monthly_expenses") or 0)

    emi_ratio = (emi / income * 100) if income > 0 else 0
    loan_to_annual = (loans / (income * 12) * 100) if income > 0 else 0
    disposable = income - expenses - emi
    max_safe_emi = income * 0.35  # 35% DTI limit (more conservative)

    if emi == 0 and loans == 0:
        status = "debt_free"
        message = (
            "✅ You are completely debt-free!\n\n"
            f"Monthly Income: ₹{income:,.0f}\n"
            f"Disposable: ₹{disposable:,.0f}/month\n\n"
            "Your debt profile is excellent. If you plan to take a new loan:\n"
            f"• Safe EMI limit (35% DTI): ₹{max_safe_emi:,.0f}/month\n"
            "• Maintain 6 months emergency fund before taking any loan.\n"
            "• Compare interest rates across multiple lenders.\n\n"
            "Debt-free living is true financial freedom! 🎉"
        )

    elif emi_ratio > 50:
        status = "critical"
        message = (
            "❌ Your EMI burden is critically high!\n\n"
            f"Monthly EMI: ₹{emi:,.0f} ({emi_ratio:.1f}% of income)\n"
            f"Monthly Income: ₹{income:,.0f}\n\n"
            "Immediate actions needed:\n"
            "• Stop all new debt immediately.\n"
            "• Consider loan prepayment with any surplus.\n"
            "• Look into loan consolidation or restructuring.\n"
            "• Consult a financial advisor.\n\n"
            "Focus on clearing debt — freedom is worth the sacrifice! 💪"
        )

    elif emi_ratio > 35:
        status = "high"
        message = (
            "⚠ Your EMI burden is high.\n\n"
            f"Monthly EMI: ₹{emi:,.0f} ({emi_ratio:.1f}% of income)\n"
            f"Recommended Max EMI: ₹{max_safe_emi:,.0f}/month\n\n"
            "• Avoid taking any new loans right now.\n"
            "• Make small prepayments to reduce principal faster.\n"
            "• Refinance at a lower interest rate if possible.\n\n"
            "Every extra repayment shortens your loan journey! 📊"
        )

    elif loans > income * 12:
        status = "elevated"
        message = (
            "⚠ Your total loan burden is high relative to your annual income.\n\n"
            f"Total Loans: ₹{loans:,.0f}\n"
            f"Annual Income: ₹{income*12:,.0f}\n"
            f"Loan-to-Income Ratio: {loan_to_annual:.1f}%\n\n"
            "• Focus on repaying high-interest loans first (avalanche method).\n"
            "• Avoid any new credit until ratio drops below 100%.\n\n"
            "Steady and consistent repayment is the winning strategy! 🏆"
        )

    else:
        status = "manageable"
        message = (
            "✅ Your loan commitments are manageable.\n\n"
            f"Monthly EMI: ₹{emi:,.0f} ({emi_ratio:.1f}% of income)\n"
            f"Remaining Safe EMI Room: ₹{max_safe_emi - emi:,.0f}/month\n\n"
            "• Maintain this ratio by not exceeding 35% DTI.\n"
            "• Consider prepayment if you receive bonuses.\n\n"
            "You're handling debt responsibly — keep it up! 💼"
        )

    return {"message": message, "status": status, "emi_ratio": round(emi_ratio, 1)}