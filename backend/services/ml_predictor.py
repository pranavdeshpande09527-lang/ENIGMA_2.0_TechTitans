"""
ML Predictor Service — loads trained models and predicts PM2.5.
If model files are missing, trains them automatically.
"""

import os
import numpy as np

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
ML_DIR = os.path.join(os.path.dirname(SCRIPT_DIR), "ml")
PM25_MODEL_PATH = os.path.join(ML_DIR, "pm25_model.pkl")

_pm25_model = None


def _load_model():
    global _pm25_model
    try:
        import joblib
        
        # Load PM2.5
        if os.path.exists(PM25_MODEL_PATH):
            _pm25_model = joblib.load(PM25_MODEL_PATH)
            print(f"[SUCCESS] ML model loaded from {PM25_MODEL_PATH}")
        else:
            print("[WARNING]  PM2.5 Model file not found — training now...")
            from ml.train_model import train_model
            _pm25_model = train_model("PM 2.5", PM25_MODEL_PATH)
            
    except Exception as e:
        print(f"[WARNING]  Could not load ML models: {e}")


# Load once at import time
_load_model()


def predict_pm25(temperature: float, humidity: float, pressure: float,
                 visibility: float, wind_speed: float) -> float | None:
    """Predict PM2.5 from 5 weather features. Returns None on failure."""
    if _pm25_model is None:
        return None
    try:
        features = np.array([[temperature, humidity, pressure, visibility, wind_speed]])
        result = float(_pm25_model.predict(features)[0])
        return round(max(0, result), 2)
    except Exception as e:
        print(f"[WARNING]  PM2.5 Prediction error: {e}")
        return None
