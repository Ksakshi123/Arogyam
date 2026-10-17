import {
  dbRegisterUser,
  dbLoginUser,
  dbGetUser,
  dbGetProfile,
  dbSaveProfile,
  dbSetSession,
  dbGetSession,
  dbClearSession,
  User,
  StoredProfile,
} from "./db";
import { PatientProfile } from "@/types/patient";
import { apiClient } from "@/services/api";
import { patientApi } from "@/services/patientApi";
import { usePatientStore } from "@/store/patientStore";
import { useDietStore } from "@/store/dietStore";

export interface AuthState {
  user: User | null;
  profile: StoredProfile | null;
  isAuthenticated: boolean;
}

interface BackendAuthResponse {
  access_token: string;
  token_type: string;
  user: {
    id: number;
    name: string;
    email: string;
    role: string;
  };
}

export async function register(
  email: string,
  password: string,
  profileData?: Partial<PatientProfile>
): Promise<{ success: boolean; error?: string; user?: User; profile?: StoredProfile }> {
  // Clear any existing session & stored plans from previous user
  logout();

  const cleanEmail = email.trim().toLowerCase();
  const userName = profileData?.fullName || cleanEmail.split("@")[0];

  // Register on FastAPI PostgreSQL backend (Neon only - no local fallback)
  try {
    const res = await apiClient<BackendAuthResponse>("/api/auth/register", {
      data: {
        name: userName,
        email: cleanEmail,
        password,
        role: "patient",
      },
    });

    if (res?.access_token && res?.user) {
      localStorage.setItem("arogyam_jwt_token", res.access_token);
      const strId = String(res.user.id);
      dbSetSession(strId);

      // Persist profile to PostgreSQL
      if (profileData) {
        await patientApi.createPatient({
          ...profileData,
          userId: res.user.id,
          fullName: userName,
        }).catch((err) => console.warn("Backend patient create warning:", err));
      }

      const localProfile: StoredProfile = {
        userId: strId,
        fullName: userName,
        age: profileData?.age || 28,
        gender: profileData?.gender || "Other",
        height: profileData?.height || 170,
        weight: profileData?.weight || 65,
        activityLevel: profileData?.activityLevel || "Moderately Active",
        wellnessGoals: profileData?.wellnessGoals || ["General Wellness"],
        dietPreference: profileData?.dietPreference || "Vegetarian",
        foodPreferences: profileData?.foodPreferences || ["Prefer Indian Food"],
        allergies: profileData?.allergies || [],
        foodRestrictions: profileData?.foodRestrictions || [],
        dislikedFoods: profileData?.dislikedFoods || [],
        joinedAt: new Date().toISOString(),
      };
      dbSaveProfile(localProfile);

      return {
        success: true,
        user: {
          id: strId,
          email: res.user.email,
          passwordHash: "",
          createdAt: new Date().toISOString(),
        },
        profile: localProfile,
      };
    }
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "";
    // Handle specific backend errors
    if (msg.includes("already exists")) {
      return { success: false, error: "An account with this email already exists." };
    }
    if (msg.includes("Rate limit")) {
      return { success: false, error: msg };
    }
    if (msg.includes("429")) {
      return { success: false, error: "Too many registration attempts. Please wait and try again later." };
    }
    // Pass through any other backend error message
    console.error("Backend register error:", err);
    return { success: false, error: msg || "Registration failed. Please try again." };
  }

  return { success: false, error: "Registration failed" };
}

export async function login(
  email: string,
  password: string
): Promise<{ success: boolean; error?: string; user?: User; profile?: StoredProfile | null }> {
  // Clear any existing session & stored plans from previous user
  logout();

  const cleanEmail = email.trim().toLowerCase();

  // Login via FastAPI backend (Neon PostgreSQL only - no local fallback)
  try {
    const res = await apiClient<BackendAuthResponse>("/api/auth/login", {
      data: {
        email: cleanEmail,
        password,
      },
    });

    if (res?.access_token && res?.user) {
      localStorage.setItem("arogyam_jwt_token", res.access_token);
      const strId = String(res.user.id);
      dbSetSession(strId);

      const localUser: User = {
        id: strId,
        email: res.user.email,
        passwordHash: "",
        createdAt: new Date().toISOString(),
      };

      return {
        success: true,
        user: localUser,
        profile: dbGetProfile(strId),
      };
    }
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "";
    // Handle specific backend errors
    if (msg.includes("Incorrect email or password")) {
      return { success: false, error: "Incorrect email or password" };
    }
    if (msg.includes("Rate limit")) {
      return { success: false, error: msg };
    }
    if (msg.includes("429")) {
      return { success: false, error: "Too many login attempts. Please wait and try again later." };
    }
    if (msg.includes("401") || msg.includes("404")) {
      return { success: false, error: "Invalid email or password" };
    }
    // Pass through any other backend error message
    console.error("Backend login error:", err);
    return { success: false, error: msg || "An error occurred during login. Please try again." };
  }

  return { success: false, error: "Invalid email or password" };
}

export function logout(): void {
  dbClearSession();
  localStorage.removeItem("arogyam_jwt_token");
  try {
    localStorage.removeItem("arogyam-patient-storage");
    localStorage.removeItem("arogyam-diet-storage");
  } catch {
    // ignore
  }
  usePatientStore.getState().reset();
  useDietStore.getState().reset();
}

export function getCurrentSession(): AuthState {
  const userId = dbGetSession();
  if (!userId) {
    return { user: null, profile: null, isAuthenticated: false };
  }
  const user = dbGetUser(userId);
  if (!user) {
    return {
      user: {
        id: userId,
        email: `user_${userId}@arogyam.local`,
        passwordHash: "",
        createdAt: new Date().toISOString(),
      },
      profile: dbGetProfile(userId),
      isAuthenticated: true,
    };
  }
  const profile = dbGetProfile(userId);
  return { user, profile, isAuthenticated: true };
}

export function isAuthenticated(): boolean {
  return !!dbGetSession() || !!localStorage.getItem("arogyam_jwt_token");
}
