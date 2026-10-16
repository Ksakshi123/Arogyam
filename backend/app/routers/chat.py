from fastapi import APIRouter, Depends, HTTPException, Header, status
from sqlalchemy.orm import Session
from typing import List, Optional
import json

from app.database import get_db
from app.models.chat import ChatMessage
from app.models.patient import PatientProfile
from app.models.user import User
from app.dependencies import get_current_user_optional
from app.schemas.chat import (
    ChatRequest,
    ChatAIResponse,
    ChatMessageCreate,
    ChatMessageResponse,
)
from app.services.patient_context_service import build_patient_context
from app.services.grok_service import ask_ayu
from app.routers.patient import _get_patient_or_404

router = APIRouter()


def _resolve_patient(
    db: Session,
    current_user: Optional[User],
    explicit_patient_id: Optional[int] = None,
    header_patient_id: Optional[str] = None
) -> PatientProfile:
    # SECURITY FIX: When a JWT is present, always resolve patient from the
    # authenticated user's own record. Never trust X-Patient-Id or payload
    # patient_id from an authenticated non-doctor — those could be spoofed
    # to access another patient's data.
    if current_user:
        if current_user.role == "doctor":
            # Doctors may query any patient via explicit_patient_id
            if explicit_patient_id:
                profile = db.query(PatientProfile).filter(
                    (PatientProfile.id == explicit_patient_id) |
                    (PatientProfile.user_id == explicit_patient_id)
                ).first()
                if profile:
                    return profile
        # For patients (or doctors without an explicit ID), use their own profile
        profile = db.query(PatientProfile).filter(
            PatientProfile.user_id == current_user.id
        ).first()
        if profile:
            return profile

    # Guest / unauthenticated path — only use header as last resort
    if header_patient_id and header_patient_id.isdigit():
        pid = int(header_patient_id)
        profile = db.query(PatientProfile).filter(
            (PatientProfile.id == pid) | (PatientProfile.user_id == pid)
        ).first()
        if profile:
            return profile

    raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail="No patient profile found. Please register or complete onboarding first."
    )


@router.post("", response_model=ChatAIResponse)
async def chat_with_ayu(
    payload: ChatRequest,
    current_user: Optional[User] = Depends(get_current_user_optional),
    x_patient_id: Optional[str] = Header(None, alias="X-Patient-Id"),
    db: Session = Depends(get_db)
):
    """
    Main interactive AI dialogue endpoint with Ayu (powered by Grok/xAI).
    Loads patient context from PostgreSQL, validates against allergies, and saves dialogue history.
    """
    patient = _resolve_patient(
        db=db,
        current_user=current_user,
        explicit_patient_id=payload.patient_id,
        header_patient_id=x_patient_id
    )

    # 1. Save user query to PostgreSQL
    user_msg = ChatMessage(
        patient_id=patient.id,
        role="user",
        message=payload.message
    )
    db.add(user_msg)
    db.commit()

    # 2. Build rich patient context from PostgreSQL
    context = build_patient_context(db, patient.id)

    # 3. Query Ayu / Grok AI service
    ai_response = await ask_ayu(payload.message, context)

    # 4. Save assistant response to PostgreSQL
    # If structured data exists, we can encode it or save the readable message
    assistant_msg = ChatMessage(
        patient_id=patient.id,
        role="assistant",
        message=ai_response.message
    )
    db.add(assistant_msg)
    db.commit()

    return ai_response


@router.get("/history", response_model=List[ChatMessageResponse])
def get_current_patient_chat_history(
    patient_id: Optional[int] = None,
    current_user: Optional[User] = Depends(get_current_user_optional),
    x_patient_id: Optional[str] = Header(None, alias="X-Patient-Id"),
    db: Session = Depends(get_db)
):
    """
    Returns recent dialogue history for the current authenticated patient.
    """
    try:
        patient = _resolve_patient(
            db=db,
            current_user=current_user,
            explicit_patient_id=patient_id,
            header_patient_id=x_patient_id
        )
    except HTTPException:
        return []

    messages = (
        db.query(ChatMessage)
        .filter(ChatMessage.patient_id == patient.id)
        .order_by(ChatMessage.created_at.asc())
        .limit(40)
        .all()
    )
    return [ChatMessageResponse.model_validate(m) for m in messages]


@router.get("/history/{patient_id}", response_model=List[ChatMessageResponse])
def get_chat_history_by_id(patient_id: int, db: Session = Depends(get_db)):
    """
    Direct history lookup by patient ID.
    """
    patient = _get_patient_or_404(db, patient_id)
    messages = (
        db.query(ChatMessage)
        .filter(ChatMessage.patient_id == patient.id)
        .order_by(ChatMessage.created_at.asc())
        .limit(40)
        .all()
    )
    return [ChatMessageResponse.model_validate(m) for m in messages]


@router.post("/message", response_model=ChatMessageResponse)
def save_single_message(payload: ChatMessageCreate, db: Session = Depends(get_db)):
    """
    Legacy message creation endpoint.
    """
    patient = _get_patient_or_404(db, payload.patient_id)
    msg = ChatMessage(
        patient_id=patient.id,
        role=payload.role,
        message=payload.message
    )
    db.add(msg)
    db.commit()
    db.refresh(msg)
    return ChatMessageResponse.model_validate(msg)
