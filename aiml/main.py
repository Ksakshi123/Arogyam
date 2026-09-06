"""
Arogyam AI/ML Inference Microservice.
Provides REST endpoints for ML dosha prediction, recipe ranking, and conversational intent parsing.
Runs on port 8001 by default.
"""
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Dict, List, Any, Optional

from dosha_predictor.dosha_model import DoshaPredictor
from diet_recommender.recommender import AyurvedicDietRecommender
from chatbot.llm_service import AyurvedicLLMService

app = FastAPI(
    title="Arogyam AI/ML Microservice",
    description="Machine Learning & NLP Services for Ayurvedic Dosha Profiling & Nutrition",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

dosha_predictor = DoshaPredictor()
diet_recommender = AyurvedicDietRecommender()
llm_service = AyurvedicLLMService()


# ── Schemas ──────────────────────────────────────────────────────────────────

class DoshaPredictRequest(BaseModel):
    features: Dict[str, str]

class DietRecommendRequest(BaseModel):
    candidate_meals: List[Dict[str, Any]]
    patient_dosha: str
    allergies: List[str] = []
    diet_preference: str = "vegetarian"
    target_calories: int = 2000

class ChatInterpretRequest(BaseModel):
    message: str
    dosha_constitution: str = "Vata-Pitta"
    user_name: str = "Seeker"


# ── Endpoints ────────────────────────────────────────────────────────────────

@app.get("/health")
def health():
    return {
        "status": "healthy",
        "service": "arogyam-aiml",
        "components": {
            "dosha_classifier": "ready",
            "diet_recommender": "ready",
            "llm_service": "ready",
        },
    }

@app.post("/predict/dosha")
def predict_dosha(payload: DoshaPredictRequest):
    """
    ML model inference predicting Vata/Pitta/Kapha percentages from user answers.
    """
    try:
        result = dosha_predictor.predict(payload.features)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/recommend/diet")
def recommend_diet(payload: DietRecommendRequest):
    """
    Ranks candidate meals based on dosha affinity, allergen exclusion, and dietary goals.
    """
    try:
        ranked = diet_recommender.recommend(
            candidate_meals=payload.candidate_meals,
            patient_dosha=payload.patient_dosha,
            allergies=payload.allergies,
            diet_preference=payload.diet_preference,
            target_calories=payload.target_calories,
        )
        return {"recommendations": ranked, "count": len(ranked)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/chat/interpret")
def interpret_chat(payload: ChatInterpretRequest):
    """
    Extracts intents and generates Ayurvedic conversational advice.
    """
    try:
        intent_info = llm_service.parse_intent(payload.message)
        reply = llm_service.generate_response(
            message=payload.message,
            dosha_constitution=payload.dosha_constitution,
            user_name=payload.user_name,
        )
        return {
            "intent": intent_info["intent"],
            "confidence": intent_info["confidence"],
            "requires_action": intent_info["requires_action"],
            "response": reply,
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
