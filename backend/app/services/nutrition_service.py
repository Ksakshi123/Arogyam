"""
Nutrition and Habit Analytics Service.
Calculates adherence, streaks, and macro aggregations from meal completions.
"""
from datetime import datetime, timedelta
from typing import List, Dict, Any
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.models.nutrition import MealCompletion, DailyNutrition
from app.models.diet import WeeklyDietPlan
from app.models.meal import Meal


class NutritionService:
    @classmethod
    def calculate_streak(cls, db: Session, patient_id: int) -> int:
        """
        Calculates consecutive active days of completed meals.
        """
        completions = (
            db.query(MealCompletion.date)
            .filter(
                MealCompletion.patient_id == patient_id,
                MealCompletion.status == "completed"
            )
            .distinct()
            .all()
        )
        if not completions:
            return 0

        active_dates = {c[0] for c in completions}
        today = datetime.utcnow().strftime("%Y-%m-%d")
        yesterday = (datetime.utcnow() - timedelta(days=1)).strftime("%Y-%m-%d")

        if today in active_dates:
            check_date = datetime.utcnow()
        elif yesterday in active_dates:
            check_date = datetime.utcnow() - timedelta(days=1)
        else:
            return 0

        streak = 0
        while check_date.strftime("%Y-%m-%d") in active_dates:
            streak += 1
            check_date -= timedelta(days=1)

        return streak

    @classmethod
    def calculate_adherence(cls, db: Session, patient_id: int) -> int:
        """
        Calculates percentage of planned meals marked as completed for active plan.
        """
        active_plan = (
            db.query(WeeklyDietPlan)
            .filter(WeeklyDietPlan.patient_id == patient_id, WeeklyDietPlan.status == "active")
            .order_by(WeeklyDietPlan.created_at.desc())
            .first()
        )
        if not active_plan:
            return 0

        total_meals = db.query(Meal).filter(Meal.diet_plan_id == active_plan.id).count()
        if total_meals == 0:
            return 0

        completed_meals = (
            db.query(MealCompletion)
            .filter(
                MealCompletion.patient_id == patient_id,
                MealCompletion.status == "completed"
            )
            .count()
        )

        return min(100, int((completed_meals / total_meals) * 100))

    @classmethod
    def get_daily_summaries(cls, db: Session, patient_id: int) -> List[Dict[str, Any]]:
        """
        Aggregates calories and macros consumed per date.
        """
        records = (
            db.query(
                MealCompletion.date,
                func.sum(Meal.calories).label("total_calories"),
                func.sum(Meal.protein).label("total_protein"),
                func.sum(Meal.carbohydrates).label("total_carbs"),
                func.sum(Meal.fats).label("total_fats"),
                func.count(MealCompletion.id).label("completed_count"),
            )
            .join(Meal, MealCompletion.meal_id == Meal.id)
            .filter(
                MealCompletion.patient_id == patient_id,
                MealCompletion.status == "completed"
            )
            .group_by(MealCompletion.date)
            .order_by(MealCompletion.date.asc())
            .all()
        )

        results = []
        for r in records:
            results.append({
                "date": r.date,
                "total_calories": float(r.total_calories or 0.0),
                "total_protein": float(r.total_protein or 0.0),
                "total_carbohydrates": float(r.total_carbs or 0.0),
                "total_fats": float(r.total_fats or 0.0),
                "completed_meals_count": int(r.completed_count or 0),
            })
        return results
