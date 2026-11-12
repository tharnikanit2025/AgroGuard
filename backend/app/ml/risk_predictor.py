"""
Environmental Disease Risk Prediction & Feature Importance (SHAP-style) Engine
Scientifically grounded in rice epidemiology (TNAU & IRRI disease weather thresholds).
Assesses risk of weather conditions being favourable for pathogen proliferation.
"""
from typing import Dict, Any, List
from datetime import datetime

def evaluate_environmental_risk(
    temperature: float,
    humidity: float,
    rainfall: float,
    soil_moisture: float,
    growth_stage: str = "Tillering",
    crop_type: str = "Rice / Paddy"
) -> Dict[str, Any]:
    """
    Evaluate disease-favourable environmental risk.
    Scores 0-100:
    0-39: Low Risk
    40-69: Moderate Risk
    70-100: High Risk
    """
    risk_score = 15.0 # baseline nominal risk
    factors = []
    feature_importances = []
    favourable_diseases = []

    # 1. Temperature Analysis (Rice Blast optimal: 20-28°C; BLB: 28-34°C)
    temp_weight = 0.0
    temp_effect = "Neutral"
    temp_desc = f"Ambient temperature is {temperature}°C."
    if 20.0 <= temperature <= 27.0:
        temp_weight = 0.28
        risk_score += 20.0
        temp_effect = "Increases Risk"
        temp_desc = f"Cooler temperatures ({temperature}°C) combined with high moisture favour Rice Blast sporulation."
        factors.append("Cooler temperature range (20-27°C) highly favourable for fungal spore germination")
    elif 28.0 <= temperature <= 34.0:
        temp_weight = 0.22
        risk_score += 15.0
        temp_effect = "Increases Risk"
        temp_desc = f"Warm temperatures ({temperature}°C) accelerate Bacterial Leaf Blight multiplication."
        factors.append("Warm temperature (28-34°C) accelerates bacterial blight lesion elongation")
    else:
        temp_weight = 0.10
        temp_desc = f"Temperature ({temperature}°C) is outside peak fungal/bacterial proliferation ranges."

    feature_importances.append({
        "feature": "Temperature (°C)",
        "importance": round(temp_weight, 2),
        "effect": temp_effect,
        "description": temp_desc
    })

    # 2. Relative Humidity Analysis (Key driver for Blast, Sheath Blight, BLB)
    hum_weight = 0.0
    hum_effect = "Neutral"
    hum_desc = f"Relative humidity is {humidity}%."
    if humidity >= 88.0:
        hum_weight = 0.45
        risk_score += 35.0
        hum_effect = "Increases Risk"
        hum_desc = f"Extremely saturated air ({humidity}%) prolongs leaf wetness beyond 10-12 hours, enabling spore infection."
        factors.append(f"Excessive humidity ({humidity}%) causes prolonged dew on leaf canopies")
    elif humidity >= 75.0:
        hum_weight = 0.32
        risk_score += 20.0
        hum_effect = "Increases Risk"
        hum_desc = f"High humidity ({humidity}%) sustains active pathogen incubation."
        factors.append(f"Elevated relative humidity ({humidity}%) supports fungal incubation")
    else:
        hum_weight = 0.15
        risk_score -= 8.0
        hum_effect = "Decreases Risk"
        hum_desc = f"Moderate humidity ({humidity}%) allows leaves to dry, reducing infection window."

    feature_importances.append({
        "feature": "Relative Humidity (%)",
        "importance": round(hum_weight, 2),
        "effect": hum_effect,
        "description": hum_desc
    })

    # 3. Rainfall / Precipitation Analysis
    rain_weight = 0.0
    rain_effect = "Neutral"
    rain_desc = f"Rainfall is {rainfall} mm."
    if rainfall > 15.0:
        rain_weight = 0.35
        risk_score += 25.0
        rain_effect = "Increases Risk"
        rain_desc = f"Heavy rainfall ({rainfall} mm) causes splash dispersal of bacterial and fungal inoculum across plants."
        factors.append(f"Rainfall ({rainfall} mm) induces water splash transmission of pathogens")
    elif rainfall > 2.0:
        rain_weight = 0.20
        risk_score += 12.0
        rain_effect = "Increases Risk"
        rain_desc = f"Intermittent showers ({rainfall} mm) keep the crop canopy continuously moist."
        factors.append("Intermittent rain showers promote leaf moisture retention")
    else:
        rain_weight = 0.12
        rain_effect = "Neutral"
        rain_desc = "No significant rainfall registered."

    feature_importances.append({
        "feature": "Rainfall (mm)",
        "importance": round(rain_weight, 2),
        "effect": rain_effect,
        "description": rain_desc
    })

    # 4. Growth Stage Susceptibility
    stage_weight = 0.15
    stage_effect = "Neutral"
    stage_desc = f"Current growth stage: {growth_stage}."
    if growth_stage in ["Tillering", "Panicle Initiation", "Flowering / Heading"]:
        stage_weight = 0.25
        risk_score += 12.0
        stage_effect = "Increases Risk"
        stage_desc = f"Paddy is in {growth_stage} stage, which represents the highest canopy density and physiological susceptibility."
        factors.append(f"Dense canopy during {growth_stage} stage restricts air circulation")
    feature_importances.append({
        "feature": "Crop Growth Stage",
        "importance": round(stage_weight, 2),
        "effect": stage_effect,
        "description": stage_desc
    })

    # Bound final risk score between 5 and 96
    risk_score = round(max(5.0, min(96.0, risk_score)), 1)

    # Classify Risk Level
    if risk_score >= 70.0:
        risk_level = "High"
        recommended_action = "Intensify scouting: inspect lower canopy and field corners twice weekly. Avoid heavy nitrogen top dressing while humidity remains elevated."
        tamil_recommended_action = "கள ஆய்வை தீவிரப்படுத்தவும்: கீழ்மட்ட இலைகள் மற்றும் வரப்போரங்களை வாரம் இருமுறை கண்காணிக்கவும். ஈரப்பதம் குறையும் வரை அதிக தழைச்சத்து இடுவதைத் தவிர்க்கவும்."
    elif risk_score >= 40.0:
        risk_level = "Moderate"
        recommended_action = "Maintain regular surveillance. Check for early water-soaked or spindle lesions during morning dew. Ensure clear drainage channels."
        tamil_recommended_action = "வழக்கமான கண்காணிப்பைத் தொடரவும். அதிகாலை பனி வேளையில் இலைகளில் புள்ளிகள் உள்ளதா எனப் பார்க்கவும். வடிகால் வாய்க்கால்களை தூர்வாரவும்."
    else:
        risk_level = "Low"
        recommended_action = "Weather conditions are currently unfavorable for epidemic disease spread. Continue standard scheduled cultural practices."
        tamil_recommended_action = "தற்போதைய வானிலை நோய் பரவலுக்கு ஏதுவானதாக இல்லை. வழக்கமான சாகுபடி பணிகளைத் தொடரலாம்."

    # Assess specific disease affinities based on conditions
    blast_risk = round(min(98.0, max(10.0, (humidity * 0.6) + (25 - abs(temperature - 24)) * 1.5 + (rainfall * 0.8))), 1)
    blb_risk = round(min(98.0, max(10.0, (humidity * 0.5) + (rainfall * 2.2) + (temperature * 0.7))), 1)
    sheath_risk = round(min(98.0, max(10.0, (humidity * 0.65) + (soil_moisture * 0.3))), 1)
    brown_spot_risk = round(min(95.0, max(10.0, 30.0 + (100 - soil_moisture) * 0.4 + (temperature * 0.3))), 1)

    favourable_diseases = [
        {
            "disease_name": "Rice Blast",
            "tamil_name": "நெல் குலை நோய்",
            "risk_percentage": blast_risk,
            "status": "High Risk" if blast_risk > 70 else ("Moderate" if blast_risk > 45 else "Low")
        },
        {
            "disease_name": "Bacterial Leaf Blight",
            "tamil_name": "பாக்டீரியா இலைக்கருகல்",
            "risk_percentage": blb_risk,
            "status": "High Risk" if blb_risk > 70 else ("Moderate" if blb_risk > 45 else "Low")
        },
        {
            "disease_name": "Sheath Blight",
            "tamil_name": "உறை அழுகல் நோய்",
            "risk_percentage": sheath_risk,
            "status": "High Risk" if sheath_risk > 70 else ("Moderate" if sheath_risk > 45 else "Low")
        },
        {
            "disease_name": "Brown Spot",
            "tamil_name": "பழுப்பு புள்ளி நோய்",
            "risk_percentage": brown_spot_risk,
            "status": "High Risk" if brown_spot_risk > 70 else ("Moderate" if brown_spot_risk > 45 else "Low")
        }
    ]

    return {
        "risk_level": risk_level,
        "risk_score": risk_score,
        "risk_factors": factors if factors else ["Environmental conditions are balanced within safe agronomic thresholds"],
        "feature_importance": feature_importances,
        "favourable_diseases": favourable_diseases,
        "forecast_period": "Next 3 to 5 Days (Agro-Climatic Window)",
        "recommended_action": recommended_action,
        "tamil_recommended_action": tamil_recommended_action
    }
