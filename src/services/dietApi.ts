import { apiClient } from "./api";
import { WeeklyMealPlan, Meal, MealRecipe, MealType } from "@/types/meal";

interface BackendMealResponse {
  id: string;
  meal_name?: string;
  name?: string;
  meal_type?: string;
  type?: string;
  description?: string;
  ingredients?: string[];
  calories?: number;
  protein?: number;
  carbohydrates?: number;
  fats?: number;
  preparation_time?: number;
  preparationTime?: number;
  tags?: string[];
  suitable_doshas?: string[];
  suitableDoshas?: string[];
  explanation?: string;
  recipe?: MealRecipe;
}

interface BackendDailyPlanResponse {
  date: string;
  dayOfWeek?: string;
  day_of_week?: string;
  breakfast: BackendMealResponse;
  lunch: BackendMealResponse;
  dinner: BackendMealResponse;
}

interface BackendWeeklyPlanResponse {
  id: number | string;
  startDate?: string;
  start_date?: string;
  compatibilityScore?: {
    dosha: number;
    preferences: number;
    allergies: number;
    overall: number;
  };
  compatibility_score?: {
    dosha: number;
    preferences: number;
    allergies: number;
    overall: number;
  };
  days?: BackendDailyPlanResponse[];
}

function formatBackendMeal(raw: BackendMealResponse): Meal {
  return {
    id: raw.id,
    name: raw.meal_name || raw.name || "Ayurvedic Meal",
    type: (raw.meal_type || raw.type || "breakfast") as MealType,
    description: raw.description || "",
    ingredients: raw.ingredients || [],
    calories: Number(raw.calories || 0),
    protein: Number(raw.protein || 0),
    carbohydrates: Number(raw.carbohydrates || 0),
    fats: Number(raw.fats || 0),
    preparationTime: Number(raw.preparation_time || raw.preparationTime || 15),
    tags: raw.tags || [],
    suitableDoshas: raw.suitable_doshas || raw.suitableDoshas || [],
    explanation: raw.explanation,
    recipe: raw.recipe,
  };
}

function formatBackendPlan(raw: BackendWeeklyPlanResponse): WeeklyMealPlan {
  return {
    id: String(raw.id),
    startDate: raw.startDate || raw.start_date || new Date().toISOString().split("T")[0],
    compatibilityScore: raw.compatibilityScore || raw.compatibility_score || {
      dosha: 90,
      preferences: 100,
      allergies: 100,
      overall: 96,
    },
    days: (raw.days || []).map((d) => ({
      date: d.date,
      dayOfWeek: d.dayOfWeek || d.day_of_week || "Monday",
      breakfast: formatBackendMeal(d.breakfast),
      lunch: formatBackendMeal(d.lunch),
      dinner: formatBackendMeal(d.dinner),
    })),
  };
}

export const dietApi = {
  /**
   * Fetch current active weekly meal plan
   */
  getCurrentPlan: async (patientId: number | string): Promise<WeeklyMealPlan> => {
    const raw = await apiClient<BackendWeeklyPlanResponse>(`/api/diet/current/${patientId}`);
    return formatBackendPlan(raw);
  },

  /**
   * Generate a fresh 7-day personalized weekly plan
   */
  generateWeeklyPlan: async (patientId: number | string): Promise<WeeklyMealPlan> => {
    const raw = await apiClient<BackendWeeklyPlanResponse>("/api/diet/generate", {
      data: { patient_id: Number(patientId) },
    });
    return formatBackendPlan(raw);
  },

  /**
   * Swap or update a single meal in the active plan
   */
  updateMeal: async (mealId: string, updates: Partial<Meal>): Promise<Meal> => {
    const raw = await apiClient<BackendMealResponse>(`/api/diet/meal/${mealId}`, {
      method: "PUT",
      data: {
        meal_name: updates.name,
        description: updates.description,
        ingredients: updates.ingredients,
        calories: updates.calories,
        protein: updates.protein,
        carbohydrates: updates.carbohydrates,
        fats: updates.fats,
        preparation_time: updates.preparationTime,
        tags: updates.tags,
        suitable_doshas: updates.suitableDoshas,
        is_replaced: true,
        explanation: updates.explanation,
        recipe: updates.recipe,
      },
    });
    return formatBackendMeal(raw);
  },

  /**
   * Regenerate with updated constraints
   */
  regeneratePlan: async (patientId: number | string): Promise<WeeklyMealPlan> => {
    const raw = await apiClient<BackendWeeklyPlanResponse>("/api/diet/regenerate", {
      data: { patient_id: Number(patientId) },
    });
    return formatBackendPlan(raw);
  },
};
