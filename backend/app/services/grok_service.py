import os
import json
import re
import logging
import httpx
from typing import Dict, Any, List, Optional
from dotenv import load_dotenv

from app.schemas.chat import ChatAIResponse, MealReplacementOption
from app.services.allergy_validator import filter_safe_replacements

load_dotenv(override=True)

logger = logging.getLogger("arogyam-grok")

XAI_API_KEY = os.getenv("XAI_API_KEY", "").strip()
GROK_MODEL = os.getenv("GROK_MODEL", "grok-4.6").strip()
XAI_BASE_URL = os.getenv("XAI_BASE_URL", "https://api.x.ai/v1").rstrip("/")


def _build_system_instruction(context: Dict[str, Any]) -> str:
    patient = context.get("patient", {})
    dosha = context.get("dosha", {})
    nutrition = context.get("nutrition", {})
    today_meals = context.get("today_meals", [])

    meals_summary = []
    for m in today_meals:
        meals_summary.append(
            f"- {m.get('type', 'Meal').capitalize()}: {m.get('name')} "
            f"({m.get('calories')} kcal, {m.get('protein_g')}g protein, ingredients: {', '.join(m.get('ingredients', [])[:5])})"
        )
    meals_str = "\n".join(meals_summary) if meals_summary else "No meals scheduled for today yet."

    return f"""You are "Ayu", a compassionate, highly knowledgeable AI wellness and Ayurvedic nutrition assistant for Arogyam.
You provide personalized wellness guidance, Dosha explanations, diet explanations, meal replacements, and nutrition insights.

====================
ACTIVE PATIENT CONTEXT (From PostgreSQL)
====================
- Name: {patient.get('name', 'Friend')}
- Age: {patient.get('age', 28)} | Gender: {patient.get('gender', 'Not specified')}
- Height: {patient.get('height_cm', 170)} cm | Weight: {patient.get('weight_kg', 65)} kg
- Activity Level: {patient.get('activity_level', 'Moderately Active')}
- Diet Preference: {patient.get('diet_preference', 'Vegetarian')}
- Wellness Goals: {', '.join(patient.get('wellness_goals', []))}
- STRICT ALLERGIES (CRITICAL): {', '.join(patient.get('allergies', [])) if patient.get('allergies') else 'None'}
- Food Restrictions: {', '.join(patient.get('food_restrictions', [])) if patient.get('food_restrictions') else 'None'}
- Disliked Foods: {', '.join(patient.get('disliked_foods', [])) if patient.get('disliked_foods') else 'None'}

DOSHA PROFILE:
- Constitution: {dosha.get('constitution', 'Vata-Pitta')}
- Primary: {dosha.get('primary_dosha', 'Vata')} | Secondary: {dosha.get('secondary_dosha', 'Pitta')}
- Breakdown: Vata {dosha.get('vata_percentage', 34)}%, Pitta {dosha.get('pitta_percentage', 33)}%, Kapha {dosha.get('kapha_percentage', 33)}%

TODAY'S PLANNED NUTRITION (Pre-calculated by Python):
- Planned Calories: {nutrition.get('today_planned_calories', 0)} kcal
- Planned Protein: {nutrition.get('today_planned_protein_g', 0)}g
- Consumed Protein So Far: {nutrition.get('today_consumed_protein_g', 0)}g
- Daily Protein Target: {nutrition.get('daily_target_protein_g', 65)}g
- Planned Carbs: {nutrition.get('today_planned_carbs_g', 0)}g | Planned Fats: {nutrition.get('today_planned_fats_g', 0)}g

TODAY'S MEALS:
{meals_str}

====================
CORE MEDICAL & SAFETY RULES
====================
1. NEVER diagnose diseases or medical conditions.
2. NEVER claim to cure illness.
3. NEVER prescribe pharmaceutical medications.
4. NEVER recommend any ingredient listed under patient's STRICT ALLERGIES or Food Restrictions.
5. NEVER pretend to replace a qualified physician. For severe or clinical symptoms, always advise consulting a qualified healthcare professional.
6. Remember that suggestions are holistic Ayurvedic wellness and lifestyle guidance, not medical prescriptions.

====================
OUTPUT FORMAT REQUIREMENTS
====================
You MUST reply with a strictly valid JSON object matching this schema without markdown code fences:
{{
  "intent": "general_question" | "dosha_question" | "nutrition_question" | "protein_question" | "replace_meal" | "update_weekly_plan",
  "message": "Your warm, personalized, conversational response in clear Markdown...",
  "target": "breakfast" | "lunch" | "dinner" or null,
  "replacement_options": [
    {{
      "meal_name": "Name of meal",
      "description": "Short appetizing Ayurvedic description",
      "ingredients": ["ingredient1", "ingredient2"],
      "calories": 350,
      "protein": 16.0,
      "carbohydrates": 45.0,
      "fats": 10.0,
      "preparation_time": 20,
      "dosha_reason": "Why this balances their dosha",
      "tags": ["High Protein", "Warm", "Digestive"]
    }}
  ],
  "proposed_changes": ["Change 1", "Change 2"],
  "requires_confirmation": false
}}

- If the user wants to replace a meal (e.g. "I don't have oats", "replace my lunch", "give me higher protein dinner"), set "intent": "replace_meal", "requires_confirmation": true, and provide 2 to 3 safe "replacement_options".
- If the user wants to adjust their full weekly plan (e.g. "remove dairy this week", "make meals vegan", "increase protein"), set "intent": "update_weekly_plan", "requires_confirmation": true, and populate "proposed_changes".
- For questions about Dosha, protein, or wellness, set the respective intent with informative, encouraging explanations and "requires_confirmation": false.
"""


def _generate_fallback_response(user_message: str, context: Dict[str, Any]) -> ChatAIResponse:
    """
    Intelligent context-aware fallback when external API key is absent or unreachable.
    Uses real PostgreSQL context and Python nutrition calculations.
    """
    text = user_message.lower().strip()
    patient = context.get("patient", {})
    dosha = context.get("dosha", {})
    nutrition = context.get("nutrition", {})
    today_meals = context.get("today_meals", [])
    allergies = patient.get("allergies", [])
    pref = patient.get("diet_preference", "Vegetarian")

    # 1. Protein question
    if "protein" in text:
        planned_p = nutrition.get("today_planned_protein_g", 0)
        consumed_p = nutrition.get("today_consumed_protein_g", 0)
        target_p = nutrition.get("daily_target_protein_g", 65)
        msg = (
            f"Namaste {patient.get('name', '')}! According to your personalized diet plan for today, "
            f"you are scheduled to receive approximately **{planned_p}g of protein** "
            f"(target: **{target_p}g** based on your body weight).\n\n"
        )
        if today_meals:
            msg += "**Today's protein breakdown:**\n"
            for m in today_meals:
                msg += f"• **{m.get('type', '').capitalize()}**: {m.get('name')} — *{m.get('protein_g')}g protein*\n"
        if consumed_p > 0:
            msg += f"\nYou've logged **{consumed_p}g** completed so far! Keep up the wonderful nourishment. 🌿"

        return ChatAIResponse(
            intent="protein_question",
            message=msg,
            requires_confirmation=False
        )

    # 2. Dosha question
    if "dosha" in text or "constitution" in text or "prakriti" in text:
        const = dosha.get("constitution", "Vata-Pitta")
        v = dosha.get("vata_percentage", 34)
        p = dosha.get("pitta_percentage", 33)
        k = dosha.get("kapha_percentage", 33)
        msg = (
            f"Your primary Ayurvedic constitution is **{const}**.\n\n"
            f"**Your Energetic Balance:**\n"
            f"• **Vata**: {v}% (Movement, creativity, circulation)\n"
            f"• **Pitta**: {p}% (Digestion, metabolism, intellect)\n"
            f"• **Kapha**: {k}% (Structure, immunity, stamina)\n\n"
            f"Your current meal plan is specifically crafted to maintain this unique equilibrium with warm, easily digestible preparations."
        )
        return ChatAIResponse(
            intent="dosha_question",
            message=msg,
            requires_confirmation=False
        )

    # 3. Single meal replacement
    if any(k in text for k in ["replace", "swap", "don't have", "alternative", "change my"]):
        target_meal_type = "breakfast"
        if "lunch" in text:
            target_meal_type = "lunch"
        elif "dinner" in text:
            target_meal_type = "dinner"

        options = [
            MealReplacementOption(
                meal_name="Moong Dal & Vegetable Khichdi",
                description="Gentle, tri-doshic spiced lentils and rice cooked with cumin and ghee for optimal agni.",
                ingredients=["Yellow Moong Dal", "Basmati Rice", "Cumin Seeds", "Ghee", "Turmeric", "Ginger", "Zucchini"],
                calories=340,
                protein=15.0,
                carbohydrates=52.0,
                fats=7.0,
                preparation_time=25,
                dosha_reason=f"Perfect for balancing {dosha.get('primary_dosha', 'Vata')} with soothing warmth.",
                tags=["Tridoshic", "Easy Digestion", "Protein Rich"]
            ),
            MealReplacementOption(
                meal_name="Quinoa & Sprouted Moong Stir-Fry",
                description="Wholesome quinoa tossed with crisp green mung sprouts, curry leaves, and toasted seeds.",
                ingredients=["Quinoa", "Sprouted Moong", "Curry Leaves", "Mustard Seeds", "Grated Carrot", "Lemon Juice"],
                calories=360,
                protein=18.0,
                carbohydrates=48.0,
                fats=8.0,
                preparation_time=20,
                dosha_reason="High fiber and bioavailable plant protein that maintains calm digestion.",
                tags=["High Protein", "Vata-Pitta Balance", "Nutritious"]
            ),
            MealReplacementOption(
                meal_name="Warm Spiced Millet Upma",
                description="Roasted foxtail millet simmered with seasonal carrots, green peas, ginger, and turmeric.",
                ingredients=["Foxtail Millet", "Ginger", "Green Peas", "Carrot", "Coriander", "Sesame Oil"],
                calories=310,
                protein=12.0,
                carbohydrates=46.0,
                fats=6.0,
                preparation_time=20,
                dosha_reason="Light and grounding without causing sluggishness.",
                tags=["Gluten-Free", "Warm", "Balancing"]
            )
        ]

        safe_options = filter_safe_replacements(
            options=options,
            allergies=allergies,
            restrictions=patient.get("food_restrictions", []),
            diet_preference=pref
        )

        return ChatAIResponse(
            intent="replace_meal",
            message=f"I would be delighted to help you replace your **{target_meal_type}**! Here are wholesome alternatives tailored to your **{dosha.get('constitution', 'Vata')}** constitution and allergy guidelines. Select your favorite to update your plan:",
            target=target_meal_type,
            replacement_options=safe_options,
            requires_confirmation=True
        )

    # 4. Global plan update
    if any(k in text for k in ["avoid", "dairy", "vegan", "gluten", "week", "lighter", "increase"]):
        changes = []
        if "dairy" in text:
            changes.append("Eliminate dairy products (milk, paneer, ghee)")
        if "vegan" in text:
            changes.append("Switch to 100% plant-based vegan alternatives")
        if "protein" in text:
            changes.append("Optimize daily recipes for higher plant protein (+15-20g)")
        if not changes:
            changes.append("Rebalance upcoming 21 meals according to requested preferences")

        return ChatAIResponse(
            intent="update_weekly_plan",
            message="I can regenerate your 7-day Ayurvedic diet plan to reflect these new guidelines while preserving your Dosha balance. Would you like me to proceed with updating your plan?",
            proposed_changes=changes,
            requires_confirmation=True
        )

    # 5. General inquiry
    return ChatAIResponse(
        intent="general_question",
        message=(
            f"Namaste {patient.get('name', '')}! I am Ayu, your wellness companion. "
            f"I have your **{dosha.get('constitution', 'Ayurvedic')}** health profile and today's diet plan ready. "
            f"You can ask me about your protein intake, swap any meal, or ask how specific foods affect your energy today! 🌿"
        ),
        requires_confirmation=False
    )


async def ask_ayu(user_message: str, context: Dict[str, Any]) -> ChatAIResponse:
    """
    Primary interface to Grok / xAI API.
    Sends full patient context and chat history, strictly validates output, and ensures allergy safety.
    """
    api_key = os.getenv("XAI_API_KEY", "").strip()
    model = os.getenv("GROK_MODEL", "grok-4.6").strip()
    base_url = os.getenv("XAI_BASE_URL", "https://api.x.ai/v1").rstrip("/")

    # If API key is not configured, gracefully use the context-aware local intelligence
    if not api_key:
        logger.info("XAI_API_KEY not configured in backend/.env; using context-aware local intelligence engine.")
        return _generate_fallback_response(user_message, context)

    system_prompt = _build_system_instruction(context)

    messages = [{"role": "system", "content": system_prompt}]

    # Append recent conversation history
    for prev in context.get("recent_history", [])[-8:]:
        if prev.get("role") in ["user", "assistant"] and prev.get("content"):
            messages.append({"role": prev["role"], "content": prev["content"]})

    # Append user prompt
    messages.append({"role": "user", "content": user_message})

    payload = {
        "model": model,
        "messages": messages,
        "temperature": 0.3,
        "max_tokens": 1200,
    }

    try:
        async with httpx.AsyncClient(timeout=30.0) as client:
            resp = await client.post(
                f"{base_url}/chat/completions",
                headers={
                    "Authorization": f"Bearer {api_key}",
                    "Content-Type": "application/json",
                },
                json=payload,
            )

            if resp.status_code != 200:
                logger.warning(f"xAI API returned HTTP {resp.status_code}: {resp.text}")
                return _generate_fallback_response(user_message, context)

            data = resp.json()
            raw_content = data["choices"][0]["message"]["content"].strip()

            # Clean markdown code blocks if model wrapped JSON in ```json ... ```
            clean_json = raw_content
            if clean_json.startswith("```"):
                clean_json = re.sub(r"^```(?:json)?\s*", "", clean_json)
                clean_json = re.sub(r"\s*```$", "", clean_json)

            try:
                parsed = json.loads(clean_json)
                ai_resp = ChatAIResponse(**parsed)
            except Exception as parse_err:
                logger.warning(f"Could not parse Grok JSON output: {parse_err}. Raw: {raw_content[:200]}")
                return ChatAIResponse(
                    intent="general_question",
                    message=raw_content,
                    requires_confirmation=False
                )

            # Deterministic allergy validation on AI suggested replacements
            patient_allergies = context.get("patient", {}).get("allergies", [])
            patient_restrictions = context.get("patient", {}).get("food_restrictions", [])
            patient_pref = context.get("patient", {}).get("diet_preference", "Vegetarian")

            if ai_resp.replacement_options:
                ai_resp.replacement_options = filter_safe_replacements(
                    options=ai_resp.replacement_options,
                    allergies=patient_allergies,
                    restrictions=patient_restrictions,
                    diet_preference=patient_pref
                )

            return ai_resp

    except Exception as e:
        logger.warning(f"Grok API call encountered an error: {e}")
        return _generate_fallback_response(user_message, context)
