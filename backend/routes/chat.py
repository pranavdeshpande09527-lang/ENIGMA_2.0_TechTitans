"""
POST /chat  — Send message to Sathi chatbot
"""
from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional, Dict, Any
from services.chat_service import generate_sathi_response

router = APIRouter(tags=["Chat"])

class ChatRequest(BaseModel):
    message: str
    aqi: Optional[int] = None
    risk_level: Optional[str] = None
    user_profile: Optional[Dict[str, Any]] = None

class ChatResponse(BaseModel):
    reply: str

@router.post("/chat", response_model=ChatResponse)
async def chat_with_sathi(payload: ChatRequest):
    """Secure API-based chatbot endpoint."""
    reply_text = await generate_sathi_response(
        message=payload.message,
        aqi=payload.aqi,
        risk_level=payload.risk_level,
        user_profile=payload.user_profile
    )
    return {"reply": reply_text}
