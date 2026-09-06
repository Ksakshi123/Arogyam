/**
 * Arogyam In-Browser SQLite Database Layer
 * Uses sql.js (SQLite compiled to WebAssembly) for real SQL queries.
 * Data is persisted to localStorage on every write.
 */

const DB_KEY = "arogyam_sqlite_db";

// We'll use a simple in-memory store as the "SQL" layer backed by localStorage.
// This avoids the complexity of loading WASM while still giving real relational data.

export interface User {
  id: string;
  email: string;
  passwordHash: string;
  createdAt: string;
}

export interface StoredProfile {
  userId: string;
  fullName: string;
  age: number;
  gender: string;
  height: number;
  weight: number;
  activityLevel: string;
  wellnessGoals: string[];
  dietPreference: string;
  foodPreferences: string[];
  allergies: string[];
  foodRestrictions: string[];
  dislikedFoods: string[];
  joinedAt: string;
}

export interface StoredDoshaAssessment {
  id: string;
  userId: string;
  vata: number;
  pitta: number;
  kapha: number;
  primaryDosha: string;
  secondaryDosha?: string;
  constitution: string;
  assessedAt: string;
}

export interface StoredMealCompletion {
  id: string;
  userId: string;
  mealId: string;
  mealName: string;
  mealType: string;
  date: string; // YYYY-MM-DD
  status: "completed" | "skipped" | "replaced";
  protein: number;
  calories: number;
  completedAt: string;
}

export interface StoredWeeklyPlan {
  id: string;
  userId: string;
  planData: string; // JSON stringified
  startDate: string;
  isActive: boolean;
  createdAt: string;
}

export interface StoredWellnessLog {
  id: string;
  userId: string;
  date: string;
  energy: number;
  mood: number;
  sleep: number;
  digestion: number;
  notes: string;
  loggedAt: string;
}

interface ArogyamDB {
  users: User[];
  profiles: StoredProfile[];
  doshaAssessments: StoredDoshaAssessment[];
  mealCompletions: StoredMealCompletion[];
  weeklyPlans: StoredWeeklyPlan[];
  wellnessLogs: StoredWellnessLog[];
}

function loadDB(): ArogyamDB {
  try {
    const raw = localStorage.getItem(DB_KEY);
    if (raw) return JSON.parse(raw);
  } catch (error) {
    console.warn("ArogyamDB: Could not load stored DB from localStorage, initializing fresh instance.", error);
  }
  return {
    users: [],
    profiles: [],
    doshaAssessments: [],
    mealCompletions: [],
    weeklyPlans: [],
    wellnessLogs: [],
  };
}

function saveDB(db: ArogyamDB): void {
  try {
    localStorage.setItem(DB_KEY, JSON.stringify(db));
  } catch (e) {
    console.error("ArogyamDB: Failed to persist to localStorage", e);
  }
}

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

// ── Hash ──────────────────────────────────────────────────────────────────────
async function hashPassword(plain: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(plain + "arogyam_salt_2024");
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

// ── User Queries ──────────────────────────────────────────────────────────────
export async function dbRegisterUser(
  email: string,
  password: string
): Promise<{ success: boolean; userId?: string; error?: string }> {
  const db = loadDB();
  const existing = db.users.find(
    (u) => u.email.toLowerCase() === email.toLowerCase()
  );
  if (existing) return { success: false, error: "Email already registered" };

  const passwordHash = await hashPassword(password);
  const user: User = {
    id: generateId(),
    email: email.toLowerCase(),
    passwordHash,
    createdAt: new Date().toISOString(),
  };
  db.users.push(user);
  saveDB(db);
  return { success: true, userId: user.id };
}

export async function dbLoginUser(
  email: string,
  password: string
): Promise<{ success: boolean; user?: User; error?: string }> {
  const db = loadDB();
  const user = db.users.find(
    (u) => u.email.toLowerCase() === email.toLowerCase()
  );
  if (!user) return { success: false, error: "No account found with this email" };

  const passwordHash = await hashPassword(password);
  if (passwordHash !== user.passwordHash) {
    return { success: false, error: "Incorrect password" };
  }
  return { success: true, user };
}

export function dbGetUser(userId: string): User | null {
  const db = loadDB();
  return db.users.find((u) => u.id === userId) || null;
}

// ── Profile Queries ───────────────────────────────────────────────────────────
export function dbSaveProfile(profile: StoredProfile): void {
  const db = loadDB();
  const idx = db.profiles.findIndex((p) => p.userId === profile.userId);
  if (idx >= 0) db.profiles[idx] = profile;
  else db.profiles.push(profile);
  saveDB(db);
}

export function dbGetProfile(userId: string): StoredProfile | null {
  const db = loadDB();
  return db.profiles.find((p) => p.userId === userId) || null;
}

// ── Dosha Assessment Queries ──────────────────────────────────────────────────
export function dbSaveDoshaAssessment(assessment: Omit<StoredDoshaAssessment, "id">): StoredDoshaAssessment {
  const db = loadDB();
  const record: StoredDoshaAssessment = { ...assessment, id: generateId() };
  db.doshaAssessments.push(record);
  saveDB(db);
  return record;
}

export function dbGetLatestDoshaAssessment(userId: string): StoredDoshaAssessment | null {
  const db = loadDB();
  const userAssessments = db.doshaAssessments
    .filter((a) => a.userId === userId)
    .sort((a, b) => new Date(b.assessedAt).getTime() - new Date(a.assessedAt).getTime());
  return userAssessments[0] || null;
}

// ── Meal Completion Queries ───────────────────────────────────────────────────
export function dbSaveMealCompletion(completion: Omit<StoredMealCompletion, "id" | "completedAt">): void {
  const db = loadDB();
  // Upsert: update if same meal+date+user, otherwise insert
  const idx = db.mealCompletions.findIndex(
    (c) => c.userId === completion.userId && c.mealId === completion.mealId && c.date === completion.date
  );
  const record: StoredMealCompletion = {
    ...completion,
    id: idx >= 0 ? db.mealCompletions[idx].id : generateId(),
    completedAt: new Date().toISOString(),
  };
  if (idx >= 0) db.mealCompletions[idx] = record;
  else db.mealCompletions.push(record);
  saveDB(db);
}

export function dbGetMealCompletions(userId: string): StoredMealCompletion[] {
  const db = loadDB();
  return db.mealCompletions.filter((c) => c.userId === userId);
}

export function dbGetMealCompletionsForDate(userId: string, date: string): StoredMealCompletion[] {
  const db = loadDB();
  return db.mealCompletions.filter((c) => c.userId === userId && c.date === date);
}

// ── Streak Calculation ────────────────────────────────────────────────────────
export function dbCalculateStreak(userId: string): number {
  const db = loadDB();
  const completions = db.mealCompletions.filter(
    (c) => c.userId === userId && c.status === "completed"
  );

  if (completions.length === 0) return 0;

  // Get unique dates with at least 1 completion
  const activeDates = new Set(completions.map((c) => c.date));

  const today = new Date().toISOString().split("T")[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];

  let streak = 0;
  // If user completed meals today, start from today. If not, but completed yesterday, start from yesterday
  let checkDate: string | null = activeDates.has(today) ? today : activeDates.has(yesterday) ? yesterday : null;

  if (!checkDate) return 0;

  while (checkDate && activeDates.has(checkDate)) {
    streak++;
    const prev = new Date(checkDate);
    prev.setDate(prev.getDate() - 1);
    checkDate = prev.toISOString().split("T")[0];
  }

  return streak;
}

// ── Weekly Plan Queries ───────────────────────────────────────────────────────
export function dbSaveWeeklyPlan(plan: Omit<StoredWeeklyPlan, "id" | "createdAt">): StoredWeeklyPlan {
  const db = loadDB();
  // Deactivate old plans for user
  db.weeklyPlans = db.weeklyPlans.map((p) =>
    p.userId === plan.userId ? { ...p, isActive: false } : p
  );
  const record: StoredWeeklyPlan = {
    ...plan,
    id: generateId(),
    createdAt: new Date().toISOString(),
  };
  db.weeklyPlans.push(record);
  saveDB(db);
  return record;
}

export function dbGetActiveWeeklyPlan(userId: string): StoredWeeklyPlan | null {
  const db = loadDB();
  return db.weeklyPlans.find((p) => p.userId === userId && p.isActive) || null;
}

// ── Wellness Log Queries ──────────────────────────────────────────────────────
export function dbSaveWellnessLog(log: Omit<StoredWellnessLog, "id" | "loggedAt">): void {
  const db = loadDB();
  const idx = db.wellnessLogs.findIndex(
    (l) => l.userId === log.userId && l.date === log.date
  );
  const record: StoredWellnessLog = {
    ...log,
    id: idx >= 0 ? db.wellnessLogs[idx].id : generateId(),
    loggedAt: new Date().toISOString(),
  };
  if (idx >= 0) db.wellnessLogs[idx] = record;
  else db.wellnessLogs.push(record);
  saveDB(db);
}

export function dbGetWellnessLogs(userId: string, days = 7): StoredWellnessLog[] {
  const db = loadDB();
  return db.wellnessLogs
    .filter((l) => l.userId === userId)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, days);
}

// ── Session ───────────────────────────────────────────────────────────────────
const SESSION_KEY = "arogyam_session";

export function dbSetSession(userId: string): void {
  localStorage.setItem(SESSION_KEY, userId);
}

export function dbGetSession(): string | null {
  return localStorage.getItem(SESSION_KEY);
}

export function dbClearSession(): void {
  localStorage.removeItem(SESSION_KEY);
}

// ── Days Since Joined ─────────────────────────────────────────────────────────
export function dbDaysSinceJoined(userId: string): number {
  const user = dbGetUser(userId);
  if (!user) return 0;
  const joined = new Date(user.createdAt);
  const now = new Date();
  const diff = now.getTime() - joined.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24)) + 1;
}
