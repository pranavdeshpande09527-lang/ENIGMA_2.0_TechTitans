"""
GET /aqi/{city}  — Fetch AQI data for a city.
Returns mock data by default; uses real API if AQI_API_KEY is set.
"""

from fastapi import APIRouter, HTTPException
from services.aqi_service import fetch_aqi

router = APIRouter(tags=["AQI"])

import os

DEMO_MODE = os.getenv("DEMO_MODE", "true").lower() == "true"

@router.get("/aqi/{city}")
async def get_aqi(city: str):
    """Get current Air Quality Index for a given city via OpenWeather."""
    data = await fetch_aqi(city)
    if not data:
        raise HTTPException(status_code=404, detail=f"AQI data not found for '{city}'")
    return data
