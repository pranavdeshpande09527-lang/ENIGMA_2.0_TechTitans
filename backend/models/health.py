"""Health reading model / schema."""

from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional


class HealthReadingCreate(BaseModel):
    user_id: str
    heart_rate: float
    spo2: float


class HealthReadingResponse(BaseModel):
    id: str = Field(alias="_id")
    user_id: str
    heart_rate: float
    spo2: float
    timestamp: datetime

    class Config:
        populate_by_name = True


# ── MongoDB sample document ──────────────────────────────
# {
#   "_id": ObjectId("..."),
#   "user_id": "abc123",
#   "heart_rate": 78,
#   "spo2": 96.5,
#   "timestamp": ISODate("2026-02-26T10:15:00Z")
# }
