from sqlalchemy import Column, Integer, String, DateTime, JSON, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base


class WeeklyDietPlan(Base):
    """
    Weekly meal plan container for a patient.
    """
    __tablename__ = "weekly_diet_plans"

    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(Integer, ForeignKey("patient_profiles.id", ondelete="CASCADE"), nullable=False, index=True)
    week_start_date = Column(String, nullable=False)     # YYYY-MM-DD
    status = Column(String, default="active", nullable=False) # "active" or "archived"
    compatibility_score = Column(JSON, nullable=True)    # {dosha, preferences, allergies, overall}

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now(), server_default=func.now())

    patient = relationship("PatientProfile", back_populates="weekly_plans")
    meals = relationship("Meal", back_populates="diet_plan", cascade="all, delete-orphan", order_by="Meal.id")
