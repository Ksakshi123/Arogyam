export type ActivityLevel = "Sedentary" | "Lightly Active" | "Moderately Active" | "Very Active";

export type WellnessGoal = 
  | "Weight Management"
  | "Improve Digestion"
  | "Improve Energy"
  | "Better Sleep"
  | "Healthy Lifestyle"
  | "Muscle Support"
  | "Skin Wellness"
  | "General Wellness";

export type DietPreference = 
  | "Vegetarian"
  | "Vegan"
  | "Eggetarian"
  | "Non-Vegetarian"
  | "Jain"
  | "Other";

export type FoodPreference = 
  | "Prefer Indian Food"
  | "Prefer Maharashtrian Food"
  | "Prefer South Indian Food"
  | "Prefer North Indian Food"
  | "Open to Different Cuisines";

export interface PatientProfile {
  fullName: string;
  age: number;
  gender?: string;
  height: number; // in cm
  weight: number; // in kg
  activityLevel: ActivityLevel;
  wellnessGoals: WellnessGoal[];
  dietPreference: DietPreference;
  foodPreferences: FoodPreference[];
  allergies: string[];
  foodRestrictions: string[];
  dislikedFoods: string[];
}
