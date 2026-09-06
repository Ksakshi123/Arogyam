import { DoshaResult, DoshaType, QuizQuestion } from "../types/dosha";
import { doshaQuestions } from "../data/doshaQuestions";

export class RuleBasedDoshaPredictionService {
  /**
   * Calculates dosha percentages based on given answers
   * @param answers Record mapping questionId to optionId
   */
  public static calculateDosha(answers: Record<string, string>): DoshaResult {
    let vataScore = 0;
    let pittaScore = 0;
    let kaphaScore = 0;
    let totalScore = 0;

    doshaQuestions.forEach(q => {
      const selectedOptionId = answers[q.id];
      if (selectedOptionId) {
        const option = q.options.find(o => o.id === selectedOptionId);
        if (option) {
          vataScore += option.vataScore;
          pittaScore += option.pittaScore;
          kaphaScore += option.kaphaScore;
          totalScore += (option.vataScore + option.pittaScore + option.kaphaScore);
        }
      }
    });

    if (totalScore === 0) {
      return this.fallbackResult();
    }

    const vata = Math.round((vataScore / totalScore) * 100);
    const pitta = Math.round((pittaScore / totalScore) * 100);
    // Ensure it adds exactly to 100
    const kapha = 100 - vata - pitta;

    return this.determineConstitution(vata, pitta, kapha);
  }

  private static determineConstitution(vata: number, pitta: number, kapha: number): DoshaResult {
    const scores = [
      { name: "Vata" as DoshaType, score: vata },
      { name: "Pitta" as DoshaType, score: pitta },
      { name: "Kapha" as DoshaType, score: kapha }
    ];

    scores.sort((a, b) => b.score - a.score);

    const primaryDosha = scores[0].name;
    const secondaryDosha = scores[1].name;
    
    // Logic for constitution
    let constitution = "";
    
    if (scores[0].score - scores[1].score <= 15 && scores[1].score - scores[2].score <= 15) {
      // Tridoshic / Balanced
      constitution = "Tridoshic (Balanced)";
    } else if (scores[0].score - scores[1].score <= 15) {
      // Dual dominant
      constitution = `${primaryDosha}-${secondaryDosha}`;
    } else {
      // Single dominant
      constitution = `${primaryDosha} Dominant`;
    }

    return {
      vata,
      pitta,
      kapha,
      primaryDosha,
      secondaryDosha: (scores[0].score - scores[1].score <= 15) ? secondaryDosha : undefined,
      constitution,
      assessmentDate: new Date().toISOString()
    };
  }

  private static fallbackResult(): DoshaResult {
    return {
      vata: 34,
      pitta: 33,
      kapha: 33,
      primaryDosha: "Vata",
      constitution: "Tridoshic (Balanced)",
      assessmentDate: new Date().toISOString()
    };
  }
}
