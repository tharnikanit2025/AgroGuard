"""
Weather Service integration with Open-Meteo API and robust agro-climatic fallback for Tamil Nadu.
"""
import requests
from typing import Dict, Any

def get_weather_for_coordinates(lat: float, lon: float) -> Dict[str, Any]:
    """
    Fetch live weather data from Open-Meteo free public API.
    Gracefully falls back to realistic agro-climatic profile if offline or network unavailable.
    """
    url = (
        f"https://api.open-meteo.com/v1/forecast?"
        f"latitude={lat}&longitude={lon}&current=temperature_2m,relative_humidity_2m,rain&timezone=auto"
    )
    
    try:
        response = requests.get(url, timeout=3.0)
        if response.status_code == 200:
            data = response.json()
            current = data.get("current", {})
            temp = float(current.get("temperature_2m", 28.5))
            humidity = float(current.get("relative_humidity_2m", 78.0))
            rain = float(current.get("rain", 0.0))
            
            # Estimate soil moisture based on rainfall & humidity
            soil_moist = min(95.0, max(45.0, 60.0 + (rain * 2.5) + ((humidity - 60) * 0.3)))
            
            return {
                "temperature": round(temp, 1),
                "humidity": round(humidity, 1),
                "rainfall": round(rain, 1),
                "soil_moisture": round(soil_moist, 1),
                "source": "Open-Meteo Live Weather API"
            }
    except Exception:
        pass

    # Deterministic regional fallback based on coordinate jitter (Cauvery Delta / Tamil Nadu)
    # Typical Tamil Nadu paddy climate: 28-32°C, 72-85% humidity
    lat_factor = abs(lat - 10.78) # Distance from Thanjavur
    lon_factor = abs(lon - 79.13)
    
    fallback_temp = round(29.4 + (lat_factor * 0.5) - (lon_factor * 0.2), 1)
    fallback_humidity = round(82.0 - (lat_factor * 1.5) + (lon_factor * 0.8), 1)
    fallback_rain = 3.2 if fallback_humidity > 80 else 0.0
    fallback_soil_moist = 74.0

    return {
        "temperature": fallback_temp,
        "humidity": fallback_humidity,
        "rainfall": fallback_rain,
        "soil_moisture": fallback_soil_moist,
        "source": "Agro-Climatic Simulation (Tamil Nadu Delta Model)"
    }
