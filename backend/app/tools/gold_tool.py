def get_gold_advice(profile: dict) -> dict:
    if not isinstance(profile, dict):
        profile = {}

    income = float(profile.get("monthly_income") or 0)
    savings = float(profile.get("savings") or 0)
    expenses = float(profile.get("monthly_expenses") or 0)
    emi = float(profile.get("monthly_emi") or 0)
    surplus = income - expenses - emi

    # Recommended gold allocation = 5–10% of total savings
    recommended_min = savings * 0.05
    recommended_max = savings * 0.10
    emergency_target = expenses * 6
    has_emergency_fund = savings >= emergency_target

    # Monthly SIP into gold
    gold_sip = max(500, int(surplus * 0.1)) if surplus > 0 else 0

    if not has_emergency_fund:
        shortfall = emergency_target - savings
        status = "build_emergency_first"
        message = (
            "⚠ Build your emergency fund before investing in gold.\n\n"
            f"Current Savings:       ₹{savings:,.0f}\n"
            f"Emergency Fund Target: ₹{emergency_target:,.0f} (6 months)\n"
            f"Shortfall:             ₹{shortfall:,.0f}\n\n"
            "Once your emergency fund is secure:\n"
            "• Start Gold ETF SIPs (₹500–₹1,000/month).\n"
            "• Consider Sovereign Gold Bonds (SGB) for 2.5% annual interest.\n"
            "• Digital Gold on Zerodha/Paytm — buy from ₹1.\n\n"
            "Safety first, then wealth building! 🛡️"
        )
    elif savings < 50000:
        status = "small_allocation"
        message = (
            "✅ You can start small gold investments.\n\n"
            f"Current Savings: ₹{savings:,.0f}\n"
            f"Suggested Gold Allocation: ₹500–₹2,000/month via SIP\n\n"
            "• Gold ETFs: Low expense ratio, fully liquid, traded like stocks.\n"
            "• Digital Gold: Buy from ₹10 on any UPI app.\n"
            "• SGB: Better returns but 8-year lock-in.\n\n"
            "Small consistent investments compound beautifully! 📈"
        )
    else:
        status = "good_allocation"
        message = (
            "✅ Gold is a healthy portfolio diversification option for you!\n\n"
            f"Current Savings:         ₹{savings:,.0f}\n"
            f"Recommended Gold (5%):  ₹{recommended_min:,.0f}\n"
            f"Recommended Gold (10%): ₹{recommended_max:,.0f}\n"
            f"Monthly Gold SIP:        ₹{gold_sip:,}\n\n"
            "Best gold investment options:\n"
            "• Sovereign Gold Bonds (SGB) — 2.5% interest + no capital gains tax on maturity.\n"
            "• Nifty Gold BeES ETF — most liquid, lowest expense ratio.\n"
            "• Gold Mutual Funds — SIP convenience, no demat needed.\n\n"
            "Gold hedges inflation and adds stability to your portfolio! 💛"
        )

    return {"message": message, "status": status}


# Backwards-compatible alias used by planner
def get_gold_price(profile: dict) -> dict:
    return get_gold_advice(profile)