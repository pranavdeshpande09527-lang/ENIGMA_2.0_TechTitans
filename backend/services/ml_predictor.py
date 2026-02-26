"""
ML Predictor Service — loads the trained model and predicts PM2.5.
If model file is missing, trains once automatically.
"""

import os
import numpy as np

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
ML_DIR = os.path.join(os.path.dirname(SCRIPT_DIR), "ml")
MODEL_PATH = os.path.join(ML_DIR, "pm25_model.pkl")

_model = None


def _load_model():
    global _model
    try:
        import joblib
        if os.path.exists(MODEL_PATH):
            _model = joblib.load(MODEL_PATH)
            print(f"✅ ML model loaded from {MODEL_PATH}")
        else:
            print("⚠️  Model file not found — training now...")
            from ml.train_model import train
            _model = train()
    except Exception as e:
        print(f"⚠️  Could not load ML model: {e}")


# Load once at import time
_load_model()


def predict_pm25(temperature: float, humidity: float, pressure: float,
                 visibility: float, wind_speed: float) -> float | None:
    """Predict PM2.5 from 5 weather features. Returns None on failure."""
    if _model is None:
        return None
    try:
        features = np.array([[temperature, humidity, pressure, visibility, wind_speed]])
        result = float(_model.predict(features)[0])
        return round(max(0, result), 2)
    except Exception as e:
        print(f"⚠️  Prediction error: {e}")
        return None
