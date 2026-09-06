from pydantic import BaseModel
from typing import Optional, List, Any


class MealBase(BaseModel):
    id: str
    day_of_week: str
    date: Optional[str] = None
    meal_type: str                                       # breakfast | lunch | dinner
    meal_name: str
    description: Optional[str] = None
    ingredients: Optional[List[str]] = []
    calories: float = 0.0
    protein: float = 0.0
    carbohydrates: float = 0.0
    fats: float = 0.0
    preparation_time: Optional[int] = 15
    tags: Optional[List[str]] = []
    suitable_doshas: Optional[List[str]] = []
    is_replaced: Optional[bool] = False
    explanation: Optional[str] = None
    recipe: Optional[Any] = None                         # {steps, tips, servings, difficulty}


class MealUpdate(BaseModel):
    meal_name: Optional[str] = None
    description: Optional[str] = None
    ingredients: Optional[List[str]] = None
    calories: Optional[float] = None
    protein: Optional[float] = None
    carbohydrates: Optional[float] = None
    fats: Optional[float] = None
    preparation_time: Optional[int] = None
    tags: Optional[List[str]] = None
    suitable_doshas: Optional[List[str]] = None
    is_replaced: Optional[bool] = None
    explanation: Optional[str] = None
    recipe: Optional[Any] = None


class MealResponse(MealBase):
    diet_plan_id: int

    class Config:
        from_attributes = True
