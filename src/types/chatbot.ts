import { Meal } from "./meal";

export type ChatIntent = 
  | "general_question"
  | "dosha_question"
  | "nutrition_question"
  | "protein_question"
  | "replace_meal" 
  | "update_weekly_plan" 
  | "general_inquiry" 
  | "unknown";

export interface MealReplacementOption {
  id?: string;
  meal_name: string;
  description: string;
  ingredients: string[];
  calories: number;
  protein: number;
  carbohydrates: number;
  fats: number;
  preparation_time: number;
  dosha_reason: string;
  tags: string[];
}

export interface ChatAIResponse {
  intent: ChatIntent | string;
  message: string;
  target?: string | null;
  replacement_options?: MealReplacementOption[];
  proposed_changes?: string[];
  requires_confirmation?: boolean;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: string;
  intent?: ChatIntent | string;
  target?: string | null;
  replacement_options?: MealReplacementOption[];
  proposed_changes?: string[];
  requires_confirmation?: boolean;
  structuredData?: {
    targetMeal?: string;
    targetDay?: string;
    suggestedMeals?: Meal[];
    planChangesSummary?: string[];
    isConfirmation?: boolean;
  };
}
