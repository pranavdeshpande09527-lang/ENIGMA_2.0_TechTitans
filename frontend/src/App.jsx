import React from 'react';
import { Routes, Route, NavLink } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Analytics from './pages/Analytics';
import SathiChat from './components/SathiChat';
import Timeline from './pages/Timeline';

/* ── Sidebar Navigation ──────────────────────────────────── */
const navItems = [
    { to: '/', label: 'Dashboard', icon: '🫁' },
    { to: '/timeline', label: 'Timeline', icon: '📊' },
    { to: '/analytics', label: 'Analytics', icon: '🌍' },
];

function Sidebar() {
    return (
        <aside className="fixed left-0 top-0 h-screen w-64 bg-dark-950/80 backdrop-blur-xl border-r border-white/10 flex flex-col z-50">
            {/* Logo */}
            <div className="p-6 border-b border-white/10">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-xl shadow-lg shadow-primary-500/25">
                        🫁
                    </div>
                    <div>
                        <h1 className="text-lg font-bold bg-gradient-to-r from-primary-400 to-primary-200 bg-clip-text text-transparent">
                            Breathometer
                        </h1>
                        <p className="text-[10px] text-gray-500 tracking-widest uppercase">AI Lung Monitor</p>
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
                                ? 'bg-primary-500/15 text-primary-400 border border-primary-500/30 shadow-lg shadow-primary-500/10'
                                : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'
                            }`
                        }
                    >
                        <span className="text-lg">{item.icon}</span>
                        {item.label}
                    </NavLink>
                ))}
            </nav>

            {/* Footer */}
            <div className="p-4 border-t border-white/10">
                <div className="glass-card p-3 rounded-xl">
                    <p className="text-[11px] text-gray-500">System Status</p>
                    <div className="flex items-center gap-2 mt-1">
                        <span className="w-2 h-2 bg-safe-500 rounded-full animate-pulse-glow"></span>
                        <span className="text-xs text-safe-400">All systems operational</span>
                    </div>
                </div>
            </div>
        </aside>
    );
}

/* ── Main App ────────────────────────────────────────────── */
export default function App() {
    return (
        <div className="flex min-h-screen">
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
