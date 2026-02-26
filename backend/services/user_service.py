"""
User Service — Crash-proof with in-memory fallback.
"""

from database import (
    get_users_collection,
    get_health_readings_collection,
    is_using_memory,
    memory_find,
)


# ── Demo user (always available) ─────────────────────────
DEMO_USER = {
    "_id": "demo",
    "name": "Demo User",
    "email": "demo@breathometer.ai",
    "city": "Nagpur",
    "created_at": "2026-02-26T10:00:00Z",
    "latest_readings": {
        "heart_rate": 78,
        "spo2": 96.5,
        "timestamp": "2026-02-26T10:15:00Z",
    },
}


async def get_user_by_id(user_id: str) -> dict | None:
    """Fetch user — never crashes."""
    # Always return demo user for "demo"
    if user_id == "demo":
        return DEMO_USER

    # In-memory mode
    if is_using_memory():
        results = memory_find("users", {"_id": user_id})
        return results[0] if results else None

    # MongoDB mode
    try:
        users = get_users_collection()
        if users is None:
            return None

        from bson import ObjectId
        query = {"_id": ObjectId(user_id)} if ObjectId.is_valid(user_id) else {"_id": user_id}
        user = await users.find_one(query)
        if not user:
            return None

        user["_id"] = str(user["_id"])

        # Latest health reading
        readings = get_health_readings_collection()
        if readings:
            latest = await readings.find_one(
                {"user_id": user["_id"]},
                sort=[("timestamp", -1)],
            )
            if latest:
                latest["_id"] = str(latest["_id"])
                user["latest_readings"] = latest

        return user
    except Exception as e:
        print(f"⚠️  Error fetching user: {e}")
        return None
