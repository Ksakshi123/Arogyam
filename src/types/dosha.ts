export type DoshaType = "Vata" | "Pitta" | "Kapha";

export interface DoshaAssessment {
  id: string;
  answers: Record<string, string>; // questionId -> answerId
  completedAt?: string;
}

export interface DoshaResult {
  vata: number; // percentage
  pitta: number;
  kapha: number;
  percentages?: {
    vata: number;
    pitta: number;
    kapha: number;
  };
  primaryDosha: DoshaType;
  secondaryDosha?: DoshaType;
  constitution: string; // e.g., "Vata-Pitta"
  assessmentDate: string;
}

export interface QuizQuestion {
  id: string;
  category: string;
  question: string;
  options: QuizOption[];
}

export interface QuizOption {
  id: string;
  text: string;
  vataScore: number;
  pittaScore: number;
  kaphaScore: number;
}
