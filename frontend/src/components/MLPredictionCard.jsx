/**
 * MLPredictionCard — Simple PM2.5 and PM10 prediction from weather inputs.
 */
import React, { useState } from 'react';
import { predictAirQuality, getAQI } from '../services/api';

const DEFAULT_VALUES = {
    temperature: '',
    humidity: '',
    pressure: '',
    visibility: '',
    wind_speed: '',
};

const FIELDS = [
    { key: 'temperature', label: 'Temperature', unit: '°C', placeholder: '32' },
    { key: 'humidity', label: 'Humidity', unit: '%', placeholder: '60' },
    { key: 'pressure', label: 'Pressure', unit: 'hPa', placeholder: '1012' },
    { key: 'visibility', label: 'Visibility', unit: 'km', placeholder: '8' },
    { key: 'wind_speed', label: 'Wind Speed', unit: 'km/h', placeholder: '5' },
];

export default function MLPredictionCard({ onPredict, onWeatherFetched }) {
    const [form, setForm] = useState(DEFAULT_VALUES);
    const [city, setCity] = useState('');
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [fetchingWeather, setFetchingWeather] = useState(false);
    const [error, setError] = useState(null);

    const handleChange = (key, value) => {
        setForm((prev) => ({ ...prev, [key]: value }));
    };

    const handleFetchWeather = async () => {
        if (!city.trim()) {
            setError("Please enter a city name to fetch weather.");
            return;
        }
        setFetchingWeather(true);
        setError(null);
        try {
            const apiKey = "92b720fddf2a5c86fd6eb01f8a23430d";
            // 1. Get Coordinates
            const geoRes = await fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(city)}&limit=1&appid=${apiKey}`);
            const geoData = await geoRes.json();
            if (!geoData || geoData.length === 0) {
                throw new Error("City not found.");
            }
            const { lat, lon } = geoData[0];

            // 2. Get Weather
            const weatherRes = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`);
            const weatherData = await weatherRes.json();

            const temp = Math.round(weatherData.main.temp);
            const hum = Math.round(weatherData.main.humidity);

            // 3. Get AQI via existing backend endpoint
            let fetchedAqi = null;
            try {
                const aqiData = await getAQI(city);
                if (aqiData && aqiData.aqi) fetchedAqi = aqiData.aqi;
            } catch (aqiErr) {
                console.warn("Failed to fetch AQI for this city:", aqiErr);
            }

            setForm({
                temperature: temp,
                humidity: hum,
                pressure: Math.round(weatherData.main.pressure),
                visibility: Math.max(1, Math.round(weatherData.visibility / 1000)), // m to km
                wind_speed: Math.round(weatherData.wind.speed * 3.6), // m/s to km/h
            });
            setError(null);

            if (onWeatherFetched) {
                onWeatherFetched(temp, hum, fetchedAqi, city);
            }
        } catch (err) {
            setError("Failed to fetch weather: " + err.message);
        } finally {
            setFetchingWeather(false);
        }
    };

    const handlePredict = async () => {
        setError(null);
        setResult(null);

        // Validate all fields filled
        for (const f of FIELDS) {
            if (form[f.key] === '' || isNaN(Number(form[f.key]))) {
                setError(`Please enter a valid ${f.label}`);
                return;
            }
        }

        setLoading(true);
        try {
            const payload = {
                temperature: Number(form.temperature),
                humidity: Number(form.humidity),
                pressure: Number(form.pressure),
                visibility: Number(form.visibility),
                wind_speed: Number(form.wind_speed),
                city: city.trim() || 'Delhi'
            };
            const data = await predictAirQuality(payload);
            setResult({ pm25: data.predicted_pm25, pm10: data.predicted_pm10 });
            if (onPredict) {
                onPredict(data.predicted_pm25, data.predicted_pm10);
            }
        } catch (err) {
            setError(err?.response?.data?.detail || 'Prediction failed. Is the backend running?');
        } finally {
            setLoading(false);
        }
    };

    // Color based on PM2.5 level
    const getColor = (pm25) => {
        if (pm25 <= 50) return '#1aaf64';
        if (pm25 <= 100) return '#f5a623';
        if (pm25 <= 150) return '#ff8c00';
        if (pm25 <= 200) return '#e53935';
        return '#8e24aa';
    };

    const getLabel = (pm25) => {
        if (pm25 <= 50) return 'Good';
        if (pm25 <= 100) return 'Moderate';
        if (pm25 <= 150) return 'Unhealthy for Sensitive';
        if (pm25 <= 200) return 'Unhealthy';
        return 'Very Unhealthy';
    };

    return (
        <div className="glass-card p-6 rounded-2xl">
            {/* Header */}
            <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center">
                    <span className="text-xl">🤖</span>
                </div>
                <div>
                    <h3 className="text-ink-dark font-semibold">ML Air Quality Prediction</h3>
                    <p className="text-xs text-ink-muted">Dual Random Forests · PM2.5 & PM10</p>
                </div>
            </div>

            {/* Auto-fill Weather row */}
            <div className="mb-4 flex gap-2">
                <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Enter city to auto-fill weather..."
                    className="flex-1 px-3 py-2 rounded-lg bg-black shadow-premium border border-brand-terracotta/10 text-white text-sm outline-none focus:border-purple-500/50 transition-colors placeholder-gray-400"
                />
                <button
                    onClick={handleFetchWeather}
                    disabled={fetchingWeather}
                    className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-ink-dark font-semibold text-sm transition-colors disabled:opacity-50"
                >
                    {fetchingWeather ? 'Fetching...' : 'Get Weather'}
                </button>
            </div>

            {/* Input fields */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
                {FIELDS.map((f) => (
                    <div key={f.key}>
                        <label className="text-xs text-ink-muted mb-1 block">
                            {f.label} ({f.unit})
                        </label>
                        <input
                            type="number"
                            value={form[f.key]}
                            onChange={(e) => handleChange(f.key, e.target.value)}
                            placeholder={f.placeholder}
                            className="w-full px-3 py-2 rounded-lg bg-black shadow-premium border border-brand-terracotta/10 text-white text-sm outline-none focus:border-purple-500/50 transition-colors placeholder-gray-400"
                        />
                    </div>
                ))}
            </div>

            {/* Predict button */}
            <button
                onClick={handlePredict}
                disabled={loading}
                className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-ink-dark font-semibold text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {loading ? 'Predicting...' : 'Predict Air Quality'}
            </button>

            {/* Error */}
            {error && (
                <p className="text-red-400 text-xs mt-3 text-center">{error}</p>
            )}

            {/* Result */}
            {result !== null && (
                <div className="mt-5 grid grid-cols-2 gap-4 animate-slide-up">
                    <div className="text-center bg-surface-base rounded-xl p-4 border border-brand-terracotta/5">
                        <p className="text-xs text-ink-muted mb-1">Predicted PM2.5</p>
                        <p className="text-4xl font-bold" style={{ color: getColor(result.pm25) }}>
                            {result.pm25}
                        </p>
                        <p className="text-sm mt-1" style={{ color: getColor(result.pm25) }}>
                            {getLabel(result.pm25)}
                        </p>
                    </div>
                    <div className="text-center bg-surface-base rounded-xl p-4 border border-brand-terracotta/5">
                        <p className="text-xs text-ink-muted mb-1">Predicted PM10</p>
                        <p className="text-4xl font-bold text-blue-400">
                            {result.pm10}
                        </p>
                        <p className="text-sm mt-1 text-blue-400">
                            µg/m³
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}
