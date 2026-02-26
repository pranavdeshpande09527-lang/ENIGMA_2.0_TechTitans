"""
PM2.5 Model Training — Breathometer AI
───────────────────────────────────────
Trains a Random Forest on 2013–2016 pollution data.
Saves model as pm25_model.pkl via joblib.

Usage:  python ml/train_model.py
"""

import os
import json
import numpy as np
import pandas as pd
import joblib
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_absolute_error, r2_score

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = r"C:\Users\prana\OneDrive\Documents\realdata"
MODEL_PATH = os.path.join(SCRIPT_DIR, "pm25_model.pkl")

# 5 features the user will provide
FEATURES = ["T", "H", "SLP", "VV", "V"]


def load_and_clean():
    frames = []
    for year in range(2013, 2017):
        path = os.path.join(DATA_DIR, f"real_{year}.csv")
        if not os.path.exists(path):
            print(f"⚠️  Missing: {path}")
            continue
        df = pd.read_csv(path)
        df.columns = df.columns.str.strip()
        frames.append(df)

    data = pd.concat(frames, ignore_index=True)
    data["PM 2.5"] = pd.to_numeric(data["PM 2.5"], errors="coerce")
    data = data.dropna(subset=["PM 2.5"])
    data = data[data["PM 2.5"] > 0].copy()
    data = data.dropna(subset=FEATURES)
    print(f"📂 Loaded {len(data)} clean rows from {len(frames)} files")
    return data


def train():
    data = load_and_clean()

    X = data[FEATURES].values
    y = data["PM 2.5"].values

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

    print(f"✅ MAE  = {mae:.2f}")
    print(f"✅ R²   = {r2:.4f}")

    joblib.dump(model, MODEL_PATH)
    print(f"💾 Model saved → {MODEL_PATH}")
    return model


if __name__ == "__main__":
    print("🚀 Training PM2.5 model...")
    train()
    print("Done!")
