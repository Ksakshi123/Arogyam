from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime


class MealReplacementOption(BaseModel):
    id: Optional[str] = None
    meal_name: str
    description: str
    ingredients: List[str] = Field(default_factory=list)
    calories: int = 350
    protein: float = 15.0
    carbohydrates: float = 45.0
    fats: float = 10.0
    preparation_time: int = 20
    dosha_reason: str = "Balances your primary constitution"
    tags: List[str] = Field(default_factory=list)


class ChatAIResponse(BaseModel):
    intent: str = "general_question"
    message: str
    target: Optional[str] = None
    replacement_options: List[MealReplacementOption] = Field(default_factory=list)
    proposed_changes: List[str] = Field(default_factory=list)
    requires_confirmation: bool = False


class ChatRequest(BaseModel):
    message: str
    patient_id: Optional[int] = None


class ChatMessageCreate(BaseModel):
    patient_id: int
    role: str                                            # user | assistant | system
    message: str


class ChatMessageResponse(BaseModel):
    id: int
    patient_id: int
    role: str
    message: str
    created_at: datetime
    structured_data: Optional[ChatAIResponse] = None

    class Config:
        from_attributes = True
