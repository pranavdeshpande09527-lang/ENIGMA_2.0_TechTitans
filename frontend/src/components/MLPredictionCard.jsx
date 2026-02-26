/**
 * MLPredictionCard — Simple PM2.5 prediction from weather inputs.
 */
import React, { useState } from 'react';
import { predictPM25 } from '../services/api';

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

export default function MLPredictionCard() {
    const [form, setForm] = useState(DEFAULT_VALUES);
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleChange = (key, value) => {
        setForm((prev) => ({ ...prev, [key]: value }));
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
            };
            const data = await predictPM25(payload);
            setResult(data.predicted_pm25);
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
                    <h3 className="text-white font-semibold">ML PM2.5 Prediction</h3>
                    <p className="text-xs text-gray-500">Random Forest · Trained on 2013–2016 data</p>
                </div>
            </div>

            {/* Input fields */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
                {FIELDS.map((f) => (
                    <div key={f.key}>
                        <label className="text-xs text-gray-400 mb-1 block">
                            {f.label} ({f.unit})
                        </label>
                        <input
                            type="number"
                            value={form[f.key]}
                            onChange={(e) => handleChange(f.key, e.target.value)}
                            placeholder={f.placeholder}
                            className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm outline-none focus:border-purple-500/50 transition-colors"
                        />
                    </div>
                ))}
            </div>

            {/* Predict button */}
            <button
                onClick={handlePredict}
                disabled={loading}
                className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {loading ? 'Predicting...' : 'Predict PM2.5'}
            </button>

            {/* Error */}
            {error && (
                <p className="text-red-400 text-xs mt-3 text-center">{error}</p>
            )}

            {/* Result */}
            {result !== null && (
                <div className="mt-5 text-center animate-slide-up">
                    <p className="text-xs text-gray-500 mb-1">Predicted PM2.5</p>
                    <p className="text-4xl font-bold" style={{ color: getColor(result) }}>
                        {result}
                    </p>
                    <p className="text-sm mt-1" style={{ color: getColor(result) }}>
                        {getLabel(result)} · µg/m³
                    </p>
                </div>
            )}
        </div>
    );
}
