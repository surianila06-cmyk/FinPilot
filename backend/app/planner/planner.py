from app.tools.gold_tool import get_gold_price
from app.tools.loan_tool import loan_analysis
from app.tools.budget_tool import budget_analysis
from app.tools.goal_tool import goal_analysis


def planner(query: str, profile: dict):

    query = query.lower()

    gold_words = [
        "gold",
        "jewellery",
        "jewelry",
        "gold etf",
        "sovereign gold"
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
        "money",
        "spending"
    ]

    goal_words = [
        "buy",
        "purchase",
        "afford",
        "goal",
        "plan",
        "bike",
        "car",
        "house",
        "vacation"
    ]

    if any(word in query for word in gold_words):
        return get_gold_price(profile)

    elif any(word in query for word in loan_words):
        return loan_analysis(profile)

    elif any(word in query for word in budget_words):
        return budget_analysis(profile)

    elif any(word in query for word in goal_words):
        return goal_analysis(profile, query)

    return {
        "message":
        "👋 I can help you with:\n\n"
        "• Budget planning\n"
        "• Savings advice\n"
        "• Gold investments\n"
        "• Loans and EMI\n"
        "• Financial goals\n\n"
        "Ask me something like:\n"
        "• Can I buy a bike?\n"
        "• Should I invest in gold?\n"
        "• Can I take a home loan?"
    }