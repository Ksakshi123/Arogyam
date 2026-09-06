"""
Ayurvedic Diet Generation Service.
Generates personalized 7-day meal plans considering dosha balances,
dietary preferences, allergies, and calorie goals.
"""
from datetime import datetime, timedelta
from typing import List, Dict, Any, Optional

from app.models.diet import WeeklyDietPlan
from app.models.meal import Meal
from app.services.diet_generator import SAMPLE_MEALS


class DietService:
    @classmethod
    def is_meal_safe(cls, meal: Dict[str, Any], allergies: List[str], restrictions: List[str], disliked: List[str]) -> bool:
        avoid_words = [a.lower().strip() for a in (allergies + restrictions + disliked) if a]
        if not avoid_words:
            return True

        content = " ".join(
            [str(i).lower() for i in meal.get("ingredients", [])] +
            [str(meal.get("name", "")).lower()] +
            [str(t).lower() for t in meal.get("tags", [])]
        )

        for word in avoid_words:
            if word in content:
                return False
        return True

    @classmethod
    def matches_diet_preference(cls, meal: Dict[str, Any], preference: Optional[str]) -> bool:
        if not preference:
            return True
        pref = preference.lower()
        ingredients = [str(i).lower() for i in meal.get("ingredients", [])]

        if pref == "vegan" and any(dairy in ingredients for dairy in ["ghee", "milk", "paneer", "yogurt"]):
            return False
        if pref == "jain" and any(root in ingredients for root in ["onion", "garlic", "potato"]):
            return False
        return True

    @classmethod
    def sort_by_dosha(cls, meals: List[Dict[str, Any]], primary_dosha: str) -> List[Dict[str, Any]]:
        def score_meal(m):
            suitable = m.get("suitable_doshas", [])
            if primary_dosha in suitable or "Tridoshic" in suitable:
                return 2
            return 1
        return sorted(meals, key=score_meal, reverse=True)

    @classmethod
    def generate_weekly_plan(
        cls,
        patient_id: int,
        allergies: List[str],
        food_restrictions: List[str],
        disliked_foods: List[str],
        diet_preference: Optional[str],
        primary_dosha: str,
        start_date_str: Optional[str] = None,
    ) -> Dict[str, Any]:
        """
        Generates a curated 7-day meal plan.
        """
        # 1. Filter safe meals
        safe_meals = [
            m for m in SAMPLE_MEALS
            if cls.is_meal_safe(m, allergies, food_restrictions, disliked_foods)
        ]
        if not safe_meals:
            safe_meals = SAMPLE_MEALS

        # 2. Preference filter
        preferred_meals = [
            m for m in safe_meals
            if cls.matches_diet_preference(m, diet_preference)
        ]
        pool = preferred_meals if len(preferred_meals) >= 6 else safe_meals

        # 3. Categorize by type
        breakfasts = [m for m in pool if m.get("type") == "breakfast"] or [m for m in SAMPLE_MEALS if m.get("type") == "breakfast"]
        lunches = [m for m in pool if m.get("type") == "lunch"] or [m for m in SAMPLE_MEALS if m.get("type") == "lunch"]
        dinners = [m for m in pool if m.get("type") == "dinner"] or [m for m in SAMPLE_MEALS if m.get("type") == "dinner"]

        sorted_b = cls.sort_by_dosha(breakfasts, primary_dosha)
        sorted_l = cls.sort_by_dosha(lunches, primary_dosha)
        sorted_d = cls.sort_by_dosha(dinners, primary_dosha)

        start_dt = datetime.strptime(start_date_str, "%Y-%m-%d") if start_date_str else datetime.utcnow()
        days_of_week = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

        days_data = []
        all_meals_to_create = []

        dosha_matches = 0

        for i in range(7):
            current_date = (start_dt + timedelta(days=i)).strftime("%Y-%m-%d")
            day_name = days_of_week[(start_dt.weekday() + i) % 7]

            b_template = sorted_b[i % len(sorted_b)]
            l_template = sorted_l[i % len(sorted_l)]
            d_template = sorted_d[i % len(sorted_d)]

            for t in [b_template, l_template, d_template]:
                if primary_dosha in t.get("suitable_doshas", []):
                    dosha_matches += 1

            # Day meals
            b_meal = {
                "id": f"meal-b-{patient_id}-{i}",
                "day_of_week": day_name,
                "date": current_date,
                "meal_type": "breakfast",
                "meal_name": b_template["name"],
                "description": b_template.get("description", ""),
                "ingredients": b_template.get("ingredients", []),
                "calories": float(b_template.get("calories", 300)),
                "protein": float(b_template.get("protein", 10)),
                "carbohydrates": float(b_template.get("carbohydrates", 45)),
                "fats": float(b_template.get("fats", 8)),
                "preparation_time": int(b_template.get("preparation_time", 15)),
                "tags": b_template.get("tags", []),
                "suitable_doshas": b_template.get("suitable_doshas", []),
                "is_replaced": False,
                "explanation": b_template.get("explanation", f"Nourishing breakfast supporting {primary_dosha} balance."),
                "recipe": {
                    "steps": ["Prepare fresh ingredients", "Cook with gentle heat & digestion spices", "Serve warm and freshly prepared"],
                    "tips": ["Chew slowly in a quiet environment", "Avoid iced beverages during meal"],
                    "servings": 1,
                    "difficulty": "Easy"
                }
            }

            l_meal = {
                "id": f"meal-l-{patient_id}-{i}",
                "day_of_week": day_name,
                "date": current_date,
                "meal_type": "lunch",
                "meal_name": l_template["name"],
                "description": l_template.get("description", ""),
                "ingredients": l_template.get("ingredients", []),
                "calories": float(l_template.get("calories", 420)),
                "protein": float(l_template.get("protein", 15)),
                "carbohydrates": float(l_template.get("carbohydrates", 60)),
                "fats": float(l_template.get("fats", 12)),
                "preparation_time": int(l_template.get("preparation_time", 25)),
                "tags": l_template.get("tags", []),
                "suitable_doshas": l_template.get("suitable_doshas", []),
                "is_replaced": False,
                "explanation": l_template.get("explanation", f"Hearty lunch taken when digestive fire (Agni) is at its peak."),
                "recipe": {
                    "steps": ["Steam or lightly sauté ingredients with ghee or oil", "Simmer with cumin and turmeric", "Serve freshly made"],
                    "tips": ["Eat your largest meal of the day at lunch", "Sit down comfortably while eating"],
                    "servings": 1,
                    "difficulty": "Easy"
                }
            }

            d_meal = {
                "id": f"meal-d-{patient_id}-{i}",
                "day_of_week": day_name,
                "date": current_date,
                "meal_type": "dinner",
                "meal_name": d_template["name"],
                "description": d_template.get("description", ""),
                "ingredients": d_template.get("ingredients", []),
                "calories": float(d_template.get("calories", 340)),
                "protein": float(d_template.get("protein", 12)),
                "carbohydrates": float(d_template.get("carbohydrates", 50)),
                "fats": float(d_template.get("fats", 8)),
                "preparation_time": int(d_template.get("preparation_time", 20)),
                "tags": d_template.get("tags", []),
                "suitable_doshas": d_template.get("suitable_doshas", []),
                "is_replaced": False,
                "explanation": d_template.get("explanation", f"Light evening broth easing digestion before sleep."),
                "recipe": {
                    "steps": ["Simmer vegetables and lentils until tender", "Garnish with fresh cilantro", "Enjoy 2-3 hours before sleep"],
                    "tips": ["Keep dinner lighter than lunch for restful sleep", "Sip warm water if desired"],
                    "servings": 1,
                    "difficulty": "Easy"
                }
            }

            days_data.append({
                "date": current_date,
                "dayOfWeek": day_name,
                "breakfast": b_meal,
                "lunch": l_meal,
                "dinner": d_meal,
            })
            all_meals_to_create.extend([b_meal, l_meal, d_meal])

        dosha_score = min(100, int((dosha_matches / 21) * 100))
        pref_score = 100 if len(preferred_meals) >= 6 else 80
        compatibility = {
            "dosha": dosha_score,
            "preferences": pref_score,
            "allergies": 100,
            "overall": int((dosha_score + pref_score + 100) / 3),
        }

        return {
            "start_date": start_dt.strftime("%Y-%m-%d"),
            "days": days_data,
            "meals": all_meals_to_create,
            "compatibility_score": compatibility,
        }

    @classmethod
    def get_alternatives(
        cls,
        current_meal_type: str,
        current_meal_id: str,
        allergies: List[str],
        primary_dosha: str
    ) -> List[Dict[str, Any]]:
        safe = [
            m for m in SAMPLE_MEALS
            if m.get("type") == current_meal_type and m.get("id") != current_meal_id
        ]
        return cls.sort_by_dosha(safe, primary_dosha)[:3]
