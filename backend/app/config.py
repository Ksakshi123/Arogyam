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

    class Config:
        env_file = ".env"


settings = Settings()
