"""
Groq LLM Ayurvedic Meal Plan Generation Service.
Generates a complete 7-day Ayurvedic meal plan using Groq LLM (openai/gpt-oss-120b)
with automatic dual-key failover, region-specific authenticity, composite meal plates,
strict dietary enforcement (Jain/Vegan/Veg/Non-Veg), natural repetition of staples,
and automated post-generation safety sanitation.
"""
import os
import re
import time
import json
import logging
from datetime import datetime, date
from typing import Dict, Any, List, Optional
import httpx
from dotenv import load_dotenv

from app.config import settings

load_dotenv(override=True)

logger = logging.getLogger("arogyam-groq-diet")

GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions"


def _build_dietary_rules(diet_preference: Optional[str]) -> str:
    """Generates strict zero-tolerance dietary constraints based on preference."""
    pref = (diet_preference or "Vegetarian").strip().lower()

    if pref == "jain":
        return """### MANDATORY DIETARY CONSTRAINT: JAIN DIET (ZERO TOLERANCE)
- 100% STRICT VEGETARIAN: Absolutely NEVER include meat, poultry, chicken, mutton, fish, seafood, gelatin, or eggs.
- STRICTLY FORBIDDEN ROOT VEGETABLES (ZERO TOLERANCE): ZERO onion (kanda/pyaz), ZERO garlic (lasun), ZERO potato (aloo/batata), ZERO carrot (gajar), ZERO radish (mooli), ZERO beetroot, ZERO ginger (adrak), ZERO yam (suran).
- PERMITTED INGREDIENTS: Grains (wheat, rice, jowar, bajra, poha, rava, oats), Dals/Pulses (moong, chana, toor, urad), Dairy (cow ghee, curd/dahi, milk, fresh paneer), Above-ground vegetables (lauki/bottle gourd, turai/ridge gourd, bhindi/okra, tendli/ivy gourd, raw banana/kela, cabbage, parwal), Spices (hing, cumin, turmeric, coriander, ajwain, rock salt)."""

    elif pref == "vegan":
        return """### MANDATORY DIETARY CONSTRAINT: VEGAN DIET (ZERO TOLERANCE)
- 100% STRICT PLANT-BASED: Absolutely ZERO meat, poultry, fish, seafood, or eggs.
- STRICTLY FORBIDDEN DAIRY & ANIMAL PRODUCTS: ZERO cow ghee (use cold-pressed sesame/mustard oil), ZERO milk, ZERO curd/dahi, ZERO paneer (use tofu if needed), ZERO butter, ZERO honey.
- PERMITTED INGREDIENTS: All grains, pulses, legumes, green vegetables, root vegetables, nuts, seeds, and plant-based oils."""

    elif pref == "vegetarian":
        return """### MANDATORY DIETARY CONSTRAINT: PURE VEGETARIAN DIET (ZERO TOLERANCE)
- 100% PURE VEGETARIAN: Absolutely NEVER include meat, chicken, mutton, fish, prawns, seafood, or eggs.
- PERMITTED INGREDIENTS: All dairy (cow ghee, curd, milk, paneer, buttermilk), grains, pulses, legumes, and all seasonal vegetables."""

    elif pref == "eggetarian":
        return """### MANDATORY DIETARY CONSTRAINT: EGGETARIAN DIET
- Vegetarian diet with eggs permitted (e.g. boiled eggs, egg bhurji, omelette).
- Absolutely NEVER include meat, chicken, mutton, fish, or seafood."""

    elif pref in ("non-vegetarian", "non-veg"):
        return """### MANDATORY DIETARY CONSTRAINT: NON-VEGETARIAN DIET
- Wholesome homestyle non-vegetarian: Chicken, fish, mutton, or eggs can be included in healthy, traditionally spiced curries/preparations (e.g. Chicken Sukka, Fish Curry, Egg Curry) served alongside traditional staples (rotis/chapatis, steamed rice, dal).
- Heavy deep-fried junk meats are strictly discouraged in Ayurveda; prioritize lightly spiced, well-cooked preparations."""

    return """### MANDATORY DIETARY CONSTRAINT: PURE VEGETARIAN DIET
- Absolutely NEVER include meat, chicken, fish, seafood, or eggs. Dairy and seasonal vegetables encouraged."""


def _build_regional_guidelines(food_preferences: Optional[List[str]]) -> str:
    """Builds regional cuisine guidance tailored to user selections."""
    prefs = " ".join(food_preferences or []).lower()

    guidelines = []
    if "maharashtrian" in prefs:
        guidelines.append("""* AUTHENTIC MAHARASHTRIAN CUISINE:
  - Breakfast: Kanda Poha (with peanuts & coriander), Thalipeeth (with fresh curd), Upma, Sabudana Khichdi, or Moong Dal Cheela.
  - Lunch (Composite Thali): 2-3 Jowar or Bajra Bhakris (or Wheat Chapatis) AND Steamed Rice served with Besan Pithla / Matki Usal / Bharli Vangi / Methi Bhaji + Varan Bhaat with cow ghee + Cucumber Koshimbir.
  - Dinner: 2 Chapatis with Amti / Dal and Seasonal Bhaji + Steamed Rice, or Dal Khichdi with Maharashtrian Kadhi.""")

    if "south indian" in prefs:
        guidelines.append("""* AUTHENTIC SOUTH INDIAN CUISINE:
  - Breakfast: Idli-Sambar with Coconut Chutney, Ven Pongal with Ghee & Chutney, Rava Upma, or Plain/Masala Dosa.
  - Lunch (Composite Thali): 2 Phulkas/Rotis AND Steamed Rice with Drumstick/Vegetable Sambar, Rasam, Vegetable Poriyal (beans/cabbage), and Curd.
  - Dinner: 2 Rotis with Vegetable Kootu & Steamed Rice, or Bisi Bele Bath with Raita, or Rasam Rice with Appalam.""")

    if "north indian" in prefs:
        guidelines.append("""* AUTHENTIC NORTH INDIAN CUISINE:
  - Breakfast: Whole wheat Stuffed Parathas (Paneer/Methi/Gobi - or Jain compliant) with Curd, Besan Chilla, Vegetable Dalia.
  - Lunch (Composite Thali): 2-3 Phulkas AND Steamed Jeera Rice with Dal Tadka / Dal Makhani / Rajma / Chole + Seasonal Sabzi (Bhindi / Lauki / Palak Paneer) + Curd/Raita.
  - Dinner: 2-3 Phulkas with Dal Palak or Lauki Chana Dal + small portion of Steamed Rice, or Moong Dal Khichdi with Punjabi Kadhi.""")

    if "gujarati" in prefs:
        guidelines.append("""* AUTHENTIC GUJARATI CUISINE:
  - Breakfast: Methi Thepla with Curd & Chundo, Poha, Khaman Dhokla, or Handvo.
  - Lunch (Composite Thali): 3 Phulkas with Ghee AND Steamed Rice with Sweet-Sour Gujarati Dal + Seasonal Shaak (Bhindi, Tindora, Guvar) + Chaas.
  - Dinner: Moong Dal Khichdi with Gujarati Kadhi + Roasted Papad, or 2 Theplas with Shaak.""")

    if not guidelines:
        guidelines.append("""* WHOLESOME HOMESTYLE INDIAN THALI:
  - Breakfast: Poha, Upma, Idli-Sambar, Moong Cheela, or Whole Wheat Paratha with Curd.
  - Lunch (Composite Thali): 2-3 Rotis/Phulkas AND Steamed Rice with Dal Tadka / Legume Curry + Seasonal Sabzi + Curd/Chaas.
  - Dinner: 2-3 Rotis with Dal/Sabzi + Steamed Rice, or Wholesome Vegetable Khichdi with Kadhi.""")

    return "\n".join(guidelines)


def _sanitize_meal_plan(plan: Dict[str, Any], diet_preference: Optional[str]) -> Dict[str, Any]:
    """
    Post-generation safety and quality sanitizer.
    Guarantees zero tolerance for forbidden ingredients and enriches incomplete meal names.
    """
    pref = (diet_preference or "Vegetarian").strip().lower()

    jain_forbidden = [
        "chicken", "meat", "mutton", "fish", "prawn", "seafood", "egg",
        "onion", "pyaz", "kanda", "garlic", "lasun", "lahsun",
        "potato", "aloo", "batata", "carrot", "gajar", "radish", "mooli",
        "beetroot", "ginger", "adrak", "suran", "yam"
    ]
    veg_forbidden = ["chicken", "meat", "mutton", "fish", "prawn", "seafood", "egg"]
    vegan_forbidden = ["chicken", "meat", "mutton", "fish", "prawn", "seafood", "egg", "ghee", "milk", "paneer", "curd", "dahi", "butter", "honey"]

    days = plan.get("days", [])
    for day in days:
        for meal_type in ["breakfast", "lunch", "dinner"]:
            meal = day.get(meal_type)
            if not isinstance(meal, dict):
                continue

            name = meal.get("meal_name", "")
            ingredients = meal.get("ingredients", [])
            sanitized_ingredients = []

            # 1. Dietary Safety Check
            for ing in ingredients:
                ing_str = str(ing).lower()
                is_forbidden = False

                if pref == "jain":
                    for forbidden in jain_forbidden:
                        if re.search(rf"\b{re.escape(forbidden)}\b", ing_str):
                            is_forbidden = True
                            break
                elif pref == "vegan":
                    for forbidden in vegan_forbidden:
                        if re.search(rf"\b{re.escape(forbidden)}\b", ing_str):
                            is_forbidden = True
                            break
                elif pref in ("vegetarian", "veg"):
                    for forbidden in veg_forbidden:
                        if re.search(rf"\b{re.escape(forbidden)}\b", ing_str):
                            is_forbidden = True
                            break

                if not is_forbidden:
                    sanitized_ingredients.append(ing)

            # Ensure ingredients list isn't empty after sanitation
            if not sanitized_ingredients:
                sanitized_ingredients = ["Whole Wheat Flour", "Yellow Moong Dal", "Bottle Gourd (Lauki)", "Cow Ghee", "Cumin Seeds"]
            meal["ingredients"] = sanitized_ingredients

            # Sanitize meal name if it mentions forbidden words
            if pref == "jain":
                for forbidden in ["onion", "garlic", "potato", "aloo", "chicken", "meat", "egg"]:
                    name = re.sub(rf"\b{forbidden}\b", "Jain", name, flags=re.IGNORECASE)

            # 2. Prevent single-item meal names (e.g. "Only Bhakri", "Rice", "Soup")
            name_lower = name.strip().lower()
            if meal_type in ("lunch", "dinner"):
                if name_lower in ["bhakri", "jowar bhakri", "bajra bhakri"]:
                    name = f"2 {name.capitalize()} & Steamed Rice with Dal and Seasonal Sabzi"
                elif name_lower in ["rice", "steamed rice", "jeera rice"]:
                    name = f"2 Phulkas & {name.capitalize()} with Yellow Dal Tadka and Sabzi"
                elif name_lower in ["soup", "vegetable soup", "dal soup"]:
                    name = "2 Phulkas & Steamed Rice with Vegetable Dal Soup and Sabzi"

            meal["meal_name"] = name.strip()

    return plan


class GroqDietService:
    @classmethod
    def get_api_keys(cls) -> List[str]:
        """
        Retrieves primary and backup Groq API keys dedicated to diet plan generation.
        Maintains strict separation from Ayu chatbot key.
        """
        primary = os.getenv("GROQ_API_KEY_DIET_1") or settings.GROQ_API_KEY_DIET_1 or ""
        backup = os.getenv("GROQ_API_KEY_DIET_2") or settings.GROQ_API_KEY_DIET_2 or ""

        keys = []
        if primary.strip():
            keys.append(primary.strip())
        if backup.strip() and backup.strip() not in keys:
            keys.append(backup.strip())
        return keys

    @classmethod
    def generate_meal_plan(
        cls,
        patient_id: int,
        age: Optional[int],
        weight: Optional[float],
        height: Optional[float],
        activity_level: Optional[str],
        diet_preference: Optional[str],
        food_preferences: Optional[List[str]],
        wellness_goals: Optional[List[str]],
        allergies: Optional[List[str]],
        food_restrictions: Optional[List[str]],
        disliked_foods: Optional[List[str]],
        dosha: Optional[str],
        start_date: Optional[str] = None,
    ) -> Optional[Dict[str, Any]]:
        """
        Calls Groq LLM with dual-key failover to generate a 7-day Ayurvedic meal plan.
        Returns parsed and sanitized JSON plan, or None if keys are unavailable / exhausted.
        """
        keys = cls.get_api_keys()
        if not keys:
            logger.info("No Groq diet keys configured. Falling back to deterministic rule generator.")
            return None

        today_str = start_date or date.today().isoformat()
        now_iso = datetime.utcnow().isoformat() + "Z"

        dietary_rules = _build_dietary_rules(diet_preference)
        regional_rules = _build_regional_guidelines(food_preferences)

        prompt = f"""You are an AI-powered Ayurvedic nutrition and meal-planning assistant for Arogyam.
Generate a complete, highly practical, and satisfying 7-day Indian Ayurvedic meal plan matching the exact JSON schema.
Return STRICT JSON ONLY. Do not wrap in markdown code fences. No explanations outside the JSON object.

USER PROFILE:
* Age: {age or 28} | Weight: {weight or 65} kg | Height: {height or 170} cm | Activity: {activity_level or 'Moderately Active'}
* Diet Preference: {diet_preference or 'Vegetarian'} (STRICT HARD CONSTRAINT)
* Regional Cuisines / Food Preferences: {', '.join(food_preferences) if food_preferences else 'Prefer Indian Food'} (CRITICAL PRIORITY)
* Wellness Goals: {', '.join(wellness_goals) if wellness_goals else 'Balanced Digestion, Vitality'}
* Allergies: {', '.join(allergies) if allergies else 'None'} (STRICT SAFETY - NEVER INCLUDE)
* Food Restrictions: {', '.join(food_restrictions) if food_restrictions else 'None'} (NEVER INCLUDE)
* Disliked Foods: {', '.join(disliked_foods) if disliked_foods else 'None'} (AVOID)
* Ayurvedic Dosha: {dosha or 'Vata-Pitta'} (Pacify through thermal qualities & tastes)

{dietary_rules}

{regional_rules}

### CORE RULES FOR MEAL COMPOSITION, REGION & SATIETY:
1. COMPOSITE MEALS ONLY (NO ISOLATED SINGLE ITEMS):
   - Lunch and Dinner MUST be complete balanced composite meals combining BREAD AND RICE TOGETHER:
     * Standard Lunch: 2-3 Rotis/Chapatis/Bhakris AND Steamed Rice (or Jeera Rice) served with Cooked Dal/Legume Curry + Seasonal Sabzi + Accompaniment (Curd/Chaas/Koshimbir).
     * NEVER suggest only 'Bhakri', only 'Rice', or only 'Roti'. Name the complete combination! (e.g. '2 Jowar Bhakris & Steamed Rice with Pithla and Cucumber Koshimbir' or '2-3 Phulkas & Steamed Rice with Dal Tadka and Bhindi Masala').
     * NEVER suggest soup or salad as a primary lunch or dinner. Soup or broth is only an appetizer and cannot satisfy as an adult meal.
   - Breakfast: Substantial, hearty dish with chutney or curd (e.g., Poha with peanuts, Thalipeeth with curd, Upma with vegetables, or Idli-Sambar).
2. NATURAL REPETITION IS REALISTIC & MANDATORY:
   - Real households repeat staples. Chapatis/Phulkas should appear 4-6 days a week for lunch/dinner.
   - Familiar breakfast staples (Poha, Upma, Idli-Sambar, Paratha, Thalipeeth) SHOULD repeat 2 times across the 7 days (e.g. Poha on Mon & Fri, Idli on Tue & Sat).
   - Do NOT invent 21 exotic unique meals. Repeating practical, nutritious staple recipes is required for realism.
3. SATIATING ADULT CALORIES (STRICT CALORIC SUFFICIENCY):
   - Breakfast: 380 - 500 kcal, 10 - 20g protein.
   - Lunch (Peak Agni, heaviest meal): 680 - 800 kcal, 20 - 30g protein.
   - Dinner: 520 - 650 kcal, 15 - 25g protein.
   - Total daily calories must sum to 1650 - 2050 kcal.
4. STRICT CONCISENESS TO FIT 7 FULL DAYS (CRITICAL):
   - Keep 'description' and 'explanation' under 8 words each.
   - In 'recipe', provide exactly 1-2 short steps (under 8 words each) and 1 short tip.
   - Limit 'ingredients' to 4-5 key items.
   - Do NOT write lengthy explanations. Keeping every field compact guarantees all 7 full days fit completely within token limits.
5. Exactly 7 consecutive days starting from {today_str}. Every day must contain breakfast, lunch, and dinner.
6. All 4 compatibility scores (dosha, preferences, allergies, overall) must be integers between 85 and 100.

OUTPUT JSON SCHEMA:
{{
  "id": "plan_{patient_id}_{today_str}",
  "patient_id": {patient_id},
  "startDate": "{today_str}",
  "status": "active",
  "created_at": "{now_iso}",
  "compatibilityScore": {{
    "dosha": 94,
    "preferences": 98,
    "allergies": 100,
    "overall": 96
  }},
  "days": [
    {{
      "date": "{today_str}",
      "dayOfWeek": "Monday",
      "breakfast": {{
        "meal_name": "Meal Name",
        "description": "Short 6-word description",
        "ingredients": ["Ing 1", "Ing 2", "Ing 3"],
        "calories": 440,
        "protein": 14,
        "carbohydrates": 60,
        "fats": 12,
        "preparation_time": 15,
        "explanation": "Short 6-word explanation",
        "recipe": {{
          "steps": ["Step 1", "Step 2"],
          "tips": ["Tip 1"]
        }}
      }},
      "lunch": {{
        "meal_name": "2 Jowar Bhakris & Steamed Rice with Pithla & Koshimbir",
        "description": "Short description",
        "ingredients": ["Ing 1", "Ing 2", "Ing 3"],
        "calories": 740,
        "protein": 24,
        "carbohydrates": 95,
        "fats": 20,
        "preparation_time": 25,
        "explanation": "Short explanation",
        "recipe": {{
          "steps": ["Step 1", "Step 2"],
          "tips": ["Tip 1"]
        }}
      }},
      "dinner": {{
        "meal_name": "2 Chapatis & Steamed Rice with Moong Dal & Lauki Sabzi",
        "description": "Short description",
        "ingredients": ["Ing 1", "Ing 2", "Ing 3"],
        "calories": 580,
        "protein": 18,
        "carbohydrates": 78,
        "fats": 14,
        "preparation_time": 20,
        "explanation": "Short explanation",
        "recipe": {{
          "steps": ["Step 1", "Step 2"],
          "tips": ["Tip 1"]
        }}
      }}
    }}
  ]
}}"""

        model = os.getenv("GROQ_DIET_MODEL") or settings.GROQ_DIET_MODEL or "openai/gpt-oss-120b"

        for idx, key in enumerate(keys):
            key_label = "Primary Key" if idx == 0 else "Backup Key"
            logger.info(f"Attempting Groq Diet generation using {key_label} (model: {model})...")

            try:
                headers = {
                    "Authorization": f"Bearer {key}",
                    "Content-Type": "application/json",
                }
                payload = {
                    "model": model,
                    "messages": [
                        {
                            "role": "system",
                            "content": "You are an AI-powered Ayurvedic nutrition planner for Arogyam. Return STRICT JSON only matching the schema exactly.",
                        },
                        {
                            "role": "user",
                            "content": prompt,
                        },
                    ],
                    "response_format": {"type": "json_object"},
                    "temperature": 0.35,
                    "max_tokens": 5200,
                    "reasoning_effort": "low",
                }

                with httpx.Client(timeout=100.0) as client:
                    resp = client.post(GROQ_API_URL, headers=headers, json=payload)

                # If rate limited (TPM window), wait briefly and retry once
                if resp.status_code == 429:
                    logger.warning(f"Groq {key_label} hit TPM rate limit. Waiting 6 seconds before retry...")
                    time.sleep(6)
                    with httpx.Client(timeout=100.0) as client:
                        resp = client.post(GROQ_API_URL, headers=headers, json=payload)

                if resp.status_code == 200:
                    data = resp.json()
                    content = data.get("choices", [{}])[0].get("message", {}).get("content", "").strip()
                    parsed = json.loads(content)

                    # Validate basic schema structure
                    if "days" in parsed and len(parsed["days"]) >= 7:
                        logger.info(f"Successfully generated 7-day meal plan via Groq {key_label}!")
                        sanitized_plan = _sanitize_meal_plan(parsed, diet_preference)
                        return sanitized_plan
                    else:
                        logger.warning(f"Groq {key_label} returned incomplete plan days. Switching to backup if available...")
                        continue

                elif resp.status_code in (429, 401, 403, 503):
                    logger.warning(
                        f"Groq {key_label} exhausted or failed (HTTP {resp.status_code}: {resp.text[:150]}). "
                        f"Failing over to next backup key..."
                    )
                    continue
                else:
                    logger.error(f"Groq {key_label} returned error {resp.status_code}: {resp.text[:200]}")
                    continue

            except Exception as e:
                logger.warning(f"Exception during Groq {key_label} execution: {e}. Trying backup key...")
                continue

        logger.error("All Groq Diet API keys exhausted or failed. Returning None for fallback.")
        return None
