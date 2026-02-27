import React, { useState, useEffect } from 'react';
import { predictLungRisk } from '../services/api';

export default function LungRiskCard({ aqiData, profile, predictedPm25, predictedPm10, fetchedWeather }) {
    // Environmental Data
    const [envStats, setEnvStats] = useState({
        pm25: 45.0,
        pm10: 80.0,
        aqi: aqiData?.aqi || 100,
        temperature: 28.5,
        humidity: 60.0
    });

    useEffect(() => {
        setEnvStats(prev => {
            const next = { ...prev };
            if (predictedPm25 !== null && predictedPm25 !== undefined) next.pm25 = Number(predictedPm25);
            if (predictedPm10 !== null && predictedPm10 !== undefined) next.pm10 = Number(predictedPm10);
            if (fetchedWeather?.temp !== null && fetchedWeather?.temp !== undefined) next.temperature = Number(fetchedWeather.temp);
            if (fetchedWeather?.hum !== null && fetchedWeather?.hum !== undefined) next.humidity = Number(fetchedWeather.hum);
            if (fetchedWeather?.aqi !== null && fetchedWeather?.aqi !== undefined) next.aqi = Number(fetchedWeather.aqi);
            return next;
        });
    }, [predictedPm25, predictedPm10, fetchedWeather]);

    // Medical & Profile Data
    const [healthStats, setHealthStats] = useState({
        age: profile?.age || 30,
        smoking: profile?.smoker || false,
        cigarettesPerDay: 0,
        asthma: profile?.asthma || false,
        copd: profile?.copd || false,
        previousInfection: false,
        outdoorExposure: "Low"
    });

    // Symptoms
    const [symptoms, setSymptoms] = useState({
        coughSeverity: 0,
        coughType: "Dry",
        symptomsDurationDays: 0,
        breathlessnessSeverity: 0,
        wheezing: false,
        spo2: 98.0,
        fever: false,
        chestPain: false
    });

    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);

    const handleEnvChange = (e) => setEnvStats({ ...envStats, [e.target.name]: Number(e.target.value) });
    const handleHealthChange = (e) => {
        const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        setHealthStats({ ...healthStats, [e.target.name]: value });
    };
    const handleSymptomChange = (e) => {
        const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        setSymptoms({ ...symptoms, [e.target.name]: value });
    };

    const handlePredict = async () => {
        setLoading(true);
        setError(null);
        try {
            const payload = {
                pm25: envStats.pm25,
                pm10: envStats.pm10,
                aqi: envStats.aqi,
                temperature: envStats.temperature,
                humidity: envStats.humidity,
                age: Number(healthStats.age),
                smoking: Boolean(healthStats.smoking),
                cigarettes_per_day: Number(healthStats.cigarettesPerDay),
                asthma: Boolean(healthStats.asthma),
                copd: Boolean(healthStats.copd),
                previous_infection: Boolean(healthStats.previousInfection),
                outdoor_exposure: String(healthStats.outdoorExposure),
                cough_severity: Number(symptoms.coughSeverity),
                cough_type: String(symptoms.coughType),
                symptoms_duration_days: Number(symptoms.symptomsDurationDays),
                breathlessness_severity: Number(symptoms.breathlessnessSeverity),
                wheezing: Boolean(symptoms.wheezing),
                spo2: Number(symptoms.spo2),
                fever: Boolean(symptoms.fever),
                chest_pain: Boolean(symptoms.chestPain)
            };
            const data = await predictLungRisk(payload);
            setResult(data);
        } catch (err) {
            setError(err.response?.data?.detail || err.message);
        } finally {
            setLoading(false);
        }
    };

    const getRiskColor = (level) => {
        if (level === 'Low') return 'text-brand-teal';
        if (level === 'Moderate') return 'text-warning-400';
        return 'text-danger-400';
    };

    return (
        <div className="bg-surface-card shadow-premium border border-brand-sand backdrop-blur-md rounded-2xl p-6 shadow-xl">
            <h2 className="text-xl font-bold text-ink-dark mb-4 flex items-center gap-2">
                <span className="text-brand-orange">🫁</span> Lung Infection Risk Predictor
            </h2>

            <p className="text-sm text-ink-muted mb-6">
                Calculate your real-time risk of lung infection based on environmental factors, your health profile, and current symptoms.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                {/* 1. Environment Column */}
                <div className="space-y-4 bg-gray-900/40 p-4 rounded-xl border border-brand-sand">
                    <h3 className="text-sm font-semibold text-ink-muted uppercase tracking-wider mb-2">Environment</h3>

                    <div>
                        <label className="block text-xs text-ink-muted mb-1 flex justify-between">
                            <span>Current AQI</span>
                            <span className="text-brand-orange text-[10px]">(Auto-fetched)</span>
                        </label>
                        <input type="number" name="aqi" value={envStats.aqi} onChange={handleEnvChange} className="w-full bg-black shadow-premium border border-brand-sand rounded-lg px-3 py-2 text-white focus:outline-none focus:border-primary-500 placeholder-gray-400" />
                    </div>

                    <div>
                        <label className="block text-xs text-ink-muted mb-1">PM2.5 (µg/m³)</label>
                        <input type="number" name="pm25" value={envStats.pm25} onChange={handleEnvChange} className="w-full bg-black shadow-premium border border-brand-sand rounded-lg px-3 py-2 text-white focus:outline-none focus:border-primary-500 placeholder-gray-400" />
                    </div>
                    <div>
                        <label className="block text-xs text-ink-muted mb-1">PM10 (µg/m³)</label>
                        <input type="number" name="pm10" value={envStats.pm10} onChange={handleEnvChange} className="w-full bg-black shadow-premium border border-brand-sand rounded-lg px-3 py-2 text-white focus:outline-none focus:border-primary-500 placeholder-gray-400" />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                        <div>
                            <label className="block text-xs text-ink-muted mb-1">Temp (°C)</label>
                            <input type="number" name="temperature" value={envStats.temperature} onChange={handleEnvChange} className="w-full bg-black shadow-premium border border-brand-sand rounded-lg px-3 py-2 text-white focus:outline-none focus:border-primary-500 placeholder-gray-400" />
                        </div>
                        <div>
                            <label className="block text-xs text-ink-muted mb-1">Hum. (%)</label>
                            <input type="number" name="humidity" value={envStats.humidity} onChange={handleEnvChange} className="w-full bg-black shadow-premium border border-brand-sand rounded-lg px-3 py-2 text-white focus:outline-none focus:border-primary-500 placeholder-gray-400" />
                        </div>
                    </div>
                </div>

                {/* 2. Health Profile Column */}
                <div className="space-y-4 bg-gray-900/40 p-4 rounded-xl border border-brand-sand">
                    <h3 className="text-sm font-semibold text-ink-muted uppercase tracking-wider mb-2">Profile Details</h3>

                    <div>
                        <label className="block text-xs text-ink-muted mb-1">Age</label>
                        <input type="number" name="age" value={healthStats.age} onChange={handleHealthChange} className="w-full bg-black shadow-premium border border-brand-sand rounded-lg px-3 py-2 text-white focus:outline-none focus:border-primary-500 placeholder-gray-400" />
                    </div>

                    <div className="space-y-2 mt-4">
                        <label className="flex items-center gap-2 text-sm text-ink-muted">
                            <input type="checkbox" name="smoking" checked={healthStats.smoking} onChange={handleHealthChange} className="w-4 h-4 rounded bg-surface-card shadow-premium border-gray-600 text-brand-orange focus:ring-primary-500" />
                            Smoker
                        </label>
                        {healthStats.smoking && (
                            <div className="pl-6 mt-1 mb-2">
                                <label className="block text-xs text-ink-muted mb-1">Cigarettes per day</label>
                                <input type="number" name="cigarettesPerDay" value={healthStats.cigarettesPerDay} onChange={handleHealthChange} className="w-full bg-black shadow-premium border border-brand-sand rounded-lg px-3 py-1.5 text-white focus:outline-none focus:border-primary-500 text-sm placeholder-gray-400" />
                            </div>
                        )}
                        <label className="flex items-center gap-2 text-sm text-ink-muted">
                            <input type="checkbox" name="asthma" checked={healthStats.asthma} onChange={handleHealthChange} className="w-4 h-4 rounded bg-surface-card shadow-premium border-gray-600 text-brand-orange focus:ring-primary-500" />
                            Asthma
                        </label>
                        <label className="flex items-center gap-2 text-sm text-ink-muted">
                            <input type="checkbox" name="copd" checked={healthStats.copd} onChange={handleHealthChange} className="w-4 h-4 rounded bg-surface-card shadow-premium border-gray-600 text-brand-orange focus:ring-primary-500" />
                            COPD
                        </label>
                        <label className="flex items-center gap-2 text-sm text-ink-muted">
                            <input type="checkbox" name="previousInfection" checked={healthStats.previousInfection} onChange={handleHealthChange} className="w-4 h-4 rounded bg-surface-card shadow-premium border-gray-600 text-brand-orange focus:ring-primary-500" />
                            Previous Lung Infection
                        </label>
                    </div>
                </div>

                {/* 3. Symptoms Column */}
                <div className="space-y-4 bg-gray-900/40 p-4 rounded-xl border border-brand-sand">
                    <h3 className="text-sm font-semibold text-ink-muted uppercase tracking-wider mb-2">Current Symptoms</h3>

                    <div>
                        <label className="block text-xs text-ink-muted mb-1 flex justify-between">
                            <span>Cough Severity (0-10)</span>
                            <span className="text-brand-orange font-bold">{symptoms.coughSeverity}</span>
                        </label>
                        <input type="range" min="0" max="10" name="coughSeverity" value={symptoms.coughSeverity} onChange={handleSymptomChange} className="w-full accent-primary-500" />
                    </div>

                    {symptoms.coughSeverity > 0 && (
                        <div className="flex gap-4 mt-2">
                            <label className="flex items-center gap-2 text-xs text-ink-muted">
                                <input type="radio" name="coughType" value="Dry" checked={symptoms.coughType === 'Dry'} onChange={handleSymptomChange} className="accent-primary-500" /> Dry Cough
                            </label>
                            <label className="flex items-center gap-2 text-xs text-ink-muted">
                                <input type="radio" name="coughType" value="Wet" checked={symptoms.coughType === 'Wet'} onChange={handleSymptomChange} className="accent-primary-500" /> Wet Cough
                            </label>
                        </div>
                    )}

                    <div>
                        <label className="block text-xs text-ink-muted mb-1 flex justify-between">
                            <span>Breathlessness (0-10)</span>
                            <span className="text-brand-orange font-bold">{symptoms.breathlessnessSeverity}</span>
                        </label>
                        <input type="range" min="0" max="10" name="breathlessnessSeverity" value={symptoms.breathlessnessSeverity} onChange={handleSymptomChange} className="w-full accent-primary-500" />
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-brand-sand mt-2">
                        <div>
                            <label className="block text-xs text-ink-muted mb-1">Duration (Days)</label>
                            <input type="number" min="0" name="symptomsDurationDays" value={symptoms.symptomsDurationDays} onChange={handleSymptomChange} className="w-full bg-black shadow-premium border border-brand-sand rounded-lg px-3 py-2 text-white focus:outline-none focus:border-primary-500 text-sm placeholder-gray-400" />
                        </div>
                        <div>
                            <label className="block text-xs text-ink-muted mb-1">SpO₂ (%)</label>
                            <input type="number" min="0" max="100" name="spo2" value={symptoms.spo2} onChange={handleSymptomChange} className="w-full bg-black shadow-premium border border-brand-sand rounded-lg px-3 py-2 text-white focus:outline-none focus:border-primary-500 text-sm placeholder-gray-400" />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-brand-sand">
                        <label className="flex items-center gap-2 text-sm text-ink-muted">
                            <input type="checkbox" name="fever" checked={symptoms.fever} onChange={handleSymptomChange} className="w-4 h-4 rounded bg-surface-card shadow-premium border-gray-600 text-brand-orange focus:ring-primary-500" />
                            Fever
                        </label>
                        <label className="flex items-center gap-2 text-sm text-ink-muted">
                            <input type="checkbox" name="chestPain" checked={symptoms.chestPain} onChange={handleSymptomChange} className="w-4 h-4 rounded bg-surface-card shadow-premium border-gray-600 text-brand-orange focus:ring-primary-500" />
                            Chest Pain
                        </label>
                        <label className="flex items-center gap-2 text-sm text-ink-muted col-span-2 mt-1">
                            <input type="checkbox" name="wheezing" checked={symptoms.wheezing} onChange={handleSymptomChange} className="w-4 h-4 rounded bg-surface-card shadow-premium border-gray-600 text-brand-orange focus:ring-primary-500" />
                            Wheezing (Whistling sound)
                        </label>
                    </div>
                </div>

            </div>

            <div className="mt-8 flex flex-col items-center">
                <button
                    onClick={handlePredict}
                    disabled={loading}
                    className="w-full md:w-auto px-10 py-3 bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-500 hover:to-primary-400 text-ink-dark font-bold rounded-xl shadow-lg shadow-primary-500/30 transition-all flex justify-center items-center disabled:opacity-50"
                >
                    {loading ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    ) : (
                        "Analyze Infection Risk"
                    )}
                </button>

                {error && <p className="text-danger-400 text-sm mt-3">{error}</p>}

                {result && !loading && (
                    <div className="mt-6 w-full fade-in">
                        <div className={`p-6 border rounded-2xl flex flex-col md:flex-row items-center gap-6 ${result.risk_level === 'High' ? 'bg-danger-500/10 border-danger-500/30' :
                            result.risk_level === 'Moderate' ? 'bg-warning-500/10 border-warning-500/30' :
                                'bg-safe-500/10 border-safe-500/30'
                            }`}>
                            <div className="flex-shrink-0 text-center">
                                <div className="text-5xl font-black tabular-nums tracking-tighter">
                                    <span className={getRiskColor(result.risk_level)}>{result.risk_percentage}</span>
                                    <span className="text-2xl text-ink-muted ml-1">%</span>
                                </div>
                                <div className={`text-sm font-bold uppercase tracking-widest mt-1 ${getRiskColor(result.risk_level)}`}>
                                    {result.risk_level} Risk
                                </div>
                            </div>

                            <div className="flex-1 text-center md:text-left">
                                <p className="text-ink-muted text-lg leading-relaxed">{result.explanation}</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div >
    );
}
