from fastapi import APIRouter
from app.models.financial_profile import FinancialProfile
from app.services.health_score import calculate_financial_score

router = APIRouter()


@router.post("/profile")
def create_profile(profile: FinancialProfile):
    profile.financial_score = calculate_financial_score(profile)

    return {
        "message": "Profile created successfully",
        "profile": profile
    }