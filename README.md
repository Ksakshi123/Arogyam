<<<<<<< HEAD
# 🌿 Arogyam – Personalized Ayurvedic Wellness Platform

Arogyam is a full-stack, AI-powered wellness platform inspired by Ayurvedic principles. The platform provides personalized wellness guidance through **Dosha assessment, nutrition recommendations, meal planning, wellness tracking, and an AI-powered assistant**.

> ⚕️ **Note:** The frontend is currently fully functional and operates using local data and browser storage. The backend and AI/ML services are structured for future development and integration.

---

# ✨ Features

* 🧘 Personalized Dosha Assessment
* 🌿 Vata, Pitta, and Kapha Dosha Analysis
* 🍽️ Personalized Ayurvedic Meal Plans
* 📊 Nutrition Analytics and Tracking
* 📈 Wellness Progress Monitoring
* 👤 Patient Profile and Preference Management
* 🤖 Ayu AI Wellness Assistant
* 💾 Local data persistence using Zustand and `localStorage`
* 🔮 Scalable architecture for future AI/ML and backend integration

---

# 🏗️ Project Architecture

The project follows a modular architecture consisting of three main components:

```text
Arogyam
│
├── Frontend
│   └── React + TypeScript + Vite
│
├── Backend
│   └── FastAPI + Database Services
│
└── AI/ML Services
    ├── Dosha Predictor
    ├── Diet Recommendation Engine
    └── AI Wellness Chatbot
```

### Future Full-Stack Architecture

```text
Browser
   │
   ▼
React Frontend
Port: 8080
   │
   ▼
FastAPI Backend
Port: 8000
   │
   ├── Database
   │   └── PostgreSQL
   │
   ▼
AI/ML Services
Port: 8001
   │
   ├── Dosha Prediction Model
   ├── Diet Recommendation Engine
   └── LLM Wellness Assistant
```

---

# 📁 Project Structure

```text
arogyam-dosha-guide/
│
├── frontend/
│   └── React + TypeScript + Vite Application
│
├── backend/
│   └── FastAPI Backend Services
│
├── aiml/
│   └── AI/ML Services
│
└── README.md
```

---

# 💻 Frontend Structure

The frontend is the currently functional part of the application.

```text
src/
│
├── App.tsx
├── main.tsx
├── index.css
│
├── pages/
│   ├── PatientLogin.tsx
│   ├── PatientOnboarding.tsx
│   ├── DoshaAssessment.tsx
│   ├── DoshaResult.tsx
│   ├── PatientDashboard.tsx
│   ├── WeeklyMealPlan.tsx
│   ├── NutritionAnalytics.tsx
│   ├── Progress.tsx
│   └── Profile.tsx
│
├── components/
│   └── patient/
│       ├── MealCard.tsx
│       └── WellnessChatbot.tsx
│
├── store/
│   ├── patientStore.ts
│   ├── dietStore.ts
│   └── chatbotStore.ts
│
├── services/
│   ├── doshaService.ts
│   ├── dietPlanService.ts
│   └── chatbotService.ts
│
├── data/
│   ├── doshaQuestions.ts
│   └── meals.ts
│
└── types/
    ├── patient.ts
    ├── dosha.ts
    ├── meal.ts
    ├── nutrition.ts
    └── chatbot.ts
```

---

# 🚀 Getting Started

## Prerequisites

Make sure the following tools are installed:

| Tool    | Recommended Version |
| ------- | ------------------- |
| Node.js | v18+                |
| npm     | v9+                 |
| Python  | v3.10+              |

Python is currently required only for future backend and AI/ML development.

---

# ▶️ Running the Frontend

The frontend is fully functional and can run independently without the backend.

### 1. Navigate to the project directory

```bash
cd C:\AROGYAM\arogyam-dosha-guide
```

### 2. Install dependencies

```bash
npm install
```

### 3. Start the development server

```bash
npm run dev
```

Open the application in your browser using the URL displayed in the terminal.

---

# 🧑‍⚕️ Patient Journey

The application currently supports the following patient workflow:

```text
Login
  ↓
Patient Onboarding
  ↓
Dosha Assessment
  ↓
Dosha Results
  ↓
Personalized Meal Plan
  ↓
Nutrition Analytics
  ↓
Patient Dashboard
  ↓
Wellness Progress Tracking
  ↓
Profile Management
```

### Available Pages

| Step | Feature                    |
| ---- | -------------------------- |
| 1    | Patient Login              |
| 2    | Patient Onboarding         |
| 3    | Dosha Assessment           |
| 4    | Dosha Results              |
| 5    | Personalized Meal Plan     |
| 6    | Nutrition Analytics        |
| 7    | Patient Dashboard          |
| 8    | Wellness Progress Tracking |
| 9    | Profile Management         |
| 10   | Ayu AI Assistant           |

---

# 🧠 Core Functionality

## 🌿 Dosha Assessment

The platform evaluates users using a questionnaire consisting of **15 Ayurvedic questions**.

The responses are processed to estimate the user's:

* Vata
* Pitta
* Kapha

constitution.

---

## 🍽️ Personalized Diet Planning

Based on the user's wellness preferences and Dosha assessment, the application generates personalized meal recommendations.

The current implementation includes:

* **42 curated Ayurvedic meals**
* Weekly meal planning
* Personalized dietary preferences
* Nutrition information

---

## 📊 Nutrition Analytics

Users can monitor nutritional information and wellness-related insights through interactive visualizations.

The application uses charts to display relevant nutritional analytics and progress.

---

## 🤖 Ayu AI Wellness Assistant

Ayu is the platform's wellness assistant designed to provide guidance related to:

* Meals and nutrition
* Ayurvedic wellness
* Dietary preferences
* General wellness queries

The current frontend implementation uses an intent-based chatbot architecture and is designed for future integration with an LLM-powered assistant.

---

# 🔐 Authentication and Data Storage

Currently, the application operates in **frontend-only mode**.

* Any valid email format can be used.
* Password validation is currently simulated.
* User data is stored locally using `localStorage`.
* Zustand is used for state management.

> 🔮 Future versions will integrate secure authentication and database-backed user management.

---

# 🔮 Backend Architecture (Future Development)

The backend is structured using **FastAPI**.

```text
backend/
│
├── app/
│   ├── main.py
│   │
│   ├── routers/
│   │   └── API route handlers
│   │
│   ├── models/
│   │   └── SQLAlchemy database models
│   │
│   ├── schemas/
│   │   └── Pydantic request/response schemas
│   │
│   └── services/
│       └── Business logic services
│
├── requirements.txt
└── README.md
```

### Running the Backend

```bash
cd backend
```

Create a virtual environment:

```bash
python -m venv venv
```

Activate it on Windows:

```bash
venv\Scripts\activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Start the FastAPI server:

```bash
uvicorn app.main:app --reload --port 8000
```

The API will run on:

`http://localhost:8000`

Swagger API documentation:

`http://localhost:8000/docs`

---

# 🤖 AI/ML Services (Future Development)

The AI/ML layer is designed to support intelligent wellness recommendations.

```text
aiml/
│
├── dosha_predictor/
│   └── Dosha classification model
│
├── diet_recommender/
│   └── Personalized diet recommendation engine
│
├── chatbot/
│   └── LLM-powered wellness assistant
│
└── README.md
```

### Running the AI/ML Service

```bash
cd aiml
```

Create and activate a virtual environment:

```bash
python -m venv venv
venv\Scripts\activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Start the service:

```bash
python -m uvicorn main:app --reload --port 8001
```

---

# 🛠️ Tech Stack

### Frontend

* React
* TypeScript
* Vite
* Tailwind CSS
* shadcn/ui
* Radix UI
* React Router
* Zustand
* Framer Motion
* Recharts
* Lucide Icons

### Backend

* FastAPI
* Python
* SQLAlchemy
* Pydantic
* PostgreSQL

### AI/ML (Planned)

* Python
* Machine Learning Models
* Recommendation Systems
* Large Language Models
* AI-powered Conversational Assistant

---

# 📦 Useful Commands

### Run Development Server

```bash
npm run dev
```

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

### Run Linter

```bash
npm run lint
```

---

# ⚕️ Disclaimer

> **Arogyam is designed for wellness and educational purposes only.**

This application does not provide medical diagnosis or treatment. The recommendations generated by the platform are intended as general wellness guidance and should not replace professional medical advice.

Users should consult qualified healthcare professionals for medical conditions, diagnosis, or treatment.

---

# 🌱 Future Enhancements

* Secure user authentication
* PostgreSQL database integration
* ML-based Dosha prediction
* Personalized AI diet recommendation engine
* LLM-powered Ayu wellness assistant
* Real-time health and wellness analytics
* Backend API integration
* Personalized recommendation improvements

---

## 🌿 Arogyam

**Personalizing wellness through technology and Ayurvedic principles.**
=======
# Arogyam
ML-Based Diet Recommendation System 
>>>>>>> 7ded3cbcb2ae5381ec4bfa877a3ba9f0052550f4
