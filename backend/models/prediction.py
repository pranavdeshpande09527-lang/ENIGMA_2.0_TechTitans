"""Pydantic models for PM2.5 prediction."""

from pydantic import BaseModel


class PredictionRequest(BaseModel):
    temperature: float
    humidity: float
    pressure: float
    visibility: float
    wind_speed: float
    city: str = "Delhi"


class PredictionResponse(BaseModel):
    predicted_pm25: float
    predicted_pm10: float


class LungRiskRequest(BaseModel):
    # Environmental Data
    pm25: float
    pm10: float
    aqi: float
    temperature: float
    humidity: float
    
    # User Profile
    age: int
    smoking: bool
    cigarettes_per_day: int = 0
    asthma: bool
    copd: bool
    previous_infection: bool
    outdoor_exposure: str = "Low"  # Low, Medium, High
    
    # Current Symptoms
    cough_severity: int  # 0 to 10
    cough_type: str = "Dry"  # Dry or Wet
    symptoms_duration_days: int = 0
    breathlessness_severity: int  # 0 to 10
    wheezing: bool = False
    spo2: float = 98.0
    fever: bool
    chest_pain: bool


class LungRiskResponse(BaseModel):
    risk_percentage: float
    risk_level: str
    explanation: str


class WeeklyReportRequest(BaseModel):
    # Sends in the *current* state. Backend simulates the 7-day history.
    city: str = "Delhi"
    pm25: float
    pm10: float
    aqi: float
    temperature: float
    humidity: float
    
    age: int
    smoking: bool
    cigarettes_per_day: int = 0
    asthma: bool
    copd: bool
    previous_infection: bool
    outdoor_exposure: str = "Low"
    
    cough_severity: int
    cough_type: str = "Dry"
    symptoms_duration_days: int = 0
    breathlessness_severity: int
    wheezing: bool = False
    spo2: float = 98.0
    fever: bool
    chest_pain: bool


class DiseaseRisk(BaseModel):
    name: str
    risk_percentage: float

class WeeklyReportResponse(BaseModel):
    # 1. Weekly Summary
    avg_cough_severity: float
    avg_breathlessness: float
    highest_symptom: str
    avg_spo2: float
    avg_aqi: float
    
    # 2. Risk Score
    avg_risk_percentage: float
    avg_risk_level: str
    trend: str # Increasing, Decreasing, Stable
    
    # 3. Simple AI Insights
    insights: list[str]
    
    # 4. Disease Risk Vulnerabilities (Responsible AI phrasing)
    disease_risks: list[DiseaseRisk]
    
    # 5. Recommendation
    recommendation: str
    
    # 5. Graph Data (7 dots)
    daily_risks: list[float]
