"""
Early Warning Alerts & Notification Center API Routes
Module 8: Adaptive notifications and localized warning advisories.
"""
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from ..database.session import get_db
from ..models.models import User, Alert
from ..schemas.schemas import AlertResponse, AlertReadUpdate
from ..utils.security import get_current_user

router = APIRouter(prefix="/api/alerts", tags=["Alerts"])

@router.get("", response_model=List[AlertResponse])
def get_user_alerts(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    alerts = db.query(Alert).filter(Alert.user_id == current_user.user_id).order_by(Alert.created_at.desc()).all()
    results = []
    for a in alerts:
        results.append({
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
            "tamil_title": f"முன்னெச்சரிக்கை: {a.title}",
            "tamil_description": a.description
        })
    return results

@router.patch("/{alert_id}/read")
def mark_alert_as_read(
    alert_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    alert = db.query(Alert).filter(Alert.alert_id == alert_id, Alert.user_id == current_user.user_id).first()
    if not alert:
        raise HTTPException(status_code=404, detail="Alert record not found.")

    alert.is_read = True
    db.commit()
    return {"message": "Alert marked as read", "alert_id": alert_id, "is_read": True}
