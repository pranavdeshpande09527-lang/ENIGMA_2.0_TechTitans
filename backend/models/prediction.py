"""Pydantic models for PM2.5 prediction."""

from pydantic import BaseModel


class PredictionRequest(BaseModel):
    temperature: float
    humidity: float
    pressure: float
    visibility: float
    wind_speed: float


class PredictionResponse(BaseModel):
    predicted_pm25: float
