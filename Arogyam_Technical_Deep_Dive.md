# Arogyam — Complete Technical Deep Dive 🌿
> *Interview Preparation Guide: Backend · Frontend · System Design · AI/ML*

---

## 📌 Table of Contents
1. [Project Overview](#1-project-overview)
2. [Tech Stack Summary](#2-tech-stack-summary)
3. [High-Level System Design (HLD)](#3-high-level-system-design-hld)
4. [Low-Level Design (LLD)](#4-low-level-design-lld)
   - [Database Schema](#41-database-schema)
   - [Backend Architecture](#42-backend-architecture)
   - [Frontend Architecture](#43-frontend-architecture)
5. [Backend — How It Works (In Simple Words)](#5-backend--how-it-works)
6. [Frontend — How It Works (In Simple Words)](#6-frontend--how-it-works)
7. [AI/ML Module Deep Dive](#7-aiml-module-deep-dive)
8. [Complete API Reference](#8-complete-api-reference)
9. [Key Data Flows (Request Lifecycle)](#9-key-data-flows-request-lifecycle)
10. [Interview Questions & Answers](#10-interview-questions--answers)

---

## 1. Project Overview

**Arogyam** is a full-stack **Ayurvedic Wellness Platform** that helps patients:
- Determine their **Ayurvedic Dosha constitution** (Vata, Pitta, Kapha) through a quiz
- Receive a **personalized AI-generated 7-day Indian meal plan** based on their Dosha, allergies, and food preferences
- Chat with **Ayu** — an AI wellness assistant powered by Grok/xAI
- Track **nutrition analytics** and meal completion progress
- Get recommendations from a **Doctor Dashboard**

### Core Problem It Solves
Traditional diet apps are generic. Arogyam combines **ancient Ayurvedic wisdom** with **modern AI (LLMs + ML)** to deliver hyper-personalized nutrition that respects Indian regional food culture, dietary restrictions (Jain, Vegan, Vegetarian, Non-Veg), and allergies.

---

## 2. Tech Stack Summary

| Layer | Technology | Why Used |
|---|---|---|
| **Frontend** | React 18 + TypeScript + Vite | Fast SPA with type safety |
| **UI Library** | shadcn/ui + Radix UI + TailwindCSS | Accessible, headless component system |
| **State Management** | **Zustand** (with `persist` middleware) | Lightweight global state, persists to localStorage |
| **Server State** | **TanStack React Query** | Caching, background refetch, loading states |
| **Routing** | React Router DOM v6 | Client-side routing with protected pages |
| **Charts** | Recharts | Nutrition analytics visualizations |
| **Animations** | Framer Motion | Smooth UI transitions |
| **Local DB** | sql.js (SQLite in browser) | Offline fallback data store |
| **Backend** | **FastAPI** (Python 3.11+) | Async, auto-generates OpenAPI docs |
| **ORM** | **SQLAlchemy 2.0** | Database modeling & queries |
| **Database** | **PostgreSQL** | Primary relational store |
| **Auth** | **JWT (python-jose) + SHA-256/bcrypt** | Stateless authentication |
| **AI Chatbot** | **Grok (xAI) API** | "Ayu" wellness chatbot |
| **AI Diet Gen** | **Groq API** (Llama 3.3 70B / GPT-OSS 120B) | 7-day meal plan generation |
| **ML** | **scikit-learn RandomForest** (+ heuristic fallback) | Dosha type prediction |
| **HTTP Client** | **httpx** (async Python) | Calling external AI APIs |
| **Validation** | Pydantic v2 | Request/response schema validation |
| **Migrations** | Alembic | PostgreSQL schema migrations |

---

## 3. High-Level System Design (HLD)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           CLIENT (Browser)                                  │
│  ┌──────────────────────────────────────────────────────────────────────┐   │
│  │  React 18 + Vite SPA                                                 │   │
│  │  ┌────────────┐  ┌──────────────┐  ┌──────────────┐  ┌───────────┐  │   │
│  │  │  Zustand   │  │ TanStack     │  │  React       │  │  sql.js   │  │   │
│  │  │  Store     │  │ React Query  │  │  Router v6   │  │  SQLite   │  │   │
│  │  │(persisted) │  │  (cache)     │  │  (routing)   │  │(fallback) │  │   │
│  │  └────────────┘  └──────────────┘  └──────────────┘  └───────────┘  │   │
│  └──────────────────────────────────────────────────────────────────────┘   │
└──────────────────────────────┬──────────────────────────────────────────────┘
                               │ HTTPS REST API (JSON)
                               │ Bearer JWT Token in every request
                               ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                    FASTAPI BACKEND  (Port 8000)                              │
│  ┌──────────────────────────────────────────────────────────────────────┐   │
│  │  main.py → CORSMiddleware → Router Layer                             │   │
│  │  ┌─────────┐ ┌──────────┐ ┌────────┐ ┌──────┐ ┌──────┐ ┌────────┐  │   │
│  │  │  /auth  │ │/patients │ │/dosha  │ │/diet │ │/chat │ │/nutri..│  │   │
│  │  └────┬────┘ └────┬─────┘ └───┬────┘ └──┬───┘ └──┬───┘ └────────┘  │   │
│  │       │            │            │          │         │                  │   │
│  │  ┌────▼────────────▼────────────▼──────────▼─────────▼─────────────┐ │   │
│  │  │              SERVICE LAYER                                        │ │   │
│  │  │  DoshaService  │  DietService  │  GroqDietService  │  GrokService│ │   │
│  │  │  (scoring)     │  (rule-based) │  (AI generation)  │  (Ayu chat) │ │   │
│  │  └────────────────┴──────────────┴───────────────────┴─────────────┘ │   │
│  │                          │                │                            │   │
│  │                          ▼                ▼                            │   │
│  │                    SQLAlchemy ORM    httpx async calls                 │   │
│  └──────────────────────────────────────────────────────────────────────┘   │
└──────────┬────────────────────────────────────────────────────────┬──────────┘
           │ SQLAlchemy + psycopg2/psycopg3                          │ httpx
           ▼                                                          ▼
┌──────────────────────┐              ┌───────────────────────────────────────┐
│    PostgreSQL DB      │              │       EXTERNAL AI APIs                │
│  ┌────────────────┐  │              │  ┌─────────────────────────────────┐  │
│  │ users          │  │              │  │  Groq API (api.groq.com)        │  │
│  │ patient_profiles│  │              │  │  Model: llama-3.3-70b-versatile │  │
│  │ dosha_assessments│  │              │  │  Diet Plan Generation           │  │
│  │ dosha_results  │  │              │  │  Dual API Key Failover           │  │
│  │ weekly_diet_plans│  │              │  └─────────────────────────────────┘  │
│  │ meals          │  │              │  ┌─────────────────────────────────┐  │
│  │ meal_completions│  │              │  │  xAI / Grok API (api.x.ai/v1)  │  │
│  │ chat_messages  │  │              │  │  Model: grok-4.6                │  │
│  └────────────────┘  │              │  │  "Ayu" Wellness Chatbot         │  │
└──────────────────────┘              │  └─────────────────────────────────┘  │
                                      └───────────────────────────────────────┘
                                               ▲
                                               │ (Standalone Python FastAPI)
                                      ┌────────────────────┐
                                      │  AIML Service       │
                                      │  (Port 8001)        │
                                      │  /dosha/predict     │
                                      │  RandomForest +     │
                                      │  Heuristic engine   │
                                      └────────────────────┘
```

---

## 4. Low-Level Design (LLD)

### 4.1 Database Schema

> The database is **PostgreSQL** managed by **SQLAlchemy ORM**. Tables auto-created via `Base.metadata.create_all()` on server startup.

```
┌──────────────────────┐          ┌──────────────────────────────────────┐
│       users          │          │          patient_profiles            │
├──────────────────────┤          ├──────────────────────────────────────┤
│ id (PK, Integer)     │◄────────►│ id (PK, Integer)                     │
│ email (unique)       │  1:1     │ user_id (FK → users.id, unique)      │
│ password_hash        │          │ full_name (String)                   │
│ role ("patient"|     │          │ age, gender, height_cm, weight_kg    │
│       "doctor")      │          │ activity_level (String)              │
│ is_active (Boolean)  │          │ wellness_goals (JSON array)          │
│ created_at           │          │ diet_preference (String)             │
└──────────────────────┘          │ food_preferences (JSON array)        │
         │                        │ allergies (JSON array)  ← CRITICAL   │
         │                        │ food_restrictions (JSON array)       │
         │                        │ disliked_foods (JSON array)          │
         │                        │ onboarding_completed (Boolean)       │
         │                        └──────────────────────────────────────┘
         │
         │  1:Many                 ┌─────────────────────────────────────┐
         ├────────────────────────►│        dosha_assessments            │
         │                        ├─────────────────────────────────────┤
         │                        │ id (PK)                             │
         │                        │ patient_id (FK → patient_profiles)  │
         │                        │ answers (JSON) {q1: "a", q2: "b"}   │
         │                        │ assessment_date (DateTime)          │
         │                        └─────────────────────────────────────┘
         │                                       │
         │                                       │ 1:1
         │                                       ▼
         │                        ┌─────────────────────────────────────┐
         │                        │          dosha_results               │
         │                        ├─────────────────────────────────────┤
         │                        │ id (PK)                             │
         │                        │ patient_id (FK)                     │
         │                        │ assessment_id (FK)                  │
         │                        │ vata_percentage (Float)             │
         │                        │ pitta_percentage (Float)            │
         │                        │ kapha_percentage (Float)            │
         │                        │ primary_dosha (String)              │
         │                        │ secondary_dosha (String, nullable)  │
         │                        │ constitution (String)               │
         │                        │ created_at (DateTime)               │
         │                        └─────────────────────────────────────┘
         │
         │  1:Many                 ┌─────────────────────────────────────┐
         ├────────────────────────►│        weekly_diet_plans            │
         │                        ├─────────────────────────────────────┤
         │                        │ id (PK)                             │
         │                        │ patient_id (FK → patient_profiles)  │
         │                        │ week_start_date (String)            │
         │                        │ status ("active"|"archived")        │
         │                        │ compatibility_score (JSON)          │
         │                        │   {dosha:95, preferences:98,        │
         │                        │    allergies:100, overall:96}       │
         │                        │ created_at (DateTime)               │
         │                        └─────────────────────────────────────┘
         │                                       │
         │                                       │ 1:Many (21 meals per plan)
         │                                       ▼
         │                        ┌─────────────────────────────────────┐
         │                        │             meals                    │
         │                        ├─────────────────────────────────────┤
         │                        │ id (PK, String composite key)       │
         │                        │ diet_plan_id (FK)                   │
         │                        │ day_of_week (String)                │
         │                        │ date (String, YYYY-MM-DD)           │
         │                        │ meal_type (breakfast/lunch/dinner)  │
         │                        │ meal_name (String)                  │
         │                        │ description (String)                │
         │                        │ ingredients (JSON array)            │
         │                        │ calories, protein, carbohydrates,   │
         │                        │   fats (Float each)                 │
         │                        │ preparation_time (Integer, minutes) │
         │                        │ tags (JSON array)                   │
         │                        │ suitable_doshas (JSON array)        │
         │                        │ is_replaced (Boolean)               │
         │                        │ explanation (String)                │
         │                        │ recipe (JSON {steps, tips})         │
         │                        └─────────────────────────────────────┘
         │
         │  1:Many                 ┌─────────────────────────────────────┐
         └────────────────────────►│          chat_messages              │
                                   ├─────────────────────────────────────┤
                                   │ id (PK)                             │
                                   │ patient_id (FK)                     │
                                   │ role ("user" | "assistant")         │
                                   │ message (Text)                      │
                                   │ created_at (DateTime)               │
                                   └─────────────────────────────────────┘
```

**Key Design Decisions:**
- **JSON columns** are used for flexible arrays (allergies, ingredients, tags) rather than separate join tables — optimizes read performance for single-patient queries
- **Composite Meal ID**: `"{plan_id}-{meal_type}-{date}"` ensures uniqueness without auto-increment
- **Active/Archived status** for diet plans: only one plan is "active" at a time; old ones are archived, not deleted (audit trail)
- **One-to-One** between `users` and `patient_profiles` — clean separation of auth from health data

---

### 4.2 Backend Architecture

```
backend/
├── app/
│   ├── main.py           ← FastAPI app + CORS + router registration
│   ├── config.py         ← Pydantic Settings (env vars, API keys)
│   ├── database.py       ← SQLAlchemy engine + SessionLocal + get_db()
│   ├── dependencies.py   ← JWT decode → get_current_user()
│   ├── auth.py           ← password hashing utils (legacy layer)
│   │
│   ├── models/           ← SQLAlchemy ORM table definitions
│   │   ├── user.py       ← User table
│   │   ├── patient.py    ← PatientProfile table
│   │   ├── dosha.py      ← DoshaAssessment + DoshaResult tables
│   │   ├── diet.py       ← WeeklyDietPlan table
│   │   ├── meal.py       ← Meal table (21 meals per plan)
│   │   ├── nutrition.py  ← MealCompletion tracking
│   │   └── chat.py       ← ChatMessage table
│   │
│   ├── schemas/          ← Pydantic request/response schemas (validation)
│   │   ├── user.py       ← UserCreate, UserLogin, Token, UserResponse
│   │   ├── patient.py    ← PatientCreate, PatientResponse
│   │   ├── dosha.py      ← DoshaAssessmentCreate, DoshaResultResponse
│   │   ├── diet.py       ← WeeklyDietPlanResponse, DietGenerateRequest
│   │   ├── meal.py       ← MealResponse, MealUpdate
│   │   ├── nutrition.py  ← NutritionSummary schemas
│   │   └── chat.py       ← ChatRequest, ChatAIResponse, MealReplacementOption
│   │
│   ├── routers/          ← HTTP endpoint definitions (controllers)
│   │   ├── auth.py       ← POST /register, POST /login, GET /me
│   │   ├── patient.py    ← CRUD for patient profiles
│   │   ├── dosha.py      ← POST /assessment, GET /result/:id, GET /history/:id
│   │   ├── diet.py       ← POST /generate, GET /current/:id, PUT /meal/:id
│   │   ├── nutrition.py  ← GET/POST meal completions + nutrition summaries
│   │   ├── chat.py       ← POST /chat, GET /history
│   │   ├── health.py     ← GET /health (health check endpoint)
│   │   └── database.py   ← GET /database/test (DB connectivity check)
│   │
│   └── services/         ← Business logic layer
│       ├── dosha_service.py         ← Deterministic dosha scoring
│       ├── dosha_engine.py          ← Alternative heuristic engine
│       ├── diet_service.py          ← Rule-based fallback meal generator
│       ├── diet_generator.py        ← Dosha-specific meal templates
│       ├── groq_diet_service.py     ← Groq LLM meal plan generation (PRIMARY)
│       ├── grok_service.py          ← Grok/xAI "Ayu" chatbot service (PRIMARY)
│       ├── chatbot_service.py       ← Legacy chatbot wrapper
│       ├── allergy_validator.py     ← Post-generation allergy safety filter
│       ├── patient_context_service.py ← Builds full patient context for AI
│       └── nutrition_service.py    ← Nutrition calculations & summaries
```

---

### 4.3 Frontend Architecture

```
src/
├── main.tsx              ← ReactDOM.render() entry point
├── App.tsx               ← Root: QueryClientProvider + BrowserRouter + Routes
│
├── pages/                ← Full-page route components
│   ├── Index.tsx         ← Landing / Home page
│   ├── PatientLogin.tsx  ← Login form + JWT storage
│   ├── PatientSignup.tsx ← Registration + automatic profile creation
│   ├── PatientOnboarding.tsx ← Multi-step health data collection
│   ├── DoshaAssessment.tsx   ← 15-question Ayurvedic quiz
│   ├── DoshaResult.tsx       ← Dosha result display + pie chart
│   ├── WeeklyMealPlan.tsx    ← 7-day meal plan view + swap meals
│   ├── NutritionAnalytics.tsx ← Charts: calories, macros, habits
│   ├── PatientDashboard.tsx  ← Main patient dashboard
│   ├── DoctorDashboard.tsx   ← Doctor's patient overview
│   ├── Progress.tsx          ← Progress tracking
│   ├── MealPlans.tsx         ← Historical meal plans
│   ├── Profile.tsx           ← Edit profile
│   ├── FindDiet.tsx          ← Search/discover diets
│   └── Demo.tsx              ← Demo mode (no auth needed)
│
├── components/
│   ├── patient/
│   │   └── WellnessChatbot.tsx  ← Floating Ayu chatbot widget (global)
│   ├── landing/          ← Landing page sections
│   └── ui/               ← shadcn/ui primitive components
│
├── store/                ← Zustand global state
│   ├── patientStore.ts   ← userId, profile, doshaResult (persisted to localStorage)
│   ├── dietStore.ts      ← weeklyPlan, currentDayIndex, meal completions
│   └── chatbotStore.ts   ← chat open/close toggle
│
├── services/             ← API call layer (axios-like fetch wrappers)
│   ├── api.ts            ← Base axios instance with JWT interceptor
│   ├── patientApi.ts     ← CRUD calls to /api/patients
│   ├── doshaApi.ts       ← Dosha assessment + result fetch
│   ├── dietApi.ts        ← Diet plan generation + meal updates
│   ├── nutritionApi.ts   ← Nutrition tracking APIs
│   ├── chatApi.ts        ← Chat endpoint wrapper
│   ├── chatbotService.ts ← Chatbot message send/receive
│   ├── dietPlanService.ts ← Local plan manipulation helpers
│   └── doshaService.ts   ← Frontend-side dosha calculation mirror
│
├── lib/
│   └── db.ts             ← sql.js SQLite local database (offline fallback)
│
└── types/                ← TypeScript type definitions
    ├── patient.ts
    ├── dosha.ts
    └── diet.ts
```

---

## 5. Backend — How It Works

### 5.1 Application Startup

When you run `uvicorn app.main:app`, here's what happens:

1. **`database.py` is imported** → SQLAlchemy creates an engine connected to PostgreSQL using the `DATABASE_URL` from `.env`. It immediately fires `SELECT 1` to verify the connection.

2. **`main.py` runs the `lifespan` context manager** → Calls `Base.metadata.create_all(bind=engine)`. This inspects all imported SQLAlchemy models and **creates any missing tables** in PostgreSQL automatically (schema sync on startup).

3. **CORS Middleware** is added to allow requests from any HTTP/HTTPS origin (configured broadly for development). In production, this should be restricted.

4. **Routers are registered** with prefixes like `/api/auth`, `/api/patients`, `/api/diet`, etc.

---

### 5.2 Authentication Flow (JWT)

```
User → POST /api/auth/register
  Body: { email, password, name, role }
        │
        ▼
  1. Normalize email (lowercase + strip whitespace)
  2. Check if email already exists in DB → 400 if duplicate
  3. Hash password: SHA-256(password + "arogyam_salt_2024")
  4. Create User row in DB
  5. Auto-create empty PatientProfile row (if role="patient")
  6. Generate JWT: jwt.encode({sub: email, user_id: id, role: role}, SECRET_KEY, HS256)
     Expiry: 24 hours (1440 minutes)
  7. Return: { access_token: "...", token_type: "bearer", user: {...} }

User → POST /api/auth/login
  Same flow but:
  1. Lookup user by email
  2. verify_password() tries SHA-256 → direct equality → bcrypt (fallback chain)
  3. Return JWT on success, 401 on failure

Protected Routes → Any router with Depends(get_current_user)
  1. Extract "Authorization: Bearer <token>" header
  2. Decode JWT → get email from "sub" claim
  3. Lookup user in DB → return User object
  4. If invalid/expired → 401 Unauthorized
```

> **Interview Key Point:** The `get_current_user_optional` dependency returns `None` instead of raising 401 — used for routes that work both authenticated and as guest (like the Ayu chatbot in demo mode).

---

### 5.3 Dosha Assessment Flow

```
User answers 15 questions in frontend (DoshaAssessment.tsx)
        │
        ▼
POST /api/dosha/assessment
  Body: { patient_id: "5", answers: { "q1": "a", "q2": "o2", ... } }
        │
        ▼
  DoshaService.calculate_dosha(answers):
    - Maps each answer to weights: {"vata": 3, "pitta": 0, "kapha": 0}
    - "o1"/"a"/"v" = Vata; "o2"/"b"/"p" = Pitta; "o3"/"c"/"k" = Kapha
    - Sums scores → calculates % = (score/total)*100
    - If diff between top-2 doshas ≤ 15% → dual constitution (e.g. "Vata-Pitta")
    - If diff > 15% → single dominant (e.g. "Pitta Dominant")
        │
        ▼
  Saves: DoshaAssessment (raw answers) + DoshaResult (calculated %)
  Returns: { vata_percentage, pitta_percentage, kapha_percentage,
             primary_dosha, secondary_dosha, constitution }
```

---

### 5.4 Diet Plan Generation Flow (Most Complex)

```
POST /api/diet/generate
  Body: { patient_id: "5" }
        │
        ▼
  1. Fetch PatientProfile from DB (all health data, allergies, preferences)
  2. Fetch latest DoshaResult from DB
  3. Archive any existing "active" plans → set status = "archived"

  4. Try PRIMARY path: GroqDietService.generate_meal_plan()
     │
     ├─ Build prompt with:
     │    - Patient age, weight, height, activity level
     │    - Diet type (Jain/Vegan/Vegetarian/Non-Veg) → dietary_rules string
     │    - Regional cuisine preferences → regional_guidelines string
     │    - Wellness goals, allergies (CRITICAL - NEVER include), disliked foods
     │    - Dosha type (Vata/Pitta/Kapha)
     │
     ├─ Call Groq API (GROQ_API_KEY_DIET_1 first, failover to DIET_2)
     │    - Model: llama-3.3-70b-versatile or openai/gpt-oss-120b
     │    - response_format: { type: "json_object" } ← forces pure JSON output
     │    - temperature: 0.35, max_tokens: 5200
     │
     ├─ Parse JSON response → validate 7 days × 3 meals = 21 meals
     │
     └─ _sanitize_meal_plan():
          - Scan every ingredient against forbidden lists per diet type
          - Remove forbidden ingredients, replace empty lists with safe defaults
          - Fix single-item meal names (e.g. "Rice" → "2 Phulkas & Rice with Dal")

  5. If Groq fails → FALLBACK: DietService.generate_weekly_plan()
     - Rule-based generator using dosha-specific meal templates
     - No AI involved, purely deterministic Python logic

  6. Save WeeklyDietPlan to DB
  7. Save 21 Meal rows to DB (one per meal slot per day)
  8. Return formatted WeeklyDietPlanResponse
```

---

### 5.5 Ayu Chatbot Flow

```
POST /api/chat
  Body: { message: "How much protein am I getting today?" }
  Header: Authorization: Bearer <jwt>
        │
        ▼
  1. Resolve patient: from JWT user → PatientProfile
  2. Save user message to chat_messages table
  3. build_patient_context(db, patient_id):
     - Patient full profile (name, age, allergies, dosha, etc.)
     - Today's planned meals from active diet plan
     - Today's consumed meals (from meal_completions)
     - Calculated nutrition (protein, calories, etc.)
     - Last 8 chat messages (conversation memory)

  4. ask_ayu(user_message, context):
     ├─ If XAI_API_KEY configured:
     │    - Build system prompt with all patient context (structured text)
     │    - Append last 8 messages as conversation history
     │    - POST to https://api.x.ai/v1/chat/completions
     │    - Model: grok-4.6, temperature: 0.3, max_tokens: 1200
     │    - Response MUST be JSON with schema:
     │        { intent, message, target, replacement_options, requires_confirmation }
     │    - Clean markdown fences if present (```json ... ```)
     │    - Run allergy_validator.filter_safe_replacements() on any meal suggestions
     │
     └─ If XAI_API_KEY NOT configured (fallback):
          - _generate_fallback_response() uses keyword matching:
            "protein" → calculate & explain protein intake from context
            "dosha" → explain constitution from context
            "replace/swap" → suggest 3 hardcoded safe meal alternatives
            "dairy/vegan/avoid" → propose weekly plan changes
            else → general greeting with patient name

  5. Save AI response to chat_messages table
  6. Return ChatAIResponse
```

---

### 5.6 Session & Database Pattern

```python
# Every request that touches the DB uses this dependency injection pattern:
def get_db():
    db = SessionLocal()     # Create new SQLAlchemy session
    try:
        yield db            # Provide to route handler
    finally:
        db.close()          # Always close (even on exception)

# Route handler:
@router.get("/something")
def my_route(db: Session = Depends(get_db)):
    result = db.query(User).filter(User.email == "x").first()
    return result
```

> **Why this pattern?** It's the **Repository pattern** combined with **Dependency Injection**. Each HTTP request gets its own database session, isolated from other requests. Sessions are never shared.

---

## 6. Frontend — How It Works

### 6.1 Application Bootstrap

```
index.html → loads main.tsx → ReactDOM.createRoot().render(<App />)

App.tsx wraps everything in:
  <QueryClientProvider>   ← TanStack React Query cache
    <TooltipProvider>     ← Radix UI tooltips
      <Toaster />         ← shadcn toast notifications
      <BrowserRouter>
        <WellnessChatbot />  ← Floating chatbot (always rendered, global)
        <Routes>
          / → Index (landing page)
          /patient/login → PatientLogin
          /patient/dashboard → PatientDashboard
          ... etc.
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
```

---

### 6.2 State Management with Zustand

Arogyam uses **Zustand** for global state. Think of it as a simpler Redux.

**`patientStore.ts`** — the most important store:
```typescript
const usePatientStore = create(persist(
  (set, get) => ({
    userId: null,         // Logged-in user's ID
    profile: null,        // Full PatientProfile object
    doshaResult: null,    // Dosha assessment result
    
    // Actions:
    setProfile(profile) {
      set({ profile });
      // 1. Saves to PostgreSQL via patientApi
      // 2. Mirrors to SQLite fallback via dbSaveProfile()
    },
    
    loadFromDB(userId) {
      // 1. Tries PostgreSQL (patientApi.getPatient)
      // 2. Falls back to SQLite if backend offline
    },
    
    logout() {
      // Clears JWT, localStorage, and all state
    }
  }),
  { name: "arogyam-patient-storage" }  // persists to localStorage
))
```

**Why `persist`?** So if you refresh the browser, your profile/dosha data is still there without needing to re-fetch from the backend.

---

### 6.3 API Calls with TanStack React Query

```typescript
// Example from WeeklyMealPlan.tsx:
const { data: mealPlan, isLoading } = useQuery({
  queryKey: ['diet', userId],
  queryFn: () => dietApi.getCurrentPlan(userId),
  staleTime: 5 * 60 * 1000,  // Cache for 5 minutes
});
```

**Why React Query?**
- **Automatic caching** — same data requested twice = one API call
- **Background refetch** — stale data gets refreshed automatically
- **Loading/error states** — built in, no manual `isLoading` booleans
- **Optimistic updates** — UI updates instantly, API syncs in background

---

### 6.4 Dual Storage Strategy (PostgreSQL + SQLite)

This is a key architectural decision. The frontend uses **two storage layers**:

| Scenario | Storage Used |
|---|---|
| Backend online + JWT valid | PostgreSQL (via FastAPI) |
| Backend offline / network error | Browser SQLite (sql.js) |
| Between sessions (page refresh) | Zustand + localStorage |

```
When setProfile() is called:
  1. Update Zustand state immediately (instant UI update)
  2. POST /api/patients → save to PostgreSQL (async)
  3. dbSaveProfile() → save to SQLite in browser (sync fallback)

When loadFromDB() is called:
  1. Try GET /api/patients/:id → PostgreSQL
  2. If fails → dbGetProfile(userId) → SQLite
```

This is called a **Cache-Aside** pattern — the app manages its own cache, and populates it from the primary source or falls back to secondary.

---

### 6.5 Authentication in Frontend

```
PatientLogin.tsx:
  1. User submits email + password
  2. POST /api/auth/login
  3. Store JWT token: localStorage.setItem("arogyam_jwt_token", token)
  4. Store user info in Zustand patientStore
  5. Navigate to /patient/dashboard

api.ts (Axios/fetch base):
  - Every request adds: headers["Authorization"] = "Bearer " + localStorage.token
  - If 401 received → clear token + redirect to /login

PatientDashboard.tsx:
  - On mount: useEffect → patientStore.loadFromDB(userId)
  - Loads profile + dosha from backend → populates UI
```

---

## 7. AI/ML Module Deep Dive

### 7.1 Dosha Predictor (aiml/dosha_predictor/)

There are **two inference modes**:

**Mode 1: Trained RandomForest Model**
```python
# If dosha_model.joblib exists (pre-trained):
model = joblib.load("dosha_model.joblib")
probs = model.predict_proba(input_df)[0]
# Returns probability array → [Vata: 0.45, Pitta: 0.35, Kapha: 0.20]
```
- **Algorithm**: `RandomForestClassifier` from scikit-learn
- **Training data**: `sample_data.csv` (feature rows of body type, digestion, sleep, etc.)
- **Output**: Probability distribution across 3 classes (Vata/Pitta/Kapha)

**Mode 2: Heuristic Probabilistic Engine (fallback)**
```python
# If model file not found:
for val in features.values():
    if "thin", "dry", "anxious" in val → vata_pts += 2
    if "warm", "sharp", "intense" in val → pitta_pts += 2
    if "heavy", "oily", "slow" in val → kapha_pts += 2
# Convert to % → return primary/secondary
```
This is keyword-based scoring — works without any training.

---

### 7.2 Groq LLM Diet Generation (Key AI Feature)

```
Input: Patient profile (20+ parameters)
        │
        ▼
_build_dietary_rules(diet_preference):
  → Generates strict zero-tolerance rules string
  → Jain: forbids onion/garlic/potato/carrot/ginger + all meat
  → Vegan: forbids all dairy + meat
  → Vegetarian: forbids meat/fish/eggs only
        │
        ▼
_build_regional_guidelines(food_preferences):
  → If "Maharashtrian" → Jowar Bhakri + Pithla thali template
  → If "South Indian" → Idli/Dosa/Rasam template
  → If "North Indian" → Paratha/Dal Makhani template
  → If "Gujarati" → Thepla/Dhokla template
        │
        ▼
Groq API Call:
  model: llama-3.3-70b-versatile
  response_format: { type: "json_object" }  ← forces JSON only
  temperature: 0.35 (low = more consistent)
  max_tokens: 5200
  reasoning_effort: "low" (faster response)
        │
        ▼
Dual Key Failover:
  → Try GROQ_API_KEY_DIET_1
  → If 429 (rate limit) → wait 6s → retry
  → If still fails → try GROQ_API_KEY_DIET_2
  → If both fail → return None → use rule-based fallback
        │
        ▼
_sanitize_meal_plan():
  → Scan every ingredient against forbidden lists (regex word boundary check)
  → Remove forbidden items from ingredient arrays
  → Fix incomplete meal names (single-dish names → complete thali description)
  → Ensures no empty ingredient arrays after sanitization
```

**Why Dual Keys?** Groq has per-minute token limits. Two keys = double throughput, and automatic failover means no downtime for users.

---

### 7.3 Grok "Ayu" Chatbot Architecture

```
Intent Classification (AI-driven):
  "replace_meal"      → provide 2-3 alternative meals
  "update_weekly_plan" → propose changes to full 7-day plan
  "protein_question"  → calculate and explain protein intake
  "dosha_question"    → explain constitution + breakdown
  "nutrition_question" → nutrition analysis
  "general_question"  → general wellness guidance

Allergy Safety Layer (deterministic):
  → AFTER AI generates meal replacements
  → filter_safe_replacements() removes any option containing allergen
  → This is a hard rule — cannot be overridden by AI hallucination

Context Window Management:
  → Last 8 messages appended as conversation history
  → Patient's full DB context injected as system prompt
  → Temperature: 0.3 (very consistent, professional tone)
```

---

## 8. Complete API Reference

### Authentication (`/api/auth`)
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| POST | `/api/auth/register` | Register new user + create patient profile | No |
| POST | `/api/auth/login` | Login + get JWT token | No |
| GET | `/api/auth/me` | Get current user info | Yes |

### Patient Profile (`/api/patients`)
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| POST | `/api/patients` | Create/upsert patient profile | No (patient_id in body) |
| GET | `/api/patients/:id` | Get patient profile | No |
| PUT | `/api/patients/:id` | Update patient profile | No |

### Dosha Assessment (`/api/dosha`)
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/dosha/assessment` | Submit quiz answers → get dosha result |
| GET | `/api/dosha/result/:patient_id` | Get latest dosha result |
| GET | `/api/dosha/history/:patient_id` | Get all past dosha assessments |

### Diet Plan (`/api/diet`)
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/diet/generate` | Generate new 7-day AI meal plan |
| GET | `/api/diet/current/:patient_id` | Get active meal plan (auto-generates if none) |
| PUT | `/api/diet/meal/:meal_id` | Update/replace a single meal |
| POST | `/api/diet/regenerate` | Regenerate plan (archives current) |

### Nutrition (`/api/nutrition`)
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/nutrition/complete` | Log a meal as completed/skipped |
| GET | `/api/nutrition/summary/:patient_id` | Get daily/weekly nutrition summary |

### Chat (`/api/chat`)
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/chat` | Send message to Ayu AI chatbot |
| GET | `/api/chat/history` | Get conversation history (JWT auth) |
| GET | `/api/chat/history/:patient_id` | Get history by patient ID |

### Health (`/api`)
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/health` | Service health check |
| GET | `/api/database/test` | PostgreSQL connection test |

---

## 9. Key Data Flows (Request Lifecycle)

### Flow 1: First-Time User Registration → Onboarding → Diet Plan

```
1. User fills signup form → POST /api/auth/register
   ← JWT token + user info returned

2. User fills onboarding (age, weight, allergies, etc.)
   → POST /api/patients (upsert profile to PostgreSQL)
   → Zustand patientStore.setProfile() called
   → Also mirrors to SQLite via dbSaveProfile()

3. User takes 15-question Dosha quiz
   → POST /api/dosha/assessment
   ← { vata: 45%, pitta: 35%, kapha: 20%, primary: "Vata", constitution: "Vata-Pitta" }
   → Saved in doshaResult Zustand state

4. User navigates to Meal Plan page
   → GET /api/diet/current/:patient_id
   → If no active plan: auto-calls generate_weekly_plan()
      → Calls Groq LLM with patient context
      → Saves 1 WeeklyDietPlan + 21 Meal rows to PostgreSQL
   ← Returns full 7-day meal plan JSON

5. Frontend renders WeeklyMealPlan.tsx
   → 7 day tabs, each with breakfast/lunch/dinner cards
   → Ingredients, calories, macros, recipe steps shown
```

### Flow 2: Ayu Chatbot Meal Replacement

```
User types: "Can you replace my lunch? I don't have paneer today"
        │
        ▼
1. POST /api/chat { message: "Can you replace my lunch?" }
   + Authorization: Bearer <jwt>
        │
        ▼
2. Backend resolves patient from JWT
3. Saves user message to chat_messages
4. build_patient_context():
   - Patient profile (name: Aarav, allergies: [], dosha: Vata-Pitta)
   - Today's lunch: "Palak Paneer + Rice + Roti" (from active plan)
   - Nutrition: planned_protein = 25g today
        │
        ▼
5. ask_ayu(message, context) → POST api.x.ai/v1/chat/completions
   System prompt contains full patient context
   Grok response:
   {
     "intent": "replace_meal",
     "target": "lunch",
     "message": "Here are 3 alternatives for your Vata-Pitta dosha:",
     "replacement_options": [
       { meal_name: "Moong Dal Khichdi", calories: 380, protein: 18, ... },
       { meal_name: "Quinoa Upma", calories: 350, protein: 20, ... }
     ],
     "requires_confirmation": true
   }
        │
        ▼
6. filter_safe_replacements() verifies no allergens in options
7. Save AI response to chat_messages
8. Return to frontend

9. Frontend shows replacement cards → user clicks "Apply"
10. PUT /api/diet/meal/:meal_id { meal_name: "Moong Dal Khichdi", ... }
    → Updates meal record in DB, sets is_replaced = true
```

---

## 10. Interview Questions & Answers

### Architecture & Design

**Q: Why did you use FastAPI over Django or Flask?**
> FastAPI is built on Starlette/ASGI and supports **async/await** natively — critical for our chatbot endpoint that makes external HTTP calls to Grok AI. It also auto-generates **OpenAPI (Swagger) docs** at `/docs`, reducing API documentation effort. Django would be overkill for a REST API; Flask lacks built-in validation. FastAPI's Pydantic integration gives us free input validation.

**Q: How do you handle the case when the AI API is down?**
> We use a **graceful degradation / fallback strategy** at two levels:
> - **Groq Diet API**: Dual API key failover. If Key 1 is rate-limited (HTTP 429), wait 6 seconds and retry. If still fails, try Key 2. If both fail → fall back to `DietService` which generates meals from **deterministic rule-based Python templates** (no AI needed).
> - **Grok Chatbot**: If `XAI_API_KEY` is not configured, `_generate_fallback_response()` uses keyword matching on the user's message + patient context data already loaded from DB to give a meaningful response.

**Q: Explain your JWT authentication flow.**
> 1. On login, server creates JWT: `{sub: email, user_id: id, role: role}` signed with HS256 + SECRET_KEY, expiry 24 hours.
> 2. Frontend stores it in `localStorage` as `arogyam_jwt_token`.
> 3. Every API call adds `Authorization: Bearer <token>` header.
> 4. `get_current_user()` FastAPI dependency decodes it → looks up user in DB → injects into route handler.
> 5. `get_current_user_optional()` returns `None` instead of 401 for guest-accessible endpoints.

**Q: Why use both PostgreSQL AND SQLite (sql.js) in the same app?**
> This is a **resilience pattern**. The backend PostgreSQL is the primary source of truth. The browser-embedded SQLite (via sql.js WebAssembly) acts as an **offline fallback** — if the backend server is unreachable (network issue, server down), the app can still display the user's last loaded profile, dosha result, and diet data without crashing. This is similar to a Progressive Web App (PWA) offline strategy.

**Q: How does allergy safety work end-to-end?**
> Allergies are enforced at **two independent layers** — defense in depth:
> 1. **Groq LLM Prompt Layer**: The AI system prompt explicitly states allergies as `STRICT SAFETY - NEVER INCLUDE` constraints.
> 2. **Post-generation `_sanitize_meal_plan()`**: After AI responds, a Python function scans EVERY ingredient of EVERY meal against the patient's allergy list using **regex word boundary matching** and removes any flagged items.
> 3. **Chatbot `filter_safe_replacements()`**: When Ayu suggests meal replacements, another filter removes any option with allergens in its ingredient list.
> The double-layer ensures that even if the LLM hallucinates and includes a forbidden ingredient, the Python sanitizer catches it.

### Data & Database

**Q: Why store allergies, ingredients as JSON columns instead of separate tables?**
> These are **always read and written together** with the parent record. A patient's allergies are never queried independently — they're always needed as part of the full profile. Using JSON arrays avoids complex JOINs and reduces query complexity. The trade-off is you can't efficiently query "find all patients allergic to X" — but that use case doesn't exist here.

**Q: How do you ensure only one active diet plan per patient?**
> Before generating a new plan, the service runs:
> ```python
> db.query(WeeklyDietPlan).filter(
>     WeeklyDietPlan.patient_id == patient.id,
>     WeeklyDietPlan.status == "active"
> ).update({"status": "archived"})
> ```
> Old plans are **archived, not deleted** — preserving history for analytics and the progress tracking feature.

### Frontend

**Q: Why Zustand over Redux?**
> Zustand has almost no boilerplate — no action creators, no reducers, no `connect()`. For a project of this scale, it's perfect. The `persist` middleware gives localStorage persistence in one line. Redux would require 5x more code for the same result.

**Q: What is TanStack React Query doing that Zustand isn't?**
> Zustand manages **client state** (who's logged in, profile data). TanStack Query manages **server state** — API responses with automatic caching, deduplication of concurrent requests, background refetching when data becomes stale, and automatic retry on failure. They complement each other: Zustand for "what the app knows about the user"; React Query for "what the server says right now."

**Q: How does the WellnessChatbot work as a global component?**
> `<WellnessChatbot />` is rendered in `App.tsx` **outside of** `<Routes>`. This means it's always mounted regardless of which page the user is on — it persists across navigation as a floating widget. Its `chatbotStore.ts` Zustand store tracks open/closed state globally.

---

> [!TIP]
> **For interviews:** Always mention the **dual-layer allergy safety**, **graceful AI degradation**, and **dual-storage resilience** as standout architectural decisions — these show you thought about real-world failures, not just happy paths.

> [!NOTE]
> **Project runs on 3 ports:**
> - `5173` (or `8080`) — Vite React Frontend
> - `8000` — FastAPI Backend (main)
> - `8001` — AIML Service (standalone FastAPI for ML predictions)
