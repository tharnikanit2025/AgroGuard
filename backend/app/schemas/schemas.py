"""
Pydantic Schemas for Request & Response Data Validation
"""
from datetime import datetime
from typing import List, Optional, Any, Dict
from pydantic import BaseModel, Field

# ----------------- User Schemas -----------------
class UserRegister(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    email: str = Field(..., min_length=3, max_length=120)
    password: str = Field(..., min_length=4)
    phone: Optional[str] = None
    language: Optional[str] = "en"
    location: Optional[str] = "Thanjavur, Tamil Nadu"

class UserLogin(BaseModel):
    email: str
    password: str

class UserResponse(BaseModel):
    user_id: int
    name: str
    email: str
    phone: Optional[str] = None
    language: str
    location: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str
    user: UserResponse

# ----------------- Field Schemas -----------------
class FieldCreate(BaseModel):
    field_name: str = Field(..., min_length=1, max_length=100)
    crop_type: Optional[str] = "Rice / Paddy"
    crop_variety: Optional[str] = "Ponni"
    planting_date: Optional[str] = None
    area: Optional[float] = 1.0
    latitude: float
    longitude: float
    growth_stage: Optional[str] = "Tillering"
    soil_type: Optional[str] = "Alluvial Clay Loam"

class FieldResponse(BaseModel):
    field_id: int
    user_id: int
    field_name: str
    crop_type: str
    crop_variety: Optional[str] = None
    planting_date: Optional[str] = None
    area: float
    latitude: float
    longitude: float
    growth_stage: str
    soil_type: Optional[str] = None
    created_at: datetime
    latest_observation: Optional[Any] = None
    latest_risk_level: Optional[str] = "Low"

    class Config:
        from_attributes = True

# ----------------- Observation Schemas -----------------
class ObservationAnalyzeRequest(BaseModel):
    field_id: int
    image_base64: str # data URL or raw base64 string
    farmer_notes: Optional[str] = None
    growth_stage_observed: Optional[str] = None

class GradCamExplanation(BaseModel):
    heatmap_url: str
    critical_regions_count: int
    salient_feature_summary: str
    feature_activation_intensity: float
    explanation_text: str
    tamil_explanation: str

class ObservationResponse(BaseModel):
    observation_id: int
    field_id: int
    field_name: Optional[str] = None
    image_path: str
    heatmap_path: Optional[str] = None
    observation_date: datetime
    predicted_class: str
    confidence: float
    severity: str
    farmer_notes: Optional[str] = None
    symptoms_detected: Optional[List[str]] = []
    is_demo: bool = False
    explainability: Optional[GradCamExplanation] = None
    recommendations: Optional[List[str]] = []
    tamil_name: Optional[str] = None
    tamil_recommendations: Optional[List[str]] = []

    class Config:
        from_attributes = True

class ObservationCompareRequest(BaseModel):
    earlier_observation_id: int
    recent_observation_id: int

class ObservationCompareResponse(BaseModel):
    earlier_observation: ObservationResponse
    recent_observation: ObservationResponse
    days_elapsed: int
    progression_summary: str
    severity_change: str # "Improved", "Stable", "Deteriorated", "Inconclusive"
    visual_change_notes: List[str]
    adaptive_recommendation: str
    tamil_progression_summary: str

# ----------------- Environmental & Risk Schemas -----------------
class EnvironmentalAnalyzeRequest(BaseModel):
    field_id: int
    temperature: Optional[float] = None # If None, will auto-fetch from live weather API
    humidity: Optional[float] = None
    rainfall: Optional[float] = None
    soil_moisture: Optional[float] = None
    growth_stage: Optional[str] = None

class FeatureImportanceItem(BaseModel):
    feature: str
    importance: float # 0 to 1
    effect: str # "Increases Risk", "Neutral", "Decreases Risk"
    description: str

class RiskPredictionResponse(BaseModel):
    risk_id: Optional[int] = None
    field_id: int
    field_name: Optional[str] = None
    temperature: float
    humidity: float
    rainfall: float
    soil_moisture: float
    risk_level: str # "Low", "Moderate", "High"
    risk_score: float # 0 to 100
    forecast_period: str
    risk_factors: List[str]
    favourable_diseases: List[Dict[str, Any]]
    feature_importance: List[FeatureImportanceItem]
    recommended_action: str
    tamil_recommended_action: str
    weather_source: str
    prediction_date: datetime

# ----------------- Intervention Schemas -----------------
class InterventionCreate(BaseModel):
    field_id: int
    observation_id: Optional[int] = None
    action_taken: str
    follow_up_notes: Optional[str] = None
    outcome_status: Optional[str] = "Pending Review"

class InterventionResponse(BaseModel):
    intervention_id: int
    field_id: int
    field_name: Optional[str] = None
    observation_id: Optional[int] = None
    action_taken: str
    date: datetime
    follow_up_notes: Optional[str] = None
    outcome_status: str

    class Config:
        from_attributes = True

# ----------------- Alert Schemas -----------------
class AlertResponse(BaseModel):
    alert_id: int
    user_id: int
    field_id: Optional[int] = None
    field_name: Optional[str] = None
    title: str
    description: str
    risk_level: str
    created_at: datetime
    is_read: bool
    action_url: Optional[str] = None
    tamil_title: Optional[str] = None
    tamil_description: Optional[str] = None

    class Config:
        from_attributes = True

class AlertReadUpdate(BaseModel):
    is_read: bool = True

# ----------------- Dashboard Schemas -----------------
class DashboardStats(BaseModel):
    total_fields: int
    total_observations: int
    active_disease_alerts: int
    elevated_risk_fields: int

class DashboardResponse(BaseModel):
    stats: DashboardStats
    recent_observations: List[ObservationResponse]
    recent_alerts: List[AlertResponse]
    field_summaries: List[FieldResponse]
    latest_risk_records: List[RiskPredictionResponse]
