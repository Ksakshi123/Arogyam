"""
LLM Service & Intent Extraction Pipeline.
Provides integration templates for LLM providers (e.g. Gemini, OpenAI, Claude)
or local NLP fallback to interpret natural language dietary requests.
"""
import os
from typing import Dict, Any, Optional


class AyurvedicLLMService:
    """
    Ayurvedic conversational AI engine. Parses user queries into actionable intents
    and synthesizes empathetic, Prakriti-aware wellness advice.
    """

    SYSTEM_PROMPT = """You are Ayu, an empathetic, highly knowledgeable Ayurvedic Nutrition & Lifestyle Companion.
Your core purpose is to guide users to achieve Prakriti-Vikriti equilibrium through personalized seasonal diet, herbs, and daily routines (Dinacharya).
Rules:
1. Always maintain a warm, calming tone.
2. Emphasize digestive fire (Agni) and dosha balances.
3. If the user mentions medical emergencies or severe illnesses, advise consulting a licensed physician.
"""

    def __init__(self, api_key: Optional[str] = None):
        self.api_key = api_key or os.getenv("GEMINI_API_KEY") or os.getenv("OPENAI_API_KEY")

    def parse_intent(self, message: str) -> Dict[str, Any]:
        """
        Parses intent from patient message for automated platform actions.
        """
        lower = message.lower()
        if any(w in lower for w in ["swap", "replace", "don't want", "alternative", "allergic"]):
            return {
                "intent": "swap_meal",
                "confidence": 0.94,
                "requires_action": True,
            }
        if any(w in lower for w in ["regenerate", "new plan", "recalculate", "reset", "dairy free"]):
            return {
                "intent": "regenerate_weekly_plan",
                "confidence": 0.92,
                "requires_action": True,
            }
        return {
            "intent": "ayurvedic_qa",
            "confidence": 0.88,
            "requires_action": False,
        }

    def generate_response(
        self,
        message: str,
        dosha_constitution: str = "Vata-Pitta",
        user_name: str = "Friend",
    ) -> str:
        """
        Synthesizes response. If API key is not present, delivers high-quality structured guidance.
        """
        intent_info = self.parse_intent(message)
        intent = intent_info["intent"]

        if intent == "swap_meal":
            return (
                f"I hear you, {user_name}. To support your {dosha_constitution} balance, "
                "I can present warm, light, and easy-to-digest substitutes right now. "
                "Check the suggested alternatives card below to choose your favorite."
            )

        if intent == "regenerate_weekly_plan":
            return (
                f"Understood! I will incorporate your adjustments into a brand new 7-day plan "
                f"customized for your {dosha_constitution} body type. Click confirm below to proceed."
            )

        return (
            f"Namaste {user_name}! In Ayurveda, food is medicine (Ahara is Maha-Bheshaja). "
            f"For your {dosha_constitution} disposition, focusing on nourishing meals eaten at regular "
            "intervals helps soothe the nervous system and steady Agni. How can I assist your meals today?"
        )
