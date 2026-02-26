"""
POST /calculate-risk  — Calculate personalized lung risk score.
Saves every calculation to the risk_history collection.
"""

from fastapi import APIRouter
from models.risk import RiskRequest, RiskResponse
from risk_engine import calculate_risk
from database import get_risk_history_collection
from datetime import datetime, timezone

router = APIRouter(tags=["Risk"])


@router.post("/calculate-risk", response_model=RiskResponse)
async def compute_risk(payload: RiskRequest):
    """Calculate risk from AQI + wearable metrics and persist to DB."""
    result = calculate_risk(
        aqi=payload.aqi,
        heart_rate=payload.heart_rate,
        spo2=payload.spo2,
    )

    # ── Persist to risk_history ──────────────────────────
    history_doc = {
        "user_id": payload.user_id or "anonymous",
        "city": payload.city or "unknown",
        "aqi": payload.aqi,
        "heart_rate": payload.heart_rate,
        "spo2": payload.spo2,
        **result,
        "timestamp": datetime.now(timezone.utc),
    }

    collection = get_risk_history_collection()
    if collection is not None:
        try:
            await collection.insert_one(history_doc)
        except Exception as e:
            print(f"⚠️ Could not save risk history: {e}")

    return result
