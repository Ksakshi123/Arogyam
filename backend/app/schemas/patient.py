from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime


class PatientProfileBase(BaseModel):
    age: Optional[int] = None
    gender: Optional[str] = None
    weight: Optional[float] = None
    height: Optional[float] = None
    activity_level: Optional[str] = "Moderately Active"
    diet_preference: Optional[str] = "Vegetarian"
    food_preferences: Optional[List[str]] = []
    wellness_goals: Optional[List[str]] = []
    allergies: Optional[List[str]] = []
    food_restrictions: Optional[List[str]] = []
    disliked_foods: Optional[List[str]] = []


class PatientProfileCreate(PatientProfileBase):
    full_name: Optional[str] = None
    user_id: Optional[int] = None


class PatientProfileUpdate(BaseModel):
    full_name: Optional[str] = None
    age: Optional[int] = None
    gender: Optional[str] = None
    weight: Optional[float] = None
    height: Optional[float] = None
    activity_level: Optional[str] = None
    diet_preference: Optional[str] = None
    food_preferences: Optional[List[str]] = None
    wellness_goals: Optional[List[str]] = None
    allergies: Optional[List[str]] = None
    food_restrictions: Optional[List[str]] = None
    disliked_foods: Optional[List[str]] = None



class PatientProfileResponse(PatientProfileBase):
    id: int
    user_id: int
    full_name: Optional[str] = None
    email: Optional[str] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True
