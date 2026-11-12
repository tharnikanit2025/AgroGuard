"""
Crop Observation & Longitudinal Image Progression Tracking API Routes
Module 4 (Disease Detection + Grad-CAM) & Module 7 (Image Comparison & Progression)
"""
import json
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from ..database.session import get_db
from ..models.models import User, Field, CropObservation, Alert
from ..schemas.schemas import (
    ObservationAnalyzeRequest,
    ObservationResponse,
    ObservationCompareRequest,
    ObservationCompareResponse
)
from ..ml.disease_classifier import analyze_crop_image
from ..utils.security import get_current_user
from ..utils.i18n import get_disease_info

router = APIRouter(prefix="/api/observations", tags=["Observations"])

@router.post("/analyze", response_model=ObservationResponse)
def analyze_observation(
    request: ObservationAnalyzeRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    field = db.query(Field).filter(Field.field_id == request.field_id, Field.user_id == current_user.user_id).first()
    if not field:
        raise HTTPException(status_code=404, detail="Selected field was not found or access is unauthorized.")

    try:
        analysis_result = analyze_crop_image(request.image_base64, request.farmer_notes)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Image processing failed: {str(e)}")

    # Update field growth stage if specified by farmer during observation
    if request.growth_stage_observed:
        field.growth_stage = request.growth_stage_observed

    # Persist observation in database
    new_obs = CropObservation(
        field_id=field.field_id,
        image_path=analysis_result["image_path"],
        heatmap_path=analysis_result["heatmap_path"],
        observation_date=datetime.utcnow(),
        predicted_class=analysis_result["predicted_class"],
        confidence=analysis_result["confidence"],
        severity=analysis_result["severity"],
        farmer_notes=request.farmer_notes,
        symptoms_detected=json.dumps(analysis_result["symptoms_detected"]),
        is_demo=False
    )
    db.add(new_obs)

    # If disease detected (not healthy), automatically create an Early Warning Alert
    if analysis_result["predicted_class"] != "Healthy Crop":
        new_alert = Alert(
            user_id=current_user.user_id,
            field_id=field.field_id,
            title=f"New Disease Detected: {analysis_result['predicted_class']}",
            description=f"AI confirmed {analysis_result['predicted_class']} ({analysis_result['severity']} severity) in '{field.field_name}'. Recommended action: {analysis_result['recommendations'][0]}",
            risk_level="High" if analysis_result["severity"] == "Severe" else "Moderate",
            is_read=False,
            action_url=f"/history/{field.field_id}"
        )
        db.add(new_alert)

    db.commit()
    db.refresh(new_obs)

    response_data = {
        "observation_id": new_obs.observation_id,
        "field_id": field.field_id,
        "field_name": field.field_name,
        "image_path": new_obs.image_path,
        "heatmap_path": new_obs.heatmap_path,
        "observation_date": new_obs.observation_date,
        "predicted_class": new_obs.predicted_class,
        "confidence": new_obs.confidence,
        "severity": new_obs.severity,
        "farmer_notes": new_obs.farmer_notes,
        "symptoms_detected": analysis_result["symptoms_detected"],
        "is_demo": new_obs.is_demo,
        "explainability": analysis_result["explainability"],
        "recommendations": analysis_result["recommendations"],
        "tamil_name": analysis_result["tamil_name"],
        "tamil_recommendations": analysis_result["tamil_recommendations"]
    }

    return response_data

@router.post("/compare", response_model=ObservationCompareResponse)
def compare_observations(
    req: ObservationCompareRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Module 7: Longitudinal Image Comparison & Disease Progression Tracking
    Compares earlier and recent crop leaf observations side-by-side.
    """
    earlier = db.query(CropObservation).join(Field).filter(
        CropObservation.observation_id == req.earlier_observation_id,
        Field.user_id == current_user.user_id
    ).first()

    recent = db.query(CropObservation).join(Field).filter(
        CropObservation.observation_id == req.recent_observation_id,
        Field.user_id == current_user.user_id
    ).first()

    if not earlier or not recent:
        raise HTTPException(status_code=404, detail="One or both observation records could not be found.")

    # Calculate days elapsed
    delta = recent.observation_date - earlier.observation_date
    days_elapsed = max(0, delta.days)

    severity_order = {"None": 0, "Mild": 1, "Moderate": 2, "Severe": 3}
    s_early = severity_order.get(earlier.severity, 0)
    s_recent = severity_order.get(recent.severity, 0)

    visual_notes = []
    if s_recent > s_early:
        severity_change = "Deteriorated"
        progression_summary = f"Visual symptom progression observed over {days_elapsed} days. Lesion density transitioned from {earlier.severity} to {recent.severity}."
        tamil_progression_summary = f"{days_elapsed} நாட்களில் நோய் அறிகுறிகள் அதிகரித்துள்ளது கண்டறியப்பட்டுள்ளது. தாக்கம் {earlier.severity} நிலையிலிருந்து {recent.severity} நிலைக்கு மாறியுள்ளது."
        visual_notes.append("Significant expansion of necrotic lesion area and chlorotic margins.")
        visual_notes.append("Active disease spread requires immediate intervention and canopy aeration.")
        adaptive_recommendation = "Previous management was insufficient to arrest lesion spread. Promptly apply biocontrol or consult your local agricultural officer."
    elif s_recent < s_early:
        severity_change = "Improved"
        progression_summary = f"Positive recovery observed over {days_elapsed} days. Symptom severity receded from {earlier.severity} to {recent.severity}."
        tamil_progression_summary = f"{days_elapsed} நாட்களில் பயிரில் நல்ல முன்னேற்றம் காணப்படுகிறது. நோய் தீவிரம் {earlier.severity} நிலையிலிருந்து {recent.severity} ஆகக் குறைந்துள்ளது."
        visual_notes.append("Lesion borders appear dry and localized; no fresh water-soaked expansions.")
        visual_notes.append("Emergence of healthy chlorophyll-rich leaf tissue.")
        adaptive_recommendation = "Intervention has successfully checked disease proliferation. Maintain current balanced nutrient and irrigation regimen."
    else:
        severity_change = "Stable"
        progression_summary = f"Symptoms appear stable with no rapid expansion over {days_elapsed} days ({earlier.severity} severity)."
        tamil_progression_summary = f"{days_elapsed} நாட்களில் நோய் பரவல் கட்டுக்குள் உள்ளது; புதிதாக பரவவில்லை."
        visual_notes.append("Lesions remain contained within existing margins.")
        adaptive_recommendation = "Continue watchful monitoring every 3 to 4 days."

    e_info = get_disease_info(earlier.predicted_class)
    r_info = get_disease_info(recent.predicted_class)

    earlier_resp = {
        "observation_id": earlier.observation_id,
        "field_id": earlier.field_id,
        "field_name": earlier.field.field_name,
        "image_path": earlier.image_path,
        "heatmap_path": earlier.heatmap_path,
        "observation_date": earlier.observation_date,
        "predicted_class": earlier.predicted_class,
        "confidence": earlier.confidence,
        "severity": earlier.severity,
        "farmer_notes": earlier.farmer_notes,
        "symptoms_detected": json.loads(earlier.symptoms_detected) if earlier.symptoms_detected else [],
        "is_demo": earlier.is_demo,
        "recommendations": e_info["recommendations"][:2],
        "tamil_name": e_info["tamil_name"]
    }

    recent_resp = {
        "observation_id": recent.observation_id,
        "field_id": recent.field_id,
        "field_name": recent.field.field_name,
        "image_path": recent.image_path,
        "heatmap_path": recent.heatmap_path,
        "observation_date": recent.observation_date,
        "predicted_class": recent.predicted_class,
        "confidence": recent.confidence,
        "severity": recent.severity,
        "farmer_notes": recent.farmer_notes,
        "symptoms_detected": json.loads(recent.symptoms_detected) if recent.symptoms_detected else [],
        "is_demo": recent.is_demo,
        "recommendations": r_info["recommendations"][:2],
        "tamil_name": r_info["tamil_name"]
    }

    return {
        "earlier_observation": earlier_resp,
        "recent_observation": recent_resp,
        "days_elapsed": days_elapsed,
        "progression_summary": progression_summary,
        "severity_change": severity_change,
        "visual_change_notes": visual_notes,
        "adaptive_recommendation": adaptive_recommendation,
        "tamil_progression_summary": tamil_progression_summary
    }
