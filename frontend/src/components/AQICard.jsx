/**
 * AQICard — Displays current AQI with color-coded severity
 */
import React, { useState, useEffect } from 'react';
import AQIMap from './AQIMap';

const getAQIColor = (aqi) => {
    if (aqi <= 50) return { bg: 'from-safe-500/20 to-safe-600/10', text: 'text-brand-teal', border: 'border-safe-500/30', glow: 'glow-safe' };
    if (aqi <= 100) return { bg: 'from-warning-500/20 to-warning-600/10', text: 'text-warning-400', border: 'border-warning-500/30', glow: 'glow-warning' };
    return { bg: 'from-danger-500/20 to-danger-600/10', text: 'text-danger-400', border: 'border-danger-500/30', glow: 'glow-danger' };
};

const getAQILabel = (aqi) => {
    if (aqi <= 50) return 'Good';
    if (aqi <= 100) return 'Moderate';
    if (aqi <= 150) return 'Unhealthy (Sensitive)';
    if (aqi <= 200) return 'Unhealthy';
    if (aqi <= 300) return 'Very Unhealthy';
    return 'Hazardous';
};

export default function AQICard({ data }) {
    const aqi = data?.aqi ?? 0;
    const colors = getAQIColor(aqi);
    const [showMap, setShowMap] = useState(false);
    const [coords, setCoords] = useState(null);

    // Fetch coordinates for the given city when the user wants to see the map
    useEffect(() => {
        if (!showMap || !data?.city || coords) return;

        const fetchCoords = async () => {
            try {
                const apiKey = "92b720fddf2a5c86fd6eb01f8a23430d";
                const geoRes = await fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(data.city)}&limit=1&appid=${apiKey}`);
                const geoData = await geoRes.json();
                if (geoData && geoData.length > 0) {
                    setCoords({ lat: geoData[0].lat, lon: geoData[0].lon, apiKey });
                }
            } catch (err) {
                console.error("Failed to fetch coordinates for map:", err);
            }
        };

        fetchCoords();
    }, [showMap, data?.city]);

    return (
        <div className={`glass-card-hover p-6 bg-gradient-to-br ${colors.bg} ${colors.border} ${colors.glow}`}>
            <div className="flex items-center justify-between mb-4">
                <div>
                    <p className="text-xs text-ink-muted uppercase tracking-wider font-medium">Air Quality Index</p>
                    <p className="text-sm text-ink-muted mt-1">{data?.city || 'Unknown City'}</p>
                </div>
                <button
                    onClick={() => setShowMap(!showMap)}
                    className="w-10 h-10 rounded-xl bg-surface-card shadow-premium flex items-center justify-center text-xl hover:bg-surface-base0 transition-colors"
                    title="Toggle Live Map"
                >
                    🗺️
                </button>
            </div>

            <div className="flex items-end gap-3">
                <span className={`text-5xl font-extrabold ${colors.text}`}>{aqi}</span>
                <span className={`text-sm font-medium ${colors.text} mb-2`}>{getAQILabel(aqi)}</span>
            </div>

            {data?.dominant_pollutant && (
                <div className="mt-4 flex items-center gap-2">
                    <span className="text-[10px] text-ink-muted uppercase tracking-wider">Dominant Pollutant</span>
                    <span className="text-xs text-ink-muted bg-surface-card shadow-premium px-2 py-0.5 rounded-full">
                        {data.dominant_pollutant}
                    </span>
                </div>
            )}

            {/* Map Container */}
            {showMap && (
                <div className="mt-6 animate-slide-up">
                    {!coords ? (
                        <div className="w-full h-32 flex items-center justify-center text-ink-muted text-sm border border-brand-sand rounded-xl bg-surface-base0">
                            Loading map layout...
                        </div>
                    ) : (
                        <AQIMap lat={coords.lat} lon={coords.lon} apiKey={coords.apiKey} />
                    )}
                </div>
            )}
        </div>
    );
}
