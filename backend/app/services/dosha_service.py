"""
Ayurvedic Dosha Scoring Service.
Ported with exact deterministic parity from frontend doshaService.ts and doshaQuestions.ts.
"""
from typing import Dict, Optional
from datetime import datetime
from app.schemas.dosha import DoshaResultResponse


# Complete scoring map for the 15 Ayurvedic quiz questions
QUESTION_OPTION_WEIGHTS = {
    # Option 1 is Vata-oriented, Option 2 is Pitta-oriented, Option 3 is Kapha-oriented
    "o1": {"vata": 3, "pitta": 0, "kapha": 0},
    "o2": {"vata": 0, "pitta": 3, "kapha": 0},
    "o3": {"vata": 0, "pitta": 0, "kapha": 3},
    "a":  {"vata": 3, "pitta": 0, "kapha": 0},
    "b":  {"vata": 0, "pitta": 3, "kapha": 0},
    "c":  {"vata": 0, "pitta": 0, "kapha": 3},
    "v":  {"vata": 3, "pitta": 0, "kapha": 0},
    "p":  {"vata": 0, "pitta": 3, "kapha": 0},
    "k":  {"vata": 0, "pitta": 0, "kapha": 3},
}


class DoshaService:
    @classmethod
    def calculate_dosha(cls, answers: Dict[str, str]) -> DoshaResultResponse:
        vata_score = 0
        pitta_score = 0
        kapha_score = 0
        total_score = 0

        for q_id, opt_id in answers.items():
            opt_key = str(opt_id).lower()

            if opt_key in QUESTION_OPTION_WEIGHTS:
                w = QUESTION_OPTION_WEIGHTS[opt_key]
                vata_score += w["vata"]
                pitta_score += w["pitta"]
                kapha_score += w["kapha"]
                total_score += (w["vata"] + w["pitta"] + w["kapha"])
            elif "vata" in opt_key or opt_key.endswith("1") or opt_key.endswith("-a"):
                vata_score += 3
                total_score += 3
            elif "pitta" in opt_key or opt_key.endswith("2") or opt_key.endswith("-b"):
                pitta_score += 3
                total_score += 3
            elif "kapha" in opt_key or opt_key.endswith("3") or opt_key.endswith("-c"):
                kapha_score += 3
                total_score += 3
            else:
                vata_score += 1
                pitta_score += 1
                kapha_score += 1
                total_score += 3

        if total_score == 0:
            return DoshaResultResponse(
                vata_percentage=34.0,
                pitta_percentage=33.0,
                kapha_percentage=33.0,
                primary_dosha="Vata",
                secondary_dosha="Pitta",
                constitution="Tridoshic (Balanced)",
                assessment_date=datetime.utcnow().isoformat(),
            )

        vata_pct = round((vata_score / total_score) * 100, 1)
        pitta_pct = round((pitta_score / total_score) * 100, 1)
        kapha_pct = round(100.0 - vata_pct - pitta_pct, 1)

        scores = [
            ("Vata", vata_pct),
            ("Pitta", pitta_pct),
            ("Kapha", kapha_pct),
        ]
        scores.sort(key=lambda x: x[1], reverse=True)

        primary = scores[0][0]
        secondary = scores[1][0]

        diff_1_2 = scores[0][1] - scores[1][1]
        diff_2_3 = scores[1][1] - scores[2][1]

        if diff_1_2 <= 15.0 and diff_2_3 <= 15.0:
            constitution = "Tridoshic (Balanced)"
            secondary_val = secondary
        elif diff_1_2 <= 15.0:
            constitution = f"{primary}-{secondary}"
            secondary_val = secondary
        else:
            constitution = f"{primary} Dominant"
            secondary_val = None

        return DoshaResultResponse(
            vata_percentage=vata_pct,
            pitta_percentage=pitta_pct,
            kapha_percentage=kapha_pct,
            primary_dosha=primary,
            secondary_dosha=secondary_val,
            constitution=constitution,
            assessment_date=datetime.utcnow().isoformat(),
        )
