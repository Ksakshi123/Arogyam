import { apiClient } from "./api";
import { MealCompletion } from "@/types/nutrition";

interface BackendMealCompletion {
  id?: number;
  patient_id?: number;
  meal_id?: string;
  date: string;
  status: "completed" | "skipped" | "replaced";
  replacement_meal_id?: string;
}

interface BackendDailySummary {
  date: string;
  total_calories?: number;
  total_protein?: number;
  total_carbohydrates?: number;
  total_fats?: number;
  completed_meals_count?: number;
}

interface BackendNutritionAnalytics {
  streak?: number;
  adherence_score?: number;
  daily_summaries?: BackendDailySummary[];
  completions?: BackendMealCompletion[];
}

export interface NutritionAnalytics {
  streak: number;
  adherenceScore: number;
  dailySummaries: Array<{
    date: string;
    totalCalories: number;
    totalProtein: number;
    totalCarbs: number;
    totalFats: number;
    completedMealsCount: number;
  }>;
  completions: MealCompletion[];
}

export const nutritionApi = {
  /**
   * Log meal completion status (completed, skipped, replaced)
   */
  logMealCompletion: async (
    patientId: number | string,
    completion: MealCompletion
  ): Promise<MealCompletion> => {
    const numId = Number(patientId);
    const validPatientId = !isNaN(numId) ? numId : patientId;
    const raw = await apiClient<BackendMealCompletion>("/api/nutrition/meal-completion", {
      data: {
        patient_id: validPatientId,
        meal_id: completion.mealId,
        date: completion.date,
        status: completion.status,
        replacement_meal_id: completion.replacementMealId,
      },
    });

    return {
      mealId: raw.meal_id || completion.mealId,
      date: raw.date,
      status: raw.status,
      replacementMealId: raw.replacement_meal_id,
    };
  },

  /**
   * Fetch full analytics including streak, adherence score, and history
   */
  getAnalytics: async (patientId: number | string): Promise<NutritionAnalytics> => {
    try {
      const raw = await apiClient<BackendNutritionAnalytics>(`/api/nutrition/${patientId}`);
      return {
        streak: raw.streak || 0,
        adherenceScore: raw.adherence_score || 0,
        dailySummaries: (raw.daily_summaries || []).map((s) => ({
          date: s.date,
          totalCalories: s.total_calories || 0,
          totalProtein: s.total_protein || 0,
          totalCarbs: s.total_carbohydrates || 0,
          totalFats: s.total_fats || 0,
          completedMealsCount: s.completed_meals_count || 0,
        })),
        completions: (raw.completions || []).map((c) => ({
          mealId: c.meal_id || "",
          date: c.date,
          status: c.status,
          replacementMealId: c.replacement_meal_id,
        })),
      };
    } catch {
      return {
        streak: 0,
        adherenceScore: 0,
        dailySummaries: [],
        completions: [],
      };
    }
  },
};
