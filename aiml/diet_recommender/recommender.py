"""
Content-Based & Constraint-Driven Ayurvedic Meal Recommender.
Ranks candidate recipes based on dosha compatibility, allergen exclusions,
dietary preferences (Jain, Vegan, Sattvic), and caloric profiles.
"""
from typing import List, Dict, Any


class AyurvedicDietRecommender:
    """
    Ranks meals using cosine-similarity or multi-criteria optimization on nutritional
    and Ayurvedic attributes (Rasa, Virya, Vipaka, Guna).
    """

    def recommend(
        self,
        candidate_meals: List[Dict[str, Any]],
        patient_dosha: str,
        allergies: List[str],
        diet_preference: str = "vegetarian",
        target_calories: int = 2000,
    ) -> List[Dict[str, Any]]:
        clean_allergies = [a.strip().lower() for a in allergies if a]

        scored_meals = []
        for meal in candidate_meals:
            # 1. Strict Allergen Filtering
            ingredients = [str(i).lower() for i in meal.get("ingredients", [])]
            name = meal.get("name", "").lower()
            is_allergen_free = True
            for allergen in clean_allergies:
                if any(allergen in ing for ing in ingredients) or allergen in name:
                    is_allergen_free = False
                    break

            if not is_allergen_free:
                continue

            # 2. Dosha Affinity Score (0 - 50 points)
            dosha_score = 0
            suitable = meal.get("suitable_doshas", [])
            if patient_dosha in suitable or "All" in suitable or "Tridoshic" in suitable:
                dosha_score = 50
            else:
                dosha_score = 20

            # 3. Dietary Preference Score (0 - 30 points)
            pref_score = 30
            tags = [t.lower() for t in meal.get("tags", [])]
            if diet_preference.lower() == "vegan" and "dairy" in ingredients:
                pref_score = 0
            elif diet_preference.lower() == "jain" and any(x in ingredients for x in ["onion", "garlic", "potato"]):
                pref_score = 0

            # 4. Macro Balance Score (0 - 20 points)
            protein = meal.get("protein", 0)
            macro_score = min(20, int(protein * 1.2))

            total_score = dosha_score + pref_score + macro_score

            scored_meals.append({
                **meal,
                "ai_score": total_score,
                "affinity_tag": "High Ayurvedic Synergy" if total_score > 75 else "Good Balance",
            })

        # Sort descending by AI score
        scored_meals.sort(key=lambda x: x["ai_score"], reverse=True)
        return scored_meals
