export interface MealCompletion {
  mealId: string;
  date: string;
  status: "completed" | "skipped" | "replaced";
  replacementMealId?: string;
}

export interface NutritionData {
  date: string;
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFats: number;
  completedMealsCount: number;
}
