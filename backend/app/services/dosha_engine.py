"""
Rule-based Dosha calculation engine.
Mirrors the deterministic scoring logic from the Arogyam clinical guidelines.
"""
from typing import Dict, Optional
from datetime import datetime
from app.schemas import DoshaResultResponse


class RuleBasedDoshaEngine:
    """
    Calculates individual Prakriti / Vikriti dosha breakdown based on
    responses to physical, physiological, and behavioral questions.
    """

    # Default fallback options if scoring map is partial
    OPTION_WEIGHTS = {
        # General pattern: option 'a' = Vata, 'b' = Pitta, 'c' = Kapha
        "a": {"vata": 3, "pitta": 0, "kapha": 0},
        "b": {"vata": 0, "pitta": 3, "kapha": 0},
        "c": {"vata": 0, "pitta": 0, "kapha": 3},
        "v": {"vata": 3, "pitta": 0, "kapha": 0},
        "p": {"vata": 0, "pitta": 3, "kapha": 0},
        "k": {"vata": 0, "pitta": 0, "kapha": 3},
    }

    @classmethod
    def calculate(cls, answers: Dict[str, str]) -> DoshaResultResponse:
        vata_score = 0
        pitta_score = 0
        kapha_score = 0
        total_points = 0

        for q_id, opt_id in answers.items():
            opt_key = str(opt_id).lower()
            # Check by specific ending or prefix
            if "vata" in opt_key or opt_key.endswith("-a") or opt_key == "a":
                vata_score += 3
                total_points += 3
            elif "pitta" in opt_key or opt_key.endswith("-b") or opt_key == "b":
                pitta_score += 3
                total_points += 3
            elif "kapha" in opt_key or opt_key.endswith("-c") or opt_key == "c":
                kapha_score += 3
                total_points += 3
            elif opt_key in cls.OPTION_WEIGHTS:
                w = cls.OPTION_WEIGHTS[opt_key]
                vata_score += w["vata"]
                pitta_score += w["pitta"]
                kapha_score += w["kapha"]
                total_points += w["vata"] + w["pitta"] + w["kapha"]
            else:
                # Default balanced distribution for unknown option
                vata_score += 1
                pitta_score += 1
                kapha_score += 1
                total_points += 3

        if total_points == 0:
            return DoshaResultResponse(
                vata=34.0,
                pitta=33.0,
                kapha=33.0,
                primary_dosha="Vata",
                secondary_dosha="Pitta",
                constitution="Tridoshic (Balanced)",
                assessed_at=datetime.utcnow().isoformat(),
            )

        v_pct = round((vata_score / total_points) * 100, 1)
        p_pct = round((pitta_score / total_points) * 100, 1)
        k_pct = round(100.0 - v_pct - p_pct, 1)

        scores = [
            ("Vata", v_pct),
            ("Pitta", p_pct),
            ("Kapha", k_pct),
        ]
        scores.sort(key=lambda x: x[1], reverse=True)

        primary = scores[0][0]
        secondary = scores[1][0]

        # Determine Constitution label
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
            vata=v_pct,
            pitta=p_pct,
            kapha=k_pct,
            primary_dosha=primary,
            secondary_dosha=secondary_val,
            constitution=constitution,
            assessed_at=datetime.utcnow().isoformat(),
        )
