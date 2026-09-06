"""
Inference wrapper for Ayurvedic Dosha Prediction.
Provides class probability distributions (Vata, Pitta, Kapha) and identifies dominant constitution.
"""
import os
import joblib
import pandas as pd
from typing import Dict, Any

MODEL_PATH = os.path.join(os.path.dirname(__file__), "dosha_model.joblib")


class DoshaPredictor:
    def __init__(self):
        self.model = None
        if os.path.exists(MODEL_PATH):
            try:
                self.model = joblib.load(MODEL_PATH)
            except Exception as e:
                print(f"Notice: Could not load joblib model ({e}). Using heuristic inference.")

    def predict(self, features: Dict[str, str]) -> Dict[str, Any]:
        """
        Takes patient feature dict and returns calibrated dosha percentages.
        """
        if self.model:
            try:
                input_df = pd.DataFrame([features])
                probs = self.model.predict_proba(input_df)[0]
                classes = list(self.model.classes_)
                prob_map = {cls_name: round(float(prob) * 100, 1) for cls_name, prob in zip(classes, probs)}

                v_pct = prob_map.get("Vata", 33.3)
                p_pct = prob_map.get("Pitta", 33.3)
                k_pct = prob_map.get("Kapha", 33.4)

                dominant = max(prob_map, key=prob_map.get)
                return {
                    "vata": v_pct,
                    "pitta": p_pct,
                    "kapha": k_pct,
                    "primary_dosha": dominant,
                    "constitution": f"{dominant} Dominant",
                    "model_used": "RandomForestClassifier",
                }
            except Exception as ex:
                print(f"Model prediction fallback due to: {ex}")

        # Probabilistic heuristic inference if model file is not pre-trained
        vata_pts = 0
        pitta_pts = 0
        kapha_pts = 0

        for val in features.values():
            s = str(val).lower()
            if any(k in s for k in ["thin", "dry", "irregular", "cold", "variable", "anxious", "light"]):
                vata_pts += 2
            elif any(k in s for k in ["medium", "warm", "sharp", "intense", "sweaty", "irritable", "focused"]):
                pitta_pts += 2
            elif any(k in s for k in ["heavy", "oily", "slow", "steady", "thick", "calm", "deep"]):
                kapha_pts += 2
            else:
                vata_pts += 1
                pitta_pts += 1
                kapha_pts += 1

        total = vata_pts + pitta_pts + kapha_pts
        v_pct = round((vata_pts / total) * 100, 1)
        p_pct = round((pitta_pts / total) * 100, 1)
        k_pct = round(100.0 - v_pct - p_pct, 1)

        scores = [("Vata", v_pct), ("Pitta", p_pct), ("Kapha", k_pct)]
        scores.sort(key=lambda x: x[1], reverse=True)

        return {
            "vata": v_pct,
            "pitta": p_pct,
            "kapha": k_pct,
            "primary_dosha": scores[0][0],
            "secondary_dosha": scores[1][0] if scores[0][1] - scores[1][1] <= 15 else None,
            "constitution": f"{scores[0][0]}-{scores[1][0]}" if scores[0][1] - scores[1][1] <= 15 else f"{scores[0][0]} Dominant",
            "model_used": "HeuristicProbabilisticEngine",
        }
