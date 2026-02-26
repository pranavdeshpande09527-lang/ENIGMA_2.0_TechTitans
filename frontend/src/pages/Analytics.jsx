/**
 * Analytics Page — Public Health Analytics Panel
 * Doughnut chart for risk distribution + city stats.
 */
import React, { useState, useEffect } from 'react';
import { Doughnut, Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    ArcElement,
    CategoryScale,
    LinearScale,
    BarElement,
    Tooltip,
    Legend,
} from 'chart.js';
import PublicStats from '../components/PublicStats';
import { getAnalytics } from '../services/api';

ChartJS.register(ArcElement, CategoryScale, LinearScale, BarElement, Tooltip, Legend);

/* ── Mock data ─────────────────────────────────────────── */
const MOCK_ANALYTICS = {
    total_users: 1247,
    total_readings: 18432,
    cities_monitored: 12,
    average_aqi_today: 134,
    risk_distribution: { Safe: 42, Moderate: 35, 'High Risk': 23 },
    top_polluted_cities: [
        { city: 'Delhi', aqi: 285, dominant_pollutant: 'PM2.5' },
        { city: 'Mumbai', aqi: 172, dominant_pollutant: 'PM10' },
        { city: 'Kolkata', aqi: 158, dominant_pollutant: 'PM2.5' },
        { city: 'Bangalore', aqi: 98, dominant_pollutant: 'O3' },
        { city: 'Chennai', aqi: 87, dominant_pollutant: 'NO2' },
    ],
    health_alerts_today: 38,
};

export default function Analytics() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetch() {
            try {
                const resp = await getAnalytics();
                setData(resp);
            } catch {
                setData(MOCK_ANALYTICS);
            } finally {
                setLoading(false);
            }
        }
        fetch();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    const dist = data?.risk_distribution || {};

    const doughnutData = {
        labels: Object.keys(dist),
        datasets: [
            {
                data: Object.values(dist),
                backgroundColor: ['#1aaf64', '#f59e0b', '#ff3d3d'],
                borderColor: '#0f0f1a',
                borderWidth: 3,
                hoverOffset: 8,
            },
        ],
    };

    const doughnutOptions = {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '70%',
        plugins: {
            legend: {
                position: 'bottom',
                labels: { color: '#94a3b8', font: { family: 'Inter' }, usePointStyle: true, padding: 20 },
            },
        },
    };

    const barData = {
        labels: (data?.top_polluted_cities || []).map((c) => c.city),
        datasets: [
            {
                label: 'AQI',
                data: (data?.top_polluted_cities || []).map((c) => c.aqi),
                backgroundColor: (data?.top_polluted_cities || []).map((c) =>
                    c.aqi <= 100 ? 'rgba(26,175,100,0.6)' : c.aqi <= 200 ? 'rgba(245,158,11,0.6)' : 'rgba(255,61,61,0.6)'
                ),
                borderRadius: 8,
                borderSkipped: false,
            },
        ],
    };

    const barOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
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
            x: { grid: { display: false }, ticks: { color: '#64748b', font: { family: 'Inter', size: 11 } } },
            y: { grid: { color: 'rgba(255,255,255,0.03)' }, ticks: { color: '#64748b', font: { family: 'Inter', size: 11 } } },
        },
    };

    /* ── KPI cards ───────────────────────────────────────── */
    const kpis = [
        { label: 'Total Users', value: data?.total_users?.toLocaleString(), icon: '👥' },
        { label: 'Readings Today', value: data?.total_readings?.toLocaleString(), icon: '📡' },
        { label: 'Cities Monitored', value: data?.cities_monitored, icon: '🏙️' },
        { label: 'Alerts Today', value: data?.health_alerts_today, icon: '🚨' },
    ];

    return (
        <div className="space-y-6 animate-slide-up">
            <div>
                <h1 className="text-2xl font-bold text-ink-dark">Public Health Analytics</h1>
                <p className="text-sm text-ink-muted mt-1">Aggregated environmental health data across cities</p>
            </div>

            {/* KPIs */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {kpis.map((kpi, i) => (
                    <div key={i} className="glass-card-hover p-5 text-center">
                        <span className="text-2xl">{kpi.icon}</span>
                        <p className="text-2xl font-bold text-ink-dark mt-2">{kpi.value}</p>
                        <p className="text-[11px] text-ink-muted uppercase tracking-wider mt-1">{kpi.label}</p>
                    </div>
                ))}
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="glass-card p-6">
                    <h3 className="text-sm font-bold text-ink-dark mb-4">Risk Distribution</h3>
                    <div style={{ height: '280px' }}>
                        <Doughnut data={doughnutData} options={doughnutOptions} />
                    </div>
                </div>
                <div className="glass-card p-6">
                    <h3 className="text-sm font-bold text-ink-dark mb-4">City AQI Comparison</h3>
                    <div style={{ height: '280px' }}>
                        <Bar data={barData} options={barOptions} />
                    </div>
                </div>
            </div>

            {/* City Table */}
            <PublicStats analytics={data} />
        </div>
    );
}
