"""
Ayurvedic Wellness Chatbot Service (Ayu).
Handles user messages, parses intents (swap meal, update diet plan, dosha inquiry),
and generates personalized, empathetic Ayurvedic responses.
"""
from typing import Dict, Any, Optional


class ChatbotService:
    """
    Core intent parsing and dialogue manager for the Ayu wellness assistant.
    Can be connected directly to an LLM service or use heuristic NLP.
    """

    @classmethod
    def process(
        cls,
        message: str,
        profile: Optional[Any] = None,
        dosha: Optional[Any] = None,
    ) -> Dict[str, Any]:
        text = message.lower().strip()

        dosha_name = getattr(dosha, "constitution", "Tridoshic (Balanced)") if dosha else "Ayurvedic"
        first_name = ""
        if profile and hasattr(profile, "full_name") and profile.full_name:
            first_name = f", {profile.full_name.split()[0]}"

        # Intent 1: Meal Replacement
        if any(w in text for w in ["replace", "swap", "alternative", "don't like", "dont like", "allergic"]):
            return {
                "content": f"I can certainly help you substitute that meal{first_name}! Based on your {dosha_name} constitution, I have chosen light, easily digestible alternatives that will keep your digestion (Agni) strong.",
                "intent": "replace_meal",
                "structured_data": {
                    "action": "swap_recommendations",
                    "context": "meal_replacement",
                },
            }

        # Intent 2: Global Plan Regeneration / Dietary Preference Change
        if any(w in text for w in ["avoid", "dairy", "vegan", "protein", "gluten", "regenerate", "new plan"]):
            detected = []
            if "dairy" in text:
                detected.append("Avoid Dairy / Lactose")
            if "protein" in text:
                detected.append("Higher Ayurvedic Plant Protein")
            if "gluten" in text:
                detected.append("Gluten-Free Grains")
            if not detected:
                detected.append("Custom Dietary Adjustment")

            return {
                "content": f"Understood{first_name}. I can recalibrate your 7-day meal plan with these guidelines:\n• "
                + "\n• ".join(detected)
                + "\n\nWould you like me to update your entire weekly plan now?",
                "intent": "update_weekly_plan",
                "structured_data": {
                    "adjustments": detected,
                    "requires_confirmation": True,
                },
            }

        # Intent 3: Dosha & Lifestyle Inquiry
        if any(w in text for w in ["dosha", "vata", "pitta", "kapha", "energy", "sleep", "digestion"]):
            return {
                "content": f"In Ayurveda, maintaining balance in your {dosha_name} dosha is key to vitality. When digestion (Agni) is steady, energy and sleep naturally harmonize. Always favor warm, freshly cooked meals and avoid iced drinks with food.",
                "intent": "ayurvedic_guidance",
                "structured_data": {
                    "dosha": dosha_name,
                    "tip": "Sip warm water with cumin or ginger throughout the day.",
                },
            }

        # Default Helpful Dialogue
        return {
            "content": f"Namaste{first_name}! I am Ayu, your personal Ayurvedic wellness companion. I can help you swap meals, adjust recipes for your {dosha_name} constitution, or adapt your weekly diet plan. How may I support your health today?",
            "intent": "general_inquiry",
            "structured_data": None,
        }
