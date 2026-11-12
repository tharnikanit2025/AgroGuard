"""
SQLAlchemy ORM Models for AgroGuard AI
Organized for clean migration to PostgreSQL.
"""
from datetime import datetime
from sqlalchemy import (
    Column, Integer, String, Float, DateTime, Boolean, Text, ForeignKey
)
from sqlalchemy.orm import relationship
from ..database.base import Base

class User(Base):
    __tablename__ = "users"

    user_id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    name = Column(String(120), nullable=False)
    email = Column(String(120), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    phone = Column(String(30), nullable=True)
    language = Column(String(10), default="en") # 'en' or 'ta'
    location = Column(String(200), nullable=True) # e.g. "Thanjavur, Tamil Nadu"
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    fields = relationship("Field", back_populates="owner", cascade="all, delete-orphan")
    alerts = relationship("Alert", back_populates="user", cascade="all, delete-orphan")


class Field(Base):
    __tablename__ = "fields"

    field_id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.user_id"), nullable=False)
    field_name = Column(String(120), nullable=False)
    crop_type = Column(String(80), default="Rice / Paddy")
    crop_variety = Column(String(80), nullable=True) # e.g. "Ponni", "IR 64", "ADT 45"
    planting_date = Column(String(30), nullable=True)
    area = Column(Float, default=1.0) # in acres
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    growth_stage = Column(String(80), default="Tillering") # Vegetative, Tillering, Panicle Initiation, Flowering, Ripening
    soil_type = Column(String(80), default="Alluvial Clay Loam")
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    owner = relationship("User", back_populates="fields")
    observations = relationship("CropObservation", back_populates="field", cascade="all, delete-orphan", order_by="desc(CropObservation.observation_date)")
    environmental_records = relationship("EnvironmentalRecord", back_populates="field", cascade="all, delete-orphan")
    risk_predictions = relationship("RiskPrediction", back_populates="field", cascade="all, delete-orphan")
    interventions = relationship("Intervention", back_populates="field", cascade="all, delete-orphan")
    alerts = relationship("Alert", back_populates="field", cascade="all, delete-orphan")


class CropObservation(Base):
    __tablename__ = "crop_observations"

    observation_id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    field_id = Column(Integer, ForeignKey("fields.field_id"), nullable=False)
    image_path = Column(String(255), nullable=False)
    heatmap_path = Column(String(255), nullable=True) # Grad-CAM overlay image path
    observation_date = Column(DateTime, default=datetime.utcnow)
    predicted_class = Column(String(100), nullable=False)
    confidence = Column(Float, nullable=False) # 0.0 to 1.0
    severity = Column(String(50), default="None") # "None", "Mild", "Moderate", "Severe"
    farmer_notes = Column(Text, nullable=True)
    symptoms_detected = Column(Text, nullable=True) # JSON array string of detected visual features
    is_demo = Column(Boolean, default=False)

    # Relationships
    field = relationship("Field", back_populates="observations")
    interventions = relationship("Intervention", back_populates="observation")


class EnvironmentalRecord(Base):
    __tablename__ = "environmental_records"

    record_id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    field_id = Column(Integer, ForeignKey("fields.field_id"), nullable=False)
    temperature = Column(Float, nullable=False) # in °C
    humidity = Column(Float, nullable=False)    # in %
    rainfall = Column(Float, default=0.0)      # in mm
    soil_moisture = Column(Float, default=65.0)# in %
    source = Column(String(80), default="Open-Meteo Live API")
    record_date = Column(DateTime, default=datetime.utcnow)

    # Relationships
    field = relationship("Field", back_populates="environmental_records")


class RiskPrediction(Base):
    __tablename__ = "risk_predictions"

    risk_id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    field_id = Column(Integer, ForeignKey("fields.field_id"), nullable=False)
    risk_level = Column(String(30), nullable=False) # "Low", "Moderate", "High"
    risk_score = Column(Float, nullable=False) # 0 to 100
    risk_factors = Column(Text, nullable=False) # JSON string of factors and weights
    favourable_diseases = Column(Text, nullable=False) # JSON string of disease risk scores
    prediction_date = Column(DateTime, default=datetime.utcnow)
    forecast_period = Column(String(50), default="Next 3 to 5 Days")
    recommended_action = Column(Text, nullable=True)

    # Relationships
    field = relationship("Field", back_populates="risk_predictions")


class Intervention(Base):
    __tablename__ = "interventions"

    intervention_id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    field_id = Column(Integer, ForeignKey("fields.field_id"), nullable=False)
    observation_id = Column(Integer, ForeignKey("crop_observations.observation_id"), nullable=True)
    action_taken = Column(Text, nullable=False)
    date = Column(DateTime, default=datetime.utcnow)
    follow_up_notes = Column(Text, nullable=True)
    outcome_status = Column(String(50), default="Pending Review")

    # Relationships
    field = relationship("Field", back_populates="interventions")
    observation = relationship("CropObservation", back_populates="interventions")


class Alert(Base):
    __tablename__ = "alerts"

    alert_id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.user_id"), nullable=False)
    field_id = Column(Integer, ForeignKey("fields.field_id"), nullable=True)
    title = Column(String(150), nullable=False)
    description = Column(Text, nullable=False)
    risk_level = Column(String(30), default="Moderate") # "Low", "Moderate", "High", "Critical"
    created_at = Column(DateTime, default=datetime.utcnow)
    is_read = Column(Boolean, default=False)
    action_url = Column(String(100), nullable=True)

    # Relationships
    user = relationship("User", back_populates="alerts")
    field = relationship("Field", back_populates="alerts")
