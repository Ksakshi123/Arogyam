from sqlalchemy import Column, Integer, String, Float, DateTime, JSON, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base


class PatientProfile(Base):
    """
    Patient profile containing biometric and Ayurvedic lifestyle preferences.
    """
    __tablename__ = "patient_profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False)

    age = Column(Integer, nullable=True)
    weight = Column(Float, nullable=True)
    height = Column(Float, nullable=True)
    activity_level = Column(String, nullable=True)

    diet_preference = Column(String, nullable=True)
    food_preferences = Column(JSON, nullable=True)      # list of strings (e.g. regional cuisines)
    wellness_goals = Column(JSON, nullable=True)         # list of strings
    allergies = Column(JSON, nullable=True)              # list of strings
    food_restrictions = Column(JSON, nullable=True)      # list of strings
    disliked_foods = Column(JSON, nullable=True)         # list of strings

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now(), server_default=func.now())

    # Relationships
    user = relationship("User", back_populates="profile")
    dosha_assessments = relationship("DoshaAssessment", back_populates="patient", cascade="all, delete-orphan")
    dosha_results = relationship("DoshaResult", back_populates="patient", cascade="all, delete-orphan")
    weekly_plans = relationship("WeeklyDietPlan", back_populates="patient", cascade="all, delete-orphan")
    meal_completions = relationship("MealCompletion", back_populates="patient", cascade="all, delete-orphan")
    daily_nutritions = relationship("DailyNutrition", back_populates="patient", cascade="all, delete-orphan")
    chat_messages = relationship("ChatMessage", back_populates="patient", cascade="all, delete-orphan")
