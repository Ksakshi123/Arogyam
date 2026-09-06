"""
SQLAlchemy database models for Arogyam.
Each class maps to a table in PostgreSQL.
"""
from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, JSON, ForeignKey, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base


class User(Base):
    """Stores patient and doctor login credentials."""
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    role = Column(String, default="patient")  # "patient" or "doctor"
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # One-to-one relationship with PatientProfile
    profile = relationship("PatientProfile", back_populates="user", uselist=False)
    dosha_assessments = relationship("DoshaAssessment", back_populates="user")
    weekly_plans = relationship("WeeklyMealPlan", back_populates="user")


class PatientProfile(Base):
    """Stores all personal and preference data collected during onboarding."""
    __tablename__ = "patient_profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True)
    full_name = Column(String, nullable=False)
    age = Column(Integer)
    gender = Column(String)
    height_cm = Column(Float)
    weight_kg = Column(Float)
    activity_level = Column(String)
    wellness_goals = Column(JSON)       # list of strings
    diet_preference = Column(String)    # Vegetarian / Vegan / etc.
    food_preferences = Column(JSON)     # list of strings
    allergies = Column(JSON)            # STRICT constraint
    food_restrictions = Column(JSON)
    disliked_foods = Column(JSON)
    onboarding_completed = Column(Boolean, default=False)
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    user = relationship("User", back_populates="profile")


class DoshaAssessment(Base):
    """Stores each quiz attempt and its calculated result."""
    __tablename__ = "dosha_assessments"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    answers = Column(JSON)              # {questionId: optionId}
    vata_percent = Column(Float)
    pitta_percent = Column(Float)
    kapha_percent = Column(Float)
    primary_dosha = Column(String)
    secondary_dosha = Column(String, nullable=True)
    constitution = Column(String)
    assessed_at = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User", back_populates="dosha_assessments")


class WeeklyMealPlan(Base):
    """Stores a generated weekly meal plan for a user."""
    __tablename__ = "weekly_meal_plans"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    start_date = Column(String)
    plan_data = Column(JSON)            # Full 7-day plan as JSON
    compatibility_score = Column(JSON)  # {dosha, preferences, allergies, overall}
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User", back_populates="weekly_plans")
    completions = relationship("MealCompletion", back_populates="plan")


class MealCompletion(Base):
    """Tracks whether a user completed, skipped or replaced each meal."""
    __tablename__ = "meal_completions"

    id = Column(Integer, primary_key=True, index=True)
    plan_id = Column(Integer, ForeignKey("weekly_meal_plans.id"))
    meal_id = Column(String)            # matches Meal.id in frontend data
    date = Column(String)
    status = Column(String)             # "completed" | "skipped" | "replaced"
    replacement_meal_id = Column(String, nullable=True)
    logged_at = Column(DateTime(timezone=True), server_default=func.now())

    plan = relationship("WeeklyMealPlan", back_populates="completions")


class ChatHistory(Base):
    """Stores Ayu chatbot conversation history."""
    __tablename__ = "chat_history"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    role = Column(String)               # "user" | "assistant"
    content = Column(Text)
    intent = Column(String, nullable=True)
    structured_data = Column(JSON, nullable=True)
    timestamp = Column(DateTime(timezone=True), server_default=func.now())
