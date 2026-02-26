"""
POST /predict-pm25 — Predict PM2.5 from weather data.
"""

from fastapi import APIRouter, HTTPException
from models.prediction import PredictionRequest, PredictionResponse
from services.ml_predictor import predict_pm25

router = APIRouter(tags=["ML Prediction"])


@router.post("/predict-pm25", response_model=PredictionResponse)
async def predict(payload: PredictionRequest):
    """Predict PM2.5 concentration from weather features."""
    result = predict_pm25(
        temperature=payload.temperature,
        humidity=payload.humidity,
        pressure=payload.pressure,
        visibility=payload.visibility,
        wind_speed=payload.wind_speed,
    )
    if result is None:
        raise HTTPException(status_code=500, detail="Model not available. Please try again later.")
    return {"predicted_pm25": result}
