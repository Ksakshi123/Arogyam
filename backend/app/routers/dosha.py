from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime

from app.database import get_db
from app.models.patient import PatientProfile
from app.models.dosha import DoshaAssessment, DoshaResult
from app.schemas.dosha import DoshaAssessmentCreate, DoshaResultResponse, DoshaHistoryItem
from app.services.dosha_service import DoshaService
from app.routers.patient import _get_patient_or_404

router = APIRouter()


@router.post("/assessment", response_model=DoshaResultResponse)
def submit_dosha_assessment(payload: DoshaAssessmentCreate, db: Session = Depends(get_db)):
    if not payload.answers:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Assessment answers dictionary cannot be empty"
        )

    # Resolve patient profile
    patient_id = payload.patient_id
    if patient_id:
        patient = _get_patient_or_404(db, patient_id)
        pid = patient.id
    else:
        # Fallback to first patient or create a guest profile
        first_patient = db.query(PatientProfile).first()
        if not first_patient:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="A valid patient profile must be created before taking the Dosha Assessment"
            )
        pid = first_patient.id

    # 1. Calculate deterministic scores
    result_data = DoshaService.calculate_dosha(payload.answers)

    # 2. Persist assessment
    assessment = DoshaAssessment(
        patient_id=pid,
        answers=payload.answers,
        assessment_date=datetime.utcnow(),
    )
    db.add(assessment)
    db.commit()
    db.refresh(assessment)

    # 3. Persist result
    dosha_result = DoshaResult(
        patient_id=pid,
        assessment_id=assessment.id,
        vata_percentage=result_data.vata_percentage,
        pitta_percentage=result_data.pitta_percentage,
        kapha_percentage=result_data.kapha_percentage,
        primary_dosha=result_data.primary_dosha,
        secondary_dosha=result_data.secondary_dosha,
        constitution=result_data.constitution,
    )
    db.add(dosha_result)
    db.commit()
    db.refresh(dosha_result)

    return DoshaResultResponse(
        id=dosha_result.id,
        patient_id=pid,
        assessment_id=assessment.id,
        vata_percentage=dosha_result.vata_percentage,
        pitta_percentage=dosha_result.pitta_percentage,
        kapha_percentage=dosha_result.kapha_percentage,
        primary_dosha=dosha_result.primary_dosha,
        secondary_dosha=dosha_result.secondary_dosha,
        constitution=dosha_result.constitution,
        assessment_date=assessment.assessment_date.isoformat() if assessment.assessment_date else None,
        created_at=dosha_result.created_at,
    )


@router.get("/result/{patient_id}", response_model=DoshaResultResponse)
def get_latest_result(patient_id: int, db: Session = Depends(get_db)):
    patient = _get_patient_or_404(db, patient_id)
    latest_result = (
        db.query(DoshaResult)
        .filter(DoshaResult.patient_id == patient.id)
        .order_by(DoshaResult.created_at.desc())
        .first()
    )
    if not latest_result:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No Dosha assessment found for this patient"
        )

    return DoshaResultResponse(
        id=latest_result.id,
        patient_id=latest_result.patient_id,
        assessment_id=latest_result.assessment_id,
        vata_percentage=latest_result.vata_percentage,
        pitta_percentage=latest_result.pitta_percentage,
        kapha_percentage=latest_result.kapha_percentage,
        primary_dosha=latest_result.primary_dosha,
        secondary_dosha=latest_result.secondary_dosha,
        constitution=latest_result.constitution,
        assessment_date=latest_result.created_at.isoformat() if latest_result.created_at else None,
        created_at=latest_result.created_at,
    )


@router.get("/history/{patient_id}", response_model=List[DoshaHistoryItem])
def get_dosha_history(patient_id: int, db: Session = Depends(get_db)):
    patient = _get_patient_or_404(db, patient_id)
    history = (
        db.query(DoshaResult)
        .filter(DoshaResult.patient_id == patient.id)
        .order_by(DoshaResult.created_at.desc())
        .all()
    )
    return [
        DoshaHistoryItem(
            id=item.id,
            assessment_id=item.assessment_id,
            vata_percentage=item.vata_percentage,
            pitta_percentage=item.pitta_percentage,
            kapha_percentage=item.kapha_percentage,
            primary_dosha=item.primary_dosha,
            secondary_dosha=item.secondary_dosha,
            constitution=item.constitution,
            created_at=item.created_at,
        )
        for item in history
    ]
