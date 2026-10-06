from pydantic import BaseModel
from typing import Optional, List, Any, Dict, Union
from datetime import datetime
from app.schemas.meal import MealResponse


class PlanCompatibilityScore(BaseModel):
    dosha: int
    preferences: int
    allergies: int
    overall: int


class DietGenerateRequest(BaseModel):
    patient_id: Union[int, str]
    preferences_override: Optional[Dict[str, Any]] = None


class DailyDietPlanResponse(BaseModel):
    date: str
    dayOfWeek: str
    breakfast: MealResponse
    lunch: MealResponse
    dinner: MealResponse


class WeeklyDietPlanResponse(BaseModel):
    id: int
    patient_id: int
    startDate: str
    status: str
    days: List[DailyDietPlanResponse]
    compatibilityScore: PlanCompatibilityScore
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True
