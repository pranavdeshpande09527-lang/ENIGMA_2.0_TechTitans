# 🫁 Breathometer AI

> Real-time Air Quality + Lung Impact Monitoring System with personalized risk scoring.

---

## 🏗️ Tech Stack

| Layer     | Technology                        |
| --------- | --------------------------------- |
| Backend   | FastAPI (Python)                  |
| Frontend  | React + Vite + Tailwind CSS       |
| Database  | MongoDB Atlas (Motor async driver)|
| AI Logic  | Custom risk scoring engine        |
| HTTP      | Axios / httpx                     |
| Charts    | Chart.js + react-chartjs-2        |

---

## 📂 Project Structure

```
breathometer/
├── backend/
│   ├── main.py              # FastAPI entry (CORS, lifespan, routes)
│   ├── database.py           # MongoDB connection & collections
│   ├── risk_engine.py        # Risk scoring: AQI × 0.5 + HR × 0.3 + SpO2 × 0.2
│   ├── models/               # Pydantic schemas
│   │   ├── user.py
│   │   ├── health.py
│   │   ├── pollution.py
│   │   └── risk.py
│   ├── routes/               # API endpoints
│   │   ├── aqi.py            # GET /aqi/{city}
│   │   ├── risk.py           # POST /calculate-risk
│   │   ├── users.py          # GET /user/{id}
│   │   └── analytics.py     # GET /public-analytics
│   ├── services/             # Business logic
│   │   ├── aqi_service.py
│   │   └── user_service.py
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   │   ├── AQICard.jsx
│   │   │   ├── RiskGauge.jsx
│   │   │   ├── AlertPanel.jsx
│   │   │   ├── HealthStats.jsx
│   │   │   └── PublicStats.jsx
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Timeline.jsx
│   │   │   └── Analytics.jsx
│   │   ├── services/
│   │   │   └── api.js        # Axios instance (uses VITE_BACKEND_URL)
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── index.html
├── .env.example
└── README.md
```

---

## 🚀 Quick Start

### 1. Clone & Setup Environment

```bash
# Copy env template
cp .env.example .env
# Edit .env with your MongoDB URL and (optional) AQI API key
```

### 2. Backend

```bash
cd backend

# Create virtual environment
python -m venv venv
venv\Scripts\activate        # Windows
# source venv/bin/activate   # Linux/Mac

# Install dependencies
pip install -r requirements.txt

# Run server
uvicorn main:app --reload --port 8000
```

**API Docs**: Open [http://localhost:8000/docs](http://localhost:8000/docs) for Swagger UI.

### 3. Frontend

```bash
cd frontend

# Install dependencies
npm install

# Start dev server
npm run dev
```

**App**: Open [http://localhost:5173](http://localhost:5173)

---

## 🔌 API Endpoints

| Method | Endpoint            | Description                        |
| ------ | ------------------- | ---------------------------------- |
| GET    | `/aqi/{city}`       | Fetch AQI data (mock or real API)  |
| POST   | `/calculate-risk`   | Calculate lung risk score          |
| GET    | `/user/{id}`        | Get user profile + health readings |
| GET    | `/public-analytics` | Aggregated public health stats     |

### Sample Request — Calculate Risk

```json
POST /calculate-risk
{
  "aqi": 172,
  "heart_rate": 78,
  "spo2": 96.5,
  "city": "Delhi"
}
```

### Sample Response

```json
{
  "risk_score": 72.5,
  "risk_level": "Moderate",
  "alert_flag": false,
  "preventive_suggestions": [
    "Consider wearing a mask if outdoors for extended periods.",
    "Avoid strenuous outdoor exercise during peak pollution hours."
  ]
}
```

---

## 🧠 Risk Engine

```
Risk Score = (AQI × 0.5) + (HeartRateFactor × 0.3) + (SpO2Factor × 0.2)
```

| Score     | Level      | Alert |
| --------- | ---------- | ----- |
| 0 – 50    | ✅ Safe     | No    |
| 51 – 100  | ⚠️ Moderate | No    |
| 100+      | 🚨 High Risk| Yes   |

---

## 📊 MongoDB Collections

| Collection       | Purpose                          |
| ---------------- | -------------------------------- |
| `users`          | User profiles                    |
| `health_readings`| Wearable data (HR, SpO2)        |
| `pollution_logs` | Historical AQI data per city     |
| `risk_history`   | Every risk calculation result    |

---

## 💡 Notes

- **No API key required** — the app ships with realistic mock data for all endpoints.
- **AQI real data** — Set `AQI_API_KEY` in `.env` to use [WAQI](https://aqicn.org/api/) real-time data.
- **MongoDB optional** — The app runs without MongoDB; it logs a warning and continues with mock data.
- **Frontend connects dynamically** — `VITE_BACKEND_URL` in `frontend/.env` configures the backend URL.

---

Built with ❤️ for cleaner air and healthier lungs.
