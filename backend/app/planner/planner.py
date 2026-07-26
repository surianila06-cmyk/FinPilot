from app.tools.gold_tool import get_gold_price
from app.tools.loan_tool import loan_analysis
from app.tools.budget_tool import budget_analysis
from app.tools.goal_tool import goal_analysis
from app.tools.sip_tool import sip_analysis
from app.services.ai_advisor import generate_advice

# ── Intent keyword maps ──────────────────────────────────────────────────────
# Higher-specificity keywords are evaluated FIRST to prevent collisions

_GOAL_WORDS = {
    "bike", "scooter", "car", "vehicle", "house", "home", "vacation", "trip",
    "laptop", "phone", "education", "college", "wedding", "marriage",
    "emergency fund", "buy", "purchase", "afford", "can i get", "want to buy",
}

_GOLD_WORDS = {
    "gold", "jewellery", "jewelry", "gold etf", "sovereign gold bond", "sgb",
    "digital gold", "gold mutual fund",
}

_SIP_WORDS = {
    "sip", "mutual fund", "index fund", "nifty", "invest", "investing",
    "equity", "stock market", "mf", "elss", "ppf", "nps", "fixed deposit",
    "fd", "rd", "recurring deposit",
}

_LOAN_WORDS = {
    "loan", "emi", "borrow", "credit", "mortgage", "debt", "interest rate",
    "home loan", "personal loan", "car loan",
}

_BUDGET_WORDS = {
    "budget", "expense", "expenses", "save", "saving", "savings rate",
    "spending", "surplus", "cashflow", "cash flow", "money management",
}


def _matches(query: str, keywords: set) -> bool:
    return any(word in query for word in keywords)


def planner(query: str, profile: dict, chat_history: list | None = None) -> dict:
    """
    Route the user's financial query to the appropriate analysis tool.
    Falls back to LLM-powered advice for open-ended questions.
    """
    if not isinstance(profile, dict):
        profile = {}

    q = (query or "").lower().strip()

    # ── Priority order: goals > gold > SIP > loan > budget > AI fallback ──
    if _matches(q, _GOAL_WORDS):
        return goal_analysis(profile, query)

    if _matches(q, _GOLD_WORDS):
        return get_gold_price(profile)

    if _matches(q, _SIP_WORDS):
        return sip_analysis(profile, query)

    if _matches(q, _LOAN_WORDS):
        return loan_analysis(profile)

    if _matches(q, _BUDGET_WORDS):
        return budget_analysis(profile)

    # ── Open-ended: use LLM advisor ──────────────────────────────────────
    advisor_response = generate_advice(
        {"question": query, "profile": profile},
        chat_history=chat_history,
    )
    return {"message": advisor_response}