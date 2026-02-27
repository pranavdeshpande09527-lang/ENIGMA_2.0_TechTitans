"""
Chat Service — Secure Sathi chatbot (Groq API Powered)
"""
import os
import httpx
from typing import Dict, Any, List
from dotenv import load_dotenv

load_dotenv()

# Lightweight conversation memory: maps session/user to their last 6 messages
conversation_store: Dict[str, List[dict]] = {}

def get_history(session_id: str = "default") -> List[dict]:
    if session_id not in conversation_store:
        conversation_store[session_id] = []
    return conversation_store[session_id]

def add_to_history(session_id: str, role: str, content: str):
    history = get_history(session_id)
    history.append({"role": role, "content": content})
    # Keep last 10 messages to limit prompt size
    if len(history) > 10:
        history.pop(0)

async def generate_sathi_response(message: str, aqi: int = None, risk_level: str = None, user_profile: dict = None) -> str:
    """Generate an intelligent, contextual health advice response using Groq."""
    
    groq_api_key = os.getenv("GROQ_API_KEY")
    if not groq_api_key:
        return "I'm currently unable to connect to my AI brain (Missing API Key). Please set GROQ_API_KEY."

    session_id = "default"
    history = get_history(session_id)
    
    # Construct Context string
    context_str = f"Current AQI: {aqi if aqi else 'Unknown'}. "
    context_str += f"Lung Infection Risk Level: {risk_level if risk_level else 'Unknown'}. "
    if user_profile:
        context_str += f"User Profile: Age {user_profile.get('age', 'Unknown')}, "
        if user_profile.get("asthma"): context_str += "Has Asthma, "
        if user_profile.get("copd"): context_str += "Has COPD, "
        if user_profile.get("smoker"): context_str += "Is a Smoker. "

    system_prompt = (
        "You are Sathi, a compassionate, expert Lung Health AI Companion for the 'Breathometer' app. "
        "Your goal is to provide concise, empathetic, and actionable medical and environmental advice. "
        f"Context for this user: {context_str}\n"
        "Guidelines:\n"
        "1. Keep responses short and digestible (2-4 sentences max unless detailed advice is requested).\n"
        "2. If the AQI > 150 or Risk is High, urgently recommend an N95 mask and staying indoors.\n"
        "3. Address the user's specific health conditions (like asthma or smoking) naturally in your advice.\n"
        "4. Do NOT use markdown bolding too excessively, just keep it conversationally friendly. No emojis needed."
    )

    add_to_history(session_id, "user", message)
    
    messages = [{"role": "system", "content": system_prompt}]
    messages.extend(history)

    headers = {
        "Authorization": f"Bearer {groq_api_key}",
        "Content-Type": "application/json"
    }
    
    payload = {
        "model": "llama3-70b-8192",
        "messages": messages,
        "temperature": 0.5,
        "max_tokens": 512,
        "top_p": 1,
        "stream": False
    }

    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.post(
                "https://api.groq.com/openai/v1/chat/completions",
                headers=headers,
                json=payload
            )
            response.raise_for_status()
            data = response.json()
            
            ai_reply = data["choices"][0]["message"]["content"]
            add_to_history(session_id, "assistant", ai_reply)
            return ai_reply

    except Exception as e:
        print(f"Groq API Error in SathiChat: {str(e)}")
        # Fallback offline response
        fallback = "I'm having trouble connecting to my AI servers. "
        if aqi and aqi > 150:
            fallback += "However, please note the AQI is High. Wear an N95 mask and limit outdoor activities."
        else:
            fallback += "Please try again in a few moments."
        return fallback
