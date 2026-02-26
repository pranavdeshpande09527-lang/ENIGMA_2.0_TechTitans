"""Pollution log model / schema."""

from pydantic import BaseModel, Field
from datetime import datetime


class PollutionLogCreate(BaseModel):
    city: str
    aqi: float
    dominant_pollutant: str = "PM2.5"


class PollutionLogResponse(BaseModel):
    id: str = Field(alias="_id")
    city: str
    aqi: float
    dominant_pollutant: str
    timestamp: datetime

    class Config:
        populate_by_name = True


# ── MongoDB sample document ──────────────────────────────
# {
#   "_id": ObjectId("..."),
#   "city": "Delhi",
#   "aqi": 172,
#   "dominant_pollutant": "PM2.5",
#   "timestamp": ISODate("2026-02-26T09:00:00Z")
# }
