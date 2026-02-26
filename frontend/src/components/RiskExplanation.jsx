/**
 * RiskExplanation — Dynamic AI-like explanation of WHY risk is high
 */
import React from 'react';

export default function RiskExplanation({ aqiData, riskData, profile }) {
    if (!riskData || !profile || !aqiData) return null;

    const generateExplanations = () => {
        const reasons = [];

        if (aqiData.aqi > 100) {
            reasons.push(`Air quality is currently Poor (${aqiData.aqi} AQI), primarily driven by ${aqiData.dominant_pollutant}.`);
        }

        if (profile.asthma || profile.copd) {
            reasons.push(`Your respiratory condition makes you highly sensitive to current particulate levels.`);
        }

        if (profile.smoker) {
            reasons.push(`Smoking history adds a baseline multiplier to your lung vulnerability.`);
        }

        if (profile.outdoorHours > 3 && aqiData.aqi > 100) {
            reasons.push(`High outdoor exposure (${profile.outdoorHours} hrs/day) significantly increases your cumulative daily dose of pollutants.`);
        }

        if (reasons.length === 0) {
            reasons.push("Your personalized metrics are currently well within normal resilient levels.");
        }

        return reasons;
    };

    const reasons = generateExplanations();

    return (
        <div className="glass-card p-6">
            <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                <span>🤖</span> AI Risk Explanation
            </h3>
            <ul className="space-y-3">
                {reasons.map((reason, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-sm text-gray-300">
                        <span className="text-primary-400 mt-0.5">↳</span>
                        <span className="leading-relaxed">{reason}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
}
