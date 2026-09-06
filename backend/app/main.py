import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from app.database import engine, Base
import app.models  # Ensures all models are registered with Base metadata
from app.routers import health, database, auth, patient, dosha, diet, nutrition, chat

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("arogyam-api")

tags_metadata = [
    {
        "name": "Database",
        "description": "PostgreSQL database connection testing and diagnostics.",
    },
    {
        "name": "Health",
        "description": "Service liveness and health checks.",
    },
    {
        "name": "Authentication",
        "description": "User registration, login, and token management.",
    },
    {
        "name": "Patient Profile",
        "description": "Patient intake and profile operations.",
    },
    {
        "name": "Dosha Assessment",
        "description": "Ayurvedic Prakriti quiz calculations and history.",
    },
    {
        "name": "Diet Plan",
        "description": "Personalized 7-day Ayurvedic diet plans and meal swapping.",
    },
    {
        "name": "Nutrition & Habits",
        "description": "Daily meal completion and habit tracking.",
    },
    {
        "name": "AI Chatbot",
        "description": "Ayurvedic wellness AI chat assistant.",
    },
]


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize database tables on startup
    try:
        logger.info("Connecting to database and ensuring schema tables exist...")
        Base.metadata.create_all(bind=engine)
        logger.info("Database schema synchronized successfully.")
    except Exception as e:
        logger.warning(
            f"Notice: Could not automatically create tables on startup ({e}). "
            "Please ensure PostgreSQL is running and credentials in .env are correct."
        )
    yield


app = FastAPI(
    title="Arogyam API",
    description="Full-Stack Ayurvedic Wellness Platform REST API (PostgreSQL + SQLAlchemy)",
    version="2.0.0",
    openapi_tags=tags_metadata,
    lifespan=lifespan,
)

# ── CORS Middleware ──────────────────────────────────────────────────────────
# Allow requests from Vite frontend dev server (port 8080 or 5173)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:8080",
        "http://localhost:5173",
        "http://127.0.0.1:8080",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Include Routers ──────────────────────────────────────────────────────────
app.include_router(database.router,  prefix="/api/database",  tags=["Database"])
app.include_router(health.router,    prefix="/api",           tags=["Health"])
app.include_router(auth.router,      prefix="/api/auth",      tags=["Authentication"])
app.include_router(patient.router,   prefix="/api/patients",  tags=["Patient Profile"])
app.include_router(dosha.router,     prefix="/api/dosha",     tags=["Dosha Assessment"])
app.include_router(diet.router,      prefix="/api/diet",      tags=["Diet Plan"])
app.include_router(nutrition.router, prefix="/api/nutrition", tags=["Nutrition & Habits"])
app.include_router(chat.router,      prefix="/api/chat",      tags=["AI Chatbot"])


@app.get("/", tags=["Health"])
def root():
    return {
        "status": "ok",
        "message": "Arogyam API is running 🌿",
        "docs": "/docs",
        "version": "2.0.0"
    }
