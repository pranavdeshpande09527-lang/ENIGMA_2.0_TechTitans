"""
AQI Service — Crash-proof AQI data fetcher.
OpenWeatherMap Air Pollution API with 5s timeout + automatic mock fallback.
"""

import os
import random
from datetime import datetime, timezone

AQI_API_KEY = os.getenv("AQI_API_KEY", "")

# ── Mock AQI data ────────────────────────────────────────
MOCK_AQI_DATA = {
    "nagpur":    {"city": "Nagpur",    "aqi": 145, "dominant_pollutant": "PM2.5", "category": "Unhealthy for Sensitive Groups"},
    "delhi":     {"city": "Delhi",     "aqi": 285, "dominant_pollutant": "PM2.5", "category": "Very Unhealthy"},
    "mumbai":    {"city": "Mumbai",    "aqi": 172, "dominant_pollutant": "PM10",  "category": "Unhealthy"},
    "kolkata":   {"city": "Kolkata",   "aqi": 158, "dominant_pollutant": "PM2.5", "category": "Unhealthy"},
    "bangalore": {"city": "Bangalore", "aqi": 98,  "dominant_pollutant": "O3",    "category": "Moderate"},
    "chennai":   {"city": "Chennai",   "aqi": 87,  "dominant_pollutant": "NO2",   "category": "Moderate"},
    "hyderabad": {"city": "Hyderabad", "aqi": 112, "dominant_pollutant": "PM2.5", "category": "Unhealthy for Sensitive Groups"},
    "pune":      {"city": "Pune",      "aqi": 78,  "dominant_pollutant": "PM10",  "category": "Moderate"},
}


def _classify_aqi(aqi: int) -> str:
    if aqi <= 50:   return "Good"
    if aqi <= 100:  return "Moderate"
    if aqi <= 150:  return "Unhealthy for Sensitive Groups"
    if aqi <= 200:  return "Unhealthy"
    if aqi <= 300:  return "Very Unhealthy"
    return "Hazardous"


def _pm25_to_us_aqi(pm25: float) -> int:
    """Convert PM2.5 µg/m³ to US EPA AQI."""
    if pm25 <= 12.0:   return int((50 / 12.0) * pm25)
    if pm25 <= 35.4:   return int(50 + (50 / 23.4) * (pm25 - 12.0))
    if pm25 <= 55.4:   return int(100 + (50 / 20.0) * (pm25 - 35.4))
    if pm25 <= 150.4:  return int(150 + (50 / 95.0) * (pm25 - 55.4))
    if pm25 <= 250.4:  return int(200 + (100 / 100.0) * (pm25 - 150.4))
    if pm25 <= 500.4:  return int(300 + (200 / 250.0) * (pm25 - 250.4))
    return 500


def _dominant(components: dict) -> str:
    keys = {"pm2_5": "PM2.5", "pm10": "PM10", "o3": "O3", "no2": "NO2", "so2": "SO2", "co": "CO"}
    if not components:
        return "PM2.5"
    best = max(keys.keys(), key=lambda k: components.get(k, 0))
    return keys[best]


def _mock_response(city: str) -> dict:
    """Return mock data for any city."""
    key = city.lower().strip()
    if key in MOCK_AQI_DATA:
        base = MOCK_AQI_DATA[key].copy()
        base["aqi"] = max(0, base["aqi"] + random.randint(-10, 10))
    else:
        base = {
            "city": city,
            "aqi": random.randint(50, 180),
            "dominant_pollutant": random.choice(["PM2.5", "PM10", "O3", "NO2"]),
            "category": "Moderate",
        }
    base["timestamp"] = datetime.now(timezone.utc).isoformat()
    base["source"] = "mock"
    return base


async def fetch_aqi(city: str) -> dict:
    """
    Fetch AQI — never raises, never crashes.
    Tries OpenWeatherMap → falls back to mock.
    """
    if not AQI_API_KEY:
        return _mock_response(city)

    try:
        import httpx
        async with httpx.AsyncClient(timeout=5.0) as client:
            # Geocode
            geo_url = f"http://api.openweathermap.org/geo/1.0/direct?q={city}&limit=1&appid={AQI_API_KEY}"
            geo_resp = await client.get(geo_url)
            geo_resp.raise_for_status()
            geo_data = geo_resp.json()
            if not geo_data:
                return _mock_response(city)

            lat, lon = geo_data[0]["lat"], geo_data[0]["lon"]

            # Air pollution
            poll_url = f"http://api.openweathermap.org/data/2.5/air_pollution?lat={lat}&lon={lon}&appid={AQI_API_KEY}"
            poll_resp = await client.get(poll_url)
            poll_resp.raise_for_status()
            poll_data = poll_resp.json()

            item = poll_data["list"][0]
            components = item.get("components", {})
            us_aqi = _pm25_to_us_aqi(components.get("pm2_5", 0))

            return {
                "city": city,
                "aqi": us_aqi,
                "dominant_pollutant": _dominant(components),
                "category": _classify_aqi(us_aqi),
                "pollutants": {
                    "pm25": round(components.get("pm2_5", 0), 1),
                    "pm10": round(components.get("pm10", 0), 1),
                    "o3": round(components.get("o3", 0), 1),
                    "no2": round(components.get("no2", 0), 1),
                    "so2": round(components.get("so2", 0), 1),
                    "co": round(components.get("co", 0), 1),
                },
                "timestamp": datetime.now(timezone.utc).isoformat(),
                "source": "OpenWeatherMap",
            }
    except Exception as e:
        print(f"⚠️  AQI API error: {e} — using mock data")
        return _mock_response(city)
