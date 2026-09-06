"""
Pydantic schemas for request/response validation.
These are separate from SQLAlchemy models.
"""
from pydantic import BaseModel, EmailStr
from typing import Optional, List, Any
from datetime import datetime


# ── Auth Schemas ──────────────────────────────────────────────────────────────

class UserCreate(BaseModel):
    email: EmailStr
    password: str
    role: str = "patient"

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


# ── Patient Profile Schemas ───────────────────────────────────────────────────

class PatientProfileCreate(BaseModel):
    full_name: str
    age: int
    gender: Optional[str] = None
    height_cm: float
    weight_kg: float
    activity_level: str
    wellness_goals: List[str]
    diet_preference: str
    food_preferences: List[str]
    allergies: List[str]
    food_restrictions: List[str]
    disliked_foods: List[str]

class PatientProfileResponse(PatientProfileCreate):
    id: int
    user_id: int
    onboarding_completed: bool

    class Config:
        from_attributes = True


# ── Dosha Schemas ─────────────────────────────────────────────────────────────

class DoshaAnswers(BaseModel):
    answers: dict[str, str]  # {questionId: optionId}

class DoshaResultResponse(BaseModel):
    vata: float
    pitta: float
    kapha: float
    primary_dosha: str
    secondary_dosha: Optional[str] = None
    constitution: str
    assessed_at: Optional[str] = None


# ── Diet Plan Schemas ─────────────────────────────────────────────────────────

class MealBase(BaseModel):
    id: str
    name: str
    type: str                 # breakfast | lunch | dinner
    description: str
    ingredients: List[str]
    calories: int
    protein: float
    carbohydrates: float
    fats: float
    preparation_time: int
    tags: List[str]
    suitable_doshas: List[str]
    explanation: Optional[str] = None

class WeeklyPlanResponse(BaseModel):
    id: int
    start_date: str
    plan_data: Any            # Full JSON plan
    compatibility_score: Any

class MealCompletionCreate(BaseModel):
    meal_id: str
    date: str
    status: str               # completed | skipped | replaced
    replacement_meal_id: Optional[str] = None


# ── Nutrition Schemas ─────────────────────────────────────────────────────────

class NutritionDayResponse(BaseModel):
    date: str
    total_calories: float
    total_protein: float
    total_carbs: float
    total_fats: float
    completed_meals_count: int


# ── Chat Schemas ──────────────────────────────────────────────────────────────

class ChatRequest(BaseModel):
    message: str

class ChatResponse(BaseModel):
    content: str
    intent: Optional[str] = None
    structured_data: Optional[Any] = None
    timestamp: str
