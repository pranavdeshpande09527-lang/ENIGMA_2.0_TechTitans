/**
 * PublicStats — Aggregated city-level statistics table
 */
import React from 'react';

export default function PublicStats({ analytics }) {
    if (!analytics) return null;

    const cities = analytics.top_polluted_cities || [];

    return (
        <div className="glass-card overflow-hidden">
            <div className="px-6 py-4 border-b border-brand-terracotta/5">
                <h3 className="text-sm font-bold text-ink-dark">🏙️ Top Polluted Cities</h3>
                <p className="text-[11px] text-ink-muted mt-0.5">{analytics.cities_monitored || 0} cities monitored</p>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="text-[11px] text-ink-muted uppercase tracking-wider border-b border-brand-terracotta/5">
                            <th className="px-6 py-3 text-left font-medium">City</th>
                            <th className="px-6 py-3 text-left font-medium">AQI</th>
                            <th className="px-6 py-3 text-left font-medium">Pollutant</th>
                            <th className="px-6 py-3 text-left font-medium">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {cities.map((city, i) => {
                            const statusColor =
                                city.aqi <= 100 ? 'text-brand-teal bg-safe-500/10' :
                                    city.aqi <= 200 ? 'text-warning-400 bg-warning-500/10' :
                                        'text-danger-400 bg-danger-500/10';

                            const statusLabel =
                                city.aqi <= 100 ? 'Moderate' :
                                    city.aqi <= 200 ? 'Unhealthy' : 'Severe';

                            return (
                                <tr key={i} className="border-b border-brand-terracotta/5 hover:bg-surface-card shadow-premium transition-colors">
                                    <td className="px-6 py-3 font-medium text-ink-dark">{city.city}</td>
                                    <td className="px-6 py-3 text-ink-muted">{city.aqi}</td>
                                    <td className="px-6 py-3 text-ink-muted">{city.dominant_pollutant}</td>
                                    <td className="px-6 py-3">
                                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusColor}`}>
                                            {statusLabel}
                                        </span>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
