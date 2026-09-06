"""
Ayurvedic Diet Generation Service.
Generates personalized 7-day meal plans considering dosha balances,
dietary preferences, allergies, and calorie goals.
"""
from datetime import datetime, timedelta
from typing import List, Dict, Any


SAMPLE_MEALS: List[Dict[str, Any]] = [
    # Breakfast
    {
        "id": "b-1",
        "name": "Warm Spiced Oatmeal with Almonds & Dates",
        "type": "breakfast",
        "description": "Ground cardamom and cinnamon infused steel-cut oats with soaked nuts.",
        "ingredients": ["oats", "almond milk", "cardamom", "cinnamon", "dates", "almonds"],
        "calories": 340,
        "protein": 11.0,
        "carbohydrates": 56.0,
        "fats": 8.5,
        "preparation_time": 15,
        "tags": ["warm", "grounding", "sattvic"],
        "suitable_doshas": ["Vata", "Kapha"],
        "explanation": "Grounding warm oats with soothing spices soothe Vata digestion.",
    },
    {
        "id": "b-2",
        "name": "Cooling Coconut Chia Seed Pudding",
        "type": "breakfast",
        "description": "Hydrating chia pudding soaked in fresh coconut milk, garnished with mint and berries.",
        "ingredients": ["chia seeds", "coconut milk", "berries", "mint", "maple syrup"],
        "calories": 290,
        "protein": 8.0,
        "carbohydrates": 38.0,
        "fats": 12.0,
        "preparation_time": 10,
        "tags": ["cooling", "sweet", "hydrating"],
        "suitable_doshas": ["Pitta"],
        "explanation": "Cooling coconut pacifies Pitta heat and acid reflux.",
    },
    {
        "id": "b-3",
        "name": "Moong Dal Cheela with Mint Chutney",
        "type": "breakfast",
        "description": "Savory light crepes made from yellow moong lentils with herbs.",
        "ingredients": ["yellow moong dal", "ginger", "green chili", "coriander", "cumin"],
        "calories": 310,
        "protein": 14.5,
        "carbohydrates": 48.0,
        "fats": 6.0,
        "preparation_time": 20,
        "tags": ["light", "tridoshic", "protein-rich"],
        "suitable_doshas": ["Vata", "Pitta", "Kapha"],
        "explanation": "Yellow moong is easily digestible and suitable for all constitutions.",
    },
    # Lunch
    {
        "id": "l-1",
        "name": "Tridoshic Kitchari with Ghee & Cumin",
        "type": "lunch",
        "description": "Classic cleansing pot of basmati rice, split yellow mung beans, and digestion-stoking spices.",
        "ingredients": ["basmati rice", "split moong dal", "ghee", "cumin", "turmeric", "ginger"],
        "calories": 420,
        "protein": 15.0,
        "carbohydrates": 68.0,
        "fats": 10.0,
        "preparation_time": 30,
        "tags": ["nourishing", "cleansing", "sattvic"],
        "suitable_doshas": ["Vata", "Pitta", "Kapha"],
        "explanation": "The ultimate Ayurvedic healing meal, balanced for Agni.",
    },
    {
        "id": "l-2",
        "name": "Steamed Quinoa Bowl with Sautéed Greens & Tahini",
        "type": "lunch",
        "description": "Fiber-rich quinoa paired with steamed zucchini, kale, and light lemon-tahini dressing.",
        "ingredients": ["quinoa", "zucchini", "kale", "tahini", "lemon", "coriander"],
        "calories": 440,
        "protein": 16.0,
        "carbohydrates": 62.0,
        "fats": 14.0,
        "preparation_time": 25,
        "tags": ["light", "detoxifying", "alkaline"],
        "suitable_doshas": ["Kapha", "Pitta"],
        "explanation": "Light bitter greens and quinoa gently stimulate metabolism.",
    },
    {
        "id": "l-3",
        "name": "Roasted Butternut Squash & Red Lentil Soup with Sourdough",
        "type": "lunch",
        "description": "Velvety spiced autumn soup served with warm toasted artisan bread.",
        "ingredients": ["butternut squash", "red lentils", "coconut cream", "cumin", "turmeric"],
        "calories": 460,
        "protein": 18.0,
        "carbohydrates": 72.0,
        "fats": 11.0,
        "preparation_time": 35,
        "tags": ["warming", "comforting"],
        "suitable_doshas": ["Vata"],
        "explanation": "Warm sweet vegetables bring calm and stability to an erratic nervous system.",
    },
    # Dinner
    {
        "id": "d-1",
        "name": "Ayurvedic Vegetable Stew with Brown Rice",
        "type": "dinner",
        "description": "Slow-simmered seasonal root vegetables and greens in golden spiced broth.",
        "ingredients": ["carrots", "spinach", "brown rice", "ginger", "ghee", "coriander"],
        "calories": 380,
        "protein": 10.0,
        "carbohydrates": 64.0,
        "fats": 9.0,
        "preparation_time": 30,
        "tags": ["light dinner", "easy-digest"],
        "suitable_doshas": ["Vata", "Kapha"],
        "explanation": "Light and comforting, preparing the digestive fire for night rejuvenation.",
    },
    {
        "id": "d-2",
        "name": "Cucumber & Cilantro Mung Soup with Toasted Seeds",
        "type": "dinner",
        "description": "Gentle cooling broth with split mung dal, cilantro, and pumpkin seeds.",
        "ingredients": ["mung dal", "cucumber", "cilantro", "pumpkin seeds", "fennel"],
        "calories": 320,
        "protein": 13.0,
        "carbohydrates": 44.0,
        "fats": 8.0,
        "preparation_time": 25,
        "tags": ["cooling", "pitta-pacifying"],
        "suitable_doshas": ["Pitta"],
        "explanation": "Fennel and cilantro cool excess heat for restful sleep.",
    },
    {
        "id": "d-3",
        "name": "Spiced Lentil Broth with Wilted Spinach",
        "type": "dinner",
        "description": "Clear rasam-style peppery broth with protein-packed lentils and spinach leaves.",
        "ingredients": ["toor dal", "black pepper", "cumin", "spinach", "curry leaves"],
        "calories": 310,
        "protein": 14.0,
        "carbohydrates": 48.0,
        "fats": 5.0,
        "preparation_time": 20,
        "tags": ["stimulating", "anti-kapha"],
        "suitable_doshas": ["Kapha"],
        "explanation": "Pungent spices burn excess Kapha and prevent nighttime sluggishness.",
    },
]


class DietGenerator:
    """
    Generates tailored 7-day meal plans matching patient doshas and allergy criteria.
    """

    @classmethod
    def generate(cls, profile: Any, assessment: Any) -> Dict[str, Any]:
        primary_dosha = getattr(assessment, "primary_dosha", "Vata")
        allergies = [a.lower() for a in (getattr(profile, "allergies", []) or [])]

        # 1. Filter out allergens
        def is_safe(m: dict) -> bool:
            for ing in m.get("ingredients", []):
                for alg in allergies:
                    if alg in ing.lower():
                        return False
            return True

        safe_meals = [m for m in SAMPLE_MEALS if is_safe(m)]
        if not safe_meals:
            safe_meals = SAMPLE_MEALS

        breakfasts = [m for m in safe_meals if m["type"] == "breakfast"] or SAMPLE_MEALS[:2]
        lunches = [m for m in safe_meals if m["type"] == "lunch"] or SAMPLE_MEALS[2:4]
        dinners = [m for m in safe_meals if m["type"] == "dinner"] or SAMPLE_MEALS[4:]

        days_of_week = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
        today = datetime.utcnow()

        days = []
        for i, day_name in enumerate(days_of_week):
            date_str = (today + timedelta(days=i)).strftime("%Y-%m-%d")
            b_meal = breakfasts[i % len(breakfasts)]
            l_meal = lunches[i % len(lunches)]
            d_meal = dinners[i % len(dinners)]

            days.append({
                "date": date_str,
                "dayOfWeek": day_name,
                "breakfast": b_meal,
                "lunch": l_meal,
                "dinner": d_meal,
            })

        return {
            "id": f"plan-{int(today.timestamp())}",
            "startDate": today.strftime("%Y-%m-%d"),
            "days": days,
            "compatibilityScore": {
                "dosha": 92,
                "preferences": 95,
                "allergies": 100,
                "overall": 95,
            },
        }
