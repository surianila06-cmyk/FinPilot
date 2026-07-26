from pydantic import BaseModel, Field, model_validator
from typing import Optional


class FinancialProfile(BaseModel):
    monthly_income: float = Field(default=0.0, ge=0)
    monthly_expenses: float = Field(default=0.0, ge=0)
    savings: float = Field(default=0.0, ge=0)
    loans: float = Field(default=0.0, ge=0)
    monthly_emi: float = Field(default=0.0, ge=0)
    insurance: float = Field(default=0.0, ge=0)
    financial_score: Optional[int] = None

    @model_validator(mode="before")
    @classmethod
    def coerce_nulls_to_zero(cls, values):
        """Replace None/null field values with 0.0 to prevent downstream TypeError."""
        numeric_fields = [
            "monthly_income", "monthly_expenses", "savings",
            "loans", "monthly_emi", "insurance"
        ]
        for field in numeric_fields:
            if values.get(field) is None:
                values[field] = 0.0
        return values