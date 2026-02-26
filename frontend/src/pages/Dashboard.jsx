/**
 * Dashboard Page — Personal Lung Health Dashboard
 * Displays AQI, risk gauge, health stats, and alert panel.
 */
import React, { useState, useEffect } from 'react';
import AQICard from '../components/AQICard';
import RiskGauge from '../components/RiskGauge';
import AlertPanel from '../components/AlertPanel';
import HealthStats from '../components/HealthStats';
import HealthProfile from '../components/HealthProfile';
import RiskExplanation from '../components/RiskExplanation';
import MLPredictionCard from '../components/MLPredictionCard';
import LungRiskCard from '../components/LungRiskCard';
import WeeklyReportCard from '../components/WeeklyReportCard';
import { getAQI, calculateRisk } from '../services/api';

/* ── Mock wearable data (used when backend is unavailable) ── */
const MOCK_WEARABLE = { heart_rate: 78, spo2: 96.5 };

const MOCK_AQI = {
    city: 'Nagpur',
    aqi: 145,
    dominant_pollutant: 'PM2.5',
    category: 'Unhealthy for Sensitive Groups',
};

const MOCK_RISK = {
    risk_score: 95.5,
    risk_level: 'Moderate',
    alert_flag: false,
    preventive_suggestions: [
        'Consider wearing a mask if outdoors for extended periods.',
        'Avoid strenuous outdoor exercise during peak pollution hours.',
        'Keep windows closed and use air purifiers indoors.',
        'Monitor your SpO₂ levels periodically.',
    ],
};

export default function Dashboard() {
    const [city, setCity] = useState('Delhi');
    const [aqiData, setAqiData] = useState(null);
    const [riskData, setRiskData] = useState(null);
    const [wearable] = useState(MOCK_WEARABLE);
    const [loading, setLoading] = useState(true);
    const [profile, setProfile] = useState(null);
    const [prevRisk, setPrevRisk] = useState(null);

    const [predictedPm25, setPredictedPm25] = useState(null);
    const [predictedPm10, setPredictedPm10] = useState(null);

    const [fetchedWeather, setFetchedWeather] = useState({ temp: null, hum: null, aqi: null });

    const handlePredictions = (pm25, pm10) => {
        setPredictedPm25(pm25);
        setPredictedPm10(pm10);
    };

    const handleWeatherFetched = (temp, hum, fetchedAqi, fetchedCity) => {
        setFetchedWeather({ temp, hum, aqi: fetchedAqi });
        if (fetchedCity) {
            setCity(fetchedCity);
        }
    };

    // Risk calculation is now securely processed over API in the backend

    async function fetchData() {
        try {
            // Fetch AQI
            const aqi = await getAQI(city);
            setAqiData(aqi);

            // Calculate base risk from backend API securely
            const risk = await calculateRisk({
                aqi: aqi.aqi,
                heart_rate: wearable.heart_rate,
                spo2: wearable.spo2,
                city,
                profile,
            });
            setPrevRisk(riskData?.risk_score || null);
            setRiskData(risk);
        } catch (err) {
            console.warn('API unavailable, using mock data:', err.message);
            setAqiData(MOCK_AQI);
            setPrevRisk(riskData?.risk_score || null);
            setRiskData(MOCK_RISK);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchData();
    }, [city, wearable, profile]);

    // Save latest data to localStorage for SathiChat context
    useEffect(() => {
        if (aqiData) localStorage.setItem('breathometer_aqi', JSON.stringify(aqiData));
        if (riskData) localStorage.setItem('breathometer_risk', JSON.stringify(riskData));
    }, [aqiData, riskData]);

    const riskTrend = prevRisk && riskData
        ? (riskData.risk_score > prevRisk ? 'up' : riskData.risk_score < prevRisk ? 'down' : 'flat')
        : 'flat';

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-slide-up">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-ink-dark">Lung Health Dashboard</h1>
                <p className="text-sm text-ink-muted mt-1">Real-time monitoring for {city}</p>
            </div>

            {/* Health Profile */}
            <HealthProfile onProfileUpdate={setProfile} />

            {/* ML Prediction Card */}
            <MLPredictionCard onPredict={handlePredictions} onWeatherFetched={handleWeatherFetched} />

            {/* Lung Infection Risk Prediction Card */}
            <LungRiskCard
                aqiData={aqiData}
                profile={profile}
                predictedPm25={predictedPm25}
                predictedPm10={predictedPm10}
                fetchedWeather={fetchedWeather}
            />

            {/* Weekly Lungs AI Report */}
            <WeeklyReportCard
                aqiData={aqiData}
                profile={profile}
                predictedPm25={predictedPm25}
                predictedPm10={predictedPm10}
                fetchedWeather={fetchedWeather}
            />

            {/* Top Row: AQI + Risk Gauge */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 relative">
                <AQICard data={aqiData} />
                <div className="relative">
                    <RiskGauge score={riskData?.risk_score} level={riskData?.risk_level} />
                    {/* Risk Trend Indicator */}
                    {riskTrend !== 'flat' && (
                        <div className={`absolute top-6 right-6 flex items-center gap-1 font-bold text-lg px-3 py-1 rounded-full ${riskTrend === 'up' ? 'text-danger-400 bg-danger-500/20 shadow-[0_0_15px_rgba(255,61,61,0.3)]' : 'text-brand-teal bg-brand-teal/20 shadow-[0_0_15px_rgba(26,175,100,0.3)]'}`}>
                            {riskTrend === 'up' ? '↑' : '↓'}
                        </div>
                    )}
                </div>
            </div>

            {/* Health Stats */}
            <HealthStats heartRate={wearable.heart_rate} spo2={wearable.spo2} />

            {/* Alert Panel */}
            <AlertPanel riskData={riskData} />

            {/* AI Explanation */}
            <RiskExplanation aqiData={aqiData} riskData={riskData} profile={profile} />
        </div>
    );
}
