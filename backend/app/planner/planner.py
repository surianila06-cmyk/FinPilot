from app.tools.gold_tool import get_gold_price
from app.tools.loan_tool import loan_analysis
from app.tools.budget_tool import budget_analysis
from app.tools.goal_tool import goal_analysis
from app.services.ai_advisor import generate_advice


def planner(query: str, profile: dict):

    query_lower = (query or "").lower().strip()

    gold_words = [
        "gold",
        "jewellery",
        "jewelry",
        "gold etf",
        "sovereign gold"
    ]

    goal_words = [
        "buy",
        "purchase",
        "afford",
        "bike",
        "car",
        "vehicle",
        "house",
        "vacation",
        "laptop"
    ]

    loan_words = [
        "loan",
        "emi",
        "borrow",
        "credit",
        "mortgage"
    ]

    budget_words = [
        "budget",
        "expense",
        "expenses",
        "save",
        "saving",
        "spending",
        "surplus"
    ]

    # Specific goal purchase checks take precedence over generic borrow/loan keywords
    if any(word in query_lower for word in goal_words):
        return goal_analysis(profile, query)

    elif any(word in query_lower for word in gold_words):
        return get_gold_price(profile)

    elif any(word in query_lower for word in loan_words):
        return loan_analysis(profile)

    elif any(word in query_lower for word in budget_words):
        return budget_analysis(profile)

    # Use AI Advisor to generate personalized conversational response for open-ended queries
    advisor_response = generate_advice({"question": query, "profile": profile})

    return {
        "message": advisor_response
    }