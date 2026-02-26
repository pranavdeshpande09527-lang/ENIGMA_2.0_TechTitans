"""
Custom Risk Scoring Engine — Standalone, no DB dependency.
──────────────────────────────────────────────────────────
Formula:  Risk Score = (AQI × 0.5) + (HeartRateFactor × 0.3) + (SpO2Factor × 0.2)

Classification:
  0–50   → Safe
  51–100 → Moderate
  100+   → High Risk
"""


def _heart_rate_factor(heart_rate: float) -> float:
    """0–100 factor based on deviation from normal 60–100 bpm."""
    try:
        hr = float(heart_rate)
    except (TypeError, ValueError):
        return 0
    if hr <= 60:  return 0
    if hr <= 80:  return (hr - 60) * 1.0
    if hr <= 100: return 20 + (hr - 80) * 2.0
    return min(60 + (hr - 100) * 4.0, 100)


def _spo2_factor(spo2: float) -> float:
    """0–100 factor; lower SpO2 → higher risk."""
    try:
        sp = float(spo2)
    except (TypeError, ValueError):
        return 0
    if sp >= 98: return 0
    if sp >= 95: return (98 - sp) * 10
    if sp >= 90: return 30 + (95 - sp) * 14
    return 100


def _suggestions(level: str) -> list[str]:
    data = {
        "Safe": [
            "Air quality is good — enjoy outdoor activities.",
            "Stay hydrated and maintain regular exercise.",
        ],
        "Moderate": [
            "Consider wearing a mask if outdoors for extended periods.",
            "Avoid strenuous outdoor exercise during peak pollution hours.",
            "Keep windows closed and use air purifiers indoors.",
            "Monitor your SpO2 levels periodically.",
        ],
        "High Risk": [
            "🚨 Stay indoors and use air purifiers immediately.",
            "Avoid all outdoor physical activity.",
            "Wear an N95 mask if you must go outside.",
            "Seek medical attention if you feel breathless or dizzy.",
            "Keep rescue inhalers accessible if you have asthma.",
        ],
    }
    return data.get(level, [])


def calculate_risk(aqi: float, heart_rate: float, spo2: float) -> dict:
    """
    Calculate personalized lung risk score.
    Never crashes — returns safe defaults on bad input.
    """
    try:
        aqi_val = max(0, float(aqi))
    except (TypeError, ValueError):
        aqi_val = 0
    try:
        hr_val = float(heart_rate)
    except (TypeError, ValueError):
        hr_val = 72
    try:
        sp_val = float(spo2)
    except (TypeError, ValueError):
        sp_val = 98

    hr_factor = _heart_rate_factor(hr_val)
    sp_factor = _spo2_factor(sp_val)
    score = round((aqi_val * 0.5) + (hr_factor * 0.3) + (sp_factor * 0.2), 2)

    if score <= 50:
        level = "Safe"
    elif score <= 100:
        level = "Moderate"
    else:
        level = "High Risk"

    return {
        "risk_score": score,
        "risk_level": level,
        "alert_flag": level == "High Risk",
        "preventive_suggestions": _suggestions(level),
    }
