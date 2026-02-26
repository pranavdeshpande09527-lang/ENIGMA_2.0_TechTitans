
🫁 Breathometer AI

Real-time Air Quality + Lung Impact Monitoring System with personalized risk scoring.

🚀 Overview

Breathometer AI combines:

🌫️ Air Quality Index (AQI)

❤️ Wearable health data (Heart Rate, SpO₂)

🧠 AI-based risk scoring

to estimate personal lung impact risk and provide preventive suggestions.

🏗️ Tech Stack

Backend: FastAPI (Python)

Frontend: React + Vite + Tailwind CSS

Database: MongoDB Atlas

Charts: Chart.js

AI Logic: Custom Risk Scoring Engine

🧠 Risk Formula
Risk Score = (AQI × 0.5) + (Heart Rate × 0.3) + (SpO2 × 0.2)
Score Range	Risk Level
0 – 50	Safe
51 – 100	Moderate
100+	High Risk
📂 Project Structure
breathometer/
├── backend/
├── frontend/
├── .env.example
└── README.md
⚙️ Setup
Backend
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload
Frontend
cd frontend
npm install
npm run dev
🔌 API Endpoints

GET /aqi/{city}

POST /calculate-risk

GET /user/{id}

GET /public-analytics

🌟 Key Features

Personalized lung health dashboard

Pollution exposure tracking

Risk alerts & prevention suggestions

Public health analytics panel

Works with mock data (No API key required)
