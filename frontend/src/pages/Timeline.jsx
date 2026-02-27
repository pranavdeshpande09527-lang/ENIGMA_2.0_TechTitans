/**
 * Timeline Page — Pollution Exposure Timeline
 * Line chart showing AQI trend over time using Chart.js.
 */
import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler,
} from 'chart.js';
import { getAnalytics } from '../services/api';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

/* ── Mock timeline data ────────────────────────────────── */
const MOCK_TIMELINE = {
    labels: ['06:00', '08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00', '22:00'],
    aqi: [110, 145, 168, 155, 140, 132, 160, 185, 150],
    riskScores: [45, 62, 78, 70, 58, 52, 68, 85, 65],
};

export default function Timeline() {
    const [timeline, setTimeline] = useState(MOCK_TIMELINE);

    useEffect(() => {
        async function fetchTimeline() {
            try {
                const data = await getAnalytics();
                if (data?.hourly_aqi_trend) {
                    setTimeline({
                        labels: data.hourly_aqi_trend.map((h) => h.hour),
                        aqi: data.hourly_aqi_trend.map((h) => h.aqi),
                        riskScores: data.hourly_aqi_trend.map((h) => Math.round(h.aqi * 0.5 + 15)),
                    });
                }
            } catch {
                /* use mock data */
            }
        }
        fetchTimeline();
    }, []);

    const chartData = {
        labels: timeline.labels,
        datasets: [
            {
                label: 'AQI',
                data: timeline.aqi,
                borderColor: '#33a5ff',
                backgroundColor: 'rgba(51, 165, 255, 0.08)',
                fill: true,
                tension: 0.4,
                pointBackgroundColor: '#33a5ff',
                pointBorderColor: '#1a1a2e',
                pointBorderWidth: 2,
                pointRadius: 5,
                pointHoverRadius: 8,
            },
            {
                label: 'Risk Score',
                data: timeline.riskScores,
                borderColor: '#f59e0b',
                backgroundColor: 'rgba(245, 158, 11, 0.08)',
                fill: true,
                tension: 0.4,
                pointBackgroundColor: '#f59e0b',
                pointBorderColor: '#1a1a2e',
                pointBorderWidth: 2,
                pointRadius: 5,
                pointHoverRadius: 8,
                borderDash: [5, 5],
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                labels: { color: '#94a3b8', font: { family: 'Inter' }, usePointStyle: true, pointStyleWidth: 10 },
            },
            tooltip: {
                backgroundColor: '#1a1a2e',
                titleColor: '#e2e8f0',
                bodyColor: '#94a3b8',
                borderColor: 'rgba(255,255,255,0.1)',
                borderWidth: 1,
                padding: 12,
                cornerRadius: 12,
            },
        },
        scales: {
            x: {
                grid: { color: 'rgba(255,255,255,0.03)' },
                ticks: { color: '#64748b', font: { family: 'Inter', size: 11 } },
            },
            y: {
                grid: { color: 'rgba(255,255,255,0.03)' },
                ticks: { color: '#64748b', font: { family: 'Inter', size: 11 } },
            },
        },
    };

    /* ── Exposure summary cards ──────────────────────────── */
    const avgAQI = Math.round(timeline.aqi.reduce((a, b) => a + b, 0) / timeline.aqi.length);
    const peakAQI = Math.max(...timeline.aqi);
    const peakHour = timeline.labels[timeline.aqi.indexOf(peakAQI)];

    return (
        <div className="space-y-6 animate-slide-up">
            <div>
                <h1 className="text-2xl font-bold text-ink-dark">Pollution Exposure Timeline</h1>
                <p className="text-sm text-ink-muted mt-1">Track your AQI & risk exposure throughout the day</p>
            </div>

            {/* Summary cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="glass-card-hover p-5">
                    <p className="text-[11px] text-ink-muted uppercase tracking-wider">Average AQI</p>
                    <p className="text-3xl font-bold text-brand-orange mt-1">{avgAQI}</p>
                </div>
                <div className="glass-card-hover p-5">
                    <p className="text-[11px] text-ink-muted uppercase tracking-wider">Peak AQI</p>
                    <p className="text-3xl font-bold text-danger-400 mt-1">{peakAQI}</p>
                </div>
                <div className="glass-card-hover p-5">
                    <p className="text-[11px] text-ink-muted uppercase tracking-wider">Peak Hour</p>
                    <p className="text-3xl font-bold text-warning-400 mt-1">{peakHour}</p>
                </div>
            </div>

            {/* Chart */}
            <div className="glass-card p-6" style={{ height: '400px' }}>
                <h3 className="text-sm font-bold text-ink-dark mb-4">Hourly AQI & Risk Trend</h3>
                <Line data={chartData} options={chartOptions} />
            </div>

            {/* Detailed Insights & Breakdown Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Activity Recommendations based on Timeline */}
                <div className="glass-card p-6 lg:col-span-1 flex flex-col justify-between">
                    <div>
                        <h3 className="text-sm font-bold text-ink-dark mb-4 border-b border-brand-sand pb-2">Activity Recommendations</h3>
                        <p className="text-xs text-ink-muted mb-4">Based on today's exposure trend, here is how you should plan your day.</p>

                        <div className="space-y-4">
                            <div className="flex items-start gap-3">
                                <span className="text-xl">🏃‍♂️</span>
                                <div>
                                    <p className="text-sm font-semibold text-ink-dark">Best Time to Exercise</p>
                                    <p className="text-xs text-brand-teal mt-0.5">06:00 - 08:00 (AQI is lowest)</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <span className="text-xl">🏠</span>
                                <div>
                                    <p className="text-sm font-semibold text-ink-dark">Stay Indoors</p>
                                    <p className="text-xs text-danger-400 mt-0.5">18:00 - 20:00 (Peak pollution)</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <span className="text-xl">😷</span>
                                <div>
                                    <p className="text-sm font-semibold text-ink-dark">Mask Recommended</p>
                                    <p className="text-xs text-warning-400 mt-0.5">All day (Avg AQI &gt; 100)</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Hourly Breakdown Table */}
                <div className="glass-card p-6 lg:col-span-2 overflow-x-auto">
                    <h3 className="text-sm font-bold text-ink-dark mb-4 border-b border-brand-sand pb-2">Hourly Breakdown</h3>
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="text-[11px] uppercase tracking-wider text-ink-muted border-b border-brand-sand/50">
                                <th className="pb-2 font-medium">Time</th>
                                <th className="pb-2 font-medium">AQI Level</th>
                                <th className="pb-2 font-medium">Risk Score</th>
                                <th className="pb-2 font-medium text-right">Status</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm">
                            {timeline.labels.map((time, idx) => {
                                const a = timeline.aqi[idx];
                                const r = timeline.riskScores[idx];
                                const statusColor = a <= 100 ? 'text-brand-teal bg-safe-400/10' : a <= 150 ? 'text-warning-400 bg-warning-400/10' : 'text-danger-400 bg-danger-400/10';
                                const statusText = a <= 100 ? 'Moderate' : a <= 150 ? 'Unhealthy for Sensitive' : 'Unhealthy';

                                return (
                                    <tr key={time} className="border-b border-brand-sand/30 hover:bg-surface-base0/50 transition-colors">
                                        <td className="py-2.5 text-ink-dark font-medium">{time}</td>
                                        <td className={`py-2.5 font-bold ${a > 150 ? 'text-danger-400' : 'text-ink-dark'}`}>{a}</td>
                                        <td className="py-2.5 text-ink-muted">{r}/100</td>
                                        <td className="py-2.5 text-right">
                                            <span className={`px-2 py-1 text-[10px] uppercase tracking-wider font-bold rounded-full ${statusColor}`}>
                                                {statusText}
                                            </span>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>

            </div>
        </div>
    );
}
