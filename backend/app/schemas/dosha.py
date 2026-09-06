from pydantic import BaseModel
from typing import Optional, Dict, Any
from datetime import datetime


class DoshaAssessmentCreate(BaseModel):
    patient_id: Optional[int] = None
    answers: Dict[str, str]                              # {questionId: optionId}


class DoshaResultResponse(BaseModel):
    id: Optional[int] = None
    patient_id: Optional[int] = None
    assessment_id: Optional[int] = None
    vata_percentage: float
    pitta_percentage: float
    kapha_percentage: float
    primary_dosha: str
    secondary_dosha: Optional[str] = None
    constitution: str
    assessment_date: Optional[str] = None
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class DoshaHistoryItem(BaseModel):
    id: int
    assessment_id: Optional[int] = None
    vata_percentage: float
    pitta_percentage: float
    kapha_percentage: float
    primary_dosha: str
    secondary_dosha: Optional[str] = None
    constitution: str
    created_at: datetime

    class Config:
        from_attributes = True
