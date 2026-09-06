export type MealType = "breakfast" | "lunch" | "dinner";

export interface MealRecipe {
  steps: string[];       // Step-by-step cooking instructions
  tips: string[];        // Ayurvedic tips or chef notes
  servings: number;
  difficulty: "Easy" | "Medium" | "Hard";
}

export interface Meal {
  id: string;
  name: string;
  type: MealType;
  description: string;
  ingredients: string[];
  calories: number;
  protein: number;
  carbohydrates: number;
  fats: number;
  preparationTime: number; // in minutes
  tags: string[];
  suitableDoshas: string[];
  imageUrl?: string;
  explanation?: string; // AI explanation for why this meal
  recipe?: MealRecipe;  // Full step-by-step recipe
}

export interface DailyMealPlan {
  date: string;
  dayOfWeek: string;
  breakfast: Meal;
  lunch: Meal;
  dinner: Meal;
}

export interface WeeklyMealPlan {
  id: string;
  userId?: string | number;
  patientId?: string | number;
  startDate: string;
  days: DailyMealPlan[];
  compatibilityScore: {
    dosha: number;
    preferences: number;
    allergies: number;
    overall: number;
  };
}
