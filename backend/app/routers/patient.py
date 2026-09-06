from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional

from app.database import get_db
from app.models.patient import PatientProfile
from app.models.user import User
from app.schemas.patient import PatientProfileCreate, PatientProfileUpdate, PatientProfileResponse

router = APIRouter()


def _get_patient_or_404(db: Session, identifier: int) -> PatientProfile:
    # Try finding by patient_profile.id first, then by user_id
    profile = db.query(PatientProfile).filter(PatientProfile.id == identifier).first()
    if not profile:
        profile = db.query(PatientProfile).filter(PatientProfile.user_id == identifier).first()
    if not profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Patient with ID {identifier} not found"
        )
    return profile


@router.post("", response_model=PatientProfileResponse, status_code=status.HTTP_201_CREATED)
def create_patient(payload: PatientProfileCreate, db: Session = Depends(get_db)):
    # Check if user exists or if user_id is provided
    user_id = payload.user_id
    if not user_id:
        # Create a user record if none provided
        user = User(
            name=payload.full_name or "Arogyam Patient",
            email=f"patient_{payload.age or 30}_{int(payload.weight or 65)}@arogyam.local",
            password_hash="placeholder_hash",
            role="patient"
        )
        db.add(user)
        db.commit()
        db.refresh(user)
        user_id = user.id

    existing = db.query(PatientProfile).filter(PatientProfile.user_id == user_id).first()
    if existing:
        # Update existing
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
def get_patient(patient_id: int, db: Session = Depends(get_db)):
    profile = _get_patient_or_404(db, patient_id)
    return _build_patient_response(profile)


@router.put("/{patient_id}", response_model=PatientProfileResponse)
def update_patient(patient_id: int, payload: PatientProfileUpdate, db: Session = Depends(get_db)):
    profile = _get_patient_or_404(db, patient_id)

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
        wellness_goals=profile.wellness_goals or [],
        allergies=profile.allergies or [],
        food_restrictions=profile.food_restrictions or [],
        disliked_foods=profile.disliked_foods or [],
        created_at=profile.created_at,
        updated_at=profile.updated_at,
    )
