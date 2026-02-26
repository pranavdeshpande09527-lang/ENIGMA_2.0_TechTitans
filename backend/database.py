"""
MongoDB connection with automatic in-memory fallback.
If MongoDB is unreachable, all data is stored in Python dicts.
"""

import os
from dotenv import load_dotenv

load_dotenv()

MONGODB_URL = os.getenv("MONGODB_URL", "")
DB_NAME = "breathometer"

# ── State ─────────────────────────────────────────────────
_client = None
_db = None
_using_memory = False

# ── In-memory fallback storage ────────────────────────────
_memory_store = {
    "users": [],
    "health_readings": [],
    "pollution_logs": [],
    "risk_history": [],
}


async def connect_db():
    """Try connecting to MongoDB; silently fall back to in-memory."""
    global _client, _db, _using_memory

    if not MONGODB_URL:
        print("ℹ️  No MONGODB_URL set — using in-memory storage.")
        _using_memory = True
        return

    try:
        from motor.motor_asyncio import AsyncIOMotorClient
        _client = AsyncIOMotorClient(MONGODB_URL, serverSelectionTimeoutMS=3000)
        # Force a connection test
        await _client.admin.command("ping")
        _db = _client[DB_NAME]
        _using_memory = False
        print(f"✅ Connected to MongoDB: {DB_NAME}")
    except Exception as e:
        print(f"⚠️  MongoDB connection failed ({e}) — using in-memory storage.")
        _client = None
        _db = None
        _using_memory = True


async def disconnect_db():
    """Close MongoDB connection if open."""
    global _client
    try:
        if _client:
            _client.close()
    except Exception:
        pass


def is_using_memory() -> bool:
    return _using_memory


# ── Collection accessors (return None if in-memory) ──────
def get_users_collection():
    return _db["users"] if _db else None


def get_health_readings_collection():
    return _db["health_readings"] if _db else None


def get_pollution_logs_collection():
    return _db["pollution_logs"] if _db else None


def get_risk_history_collection():
    return _db["risk_history"] if _db else None


# ── In-memory helpers ────────────────────────────────────
def memory_insert(collection_name: str, doc: dict):
    """Insert a document into in-memory store."""
    _memory_store.setdefault(collection_name, []).append(doc)


def memory_find(collection_name: str, query: dict = None) -> list:
    """Simple in-memory find (returns all if no query)."""
    docs = _memory_store.get(collection_name, [])
    if not query:
        return docs
    # Basic key-value match
    return [d for d in docs if all(d.get(k) == v for k, v in query.items())]
