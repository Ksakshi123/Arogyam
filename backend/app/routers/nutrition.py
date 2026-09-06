from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime

from app.database import get_db
from app.models.nutrition import MealCompletion, DailyNutrition
from app.schemas.nutrition import MealCompletionCreate, MealCompletionResponse, NutritionAnalyticsResponse, NutritionDaySummary
from app.services.nutrition_service import NutritionService
from app.routers.patient import _get_patient_or_404

router = APIRouter()


@router.post("/meal-completion", response_model=MealCompletionResponse)
def log_meal_completion(payload: MealCompletionCreate, db: Session = Depends(get_db)):
    patient = _get_patient_or_404(db, payload.patient_id)

    # Check for existing record for this meal and date
    existing = (
        db.query(MealCompletion)
        .filter(
            MealCompletion.patient_id == patient.id,
            MealCompletion.meal_id == payload.meal_id,
            MealCompletion.date == payload.date
        )
        .first()
    )

    if existing:
        existing.status = payload.status
        existing.replacement_meal_id = payload.replacement_meal_id
        db.commit()
        db.refresh(existing)
        return MealCompletionResponse.model_validate(existing)

    new_completion = MealCompletion(
        patient_id=patient.id,
        meal_id=payload.meal_id,
        date=payload.date,
        status=payload.status,
        replacement_meal_id=payload.replacement_meal_id,
        completed_at=datetime.utcnow()
    )
    db.add(new_completion)
    db.commit()
    db.refresh(new_completion)
    return MealCompletionResponse.model_validate(new_completion)


@router.get("/{patient_id}", response_model=NutritionAnalyticsResponse)
def get_nutrition_analytics(patient_id: int, db: Session = Depends(get_db)):
    patient = _get_patient_or_404(db, patient_id)

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
