from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional

from app.database import get_db
from app.models.patient import PatientProfile
from app.models.user import User
from app.schemas.patient import PatientProfileCreate, PatientProfileUpdate, PatientProfileResponse
from app.dependencies import get_current_user

router = APIRouter()


def _get_patient_or_404(db: Session, identifier: any) -> PatientProfile:
    """Looks up a PatientProfile by its id or user_id. Raises 404 generically on miss
    to avoid revealing which IDs exist (prevents enumeration attacks)."""
    pid = None
    try:
        pid = int(identifier)
    except (ValueError, TypeError):
        pid = None

    if pid is not None:
        profile = db.query(PatientProfile).filter(PatientProfile.id == pid).first()
        if not profile:
            profile = db.query(PatientProfile).filter(PatientProfile.user_id == pid).first()
        if profile:
            return profile

    # SECURITY FIX: Never fall back to the first patient in the DB.
    # That would silently return another user's data for any unknown ID.
    raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail="Patient not found"  # Generic message — don't reveal ID existence
    )


@router.post("", response_model=PatientProfileResponse, status_code=status.HTTP_201_CREATED)
def create_patient(
    payload: PatientProfileCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),  # SECURITY FIX: require JWT
):
    """Create or update the authenticated user's patient profile.
    user_id is always taken from the JWT token — never from the request body.
    """
    # SECURITY FIX: Always use the authenticated user's ID — ignore any user_id in payload
    user_id = current_user.id

    existing = db.query(PatientProfile).filter(PatientProfile.user_id == user_id).first()
    if existing:
        # Update existing profile — only allow safe fields
        for field, value in payload.model_dump(exclude_unset=True).items():
            if field != "user_id" and hasattr(existing, field):
                setattr(existing, field, value)
        db.commit()
        db.refresh(existing)
        return _build_patient_response(existing)

    profile = PatientProfile(
        user_id=user_id,
        age=payload.age,
        weight=payload.weight,
        height=payload.height,
        activity_level=payload.activity_level or "Moderately Active",
        diet_preference=payload.diet_preference or "Vegetarian",
        food_preferences=payload.food_preferences or [],
        wellness_goals=payload.wellness_goals or [],
        allergies=payload.allergies or [],
        food_restrictions=payload.food_restrictions or [],
        disliked_foods=payload.disliked_foods or [],
    )
    db.add(profile)
    db.commit()
    db.refresh(profile)
    return _build_patient_response(profile)


@router.get("/{patient_id}", response_model=PatientProfileResponse)
def get_patient(
    patient_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),  # SECURITY FIX: require JWT
):
    profile = _get_patient_or_404(db, patient_id)

    # SECURITY FIX: Ownership check — patients can only read their own profile.
    # Doctors can read any patient's profile.
    if profile.user_id != current_user.id and current_user.role != "doctor":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access forbidden")

    return _build_patient_response(profile)


@router.put("/{patient_id}", response_model=PatientProfileResponse)
def update_patient(
    patient_id: str,
    payload: PatientProfileUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),  # SECURITY FIX: require JWT
):
    profile = _get_patient_or_404(db, patient_id)

    # SECURITY FIX: Ownership check — patients can only update their own profile.
    if profile.user_id != current_user.id and current_user.role != "doctor":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access forbidden")

    update_data = payload.model_dump(exclude_unset=True)
    if "full_name" in update_data and profile.user:
        profile.user.name = update_data.pop("full_name")

    for field, value in update_data.items():
        if hasattr(profile, field):
            setattr(profile, field, value)

    db.commit()
    db.refresh(profile)
    return _build_patient_response(profile)


def _build_patient_response(profile: PatientProfile) -> PatientProfileResponse:
    user = profile.user
    return PatientProfileResponse(
        id=profile.id,
        user_id=profile.user_id,
        full_name=user.name if user else "Arogyam Patient",
        email=user.email if user else None,
        age=profile.age,
        weight=profile.weight,
        height=profile.height,
        activity_level=profile.activity_level,
        diet_preference=profile.diet_preference,
        food_preferences=profile.food_preferences or [],
        wellness_goals=profile.wellness_goals or [],
        allergies=profile.allergies or [],
        food_restrictions=profile.food_restrictions or [],
        disliked_foods=profile.disliked_foods or [],
        created_at=profile.created_at,
        updated_at=profile.updated_at,
    )
