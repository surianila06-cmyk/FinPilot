def sip_analysis(profile: dict, query: str = "") -> dict:
    """Calculate SIP projections and recommend investment amounts."""
    if not isinstance(profile, dict):
        profile = {}

    income = float(profile.get("monthly_income") or 0)
    expenses = float(profile.get("monthly_expenses") or 0)
    savings = float(profile.get("savings") or 0)
    emi = float(profile.get("monthly_emi") or 0)
    surplus = income - expenses - emi

    # Recommended SIP = 20–30% of surplus
    min_sip = max(500, int(surplus * 0.2)) if surplus > 0 else 500
    ideal_sip = max(1000, int(surplus * 0.3)) if surplus > 0 else 1000

    # SIP projection at 12% CAGR (Nifty 50 long-term average)
    rate_monthly = 0.12 / 12  # 1% per month

    def sip_future_value(monthly: float, months: int, rate: float) -> float:
        if rate == 0:
            return monthly * months
        return monthly * (((1 + rate) ** months - 1) / rate) * (1 + rate)

    years_5 = round(sip_future_value(ideal_sip, 60, rate_monthly))
    years_10 = round(sip_future_value(ideal_sip, 120, rate_monthly))
    years_20 = round(sip_future_value(ideal_sip, 240, rate_monthly))
    invested_5 = ideal_sip * 60
    invested_10 = ideal_sip * 120
    invested_20 = ideal_sip * 240

    if surplus <= 0:
        status = "low_surplus"
        message = (
            "⚠ Your monthly surplus is too low to start a meaningful SIP right now.\n\n"
            f"Monthly Income: ₹{income:,.0f}\n"
            f"Monthly Expenses + EMI: ₹{expenses + emi:,.0f}\n\n"
            "Priority steps:\n"
            "• Reduce discretionary expenses to create surplus.\n"
            "• Once you have ₹1,000+ surplus, start a Nifty 50 Index Fund SIP.\n\n"
            "Even ₹500/month invested consistently beats not investing at all! 💪"
        )
    else:
        status = "good"
        message = (
            f"💡 Investing ₹{ideal_sip:,}/month in an Index Fund SIP can transform your wealth!\n\n"
            f"Monthly Surplus:     ₹{surplus:,.0f}\n"
            f"Recommended SIP:     ₹{min_sip:,} – ₹{ideal_sip:,}/month\n"
            f"Expected Rate:       12% CAGR (Nifty 50 historical avg)\n\n"
            f"Wealth Projections at ₹{ideal_sip:,}/month:\n"
            f"• 5 Years:  Invested ₹{invested_5:,} → Grows to ₹{years_5:,}\n"
            f"• 10 Years: Invested ₹{invested_10:,} → Grows to ₹{years_10:,}\n"
            f"• 20 Years: Invested ₹{invested_20:,} → Grows to ₹{years_20:,}\n\n"
            "Best platforms: Zerodha Coin, Groww, MFCentral (direct plans — no commission).\n\n"
            "Start today — time in the market beats timing the market! 📈"
        )

    return {
        "message": message,
        "status": status,
        "recommended_sip": ideal_sip,
        "projection_10y": years_10,
    }
