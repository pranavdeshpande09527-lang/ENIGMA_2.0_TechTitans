"""User model / schema."""

from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime


class UserCreate(BaseModel):
    name: str
    email: str
    city: str


class UserResponse(BaseModel):
    id: str = Field(alias="_id")
    name: str
    email: str
    city: str
    created_at: datetime

    class Config:
        populate_by_name = True


# ── MongoDB sample document ──────────────────────────────
# {
#   "_id": ObjectId("..."),
#   "name": "Pranav Sharma",
#   "email": "pranav@example.com",
#   "city": "Delhi",
#   "created_at": ISODate("2026-02-26T10:00:00Z")
# }
