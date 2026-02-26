/**
 * PublicStats — Aggregated city-level statistics table
 */
import React from 'react';

export default function PublicStats({ analytics }) {
    if (!analytics) return null;

    const cities = analytics.top_polluted_cities || [];

    return (
        <div className="glass-card overflow-hidden">
            <div className="px-6 py-4 border-b border-white/5">
                <h3 className="text-sm font-bold text-white">🏙️ Top Polluted Cities</h3>
                <p className="text-[11px] text-gray-500 mt-0.5">{analytics.cities_monitored || 0} cities monitored</p>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="text-[11px] text-gray-500 uppercase tracking-wider border-b border-white/5">
                            <th className="px-6 py-3 text-left font-medium">City</th>
                            <th className="px-6 py-3 text-left font-medium">AQI</th>
                            <th className="px-6 py-3 text-left font-medium">Pollutant</th>
                            <th className="px-6 py-3 text-left font-medium">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {cities.map((city, i) => {
                            const statusColor =
                                city.aqi <= 100 ? 'text-safe-400 bg-safe-500/10' :
                                    city.aqi <= 200 ? 'text-warning-400 bg-warning-500/10' :
                                        'text-danger-400 bg-danger-500/10';

                            const statusLabel =
                                city.aqi <= 100 ? 'Moderate' :
                                    city.aqi <= 200 ? 'Unhealthy' : 'Severe';

                            return (
                                <tr key={i} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                    <td className="px-6 py-3 font-medium text-white">{city.city}</td>
                                    <td className="px-6 py-3 text-gray-300">{city.aqi}</td>
                                    <td className="px-6 py-3 text-gray-400">{city.dominant_pollutant}</td>
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
