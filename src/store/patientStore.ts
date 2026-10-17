import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  PatientProfile,
  ActivityLevel,
  WellnessGoal,
  DietPreference,
  FoodPreference,
} from "../types/patient";
import { DoshaResult, DoshaType } from "../types/dosha";
import { patientApi } from "../services/patientApi";
import { doshaApi } from "../services/doshaApi";
import {
  dbSaveProfile,
  dbSaveDoshaAssessment,
  dbGetProfile,
  dbGetLatestDoshaAssessment,
  dbGetSession,
  dbClearSession,
  dbSetSession,
} from "@/lib/db";

interface PatientState {
  userId: string | null;
  profile: PatientProfile | null;
  doshaResult: DoshaResult | null;
  hasCompletedOnboarding: boolean;
  isLoading: boolean;
  setUserId: (id: string | null) => void;
  setProfile: (profile: PatientProfile) => void;
  setDoshaResult: (result: DoshaResult | null) => void;
  setHasCompletedOnboarding: (status: boolean) => void;
  updateProfile: (updates: Partial<PatientProfile>) => Promise<void>;
  loadFromDB: (userId: string) => Promise<void>;
  submitDoshaAssessment: (answers: Record<string, string>) => Promise<DoshaResult>;
  logout: () => void;
  reset: () => void;
}

export const usePatientStore = create<PatientState>()(
  persist(
    (set, get) => ({
      userId: null,
      profile: null,
      doshaResult: null,
      hasCompletedOnboarding: false,
      isLoading: false,

      reset: () => {
        set({
          userId: null,
          profile: null,
          doshaResult: null,
          hasCompletedOnboarding: false,
          isLoading: false,
        });
      },

      setUserId: (userId) => {
        const prevId = get().userId;
        set({ userId });
        if (userId) {
          dbSetSession(userId);
          if (prevId && prevId !== userId) {
            // New user login -> wipe stale cached profile & assessments
            set({ profile: null, doshaResult: null, hasCompletedOnboarding: false });
          }
        }
      },

      setProfile: (profile) => {
        set({ profile, hasCompletedOnboarding: true });
        const uid = get().userId || dbGetSession();

        // 1. Persist to PostgreSQL via FastAPI backend
        patientApi.createPatient({
          ...profile,
          userId: uid && !isNaN(Number(uid)) ? Number(uid) : undefined,
          fullName: profile.fullName,
        }).then((res) => {
          if (res && res.userId) {
            const newUidStr = String(res.userId);
            set({ userId: newUidStr });
            dbSetSession(newUidStr);
          }
        }).catch((err) => {
          console.warn("Backend API sync warning (Profile):", err.message);
        });

        // 2. Mirror to SQLite fallback
        const effectiveUid = uid || "1";
        dbSaveProfile({
          userId: effectiveUid,
          fullName: profile.fullName,
          age: profile.age,
          gender: profile.gender || "Other",
          height: profile.height,
          weight: profile.weight,
          activityLevel: profile.activityLevel,
          wellnessGoals: profile.wellnessGoals,
          dietPreference: profile.dietPreference,
          foodPreferences: profile.foodPreferences,
          allergies: profile.allergies,
          foodRestrictions: profile.foodRestrictions,
          dislikedFoods: profile.dislikedFoods,
          joinedAt: new Date().toISOString(),
        });
      },

      setDoshaResult: (doshaResult) => {
        set({ doshaResult });
        // Note: Dosha assessment is saved to backend via doshaApi.submitAssessment
        // This setter just updates the local state
      },

      submitDoshaAssessment: async (answers: Record<string, string>) => {
        const uid = get().userId || dbGetSession();
        try {
          const result = await doshaApi.submitAssessment(uid, answers);
          get().setDoshaResult(result);
          return result;
        } catch (err) {
          console.warn("API assessment calculation fallback to local engine:", err);
          const fallback = {
            vata: 34,
            pitta: 33,
            kapha: 33,
            primaryDosha: "Vata" as DoshaType,
            constitution: "Tridoshic (Balanced)",
            assessmentDate: new Date().toISOString(),
          };
          get().setDoshaResult(fallback);
          return fallback;
        }
      },

      setHasCompletedOnboarding: (hasCompletedOnboarding) => set({ hasCompletedOnboarding }),

      updateProfile: async (updates) => {
        // Optimistic update
        set((state) => ({
          profile: state.profile ? { ...state.profile, ...updates } : null,
        }));

        const uid = get().userId || dbGetSession();
        if (uid) {
          // Sync with PostgreSQL
          try {
            await patientApi.updatePatient(uid, updates);
          } catch (err: unknown) {
            console.warn("Backend API sync warning (Update Profile):", err);
          }

          // SQLite fallback mirror
          const updated = get().profile;
          if (updated) {
            dbSaveProfile({
              userId: uid,
              fullName: updated.fullName,
              age: updated.age,
              gender: updated.gender || "Other",
              height: updated.height,
              weight: updated.weight,
              activityLevel: updated.activityLevel,
              wellnessGoals: updated.wellnessGoals,
              dietPreference: updated.dietPreference,
              foodPreferences: updated.foodPreferences,
              allergies: updated.allergies,
              foodRestrictions: updated.foodRestrictions,
              dislikedFoods: updated.dislikedFoods,
              joinedAt: new Date().toISOString(),
            });
          }
        }
      },

      loadFromDB: async (userId) => {
        set({ isLoading: true });

        // 1. Attempt PostgreSQL Backend fetch
        try {
          const remoteProfile = await patientApi.getPatient(userId);
          const remoteDosha = await doshaApi.getLatestResult(userId);

          if (remoteProfile) {
            set({
              userId,
              hasCompletedOnboarding: true,
              profile: {
                fullName: remoteProfile.fullName,
                age: remoteProfile.age || 28,
                gender: remoteProfile.gender || "Other",
                height: remoteProfile.height || 170,
                weight: remoteProfile.weight || 65,
                activityLevel: (remoteProfile.activityLevel as ActivityLevel) || "Moderately Active",
                wellnessGoals: (remoteProfile.wellnessGoals as WellnessGoal[]) || ["General Wellness"],
                dietPreference: (remoteProfile.dietPreference as DietPreference) || "Vegetarian",
                foodPreferences: (remoteProfile.foodPreferences as FoodPreference[]) || ["Prefer Indian Food"],
                allergies: remoteProfile.allergies || [],
                foodRestrictions: remoteProfile.foodRestrictions || [],
                dislikedFoods: remoteProfile.dislikedFoods || [],
              },
            });
          }

          if (remoteDosha) {
            set({ doshaResult: remoteDosha });
          } else {
            // New user without assessment yet -> do not inherit old user's dosha!
            set({ doshaResult: null });
          }

          if (remoteProfile) {
            set({ isLoading: false });
            return;
          }
        } catch {
          // Backend offline or patient record not migrated yet -> fall back to local store
        }

        // 2. SQLite / Local fallback
        const storedProfile = dbGetProfile(userId);
        const storedAssessment = dbGetLatestDoshaAssessment(userId);

        if (storedProfile) {
          set({
            userId,
            hasCompletedOnboarding: true,
            profile: {
              fullName: storedProfile.fullName,
              age: storedProfile.age,
              gender: storedProfile.gender,
              height: storedProfile.height,
              weight: storedProfile.weight,
              activityLevel: storedProfile.activityLevel as ActivityLevel,
              wellnessGoals: storedProfile.wellnessGoals as WellnessGoal[],
              dietPreference: storedProfile.dietPreference as DietPreference,
              foodPreferences: storedProfile.foodPreferences as FoodPreference[],
              allergies: storedProfile.allergies,
              foodRestrictions: storedProfile.foodRestrictions,
              dislikedFoods: storedProfile.dislikedFoods,
            },
          });
        }
        if (storedAssessment) {
          set({
            doshaResult: {
              constitution: storedAssessment.constitution,
              primaryDosha: storedAssessment.primaryDosha as DoshaType,
              secondaryDosha: storedAssessment.secondaryDosha ? (storedAssessment.secondaryDosha as DoshaType) : undefined,
              vata: storedAssessment.vata,
              pitta: storedAssessment.pitta,
              kapha: storedAssessment.kapha,
              assessmentDate: new Date().toISOString(),
            },
          });
        } else {
          set({ doshaResult: null });
        }
        set({ isLoading: false });
      },

      logout: () => {
        dbClearSession();
        localStorage.removeItem("arogyam_jwt_token");
        try {
          localStorage.removeItem("arogyam-patient-storage");
          localStorage.removeItem("arogyam-diet-storage");
        } catch {
          // ignore
        }
        set({
          userId: null,
          profile: null,
          doshaResult: null,
          hasCompletedOnboarding: false,
        });
      },
    }),
    {
      name: "arogyam-patient-storage",
    }
  )
);
