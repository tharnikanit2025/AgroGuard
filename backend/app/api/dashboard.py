"""
Main Executive Dashboard API Route
Provides real-time consolidated agricultural intelligence, statistics, and trends.
"""
import json
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ..database.session import get_db
from ..models.models import User, Field, CropObservation, RiskPrediction, Alert
from ..schemas.schemas import DashboardResponse
from ..utils.security import get_current_user
from ..utils.i18n import get_disease_info

router = APIRouter(prefix="/api/dashboard", tags=["Dashboard"])

@router.get("", response_model=DashboardResponse)
def get_dashboard(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Total fields
    user_fields = db.query(Field).filter(Field.user_id == current_user.user_id).all()
    field_ids = [f.field_id for f in user_fields]

    # Total observations
    observations = db.query(CropObservation).filter(CropObservation.field_id.in_(field_ids)).order_by(CropObservation.observation_date.desc()).all() if field_ids else []
    
    # Active disease alerts
    alerts = db.query(Alert).filter(Alert.user_id == current_user.user_id, Alert.is_read == False).order_by(Alert.created_at.desc()).all()
    all_alerts = db.query(Alert).filter(Alert.user_id == current_user.user_id).order_by(Alert.created_at.desc()).limit(10).all()

    # Elevated risk fields
    elevated_count = 0
    field_summaries = []
    latest_risks = []

    for f in user_fields:
        latest_risk = db.query(RiskPrediction).filter(RiskPrediction.field_id == f.field_id).order_by(RiskPrediction.prediction_date.desc()).first()
        latest_obs = db.query(CropObservation).filter(CropObservation.field_id == f.field_id).order_by(CropObservation.observation_date.desc()).first()

        risk_lvl = latest_risk.risk_level if latest_risk else "Low"
        if risk_lvl in ["Moderate", "High"]:
            elevated_count += 1

        field_summaries.append({
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
            "latest_risk_level": risk_lvl
        })

        if latest_risk:
            latest_risks.append({
                "risk_id": latest_risk.risk_id,
                "field_id": f.field_id,
                "field_name": f.field_name,
                "temperature": 29.5,
                "humidity": 82.0,
                "rainfall": 2.5,
                "soil_moisture": 70.0,
                "risk_level": latest_risk.risk_level,
                "risk_score": latest_risk.risk_score,
                "forecast_period": latest_risk.forecast_period,
                "risk_factors": json.loads(latest_risk.risk_factors) if latest_risk.risk_factors else [],
                "favourable_diseases": json.loads(latest_risk.favourable_diseases) if latest_risk.favourable_diseases else [],
                "feature_importance": [],
                "recommended_action": latest_risk.recommended_action or "Maintain standard inspection protocol.",
                "tamil_recommended_action": "வழக்கமான கள ஆய்வு நெறிமுறையைப் பின்பற்றவும்.",
                "weather_source": "Open-Meteo Weather Simulation",
                "prediction_date": latest_risk.prediction_date
            })

    recent_obs_formatted = []
    for obs in observations[:6]:
        d_info = get_disease_info(obs.predicted_class)
        recent_obs_formatted.append({
            "observation_id": obs.observation_id,
            "field_id": obs.field_id,
            "field_name": obs.field.field_name if obs.field else None,
            "image_path": obs.image_path,
            "heatmap_path": obs.heatmap_path,
            "observation_date": obs.observation_date,
            "predicted_class": obs.predicted_class,
            "confidence": obs.confidence,
            "severity": obs.severity,
            "farmer_notes": obs.farmer_notes,
            "symptoms_detected": json.loads(obs.symptoms_detected) if obs.symptoms_detected else [],
            "is_demo": obs.is_demo,
            "recommendations": d_info["recommendations"][:2],
            "tamil_name": d_info["tamil_name"]
        })

    recent_alerts_formatted = []
    for a in all_alerts:
        recent_alerts_formatted.append({
            "alert_id": a.alert_id,
            "user_id": a.user_id,
            "field_id": a.field_id,
            "field_name": a.field.field_name if a.field else None,
            "title": a.title,
            "description": a.description,
            "risk_level": a.risk_level,
            "created_at": a.created_at,
            "is_read": a.is_read,
            "action_url": a.action_url,
            "tamil_title": f"எச்சரிக்கை: {a.title}",
            "tamil_description": a.description
        })

    return {
        "stats": {
            "total_fields": len(user_fields),
            "total_observations": len(observations),
            "active_disease_alerts": len(alerts),
            "elevated_risk_fields": elevated_count
        },
        "recent_observations": recent_obs_formatted,
        "recent_alerts": recent_alerts_formatted,
        "field_summaries": field_summaries,
        "latest_risk_records": latest_risks
    }
