from fastapi import APIRouter
from app.services.gemini_service import extract_financial_profile

router = APIRouter()


@router.get("/gemini-test")
def gemini_test():
    sample = """
Monthly Salary: ₹75,000
Monthly Expenses: ₹30,000
Savings: ₹4,50,000
Loans: ₹2,00,000
Monthly EMI: ₹8,000
Insurance: ₹2,500
"""

    result = extract_financial_profile(sample)

    return {
        "gemini_response": result
    }