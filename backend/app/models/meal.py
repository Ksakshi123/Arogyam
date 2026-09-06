from sqlalchemy import Column, Integer, String, Float, Boolean, Text, DateTime, JSON, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base


class Meal(Base):
    """
    Individual meal item inside a weekly plan.
    """
    __tablename__ = "meals"

    id = Column(String, primary_key=True, index=True)   # matches meal unique key
    diet_plan_id = Column(Integer, ForeignKey("weekly_diet_plans.id", ondelete="CASCADE"), nullable=False, index=True)

    day_of_week = Column(String, nullable=False)        # Monday, Tuesday, etc.
    date = Column(String, nullable=True)                # YYYY-MM-DD
    meal_type = Column(String, nullable=False)          # breakfast | lunch | dinner
    meal_name = Column(String, nullable=False)
    description = Column(Text, nullable=True)

    ingredients = Column(JSON, nullable=True)           # list of strings
    calories = Column(Float, nullable=False, default=0.0)
    protein = Column(Float, nullable=False, default=0.0)
    carbohydrates = Column(Float, nullable=False, default=0.0)
    fats = Column(Float, nullable=False, default=0.0)
    preparation_time = Column(Integer, nullable=True, default=15)

    tags = Column(JSON, nullable=True)                  # list of strings
    suitable_doshas = Column(JSON, nullable=True)       # list of strings
    is_replaced = Column(Boolean, default=False)
    explanation = Column(Text, nullable=True)
    recipe = Column(JSON, nullable=True)                # {steps, tips, servings, difficulty}

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now(), server_default=func.now())

    diet_plan = relationship("WeeklyDietPlan", back_populates="meals")
    completions = relationship("MealCompletion", back_populates="meal")
