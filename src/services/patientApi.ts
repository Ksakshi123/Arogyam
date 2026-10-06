import { apiClient } from "./api";
import { PatientProfile, ActivityLevel, DietPreference, FoodPreference, WellnessGoal } from "@/types/patient";

interface BackendPatientResponse {
  id: number;
  user_id: number;
  full_name?: string;
  email?: string;
  age?: number;
  gender?: string;
  height?: number;
  weight?: number;
  activity_level?: string;
  diet_preference?: string;
  wellness_goals?: string[];
  food_preferences?: string[];
  allergies?: string[];
  food_restrictions?: string[];
  disliked_foods?: string[];
  created_at?: string;
  updated_at?: string;
}

export interface PatientResponse extends PatientProfile {
  id: number;
  userId: number;
  email?: string;
  createdAt?: string;
  updatedAt?: string;
}

function mapBackendPatient(raw: BackendPatientResponse): PatientResponse {
  return {
    id: raw.id,
    userId: raw.user_id,
    fullName: raw.full_name || "Arogyam Patient",
    email: raw.email,
    age: raw.age || 28,
    gender: raw.gender || "Other",
    height: raw.height || 170,
    weight: raw.weight || 65,
    activityLevel: (raw.activity_level as ActivityLevel) || "Moderately Active",
    dietPreference: (raw.diet_preference as DietPreference) || "Vegetarian",
    wellnessGoals: (raw.wellness_goals as WellnessGoal[]) || [],
    foodPreferences: (raw.food_preferences as FoodPreference[]) || [],
    allergies: raw.allergies || [],
    foodRestrictions: raw.food_restrictions || [],
    dislikedFoods: raw.disliked_foods || [],
    createdAt: raw.created_at,
    updatedAt: raw.updated_at,
  };
}

export const patientApi = {
  /**
   * Fetch patient profile by patientId or userId
   */
  getPatient: async (patientId: number | string): Promise<PatientResponse> => {
    const raw = await apiClient<BackendPatientResponse>(`/api/patients/${patientId}`);
    return mapBackendPatient(raw);
  },

  /**
   * Create or initialize a new patient profile
   */
  createPatient: async (profile: Partial<PatientProfile> & { userId?: number; fullName?: string }): Promise<PatientResponse> => {
    const raw = await apiClient<BackendPatientResponse>("/api/patients", {
      data: {
        user_id: profile.userId,
        full_name: profile.fullName,
        age: profile.age,
        weight: profile.weight,
        height: profile.height,
        activity_level: profile.activityLevel,
        diet_preference: profile.dietPreference,
        food_preferences: profile.foodPreferences,
        wellness_goals: profile.wellnessGoals,
        allergies: profile.allergies,
        food_restrictions: profile.foodRestrictions,
        disliked_foods: profile.dislikedFoods,
      },
    });

    return mapBackendPatient(raw);
  },

  /**
   * Update existing patient profile
   */
  updatePatient: async (patientId: number | string, updates: Partial<PatientProfile>): Promise<PatientResponse> => {
    const raw = await apiClient<BackendPatientResponse>(`/api/patients/${patientId}`, {
      method: "PUT",
      data: {
        age: updates.age,
        weight: updates.weight,
        height: updates.height,
        activity_level: updates.activityLevel,
        diet_preference: updates.dietPreference,
        food_preferences: updates.foodPreferences,
        wellness_goals: updates.wellnessGoals,
        allergies: updates.allergies,
        food_restrictions: updates.foodRestrictions,
        disliked_foods: updates.dislikedFoods,
      },
    });

    return mapBackendPatient(raw);
  },
};
