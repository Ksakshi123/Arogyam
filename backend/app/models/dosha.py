from sqlalchemy import Column, Integer, String, Float, DateTime, JSON, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base


class DoshaAssessment(Base):
    """
    Historical record of each questionnaire attempt and user's answers.
    """
    __tablename__ = "dosha_assessments"

    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(Integer, ForeignKey("patient_profiles.id", ondelete="CASCADE"), nullable=False, index=True)
    answers = Column(JSON, nullable=False)               # {questionId: optionId}
    assessment_date = Column(DateTime(timezone=True), server_default=func.now())
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    patient = relationship("PatientProfile", back_populates="dosha_assessments")
    result = relationship("DoshaResult", back_populates="assessment", uselist=False, cascade="all, delete-orphan")


class DoshaResult(Base):
    """
    Calibrated scores and dominant Ayurvedic constitution corresponding to an assessment.
    """
    __tablename__ = "dosha_results"

    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(Integer, ForeignKey("patient_profiles.id", ondelete="CASCADE"), nullable=False, index=True)
    assessment_id = Column(Integer, ForeignKey("dosha_assessments.id", ondelete="CASCADE"), nullable=True, index=True)

    vata_percentage = Column(Float, nullable=False)
    pitta_percentage = Column(Float, nullable=False)
    kapha_percentage = Column(Float, nullable=False)

    primary_dosha = Column(String, nullable=False)
    secondary_dosha = Column(String, nullable=True)
    constitution = Column(String, nullable=False)

    created_at = Column(DateTime(timezone=True), server_default=func.now())

    patient = relationship("PatientProfile", back_populates="dosha_results")
    assessment = relationship("DoshaAssessment", back_populates="result")
