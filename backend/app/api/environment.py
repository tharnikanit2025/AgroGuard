"""
Environmental Risk Analysis & Disease-Favourable Forecasting API Routes
Module 5 (Environmental Disease Risk) & Module 9 (SHAP Feature Explainability)
"""
import json
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from ..database.session import get_db
from ..models.models import User, Field, EnvironmentalRecord, RiskPrediction, Alert
from ..schemas.schemas import EnvironmentalAnalyzeRequest, RiskPredictionResponse
from ..ml.risk_predictor import evaluate_environmental_risk
from ..utils.weather import get_weather_for_coordinates
from ..utils.security import get_current_user

router = APIRouter(prefix="/api/environment", tags=["Environmental Risk"])

@router.post("/analyze", response_model=RiskPredictionResponse)
def analyze_environmental_risk(
    request: EnvironmentalAnalyzeRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    field = db.query(Field).filter(Field.field_id == request.field_id, Field.user_id == current_user.user_id).first()
    if not field:
        raise HTTPException(status_code=404, detail="Selected field was not found or access denied.")

    # Determine environmental parameters: manual input takes precedence, otherwise fetch live weather
    if request.temperature is not None and request.humidity is not None:
        temp = request.temperature
        humidity = request.humidity
        rainfall = request.rainfall if request.rainfall is not None else 0.0
        soil_moisture = request.soil_moisture if request.soil_moisture is not None else 65.0
        weather_source = "Manual Field Weather Input"
    else:
        # Fetch live Open-Meteo or agro-climatic simulation
        live_w = get_weather_for_coordinates(field.latitude, field.longitude)
        temp = request.temperature if request.temperature is not None else live_w["temperature"]
        humidity = request.humidity if request.humidity is not None else live_w["humidity"]
        rainfall = request.rainfall if request.rainfall is not None else live_w["rainfall"]
        soil_moisture = request.soil_moisture if request.soil_moisture is not None else live_w["soil_moisture"]
        weather_source = live_w["source"]

    growth_stage = request.growth_stage or field.growth_stage or "Tillering"

    # Evaluate ML risk
    risk_output = evaluate_environmental_risk(
        temperature=temp,
        humidity=humidity,
        rainfall=rainfall,
        soil_moisture=soil_moisture,
        growth_stage=growth_stage,
        crop_type=field.crop_type
    )

    # Persist environmental record
    env_record = EnvironmentalRecord(
        field_id=field.field_id,
        temperature=temp,
        humidity=humidity,
        rainfall=rainfall,
        soil_moisture=soil_moisture,
        source=weather_source,
        record_date=datetime.utcnow()
    )
    db.add(env_record)

    # Persist risk prediction
    risk_pred = RiskPrediction(
        field_id=field.field_id,
        risk_level=risk_output["risk_level"],
        risk_score=risk_output["risk_score"],
        risk_factors=json.dumps(risk_output["risk_factors"]),
        favourable_diseases=json.dumps(risk_output["favourable_diseases"]),
        prediction_date=datetime.utcnow(),
        forecast_period=risk_output["forecast_period"],
        recommended_action=risk_output["recommended_action"]
    )
    db.add(risk_pred)

    # If High Risk, generate an Early Warning Alert
    if risk_output["risk_level"] == "High":
        new_alert = Alert(
            user_id=current_user.user_id,
            field_id=field.field_id,
            title=f"High Disease Environmental Risk: {field.field_name}",
            description=f"Weather parameters (Humidity {humidity}%, Temp {temp}°C) create severe disease-favourable conditions. {risk_output['recommended_action']}",
            risk_level="High",
            is_read=False,
            action_url=f"/risk/{field.field_id}"
        )
        db.add(new_alert)

    db.commit()
    db.refresh(risk_pred)

    return {
        "risk_id": risk_pred.risk_id,
        "field_id": field.field_id,
        "field_name": field.field_name,
        "temperature": temp,
        "humidity": humidity,
        "rainfall": rainfall,
        "soil_moisture": soil_moisture,
        "risk_level": risk_output["risk_level"],
        "risk_score": risk_output["risk_score"],
        "forecast_period": risk_output["forecast_period"],
        "risk_factors": risk_output["risk_factors"],
        "favourable_diseases": risk_output["favourable_diseases"],
        "feature_importance": risk_output["feature_importance"],
        "recommended_action": risk_output["recommended_action"],
        "tamil_recommended_action": risk_output["tamil_recommended_action"],
        "weather_source": weather_source,
        "prediction_date": risk_pred.prediction_date
    }
