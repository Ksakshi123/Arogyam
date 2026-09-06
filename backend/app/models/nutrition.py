from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base


class MealCompletion(Base):
    """
    Log of patient actions on meals (planned, completed, skipped, replaced).
    """
    __tablename__ = "meal_completions"

    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(Integer, ForeignKey("patient_profiles.id", ondelete="CASCADE"), nullable=False, index=True)
    meal_id = Column(String, ForeignKey("meals.id", ondelete="SET NULL"), nullable=True, index=True)
    date = Column(String, nullable=False, index=True)   # YYYY-MM-DD
    status = Column(String, nullable=False)             # planned | completed | skipped | replaced
    replacement_meal_id = Column(String, nullable=True)

    completed_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now(), server_default=func.now())

    patient = relationship("PatientProfile", back_populates="meal_completions")
    meal = relationship("Meal", back_populates="completions")


class DailyNutrition(Base):
    """
    Aggregated daily nutrition totals for fast analytics queries.
    """
    __tablename__ = "daily_nutritions"

    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(Integer, ForeignKey("patient_profiles.id", ondelete="CASCADE"), nullable=False, index=True)
    date = Column(String, nullable=False, index=True)   # YYYY-MM-DD

    total_calories = Column(Float, default=0.0)
    total_protein = Column(Float, default=0.0)
    total_carbohydrates = Column(Float, default=0.0)
    total_fats = Column(Float, default=0.0)

    updated_at = Column(DateTime(timezone=True), onupdate=func.now(), server_default=func.now())

    patient = relationship("PatientProfile", back_populates="daily_nutritions")
