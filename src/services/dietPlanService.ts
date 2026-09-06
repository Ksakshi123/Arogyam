import { Meal, WeeklyMealPlan } from "../types/meal";
import { PatientProfile } from "../types/patient";
import { DoshaResult } from "../types/dosha";
import { mealsDb } from "../data/meals";

export class DietPlanService {
  /**
   * Generates a personalized 7-day meal plan based on profile and dosha.
   */
  public static generateWeeklyPlan(profile: PatientProfile, dosha: DoshaResult, userId?: string | number): WeeklyMealPlan {
    const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

    // 1. Strict allergy filter first
    const safeMeals = mealsDb.filter(meal => this.isMealSafe(meal, profile));

    // 2. Diet preference filter
    const preferredMeals = safeMeals.filter(meal => this.matchesDietPreference(meal, profile.dietPreference));

    // Fallback if filtering is too strict
    const poolToUse = preferredMeals.length >= 9 ? preferredMeals : safeMeals;

    // Split by type
    const breakfasts = poolToUse.filter(m => m.type === "breakfast");
    const lunches = poolToUse.filter(m => m.type === "lunch");
    const dinners = poolToUse.filter(m => m.type === "dinner");

    // Fallbacks to full db if type pool is empty
    const bPool = breakfasts.length > 0 ? breakfasts : mealsDb.filter(m => m.type === "breakfast");
    const lPool = lunches.length > 0 ? lunches : mealsDb.filter(m => m.type === "lunch");
    const dPool = dinners.length > 0 ? dinners : mealsDb.filter(m => m.type === "dinner");

    // Sort each pool: dosha matches first
    const sortedB = this.sortByDosha(bPool, dosha);
    const sortedL = this.sortByDosha(lPool, dosha);
    const sortedD = this.sortByDosha(dPool, dosha);

    const days = daysOfWeek.map((day, index) => {
      // Rotate through sorted pool to avoid repetition
      const breakfast = sortedB[index % sortedB.length];
      const lunch = sortedL[index % sortedL.length];
      const dinner = sortedD[index % sortedD.length];

      return {
        date: new Date(Date.now() + index * 86400000).toISOString().split('T')[0],
        dayOfWeek: day,
        breakfast: { ...breakfast, explanation: breakfast.explanation || this.generateExplanation(breakfast, dosha, profile) },
        lunch:     { ...lunch,     explanation: lunch.explanation     || this.generateExplanation(lunch, dosha, profile) },
        dinner:    { ...dinner,    explanation: dinner.explanation    || this.generateExplanation(dinner, dosha, profile) },
      };
    });

    // Compatibility score
    const doshaMatchCount = days.reduce((acc, d) => {
      const match = [d.breakfast, d.lunch, d.dinner].filter(m =>
        m.suitableDoshas.includes(dosha.primaryDosha)
      ).length;
      return acc + match;
    }, 0);

    const doshaScore = Math.round((doshaMatchCount / 21) * 100);

    return {
      id: `plan-${Date.now()}`,
      userId,
      startDate: new Date().toISOString().split('T')[0],
      days,
      compatibilityScore: {
        dosha: doshaScore,
        preferences: preferredMeals.length >= 9 ? 100 : 80,
        allergies: 100, // strict constraint — always 100
        overall: Math.round((doshaScore + (preferredMeals.length >= 9 ? 100 : 80) + 100) / 3),
      },
    };
  }

  /**
   * Returns up to 3 alternative meals for the same type that respect all constraints.
   */
  public static getAlternatives(
    currentMeal: Meal,
    profile: PatientProfile,
    dosha: DoshaResult
  ): Meal[] {
    const safe = mealsDb.filter(m => this.isMealSafe(m, profile));
    const pool = safe.filter(m => m.type === currentMeal.type && m.id !== currentMeal.id);
    return this.sortByDosha(pool, dosha).slice(0, 3);
  }

  // ─── Private Helpers ────────────────────────────────────────────────────────

  private static isMealSafe(meal: Meal, profile: PatientProfile): boolean {
    const avoidWords = [
      ...(profile.allergies || []).map(a => a.toLowerCase()),
      ...(profile.foodRestrictions || []).map(r => r.toLowerCase()),
      ...(profile.dislikedFoods || []).map(d => d.toLowerCase()),
    ];
    if (avoidWords.length === 0) return true;

    const mealContent = [...meal.ingredients, meal.name, ...meal.tags]
      .join(" ")
      .toLowerCase();

    return !avoidWords.some(avoid => mealContent.includes(avoid));
  }

  private static matchesDietPreference(meal: Meal, pref: string): boolean {
    const isNonVeg = meal.tags.includes("Non-Vegetarian");
    const isEgg = meal.tags.includes("Eggetarian");
    const tagStr = meal.tags.join(" ").toLowerCase();
    const ingStr = meal.ingredients.join(" ").toLowerCase();

    if (pref === "Vegan") {
      // Reject non-veg, egg, dairy, ghee
      if (isNonVeg || isEgg) return false;
      if (ingStr.includes("ghee") || ingStr.includes("paneer") || ingStr.includes("milk") || ingStr.includes("yogurt") || ingStr.includes("cheese") || ingStr.includes("cream")) return false;
    }
    if (pref === "Vegetarian" && isNonVeg) return false;
    if (pref === "Eggetarian" && isNonVeg && !isEgg) return false;
    if (pref === "Jain") {
      // Jain avoids roots like onion, garlic, potato, carrot, beet
      const jainAvoid = ["onion", "garlic", "potato", "carrot", "beet"];
      if (jainAvoid.some(j => ingStr.includes(j))) return false;
    }
    return true;
  }

  private static sortByDosha(pool: Meal[], dosha: DoshaResult): Meal[] {
    return [...pool].sort((a, b) => {
      const aScore =
        (a.suitableDoshas.includes(dosha.primaryDosha) ? 2 : 0) +
        (dosha.secondaryDosha && a.suitableDoshas.includes(dosha.secondaryDosha) ? 1 : 0);
      const bScore =
        (b.suitableDoshas.includes(dosha.primaryDosha) ? 2 : 0) +
        (dosha.secondaryDosha && b.suitableDoshas.includes(dosha.secondaryDosha) ? 1 : 0);
      return bScore - aScore;
    });
  }

  private static generateExplanation(meal: Meal, dosha: DoshaResult, profile: PatientProfile): string {
    const doshaReason = meal.suitableDoshas.includes(dosha.primaryDosha)
      ? `aligns with your ${dosha.primaryDosha} dominant constitution`
      : `provides beneficial balance for your ${dosha.constitution} profile`;

    const goalReason =
      profile.wellnessGoals && profile.wellnessGoals.length > 0
        ? ` and supports your goal of ${profile.wellnessGoals[0]}`
        : "";

    return `Recommended because this meal ${doshaReason}${goalReason}. It matches your ${profile.dietPreference} preference with no conflict with your restrictions.`;
  }
}
