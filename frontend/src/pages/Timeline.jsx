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
                <h1 className="text-2xl font-bold text-white">Pollution Exposure Timeline</h1>
                <p className="text-sm text-gray-500 mt-1">Track your AQI & risk exposure throughout the day</p>
            </div>

            {/* Summary cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="glass-card-hover p-5">
                    <p className="text-[11px] text-gray-500 uppercase tracking-wider">Average AQI</p>
                    <p className="text-3xl font-bold text-primary-400 mt-1">{avgAQI}</p>
                </div>
                <div className="glass-card-hover p-5">
                    <p className="text-[11px] text-gray-500 uppercase tracking-wider">Peak AQI</p>
                    <p className="text-3xl font-bold text-danger-400 mt-1">{peakAQI}</p>
                </div>
                <div className="glass-card-hover p-5">
                    <p className="text-[11px] text-gray-500 uppercase tracking-wider">Peak Hour</p>
                    <p className="text-3xl font-bold text-warning-400 mt-1">{peakHour}</p>
                </div>
            </div>

            {/* Chart */}
            <div className="glass-card p-6" style={{ height: '400px' }}>
                <Line data={chartData} options={chartOptions} />
            </div>
        </div>
    );
}
