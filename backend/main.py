"""
AgroGuard AI - Backend Application Entrypoint
FastAPI REST API server with Computer Vision, ML Explainability, and Database Persistence.
"""
import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from app.database.session import engine, SessionLocal
from app.database.base import Base
from app.models.models import (
    User, Field, CropObservation, EnvironmentalRecord, RiskPrediction, Intervention, Alert
)
from app.api import auth, dashboard, fields, observations, environment, interventions, alerts
from app.services.seed_data import seed_database

# Create all database tables
Base.metadata.create_all(bind=engine)

# Path to directories
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
UPLOAD_DIR = os.path.abspath(os.path.join(BASE_DIR, "uploads"))
STATIC_DIR = os.path.abspath(os.path.join(BASE_DIR, "app", "static"))
INDEX_HTML = os.path.join(STATIC_DIR, "index.html")
os.makedirs(UPLOAD_DIR, exist_ok=True)
os.makedirs(STATIC_DIR, exist_ok=True)

# Run seed data on initialization
with SessionLocal() as db:
    try:
        seed_database(db)
    except Exception as e:
        print(f"Warning during seed data: {e}")

app = FastAPI(
    title="AgroGuard AI API",
    description="An AI-Driven Longitudinal Crop Health Monitoring, Disease Progression Tracking and Adaptive Early Warning System.",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount static files directories
app.mount("/uploads", StaticFiles(directory=UPLOAD_DIR), name="uploads")
app.mount("/static", StaticFiles(directory=STATIC_DIR), name="static")

# Include API Routers
app.include_router(auth.router)
app.include_router(dashboard.router)
app.include_router(fields.router)
app.include_router(observations.router)
app.include_router(environment.router)
app.include_router(interventions.router)
app.include_router(alerts.router)

@app.get("/")
def root():
    if os.path.exists(INDEX_HTML):
        return FileResponse(INDEX_HTML)
    return {
        "project": "AgroGuard AI",
        "title": "An AI-Driven Longitudinal Crop Health Monitoring, Disease Progression Tracking and Adaptive Early Warning System",
        "team": "KAIROS",
        "institution": "Chennai Institute of Technology, Chennai",
        "status": "Operational",
        "docs_url": "/docs"
    }

@app.get("/app")
def serve_app():
    if os.path.exists(INDEX_HTML):
        return FileResponse(INDEX_HTML)
    return {"message": "Web client loading..."}

@app.get("/api/health")
def health_check():
    return {"status": "healthy", "service": "AgroGuard AI Backend"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
