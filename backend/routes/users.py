"""
GET /user/{id}  — Fetch user profile with latest health readings.
"""

from fastapi import APIRouter, HTTPException
from services.user_service import get_user_by_id

router = APIRouter(tags=["Users"])


# ── Sample mock user for demo ────────────────────────────
MOCK_USER = {
    "_id": "demo_user_001",
    "name": "Pranav Sharma",
    "email": "pranav@example.com",
    "city": "Delhi",
    "created_at": "2026-02-26T10:00:00Z",
    "latest_readings": {
        "heart_rate": 78,
        "spo2": 96.5,
        "timestamp": "2026-02-26T10:15:00Z",
    },
}


@router.get("/user/{user_id}")
async def get_user(user_id: str):
    """Get user profile and latest health readings."""
    user = await get_user_by_id(user_id)

    # Fallback to mock data for demo
    if not user:
        if user_id == "demo":
            return MOCK_USER
        raise HTTPException(status_code=404, detail=f"User '{user_id}' not found")

    return user
