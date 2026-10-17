import os
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker
from dotenv import load_dotenv

# Ensure .env changes are always loaded fresh
load_dotenv(override=True)

DATABASE_URL = os.getenv("DATABASE_URL")

if not DATABASE_URL:
    raise RuntimeError(
        "DATABASE_URL environment variable is not set! "
        "Please set it in your .env file with your Neon PostgreSQL connection string."
    )


def get_normalized_db_url(url: str) -> str:
    # Normalize Heroku/Render style postgres://
    if url.startswith("postgres://"):
        url = url.replace("postgres://", "postgresql://", 1)

    # If postgresql+psycopg is requested, verify if psycopg (v3) is available
    if url.startswith("postgresql+psycopg://"):
        try:
            import psycopg  # noqa: F401
        except ImportError:
            # Fall back to psycopg2 or standard driver if v3 is not installed
            url = url.replace("postgresql+psycopg://", "postgresql+psycopg2://", 1)

    return url


final_db_url = get_normalized_db_url(DATABASE_URL)

try:
    engine = create_engine(
        final_db_url,
        pool_pre_ping=True,
        echo=False
    )
except Exception:
    # Final fallback if driver mismatch
    fallback_url = final_db_url.replace("+psycopg", "").replace("+psycopg2", "")
    engine = create_engine(fallback_url, pool_pre_ping=True, echo=False)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


from sqlalchemy import text

def check_db_connection():
    """
    Actively tests the connection to the database and prints status.
    """
    safe_url = engine.url.render_as_string(hide_password=True)
    db_type = "PostgreSQL"
    try:
        with engine.connect() as conn:
            conn.execute(text("SELECT 1"))
        print("\n" + "=" * 60)
        print(f"  [DATABASE] Connected successfully to {db_type}!")
        print(f"  Target: {safe_url}")
        print("=" * 60 + "\n", flush=True)
        return True
    except Exception as exc:
        print("\n" + "=" * 60)
        print(f"  [DATABASE] WARNING: Could not connect to {db_type}!")
        print(f"  Target: {safe_url}")
        print(f"  Details: {exc}")
        print("=" * 60 + "\n", flush=True)
        return False

# Perform immediate verification on module load
check_db_connection()


def get_db():
    """
    Reusable FastAPI database session dependency.
    Yields an active database session and ensures it closes cleanly.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

