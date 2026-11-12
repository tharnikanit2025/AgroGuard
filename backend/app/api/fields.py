"""
Field Management API Routes
Register, list, inspect fields, digital health history timeline, and risk trends.
"""
import json
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from ..database.session import get_db
from ..models.models import User, Field, CropObservation, RiskPrediction, Intervention
from ..schemas.schemas import FieldCreate, FieldResponse, ObservationResponse, RiskPredictionResponse
from ..utils.security import get_current_user
from ..utils.i18n import get_disease_info

router = APIRouter(prefix="/api/fields", tags=["Fields"])

@router.post("", response_model=FieldResponse)
def create_field(
    field_data: FieldCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    new_field = Field(
        user_id=current_user.user_id,
        field_name=field_data.field_name,
        crop_type=field_data.crop_type or "Rice / Paddy",
        crop_variety=field_data.crop_variety or "Ponni",
        planting_date=field_data.planting_date,
        area=field_data.area or 1.0,
        latitude=field_data.latitude,
        longitude=field_data.longitude,
        growth_stage=field_data.growth_stage or "Tillering",
        soil_type=field_data.soil_type or "Alluvial Clay Loam"
    )
    db.add(new_field)
    db.commit()
    db.refresh(new_field)
    return new_field

@router.get("", response_model=List[FieldResponse])
def get_user_fields(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    fields = db.query(Field).filter(Field.user_id == current_user.user_id).all()
    # Annotate latest observation and risk level
    results = []
    for f in fields:
        latest_obs = db.query(CropObservation).filter(CropObservation.field_id == f.field_id).order_by(CropObservation.observation_date.desc()).first()
        latest_risk = db.query(RiskPrediction).filter(RiskPrediction.field_id == f.field_id).order_by(RiskPrediction.prediction_date.desc()).first()
        
        f_dict = {
            "field_id": f.field_id,
            "user_id": f.user_id,
            "field_name": f.field_name,
            "crop_type": f.crop_type,
            "crop_variety": f.crop_variety,
            "planting_date": f.planting_date,
            "area": f.area,
            "latitude": f.latitude,
            "longitude": f.longitude,
            "growth_stage": f.growth_stage,
            "soil_type": f.soil_type,
            "created_at": f.created_at,
            "latest_observation": {
                "predicted_class": latest_obs.predicted_class,
                "confidence": latest_obs.confidence,
                "severity": latest_obs.severity,
                "observation_date": latest_obs.observation_date
            } if latest_obs else None,
            "latest_risk_level": latest_risk.risk_level if latest_risk else "Low"
        }
        results.append(f_dict)
    return results

@router.get("/{field_id}")
def get_field_details(
    field_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    field = db.query(Field).filter(Field.field_id == field_id, Field.user_id == current_user.user_id).first()
    if not field:
        raise HTTPException(status_code=404, detail="Field not found or access denied.")
    
    observations = db.query(CropObservation).filter(CropObservation.field_id == field_id).order_by(CropObservation.observation_date.desc()).all()
    interventions = db.query(Intervention).filter(Intervention.field_id == field_id).order_by(Intervention.date.desc()).all()
    latest_risk = db.query(RiskPrediction).filter(RiskPrediction.field_id == field_id).order_by(RiskPrediction.prediction_date.desc()).first()

    return {
        "field": field,
        "observations_count": len(observations),
        "interventions_count": len(interventions),
        "latest_risk": latest_risk,
        "recent_observations": observations[:5]
    }

@router.get("/{field_id}/history")
def get_field_health_history(
    field_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Module 6: Crop Health Digital History
    Returns longitudinal timeline of observations and interventions.
    """
    field = db.query(Field).filter(Field.field_id == field_id, Field.user_id == current_user.user_id).first()
    if not field:
        raise HTTPException(status_code=404, detail="Field not found or access denied.")

    observations = db.query(CropObservation).filter(CropObservation.field_id == field_id).order_by(CropObservation.observation_date.desc()).all()
    interventions = db.query(Intervention).filter(Intervention.field_id == field_id).order_by(Intervention.date.desc()).all()

    timeline_items = []
    for obs in observations:
        d_info = get_disease_info(obs.predicted_class)
        sym_list = json.loads(obs.symptoms_detected) if obs.symptoms_detected else []
        timeline_items.append({
            "type": "observation",
            "id": obs.observation_id,
            "date": obs.observation_date,
            "image_path": obs.image_path,
            "heatmap_path": obs.heatmap_path,
            "predicted_class": obs.predicted_class,
            "tamil_name": d_info["tamil_name"],
            "confidence": obs.confidence,
            "severity": obs.severity,
            "farmer_notes": obs.farmer_notes,
            "symptoms_detected": sym_list,
            "recommendations": d_info["recommendations"][:2],
            "tamil_recommendations": d_info["tamil_recommendations"][:2]
        })

    for itv in interventions:
        timeline_items.append({
            "type": "intervention",
            "id": itv.intervention_id,
            "date": itv.date,
            "observation_id": itv.observation_id,
            "action_taken": itv.action_taken,
            "follow_up_notes": itv.follow_up_notes,
            "outcome_status": itv.outcome_status
        })

    # Sort merged timeline chronologically descending
    timeline_items.sort(key=lambda x: x["date"], reverse=True)

    return {
        "field_id": field.field_id,
        "field_name": field.field_name,
        "crop_variety": field.crop_variety,
        "planting_date": field.planting_date,
        "growth_stage": field.growth_stage,
        "timeline": timeline_items
    }

@router.get("/{field_id}/risk")
def get_field_risk_history(
    field_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    field = db.query(Field).filter(Field.field_id == field_id, Field.user_id == current_user.user_id).first()
    if not field:
        raise HTTPException(status_code=404, detail="Field not found or access denied.")

    records = db.query(RiskPrediction).filter(RiskPrediction.field_id == field_id).order_by(RiskPrediction.prediction_date.desc()).limit(10).all()
    
    formatted = []
    for r in records:
        formatted.append({
            "risk_id": r.risk_id,
            "field_id": r.field_id,
            "risk_level": r.risk_level,
            "risk_score": r.risk_score,
            "risk_factors": json.loads(r.risk_factors) if r.risk_factors else [],
            "favourable_diseases": json.loads(r.favourable_diseases) if r.favourable_diseases else [],
            "prediction_date": r.prediction_date,
            "forecast_period": r.forecast_period,
            "recommended_action": r.recommended_action
        })
    return formatted
