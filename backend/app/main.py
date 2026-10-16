import logging
import os
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from contextlib import asynccontextmanager
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded

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
        print("  [DATABASE] Schema synchronized: All tables verified/created.\n", flush=True)
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

# ── Rate Limiting ─────────────────────────────────────────────────────────────
limiter = Limiter(key_func=get_remote_address)
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# ── CORS Middleware ──────────────────────────────────────────────────────────
# SECURITY FIX: Use an explicit whitelist instead of allow_origin_regex=r"^https?://.*"
# The old wildcard + allow_credentials=True combination allowed ANY website to make
# credentialed cross-origin requests to this API (CSRF risk).
_raw_origins = os.getenv(
    "CORS_ALLOWED_ORIGINS",
    "http://localhost:5173,http://localhost:8080,http://localhost:3000"
)
ALLOWED_ORIGINS = [o.strip() for o in _raw_origins.split(",") if o.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,          # Explicit whitelist only
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["Authorization", "Content-Type", "X-Patient-Id"],
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
