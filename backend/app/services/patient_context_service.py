from typing import Dict, Any, List
from datetime import datetime, date
from sqlalchemy.orm import Session
from sqlalchemy import desc

from app.models.patient import PatientProfile
from app.models.dosha import DoshaResult
from app.models.diet import WeeklyDietPlan
from app.models.meal import Meal
from app.models.nutrition import MealCompletion
from app.models.chat import ChatMessage


def build_patient_context(db: Session, patient_id: int) -> Dict[str, Any]:
    """
    Extracts and pre-computes rich, structured health context from PostgreSQL for patient.
    Computes Python-verified nutritional statistics so Grok does not hallucinate database numbers.
    """
    # 1. Patient Profile
    profile = (
        db.query(PatientProfile)
        .filter(PatientProfile.id == patient_id)
        .first()
    )
    if not profile:
        profile = (
            db.query(PatientProfile)
            .filter(PatientProfile.user_id == patient_id)
            .first()
        )

    patient_data = {
        "id": patient_id,
        "name": profile.user.name if profile and profile.user else "Arogyam Patient",
        "age": profile.age if profile else 28,
        "gender": getattr(profile, "gender", "Not Specified") if profile else "Not Specified",
        "height_cm": profile.height if profile else 170.0,
        "weight_kg": profile.weight if profile else 65.0,
        "activity_level": profile.activity_level if profile else "Moderately Active",
        "diet_preference": profile.diet_preference if profile else "Vegetarian",
        "wellness_goals": profile.wellness_goals if profile and profile.wellness_goals else ["General Wellness"],
        "allergies": profile.allergies if profile and profile.allergies else [],
        "food_restrictions": profile.food_restrictions if profile and profile.food_restrictions else [],
        "disliked_foods": profile.disliked_foods if profile and profile.disliked_foods else [],
    }

    # 2. Dosha Assessment
    real_pid = profile.id if profile else patient_id
    dosha_rec = (
        db.query(DoshaResult)
        .filter(DoshaResult.patient_id == real_pid)
        .order_by(desc(DoshaResult.created_at))
        .first()
    )

    dosha_data = {
        "primary_dosha": dosha_rec.primary_dosha if dosha_rec else "Vata",
        "secondary_dosha": dosha_rec.secondary_dosha if dosha_rec else None,
        "constitution": dosha_rec.constitution if dosha_rec else "Vata-Pitta",
        "vata_percentage": dosha_rec.vata if dosha_rec else 34,
        "pitta_percentage": dosha_rec.pitta if dosha_rec else 33,
        "kapha_percentage": dosha_rec.kapha if dosha_rec else 33,
    }

    # 3. Active Diet Plan & Today's Meals
    active_plan = (
        db.query(WeeklyDietPlan)
        .filter(
            WeeklyDietPlan.patient_id == real_pid,
            WeeklyDietPlan.status == "active"
        )
        .order_by(desc(WeeklyDietPlan.created_at))
        .first()
    )

    today_str = date.today().isoformat()
    today_meals_list: List[Dict[str, Any]] = []

    today_calories = 0
    today_protein = 0.0
    today_carbs = 0.0
    today_fats = 0.0

    if active_plan:
        meals = db.query(Meal).filter(Meal.diet_plan_id == active_plan.id).all()
        # Find meals for today's date or matching today's day of week
        today_day_name = datetime.now().strftime("%A")

        matching_meals = [m for m in meals if m.date == today_str]
        if not matching_meals:
            matching_meals = [m for m in meals if (m.day_of_week or "").lower() == today_day_name.lower()]
        if not matching_meals and meals:
            # Fallback to first 3 meals
            matching_meals = meals[:3]

        for m in matching_meals:
            m_dict = {
                "id": str(m.id),
                "name": m.name,
                "type": m.meal_type,
                "description": m.description or "",
                "ingredients": m.ingredients or [],
                "calories": m.calories or 0,
                "protein_g": float(m.protein or 0.0),
                "carbs_g": float(m.carbohydrates or 0.0),
                "fats_g": float(m.fats or 0.0),
                "preparation_time_mins": m.preparation_time or 20,
                "suitable_doshas": m.suitable_doshas or [],
                "explanation": m.explanation or "",
            }
            today_meals_list.append(m_dict)
            today_calories += m.calories or 0
            today_protein += float(m.protein or 0.0)
            today_carbs += float(m.carbohydrates or 0.0)
            today_fats += float(m.fats or 0.0)

    # 4. Meal Completions & Consumed Nutrition
    completions = (
        db.query(MealCompletion)
        .filter(
            MealCompletion.patient_id == real_pid,
            MealCompletion.date == today_str,
            MealCompletion.status == "completed"
        )
        .all()
    )
    completed_meal_ids = {c.meal_id for c in completions}
    consumed_protein = sum(
        m["protein_g"] for m in today_meals_list if m["id"] in completed_meal_ids or m["name"] in completed_meal_ids
    )

    weight_val = patient_data["weight_kg"] or 65.0
    target_protein = round(weight_val * 1.2, 1)

    nutrition_data = {
        "today_planned_calories": today_calories,
        "today_planned_protein_g": round(today_protein, 1),
        "today_planned_carbs_g": round(today_carbs, 1),
        "today_planned_fats_g": round(today_fats, 1),
        "today_consumed_protein_g": round(consumed_protein, 1),
        "daily_target_protein_g": target_protein,
        "completed_meals_today": len(completions),
        "total_planned_meals_today": len(today_meals_list),
    }

    # 5. Recent Chat History (Last 12 messages)
    recent_db_msgs = (
        db.query(ChatMessage)
        .filter(ChatMessage.patient_id == real_pid)
        .order_by(desc(ChatMessage.created_at))
        .limit(12)
        .all()
    )
    # Reverse to chronological order
    recent_history = [
        {"role": m.role, "content": m.message}
        for m in reversed(recent_db_msgs)
    ]

    return {
        "patient": patient_data,
        "dosha": dosha_data,
        "nutrition": nutrition_data,
        "today_meals": today_meals_list,
        "has_active_diet_plan": active_plan is not None,
        "active_diet_plan_id": active_plan.id if active_plan else None,
        "recent_history": recent_history,
    }
