import { create } from "zustand";
import { persist } from "zustand/middleware";
import { WeeklyMealPlan, Meal } from "../types/meal";
import { MealCompletion } from "../types/nutrition";
import { dietApi } from "../services/dietApi";
import { nutritionApi } from "../services/nutritionApi";
import {
  dbSaveMealCompletion,
  dbCalculateStreak,
  dbGetSession,
  dbSaveWeeklyPlan,
} from "@/lib/db";

interface DietState {
  weeklyPlan: WeeklyMealPlan | null;
  completions: MealCompletion[];
  isLoading: boolean;
  setWeeklyPlan: (plan: WeeklyMealPlan) => void;
  loadWeeklyPlan: (patientId?: string | number) => Promise<WeeklyMealPlan | null>;
  updateMeal: (dayIndex: number, mealType: "breakfast" | "lunch" | "dinner", newMeal: Meal) => Promise<void>;
  markMealStatus: (completion: MealCompletion) => Promise<void>;
  getStreak: () => number;
  reset: () => void;
}

export const useDietStore = create<DietState>()(
  persist(
    (set, get) => ({
      weeklyPlan: null,
      completions: [],
      isLoading: false,

      reset: () => {
        set({ weeklyPlan: null, completions: [], isLoading: false });
        try {
          localStorage.removeItem("arogyam-diet-storage");
        } catch {
          // ignore storage error
        }
      },

      setWeeklyPlan: (plan) => {
        const userId = dbGetSession();
        const planWithUser: WeeklyMealPlan = {
          ...plan,
          userId: userId || undefined,
        };
        set({ weeklyPlan: planWithUser });
        if (userId) {
          // Mirror to SQLite fallback
          dbSaveWeeklyPlan({
            userId: String(userId),
            planData: JSON.stringify(planWithUser),
            startDate: plan.startDate,
            isActive: true,
          });
        }
      },

      loadWeeklyPlan: async (patientId) => {
        const uid = patientId || dbGetSession();
        if (!uid) {
          set({ weeklyPlan: null, completions: [], isLoading: false });
          return null;
        }

        set({ isLoading: true });

        try {
          // 1. Fetch from FastAPI PostgreSQL backend
          const plan = await dietApi.getCurrentPlan(uid);
          const analytics = await nutritionApi.getAnalytics(uid);

          if (plan) {
            set({
              weeklyPlan: plan,
              completions: analytics.completions || [],
              isLoading: false,
            });
            return plan;
          } else {
            set({
              weeklyPlan: null,
              completions: analytics.completions || [],
              isLoading: false,
            });
            return null;
          }
        } catch {
          // If backend has no active plan for this user yet, reset to null
          set({
            weeklyPlan: null,
            completions: [],
            isLoading: false,
          });
          return null;
        }
      },

      updateMeal: async (dayIndex, mealType, newMeal) => {
        // Optimistic store update
        set((state) => {
          if (!state.weeklyPlan) return state;
          const updatedDays = [...state.weeklyPlan.days];
          updatedDays[dayIndex] = {
            ...updatedDays[dayIndex],
            [mealType]: newMeal,
          };
          const updatedPlan = {
            ...state.weeklyPlan,
            days: updatedDays,
          };
          return { weeklyPlan: updatedPlan };
        });

        // 1. Sync to FastAPI backend
        try {
          await dietApi.updateMeal(newMeal.id, newMeal);
        } catch (err) {
          console.warn("Backend meal update warning:", err);
        }

        // 2. Mirror to SQLite fallback
        const userId = dbGetSession();
        const currentPlan = get().weeklyPlan;
        if (userId && currentPlan) {
          dbSaveWeeklyPlan({
            userId: String(userId),
            planData: JSON.stringify(currentPlan),
            startDate: currentPlan.startDate,
            isActive: true,
          });
        }
      },

      markMealStatus: async (completion) => {
        // Optimistic store update
        set((state) => {
          const existingIndex = state.completions.findIndex(
            (c) => c.mealId === completion.mealId && c.date === completion.date
          );
          if (existingIndex >= 0) {
            const updated = [...state.completions];
            updated[existingIndex] = completion;
            return { completions: updated };
          }
          return { completions: [...state.completions, completion] };
        });

        const userId = dbGetSession();
        if (userId) {
          // 1. Sync to PostgreSQL backend
          try {
            await nutritionApi.logMealCompletion(userId, completion);
          } catch (err) {
            console.warn("Backend meal completion sync warning:", err);
          }

          // 2. Mirror to SQLite fallback
          dbSaveMealCompletion({
            userId: String(userId),
            mealId: completion.mealId,
            mealName: completion.mealId,
            mealType: "meal",
            date: completion.date,
            status: completion.status,
            protein: 0,
            calories: 0,
          });
        }
      },

      getStreak: () => {
        const userId = dbGetSession();
        const completions = get().completions.filter((c) => c.status === "completed");
        if (completions.length === 0) return 0;

        if (userId) {
          const dbStreak = dbCalculateStreak(userId);
          if (dbStreak > 0) return dbStreak;
        }

        // Fallback calculation using in-memory store completions
        const activeDates = new Set(completions.map((c) => c.date));
        const today = new Date().toISOString().split("T")[0];
        const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];

        let streak = 0;
        let checkDate: string | null = activeDates.has(today) ? today : activeDates.has(yesterday) ? yesterday : null;

        if (!checkDate) return 0;

        while (checkDate && activeDates.has(checkDate)) {
          streak++;
          const prev = new Date(checkDate);
          prev.setDate(prev.getDate() - 1);
          checkDate = prev.toISOString().split("T")[0];
        }

        return streak;
      },
    }),
    {
      name: "arogyam-diet-storage",
    }
  )
);
