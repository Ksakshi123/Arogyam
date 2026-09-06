# 🌿 Arogyam Backend API (FastAPI)

Production-ready REST API service for the Arogyam Ayurvedic Wellness platform built with FastAPI, SQLAlchemy, and Pydantic.

---

## 📁 Architecture Overview

```
backend/
├── app/
│   ├── main.py              # FastAPI app initialization, middleware & router mounts
│   ├── config.py            # Environment configuration with pydantic-settings
│   ├── database.py          # SQLAlchemy engine, session generator & Base
│   ├── models.py            # PostgreSQL database models
│   ├── schemas.py           # Pydantic input/output schemas
│   ├── auth.py              # JWT authentication & password hashing
│   ├── routers/
│   │   ├── auth.py          # POST /api/auth/register, POST /api/auth/login
│   │   ├── patient.py       # GET/POST /api/patient/profile
│   │   ├── dosha.py         # POST /api/dosha/assessment, GET /api/dosha/history
│   │   ├── diet.py          # POST /api/diet/generate, GET /api/diet/current
│   │   ├── nutrition.py     # POST /api/nutrition/track, GET /api/nutrition/weekly
│   │   └── chat.py          # POST /api/chat (Ayu wellness assistant)
│   └── services/
│       ├── dosha_engine.py  # Rule-based Ayurvedic calculation engine
│       ├── diet_generator.py# 7-day personalized meal plan generator
│       └── chatbot_service.py # Intent parsing & dialogue service
├── .env.example             # Example environment file
└── requirements.txt         # Python dependencies
```

---

## 🚀 How to Run the Backend

### Prerequisites
- Python 3.10+ installed
- PostgreSQL installed & running (or SQLite for quick local development)

### Step 1: Navigate to the backend directory
```bash
cd backend
```

### Step 2: Create and activate a virtual environment
**On Windows (PowerShell):**
```powershell
python -m venv venv
.\venv\Scripts\Activate.ps1
```

**On macOS/Linux:**
```bash
python3 -m venv venv
source venv/bin/activate
```

### Step 3: Install dependencies
```bash
pip install -r requirements.txt
```

### Step 4: Configure environment variables
Copy the `.env.example` file:
```bash
cp .env.example .env
```
*(Optionally update `DATABASE_URL` if using PostgreSQL. For quick testing without Postgres, you can change `DATABASE_URL` in `.env` to `sqlite:///./arogyam.db`)*

### Step 5: Start the development server
```bash
uvicorn app.main:app --reload --port 8000
```

### Step 6: Access interactive API Documentation
- **Swagger UI:** [http://localhost:8000/docs](http://localhost:8000/docs)
- **ReDoc:** [http://localhost:8000/redoc](http://localhost:8000/redoc)
- **Health Check:** [http://localhost:8000/health](http://localhost:8000/health)
