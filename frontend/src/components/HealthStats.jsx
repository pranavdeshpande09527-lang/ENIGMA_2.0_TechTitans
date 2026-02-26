/**
 * HealthStats — Displays Heart Rate & SpO2 from wearable
 */
import React from 'react';

function StatCard({ label, value, unit, icon, color }) {
    return (
        <div className="glass-card-hover p-5 flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center text-2xl shadow-lg`}>
                {icon}
            </div>
            <div>
                <p className="text-[11px] text-gray-500 uppercase tracking-wider font-medium">{label}</p>
                <div className="flex items-baseline gap-1 mt-1">
                    <span className="text-2xl font-bold text-white">{value}</span>
                    <span className="text-xs text-gray-500">{unit}</span>
                </div>
            </div>
        </div>
    );
}

export default function HealthStats({ heartRate = 78, spo2 = 96.5 }) {
    return (
        <div className="grid grid-cols-2 gap-4">
            <StatCard
                label="Heart Rate"
                value={heartRate}
                unit="bpm"
                icon="❤️"
                color="from-danger-500/20 to-danger-600/10"
            />
            <StatCard
                label="SpO₂"
                value={spo2}
                unit="%"
                icon="💧"
                color="from-primary-500/20 to-primary-600/10"
            />
        </div>
    );
}
