import React, { useState, useEffect } from 'react';
import { Routes, Route, NavLink } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Analytics from './pages/Analytics';
import SathiChat from './components/SathiChat';
import Timeline from './pages/Timeline';
import FullScreenLoader from './components/FullScreenLoader';
import BreathometerLogo from './components/BreathometerLogo';

/* ── Sidebar Navigation ──────────────────────────────────── */
const navItems = [
    { to: '/', label: 'Dashboard', icon: '🫁' },
    { to: '/timeline', label: 'Timeline', icon: '📊' },
    { to: '/analytics', label: 'Analytics', icon: '🌍' },
];

function Sidebar() {
    return (
        <aside className="fixed left-0 top-0 h-screen w-64 bg-surface-base backdrop-blur-xl border-r border-brand-terracotta/10 flex flex-col z-50">
            {/* Logo */}
            <div className="p-6 border-b border-brand-terracotta/10">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-transparent flex items-center justify-center text-xl shadow-lg shadow-primary-500/10">
                        <BreathometerLogo className="w-10 h-10 drop-shadow-lg" />
                    </div>
                    <div>
                        <h1 className="text-lg font-bold text-gray-100 tracking-wider">
                            BREATHOMETER
                        </h1>
                        <p className="text-[10px] text-ink-muted tracking-widest uppercase mt-1">AI Lung Monitor</p>
                    </div>
                </div>
            </div>

            {/* Nav Links */}
            <nav className="flex-1 p-4 space-y-2">
                {navItems.map((item) => (
                    <NavLink
                        key={item.to}
                        to={item.to}
                        end={item.to === '/'}
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${isActive
                                ? 'bg-surface-base0/15 text-brand-orange border border-primary-500/30 shadow-lg shadow-primary-500/10'
                                : 'text-ink-muted hover:text-ink-dark hover:bg-surface-card shadow-premium'
                            }`
                        }
                    >
                        <span className="text-lg">{item.icon}</span>
                        {item.label}
                    </NavLink>
                ))}
            </nav>

            {/* Footer */}
            <div className="p-4 border-t border-brand-terracotta/10">
                <div className="glass-card p-3 rounded-xl">
                    <p className="text-[11px] text-ink-muted">System Status</p>
                    <div className="flex items-center gap-2 mt-1">
                        <span className="w-2 h-2 bg-safe-500 rounded-full animate-pulse-glow"></span>
                        <span className="text-xs text-brand-teal">All systems operational</span>
                    </div>
                </div>
            </div>
        </aside>
    );
}

/* ── Main App ────────────────────────────────────────────── */
export default function App() {
    const [appIsLoading, setAppIsLoading] = useState(true);

    useEffect(() => {
        // Let the beautiful SVG drawing and text fade animation play for 3.5s on boot
        const startupTimer = setTimeout(() => {
            setAppIsLoading(false);
        }, 3500);
        return () => clearTimeout(startupTimer);
    }, []);

    return (
        <div className="flex min-h-screen">
            <FullScreenLoader isLoading={appIsLoading} />
            <Sidebar />
            <main className="flex-1 ml-64 p-8">
                <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/timeline" element={<Timeline />} />
                    <Route path="/analytics" element={<Analytics />} />
                </Routes>
            </main>
            <SathiChat />
        </div>
    );
}
