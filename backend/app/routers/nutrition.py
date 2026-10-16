from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime

from app.database import get_db
from app.models.nutrition import MealCompletion, DailyNutrition
from app.models.user import User
from app.schemas.nutrition import MealCompletionCreate, MealCompletionResponse, NutritionAnalyticsResponse, NutritionDaySummary
from app.services.nutrition_service import NutritionService
from app.routers.patient import _get_patient_or_404
from app.dependencies import get_current_user

router = APIRouter()


from app.models.meal import Meal


def _assert_patient_access(patient, current_user: User):
    """Raise 403 if the authenticated user does not own this patient record (unless doctor)."""
    if patient.user_id != current_user.id and current_user.role != "doctor":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access forbidden")


@router.post("/meal-completion", response_model=MealCompletionResponse)
def log_meal_completion(
    payload: MealCompletionCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),  # SECURITY FIX: require JWT
):
    patient = _get_patient_or_404(db, payload.patient_id)
    _assert_patient_access(patient, current_user)  # SECURITY FIX: ownership check

    # Check if meal exists in meals table to avoid foreign key violation
    safe_meal_id = None
    if payload.meal_id:
        meal_record = db.query(Meal).filter(Meal.id == payload.meal_id).first()
        if meal_record:
            safe_meal_id = meal_record.id

    # Check for existing record for this meal and date
    existing = (
        db.query(MealCompletion)
        .filter(
            MealCompletion.patient_id == patient.id,
            MealCompletion.date == payload.date,
            (MealCompletion.meal_id == safe_meal_id) if safe_meal_id else (MealCompletion.date == payload.date)
        )
        .first()
    )

    if existing:
        existing.status = payload.status
        existing.replacement_meal_id = payload.replacement_meal_id
        if safe_meal_id:
            existing.meal_id = safe_meal_id
        db.commit()
        db.refresh(existing)
        resp = MealCompletionResponse.model_validate(existing)
        resp.meal_id = payload.meal_id
        return resp

    new_completion = MealCompletion(
        patient_id=patient.id,
        meal_id=safe_meal_id,
        date=payload.date,
        status=payload.status,
        replacement_meal_id=payload.replacement_meal_id,
        completed_at=datetime.utcnow()
    )
    db.add(new_completion)
    db.commit()
    db.refresh(new_completion)
    resp = MealCompletionResponse.model_validate(new_completion)
    resp.meal_id = payload.meal_id
    return resp


@router.get("/{patient_id}", response_model=NutritionAnalyticsResponse)
def get_nutrition_analytics(
    patient_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),  # SECURITY FIX: require JWT
):
    patient = _get_patient_or_404(db, patient_id)
    _assert_patient_access(patient, current_user)  # SECURITY FIX: ownership check

    streak = NutritionService.calculate_streak(db, patient.id)
    adherence = NutritionService.calculate_adherence(db, patient.id)
    summaries_raw = NutritionService.get_daily_summaries(db, patient.id)

    completions = (
        db.query(MealCompletion)
        .filter(MealCompletion.patient_id == patient.id)
        .order_by(MealCompletion.completed_at.desc())
        .limit(100)
        .all()
    )

    daily_summaries = [
        NutritionDaySummary(
            date=s["date"],
            total_calories=s["total_calories"],
            total_protein=s["total_protein"],
            total_carbohydrates=s["total_carbohydrates"],
            total_fats=s["total_fats"],
            completed_meals_count=s["completed_meals_count"],
        )
        for s in summaries_raw
    ]

    return NutritionAnalyticsResponse(
        streak=streak,
        adherence_score=adherence,
        daily_summaries=daily_summaries,
        completions=[MealCompletionResponse.model_validate(c) for c in completions],
    )
