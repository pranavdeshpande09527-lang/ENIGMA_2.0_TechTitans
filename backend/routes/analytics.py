"""
GET /public-analytics  — Aggregated public health analytics.
Returns mock data for hackathon demo.
"""

from fastapi import APIRouter

router = APIRouter(tags=["Analytics"])

# ── Mock public analytics data ───────────────────────────
MOCK_ANALYTICS = {
    "total_users": 1247,
    "total_readings": 18432,
    "cities_monitored": 12,
    "average_aqi_today": 134,
    "risk_distribution": {
        "Safe": 42,
        "Moderate": 35,
        "High Risk": 23,
    },
    "top_polluted_cities": [
        {"city": "Delhi", "aqi": 285, "dominant_pollutant": "PM2.5"},
        {"city": "Mumbai", "aqi": 172, "dominant_pollutant": "PM10"},
        {"city": "Kolkata", "aqi": 158, "dominant_pollutant": "PM2.5"},
        {"city": "Bangalore", "aqi": 98, "dominant_pollutant": "O3"},
        {"city": "Chennai", "aqi": 87, "dominant_pollutant": "NO2"},
    ],
    "hourly_aqi_trend": [
        {"hour": "06:00", "aqi": 110},
        {"hour": "08:00", "aqi": 145},
        {"hour": "10:00", "aqi": 168},
        {"hour": "12:00", "aqi": 155},
        {"hour": "14:00", "aqi": 140},
        {"hour": "16:00", "aqi": 132},
        {"hour": "18:00", "aqi": 160},
        {"hour": "20:00", "aqi": 185},
        {"hour": "22:00", "aqi": 150},
    ],
    "health_alerts_today": 38,
}


@router.get("/public-analytics")
async def public_analytics():
    """Return aggregated public health analytics data."""
    return MOCK_ANALYTICS
