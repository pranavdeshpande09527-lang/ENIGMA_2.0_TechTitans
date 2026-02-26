"""
PM2.5 Model Training — Breathometer AI
───────────────────────────────────────
Trains a Random Forest on 2013–2016 pollution data.
Saves model as pm25_model.pkl via joblib.

Usage:  python ml/train_model.py
"""

import os
import numpy as np
import pandas as pd
import joblib
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_absolute_error, r2_score

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = r"C:\Users\prana\OneDrive\Documents\realdata"
PM25_MODEL_PATH = os.path.join(SCRIPT_DIR, "pm25_model.pkl")

# 5 features the user will provide
FEATURES = ["T", "H", "SLP", "VV", "V"]


def load_and_clean(target_col):
    frames = []
    for year in range(2013, 2017):
        path = os.path.join(DATA_DIR, f"real_{year}.csv")
        if not os.path.exists(path):
            continue
        df = pd.read_csv(path)
        df.columns = df.columns.str.strip()
        
        # Verify if column exists before appending
        if target_col in df.columns:
            frames.append(df)

    if not frames:
        print(f"[WARNING]  No data found with column '{target_col}'")
        return pd.DataFrame()

    data = pd.concat(frames, ignore_index=True)
    data[target_col] = pd.to_numeric(data[target_col], errors="coerce")
    data = data.dropna(subset=[target_col])
    data = data[data[target_col] > 0].copy()
    data = data.dropna(subset=FEATURES)
    print(f"📂 Loaded {len(data)} clean rows for {target_col}")
    return data


def train_model(target_col, model_path):
    print(f"\n🚀 Training {target_col} model...")
    data = load_and_clean(target_col)
    
    if data.empty:
        return None

    X = data[FEATURES].values
    y = data[target_col].values

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42
    )

    model = RandomForestRegressor(
        n_estimators=200, max_depth=15, random_state=42, n_jobs=-1
    )
    model.fit(X_train, y_train)

    preds = model.predict(X_test)
    mae = mean_absolute_error(y_test, preds)
    r2 = r2_score(y_test, preds)

    print(f"[SUCCESS] MAE  = {mae:.2f}")
    print(f"[SUCCESS] R²   = {r2:.4f}")

    joblib.dump(model, model_path)
    print(f"💾 Model saved → {model_path}")
    return model


def train_all():
    train_model("PM 2.5", PM25_MODEL_PATH)


if __name__ == "__main__":
    train_all()
    print("\nDone!")
