/**
 * AQICard — Displays current AQI with color-coded severity
 */
import React from 'react';

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

    return (
        <div className={`glass-card-hover p-6 bg-gradient-to-br ${colors.bg} ${colors.border} ${colors.glow}`}>
            <div className="flex items-center justify-between mb-4">
                <div>
                    <p className="text-xs text-ink-muted uppercase tracking-wider font-medium">Air Quality Index</p>
                    <p className="text-sm text-ink-muted mt-1">{data?.city || 'Unknown City'}</p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-surface-card shadow-premium flex items-center justify-center text-xl">
                    🌫️
                </div>
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
        </div>
    );
}
