"""
Seed Data Script for AgroGuard AI
Seeds realistic demo farmer, Tamil Nadu rice fields, multi-date longitudinal observations,
Grad-CAM heatmaps, interventions, and early warning alerts.
"""
import os
import json
from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from ..models.models import User, Field, CropObservation, EnvironmentalRecord, RiskPrediction, Intervention, Alert
from ..utils.security import hash_password
from ..ml.sample_rice_data import generate_all_sample_assets
from ..ml.disease_classifier import generate_gradcam_visual, extract_pathological_features, decode_base64_image
import cv2

UPLOAD_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "uploads"))

def seed_database(db: Session):
    # Ensure baseline sample assets exist
    generate_all_sample_assets()

    # 1. Create or retrieve demo user
    demo_user = db.query(User).filter(User.email == "demo_farmer@agroguard.ai").first()
    if not demo_user:
        demo_user = User(
            name="Murugan (Demo Farmer)",
            email="demo_farmer@agroguard.ai",
            password_hash=hash_password("agroguard2026"),
            phone="+91 98401 23456",
            language="ta",
            location="Thanjavur Delta, Tamil Nadu",
            created_at=datetime.utcnow() - timedelta(days=30)
        )
        db.add(demo_user)
        db.commit()
        db.refresh(demo_user)

    # Check if fields already seeded
    existing_field = db.query(Field).filter(Field.user_id == demo_user.user_id).first()
    if existing_field:
        return # Already seeded

    now = datetime.utcnow()

    # Helper to generate Grad-CAM for existing sample image
    def make_gradcam(src_filename, disease_name):
        src_path = os.path.join(UPLOAD_DIR, src_filename)
        if os.path.exists(src_path):
            img = cv2.imread(src_path)
            features = extract_pathological_features(img)
            _, heat_name, _ = generate_gradcam_visual(img, features["lesion_mask"], disease_name)
            return f"/uploads/{heat_name}"
        return None

    heat_blast_early = make_gradcam("sample_blast_day14.jpg", "Rice Blast")
    heat_blast_adv = make_gradcam("sample_blast_day24.jpg", "Rice Blast")
    heat_blb = make_gradcam("sample_blb_leaf.jpg", "Bacterial Leaf Blight")
    heat_healthy = make_gradcam("sample_healthy_rice.jpg", "Healthy Crop")

    # Field 1: Cauvery Delta (Longitudinal Case Study: Day 14 -> Day 24 Blast progression)
    field1 = Field(
        user_id=demo_user.user_id,
        field_name="Cauvery North Block (Kallanai Reach)",
        crop_type="Rice / Paddy",
        crop_variety="CR 1009 Sub-1",
        planting_date=(now - timedelta(days=45)).strftime("%Y-%m-%d"),
        area=2.5,
        latitude=10.7870,
        longitude=79.1378, # Thanjavur
        growth_stage="Tillering",
        soil_type="Clay Alluvium",
        created_at=now - timedelta(days=45)
    )
    db.add(field1)
    db.commit()
    db.refresh(field1)

    # Observation 1: Day 14 (Mild Blast)
    obs1 = CropObservation(
        field_id=field1.field_id,
        image_path="/uploads/sample_blast_day14.jpg",
        heatmap_path=heat_blast_early,
        observation_date=now - timedelta(days=10),
        predicted_class="Rice Blast",
        confidence=0.89,
        severity="Mild",
        farmer_notes="Noticed initial spindle spots on lower leaves after 3 consecutive foggy nights.",
        symptoms_detected=json.dumps([
            "Early spindle-shaped elliptical lesions",
            "Brown margins with tiny pale centers"
        ]),
        is_demo=True
    )
    db.add(obs1)
    db.commit()
    db.refresh(obs1)

    # Intervention between observations
    itv1 = Intervention(
        field_id=field1.field_id,
        observation_id=obs1.observation_id,
        action_taken="Applied Pseudomonas fluorescens bio-control foliar spray (1 kg/acre); withheld urea fertilizer.",
        date=now - timedelta(days=8),
        follow_up_notes="Canopy aeration improved. Weather turned rainy 4 days later.",
        outcome_status="Noticeable Improvement"
    )
    db.add(itv1)

    # Observation 2: Day 24 (Recent Observation - Progression tracking)
    obs2 = CropObservation(
        field_id=field1.field_id,
        image_path="/uploads/sample_blast_day24.jpg",
        heatmap_path=heat_blast_adv,
        observation_date=now - timedelta(hours=5),
        predicted_class="Rice Blast",
        confidence=0.94,
        severity="Moderate",
        farmer_notes="Follow-up after heavy rains. Blast lesions enlarged slightly despite bio-spray.",
        symptoms_detected=json.dumps([
            "Coalescing blast lesions",
            "Necrotic ash-gray lesion centers",
            "Chlorotic yellow surrounding halos"
        ]),
        is_demo=True
    )
    db.add(obs2)

    # Risk for Field 1
    risk1 = RiskPrediction(
        field_id=field1.field_id,
        risk_level="High",
        risk_score=78.5,
        risk_factors=json.dumps([
            "Excessive relative humidity (86%) sustaining continuous leaf dew",
            "Cooler nocturnal temperatures (23.5°C) optimal for Blast sporulation",
            "Dense canopy during active tillering phase"
        ]),
        favourable_diseases=json.dumps([
            {"disease_name": "Rice Blast", "tamil_name": "நெல் குலை நோய்", "risk_percentage": 88.0, "status": "High Risk"},
            {"disease_name": "Sheath Blight", "tamil_name": "உறை அழுகல்", "risk_percentage": 72.0, "status": "High Risk"}
        ]),
        prediction_date=now - timedelta(hours=3),
        forecast_period="Next 3 to 5 Days",
        recommended_action="Maintain strict field drainage. Avoid stagnant standing water. Inspect upper leaf canopy daily."
    )
    db.add(risk1)

    # Field 2: Vennar Basin, Tiruvarur (Bacterial Leaf Blight)
    field2 = Field(
        user_id=demo_user.user_id,
        field_name="Vennar Delta Basin - Plot B",
        crop_type="Rice / Paddy",
        crop_variety="BPT 5204 (Samba Mahsuri)",
        planting_date=(now - timedelta(days=60)).strftime("%Y-%m-%d"),
        area=3.0,
        latitude=10.7725,
        longitude=79.6365, # Tiruvarur
        growth_stage="Panicle Initiation",
        soil_type="Deep Deltaic Clay",
        created_at=now - timedelta(days=60)
    )
    db.add(field2)
    db.commit()
    db.refresh(field2)

    obs3 = CropObservation(
        field_id=field2.field_id,
        image_path="/uploads/sample_blb_leaf.jpg",
        heatmap_path=heat_blb,
        observation_date=now - timedelta(days=2),
        predicted_class="Bacterial Leaf Blight",
        confidence=0.92,
        severity="Moderate",
        farmer_notes="Wavy yellow borders expanding from tip downwards after gusty monsoon wind.",
        symptoms_detected=json.dumps([
            "Water-soaked yellow wavy marginal lesions",
            "Bleached straw-colored leaf blade margins"
        ]),
        is_demo=True
    )
    db.add(obs3)

    risk2 = RiskPrediction(
        field_id=field2.field_id,
        risk_level="Moderate",
        risk_score=54.0,
        risk_factors=json.dumps([
            "Wind-driven rain showers spreading bacterial exudate droplets",
            "Temperature hovering at 30°C promotes bacterial multiplying"
        ]),
        favourable_diseases=json.dumps([
            {"disease_name": "Bacterial Leaf Blight", "tamil_name": "பாக்டீரியா இலைக்கருகல்", "risk_percentage": 76.0, "status": "High Risk"}
        ]),
        prediction_date=now - timedelta(days=1),
        forecast_period="Next 3 to 5 Days",
        recommended_action="Drain standing floodwater. Do not clip diseased seedling tips."
    )
    db.add(risk2)

    # Field 3: Palur Adjoining, Cuddalore (Healthy Crop)
    field3 = Field(
        user_id=demo_user.user_id,
        field_name="Palur Coastal Basin - Field C",
        crop_type="Rice / Paddy",
        crop_variety="ADT 37",
        planting_date=(now - timedelta(days=25)).strftime("%Y-%m-%d"),
        area=1.8,
        latitude=11.7564,
        longitude=79.7634, # Cuddalore
        growth_stage="Vegetative",
        soil_type="Coastal Sandy Loam",
        created_at=now - timedelta(days=25)
    )
    db.add(field3)
    db.commit()
    db.refresh(field3)

    obs4 = CropObservation(
        field_id=field3.field_id,
        image_path="/uploads/sample_healthy_rice.jpg",
        heatmap_path=heat_healthy,
        observation_date=now - timedelta(days=4),
        predicted_class="Healthy Crop",
        confidence=0.96,
        severity="None",
        farmer_notes="Crop is flourishing well with deep green foliage. Standard weeding completed.",
        symptoms_detected=json.dumps([
            "Vigorous photosynthetic green leaf area",
            "No necrotic or chlorotic lesions detected"
        ]),
        is_demo=True
    )
    db.add(obs4)

    # Early Warning Alerts
    alert1 = Alert(
        user_id=demo_user.user_id,
        field_id=field1.field_id,
        title="High Environmental Risk for Rice Blast",
        description="High relative humidity (86%) and cool nighttime temperatures in Thanjavur create prime conditions for Rice Blast spore germination. Recommended: inspect lower leaves and avoid excess urea.",
        risk_level="High",
        created_at=now - timedelta(hours=3),
        is_read=False,
        action_url=f"/risk/{field1.field_id}"
    )
    alert2 = Alert(
        user_id=demo_user.user_id,
        field_id=field2.field_id,
        title="Bacterial Leaf Blight Detected in Vennar Plot",
        description="Observation confirmed Bacterial Leaf Blight symptoms. Recommended: Drain standing water immediately and suspend top-dress nitrogen.",
        risk_level="Moderate",
        created_at=now - timedelta(days=2),
        is_read=False,
        action_url=f"/history/{field2.field_id}"
    )
    db.add(alert1)
    db.add(alert2)

    db.commit()
