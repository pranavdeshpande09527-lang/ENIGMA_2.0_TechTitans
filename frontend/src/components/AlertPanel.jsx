/**
 * AlertPanel — Real-time risk alerts & preventive suggestions
 */
import React from 'react';

export default function AlertPanel({ riskData }) {
    if (!riskData) return null;

    const { alert_flag, risk_level, preventive_suggestions = [] } = riskData;

    const borderColor = alert_flag
        ? 'border-danger-500/40'
        : risk_level === 'Moderate'
            ? 'border-warning-500/40'
            : 'border-safe-500/40';

    const headerBg = alert_flag
        ? 'from-danger-500/30 to-danger-600/10 shadow-[inset_0_4px_20px_rgba(255,61,61,0.2)]'
        : risk_level === 'Moderate'
            ? 'from-warning-500/20 to-warning-600/5'
            : 'from-safe-500/20 to-safe-600/5';

    return (
        <div className={`glass-card overflow-hidden ${borderColor}`}>
            {/* Header */}
            <div className={`px-6 py-4 bg-gradient-to-r ${headerBg} border-b border-brand-terracotta/5`}>
                <div className="flex items-center gap-3">
                    <span className="text-xl">{alert_flag ? '🚨' : risk_level === 'Moderate' ? '⚠️' : '✅'}</span>
                    <div>
                        <h3 className="text-sm font-bold text-ink-dark">
                            {alert_flag ? 'HIGH RISK ALERT' : risk_level === 'Moderate' ? 'Moderate Risk Notice' : 'All Clear'}
                        </h3>
                        <p className="text-[11px] text-ink-muted">Real-time health advisory</p>
                    </div>
                    {alert_flag && (
                        <span className="ml-auto w-3 h-3 bg-danger-500 rounded-full animate-pulse-glow"></span>
                    )}
                </div>
            </div>

            {/* Suggestions */}
            <div className="p-6 space-y-3">
                {preventive_suggestions.map((tip, i) => (
                    <div
                        key={i}
                        className="flex items-start gap-3 text-sm text-ink-muted animate-slide-up"
                        style={{ animationDelay: `${i * 0.1}s` }}
                    >
                        <span className="text-brand-orange mt-0.5">›</span>
                        <span className={alert_flag ? "font-medium text-ink-dark" : ""}>{tip}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

