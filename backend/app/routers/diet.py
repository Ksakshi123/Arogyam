from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime

from app.database import get_db
from app.models.patient import PatientProfile
from app.models.dosha import DoshaResult
from app.models.diet import WeeklyDietPlan
from app.models.meal import Meal
from app.schemas.diet import DietGenerateRequest, WeeklyDietPlanResponse, PlanCompatibilityScore, DailyDietPlanResponse
from app.schemas.meal import MealResponse, MealUpdate
from app.services.diet_service import DietService
from app.routers.patient import _get_patient_or_404

router = APIRouter()


def _format_weekly_plan(plan: WeeklyDietPlan, db: Session) -> WeeklyDietPlanResponse:
    meals = db.query(Meal).filter(Meal.diet_plan_id == plan.id).all()

    # Group meals by date or day_of_week
    grouped_days = {}
    for m in meals:
        day_key = m.date or m.day_of_week
        if day_key not in grouped_days:
            grouped_days[day_key] = {"dayOfWeek": m.day_of_week, "date": m.date}
        grouped_days[day_key][m.meal_type] = MealResponse.model_validate(m)

    days_list = []
    # Sort by date
    for day_key, data in sorted(grouped_days.items(), key=lambda x: x[1].get("date", "")):
        if "breakfast" in data and "lunch" in data and "dinner" in data:
            days_list.append(DailyDietPlanResponse(
                date=data.get("date") or day_key,
                dayOfWeek=data.get("dayOfWeek", "Monday"),
                breakfast=data["breakfast"],
                lunch=data["lunch"],
                dinner=data["dinner"],
            ))

    score_data = plan.compatibility_score or {"dosha": 90, "preferences": 100, "allergies": 100, "overall": 96}
    score = PlanCompatibilityScore(**score_data)

    return WeeklyDietPlanResponse(
        id=plan.id,
        patient_id=plan.patient_id,
        startDate=plan.week_start_date,
        status=plan.status,
        days=days_list,
        compatibilityScore=score,
        created_at=plan.created_at,
    )


@router.post("/generate", response_model=WeeklyDietPlanResponse)
def generate_weekly_plan(payload: DietGenerateRequest, db: Session = Depends(get_db)):
    patient = _get_patient_or_404(db, payload.patient_id)

    # Fetch latest dosha result
    dosha = (
        db.query(DoshaResult)
        .filter(DoshaResult.patient_id == patient.id)
        .order_by(DoshaResult.created_at.desc())
        .first()
    )
    primary_dosha = dosha.primary_dosha if dosha else "Vata"

    # Archive existing active plans
    db.query(WeeklyDietPlan).filter(
        WeeklyDietPlan.patient_id == patient.id,
        WeeklyDietPlan.status == "active"
    ).update({"status": "archived"})
    db.commit()

    # Generate plan
    plan_data = DietService.generate_weekly_plan(
        patient_id=patient.id,
        allergies=patient.allergies or [],
        food_restrictions=patient.food_restrictions or [],
        disliked_foods=patient.disliked_foods or [],
        diet_preference=patient.diet_preference,
        primary_dosha=primary_dosha,
    )

    new_plan = WeeklyDietPlan(
        patient_id=patient.id,
        week_start_date=plan_data["start_date"],
        status="active",
        compatibility_score=plan_data["compatibility_score"],
    )
    db.add(new_plan)
    db.commit()
    db.refresh(new_plan)

    # Save all meals
    for m in plan_data["meals"]:
        meal_record = Meal(
            id=f"{new_plan.id}-{m['meal_type']}-{m['date']}",
            diet_plan_id=new_plan.id,
            day_of_week=m["day_of_week"],
            date=m["date"],
            meal_type=m["meal_type"],
            meal_name=m["meal_name"],
            description=m["description"],
            ingredients=m["ingredients"],
            calories=m["calories"],
            protein=m["protein"],
            carbohydrates=m["carbohydrates"],
            fats=m["fats"],
            preparation_time=m["preparation_time"],
            tags=m["tags"],
            suitable_doshas=m["suitable_doshas"],
            is_replaced=m["is_replaced"],
            explanation=m["explanation"],
            recipe=m["recipe"],
        )
        db.add(meal_record)

    db.commit()
    return _format_weekly_plan(new_plan, db)


@router.get("/current/{patient_id}", response_model=WeeklyDietPlanResponse)
def get_current_plan(patient_id: int, db: Session = Depends(get_db)):
    patient = _get_patient_or_404(db, patient_id)

    active_plan = (
        db.query(WeeklyDietPlan)
        .filter(WeeklyDietPlan.patient_id == patient.id, WeeklyDietPlan.status == "active")
        .order_by(WeeklyDietPlan.created_at.desc())
        .first()
    )

    if not active_plan:
        # Auto-generate if no active plan exists
        return generate_weekly_plan(DietGenerateRequest(patient_id=patient.id), db)

    return _format_weekly_plan(active_plan, db)


@router.put("/meal/{meal_id}", response_model=MealResponse)
def update_meal(meal_id: str, payload: MealUpdate, db: Session = Depends(get_db)):
    meal = db.query(Meal).filter(Meal.id == meal_id).first()
    if not meal:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Meal with ID '{meal_id}' not found"
        )

    update_data = payload.model_dump(exclude_unset=True)
    for key, val in update_data.items():
        if hasattr(meal, key):
            setattr(meal, key, val)

    meal.is_replaced = True
    db.commit()
    db.refresh(meal)
    return MealResponse.model_validate(meal)


@router.post("/regenerate", response_model=WeeklyDietPlanResponse)
def regenerate_plan(payload: DietGenerateRequest, db: Session = Depends(get_db)):
    return generate_weekly_plan(payload, db)
