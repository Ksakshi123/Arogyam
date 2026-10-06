from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    # Database
    DATABASE_URL: str = "postgresql://postgres:password@localhost:5432/arogyam_db"

    # JWT Secret
    SECRET_KEY: str = "CHANGE_ME_TO_A_LONG_RANDOM_SECRET"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 24 hours

    # AI/ML Service
    AIML_SERVICE_URL: str = "http://localhost:8001"

    # Groq API Keys for Diet Planning (Automatic Failover)
    GROQ_API_KEY_DIET_1: str = ""
    GROQ_API_KEY_DIET_2: str = ""
    GROQ_DIET_MODEL: str = "llama-3.3-70b-versatile"

    # Grok / Ayu AI API Configuration
    XAI_API_KEY: str = ""
    GROK_MODEL: str = "grok-4.6"
    XAI_BASE_URL: str = "https://api.x.ai/v1"

    # Separate API Key for Ayu Chatbot
    GROQ_API_KEY_AYU: str = ""

    class Config:
        env_file = ".env"
        extra = "ignore"


settings = Settings()
