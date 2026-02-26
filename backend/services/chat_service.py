"""
Chat Service — Secure Sathi chatbot (Offline Rule-Based)
"""
from typing import Dict, Any, List

# Lightweight conversation memory: maps session/user to their last 5 messages
conversation_store: Dict[str, List[str]] = {}

def get_history(session_id: str = "default") -> List[str]:
    if session_id not in conversation_store:
        conversation_store[session_id] = []
    return conversation_store[session_id]

def add_to_history(session_id: str, message: str):
    history = get_history(session_id)
    history.append(message)
    if len(history) > 5:
        history.pop(0)

def generate_explanation_for_judges() -> str:
    return (
        "🌿 Here is how Breathometer AI works: \n"
        "1. **Live AQI Monitoring:** We fetch real-time air quality data for the selected city.\n"
        "2. **Wearable Integration:** We simulate SpO2 and Heart Rate data normally collected from smartwatches.\n"
        "3. **Risk Scoring Engine:** Our algorithm calculates a composite risk score by weighting AQI (50%), Heart Rate (30%), and Oxygen (20%).\n"
        "4. **Personalized Intelligence:** The frontend adjusts this score based on user profile factors (like asthma or smoking), and I use these factors to deliver contextual health advice completely offline."
    )

def generate_sathi_response(message: str, aqi: int = None, risk_level: str = None, user_profile: dict = None) -> str:
    """Generate an intelligent, contextual health advice response based on rules."""
    session_id = "default"
    history = get_history(session_id)
    is_first_message = len(history) == 0
    
    add_to_history(session_id, message)
    message_lower = message.lower()

    # 1. HACKATHON PRESENTATION MODE
    if "how does this system work" in message_lower or "explain the system" in message_lower:
        return generate_explanation_for_judges()

    response = ""
    # Always prefix first message
    if is_first_message:
        response += "Hi, I am Sathi 🌿 Your Lung Health Companion. "

    # 2. HIGH RISK ALERT MODE
    if (aqi and aqi > 200) or risk_level == "High":
        response += "⚠️ **High Risk Alert** \n"
        response += "I understand this can be concerning, but your current air quality and health metrics indicate a severe risk. Please follow these steps immediately:\n"
        response += "- 😷 Wear an N95 or KN95 mask if you must go outside.\n"
        response += "- 🚪 Keep all windows sealed and turn on indoor air purifiers.\n"
        response += "- 🛋️ Avoid all physical exertion and rest indoors.\n"
        response += "Please check your Dashboard for more detailed preventive suggestions. "
        return response

    # 3. CONTEXTUAL AQI EMPATHY & ENCOURAGEMENT
    sentences = []
    if aqi is not None:
        if aqi <= 50:
            sentences.append(f"✅ The current AQI is an excellent {aqi}. It's a beautiful day to enjoy the fresh air outdoors!")
        elif 51 <= aqi <= 100:
            sentences.append(f"The AQI is {aqi}, which is acceptable. However, if you are unusually sensitive to pollution, you might want to take it slightly easy outdoors.")
        elif 101 <= aqi <= 150:
            sentences.append(f"The AQI is {aqi}. I understand this can be frustrating for sensitive groups. Please exercise caution if you have respiratory issues.")
        elif 151 <= aqi <= 200:
            sentences.append(f"⚠️ Warning: The AQI has reached {aqi}. It's quite polluted out there. Please limit your time outside and wear a mask if you need to travel.")
            
    # 4. PERSONALIZED HEALTH ADVICE
    if user_profile:
        if user_profile.get("asthma") and aqi and aqi > 100:
            sentences.append("Since you mentioned having asthma, your airways are especially vulnerable today. Please keep your rescue inhaler nearby.")
        if user_profile.get("copd") and aqi and aqi > 100:
            sentences.append("Given your COPD profile, this level of pollution can trigger severe flare-ups. Staying in a filtered indoor environment is crucial.")
        if user_profile.get("age", 30) > 65:
            sentences.append("Given your age group, it is highly recommended to minimize strenuous activity when air quality drops.")
        if user_profile.get("smoker"):
            sentences.append("As someone with a history of smoking, your lungs face a compounded burden from the pollution. Taking extra precautions today will help protect your health.")

    # 5. KEYWORD RESPONSES
    if "mask" in message_lower:
        sentences.append("😷 When selecting a mask, an N95 or KN95 is strongly recommended. They filter out 95% of harmful PM2.5 particles, unlike standard surgical or cloth masks.")
    elif "exercise" in message_lower or "workout" in message_lower:
        if aqi and aqi > 100:
            sentences.append("Since the AQI is elevated, I advise shifting your workout indoors. Heavy breathing outdoors draws toxic particles deeper into your lungs.")
        else:
            sentences.append("The air quality looks supportive of an outdoor workout right now. Enjoy your exercise!")
    elif "children" in message_lower or "child" in message_lower:
        sentences.append("Children breathe faster than adults and their lungs are still developing. Keep them indoors and avoid vigorous outdoor play during pollution spikes.")
    elif "elderly" in message_lower or "senior" in message_lower:
        sentences.append("Elderly individuals have lower respiratory reserves. Ensure seniors rest indoors in well-ventilated, purified areas when air quality is poor.")
    
    # Check memory for follow-ups safely
    if not sentences and len(history) > 1:
        last_msg = history[-2].lower()
        if "child" in last_msg or "kid" in last_msg:
            sentences.append("Continuing on children's health, ensuring they have clean indoor air and asthma action plans updated is essential.")

    # Fallback if no specific advice was generated
    if not sentences:
        sentences.append("How can I assist you in managing your lung health today? Feel free to ask me about safety measures, masks, or high-risk conditions.")

    response += " ".join(sentences[:5]) # Limit to 5-7 sentences total
    return response.strip()
