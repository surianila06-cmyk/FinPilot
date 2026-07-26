def get_gold_price(profile):
    if not isinstance(profile, dict):
        profile = {}

    savings = float(profile.get("savings") or 0)
    income = float(profile.get("monthly_income") or 0)

    # Modular gold allocation benchmark (e.g. 10g 24k gold ~ ₹75,000 or Digital Gold SIP)
    target_gold_investment = 75000
    monthly_save = income * 0.2

    if monthly_save > 0:
        months = max(1, round(target_gold_investment / monthly_save))
        time_text = f"Estimated time to build a ₹{target_gold_investment:,} gold allocation: ~{months} months."
    else:
        time_text = "Build an emergency fund before starting regular gold investments."

    if savings >= 50000:
        message = (
            "✅ Gold investment is a healthy portfolio diversification option.\n\n"
            f"Monthly Income: ₹{income:,.0f}\n"
            f"Current Savings: ₹{savings:,.0f}\n\n"
            "Suggestions:\n"
            "• Allocate 5% - 10% of total savings to Gold.\n"
            "• Sovereign Gold Bonds (SGB) offer 2.5% p.a. interest + capital gains tax exemption.\n"
            "• Digital Gold or Gold ETFs allow low-cost systematic monthly investing (SIP)."
        )
    else:
        message = (
            "⚠ Exercise caution before starting gold investments.\n\n"
            f"Monthly Income: ₹{income:,.0f}\n"
            f"Current Savings: ₹{savings:,.0f}\n\n"
            f"{time_text}\n\n"
            "Suggestions:\n"
            "• Build 3-6 months of liquid emergency reserves first.\n"
            "• Start small with Digital Gold SIPs (e.g., ₹500/month)."
        )

    return {
        "message": message
    }