from app.tools.gold_tool import get_gold_price
from app.tools.loan_tool import loan_analysis
from app.tools.budget_tool import budget_analysis
from app.tools.goal_tool import goal_analysis


def planner(query: str, profile: dict):

    query_lower = query.lower()


    if "gold" in query_lower:
        return get_gold_price(profile)


    elif "loan" in query_lower:
        return loan_analysis(profile)


    elif "save" in query_lower or "budget" in query_lower or "expense" in query_lower:
        return budget_analysis(profile)


    elif (
        "buy" in query_lower
        or "goal" in query_lower
        or "afford" in query_lower
        or "plan" in query_lower
    ):
        return goal_analysis(profile, query)


    else:
        return {
            "message": "I can help with investments, loans, budgets, and financial goals."
        }