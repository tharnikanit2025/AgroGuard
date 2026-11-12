"""
Intervention Logging API Routes
Module 8 & Module 10: Farmer treatment actions and post-intervention follow-ups.
"""
from datetime import datetime
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from ..database.session import get_db
from ..models.models import User, Field, Intervention, CropObservation
from ..schemas.schemas import InterventionCreate, InterventionResponse
from ..utils.security import get_current_user

router = APIRouter(prefix="/api/interventions", tags=["Interventions"])

@router.post("", response_model=InterventionResponse)
def record_intervention(
    data: InterventionCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    field = db.query(Field).filter(Field.field_id == data.field_id, Field.user_id == current_user.user_id).first()
    if not field:
        raise HTTPException(status_code=404, detail="Field not found or access denied.")

    if data.observation_id:
        obs = db.query(CropObservation).filter(CropObservation.observation_id == data.observation_id, CropObservation.field_id == field.field_id).first()
        if not obs:
            raise HTTPException(status_code=404, detail="Referenced observation record was not found.")

    new_itv = Intervention(
        field_id=field.field_id,
        observation_id=data.observation_id,
        action_taken=data.action_taken,
        date=datetime.utcnow(),
        follow_up_notes=data.follow_up_notes,
        outcome_status=data.outcome_status or "Pending Review"
    )
    db.add(new_itv)
    db.commit()
    db.refresh(new_itv)

    return {
        "intervention_id": new_itv.intervention_id,
        "field_id": new_itv.field_id,
        "field_name": field.field_name,
        "observation_id": new_itv.observation_id,
        "action_taken": new_itv.action_taken,
        "date": new_itv.date,
        "follow_up_notes": new_itv.follow_up_notes,
        "outcome_status": new_itv.outcome_status
    }

@router.get("/field/{field_id}", response_model=List[InterventionResponse])
def get_field_interventions(
    field_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    field = db.query(Field).filter(Field.field_id == field_id, Field.user_id == current_user.user_id).first()
    if not field:
        raise HTTPException(status_code=404, detail="Field not found or access denied.")

    itvs = db.query(Intervention).filter(Intervention.field_id == field_id).order_by(Intervention.date.desc()).all()
    results = []
    for itv in itvs:
        results.append({
            "intervention_id": itv.intervention_id,
            "field_id": itv.field_id,
            "field_name": field.field_name,
            "observation_id": itv.observation_id,
            "action_taken": itv.action_taken,
            "date": itv.date,
            "follow_up_notes": itv.follow_up_notes,
            "outcome_status": itv.outcome_status
        })
    return results
