from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime


class MealCompletionCreate(BaseModel):
    patient_id: int
    meal_id: str
    date: str                                            # YYYY-MM-DD
    status: str                                          # planned | completed | skipped | replaced
    replacement_meal_id: Optional[str] = None


class MealCompletionResponse(BaseModel):
    id: int
    patient_id: int
    meal_id: Optional[str] = None
    date: str
    status: str
    replacement_meal_id: Optional[str] = None
    completed_at: datetime

    class Config:
        from_attributes = True


class NutritionDaySummary(BaseModel):
    date: str
    total_calories: float
    total_protein: float
    total_carbohydrates: float
    total_fats: float
    completed_meals_count: int


class NutritionAnalyticsResponse(BaseModel):
    streak: int
    adherence_score: int
    daily_summaries: List[NutritionDaySummary]
    completions: List[MealCompletionResponse]
