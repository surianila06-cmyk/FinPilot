from pydantic import BaseModel
from typing import Optional


class FinancialProfile(BaseModel):
    monthly_income: float
    monthly_expenses: float
    savings: float
    loans: float
    monthly_emi: float
    insurance: float
    financial_score: Optional[int] = None