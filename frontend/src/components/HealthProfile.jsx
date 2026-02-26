/**
 * HealthProfile — Personalize risk scoring based on vulnerability factors
 */
import React, { useState, useEffect } from 'react';

export default function HealthProfile({ onProfileUpdate }) {
    const [profile, setProfile] = useState({
        age: 30,
        smoker: false,
        asthma: false,
        copd: false,
        outdoorHours: 2,
    });
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        const saved = localStorage.getItem('breathometer_profile');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                setProfile(parsed);
                onProfileUpdate(parsed);
            } catch (e) { }
        } else {
            onProfileUpdate(profile);
        }
    }, []);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setProfile(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : Number(value)
        }));
    };

    const handleSave = () => {
        localStorage.setItem('breathometer_profile', JSON.stringify(profile));
        onProfileUpdate(profile);
        setIsEditing(false);
    };

    const hasHighVulnerabilty = profile.asthma || profile.copd;

    return (
        <div className="glass-card overflow-hidden transition-all duration-300">
            <div className="px-6 py-4 border-b border-brand-terracotta/5 flex justify-between items-center bg-surface-card shadow-premium">
                <div className="flex items-center gap-3">
                    <span className="text-xl">👤</span>
                    <div>
                        <h3 className="text-sm font-bold text-ink-dark">Health Profile</h3>
                        <div className="flex gap-2 mt-1">
                            {hasHighVulnerabilty && (
                                <span className="text-[10px] bg-danger-500/20 text-danger-400 px-2 flex items-center rounded-sm font-semibold border border-danger-500/30">
                                    High Vulnerability
                                </span>
                            )}
                            {profile.smoker && (
                                <span className="text-[10px] bg-warning-500/20 text-warning-400 px-2 flex items-center rounded-sm font-semibold border border-warning-500/30">
                                    Elevated Risk
                                </span>
                            )}
                            {!hasHighVulnerabilty && !profile.smoker && (
                                <span className="text-[10px] bg-brand-teal/20 text-brand-teal px-2 flex items-center rounded-sm font-semibold border border-safe-500/30">
                                    Standard Profile
                                </span>
                            )}
                        </div>
                    </div>
                </div>
                <button
                    onClick={() => setIsEditing(!isEditing)}
                    className="text-xs bg-surface-card shadow-premium hover:shadow-premium-hover transition-shadow duration-300 hover:bg-surface-card/20 text-ink-dark px-3 py-1.5 rounded-lg transition-colors"
                >
                    {isEditing ? 'Cancel' : 'Edit Profile'}
                </button>
            </div>

            {isEditing && (
                <div className="p-6 space-y-4 animate-slide-up bg-surface-base">
                    <div className="grid grid-cols-2 gap-4">
                        <label className="text-sm text-ink-muted flex flex-col gap-1.5">
                            Age
                            <input type="number" name="age" value={profile.age} onChange={handleChange} className="bg-surface-card shadow-premium border border-brand-terracotta/10 rounded-lg p-2 text-ink-dark text-sm" />
                        </label>
                        <label className="text-sm text-ink-muted flex flex-col gap-1.5">
                            Outdoor Hours / Day
                            <input type="number" name="outdoorHours" value={profile.outdoorHours} onChange={handleChange} className="bg-surface-card shadow-premium border border-brand-terracotta/10 rounded-lg p-2 text-ink-dark text-sm" />
                        </label>
                    </div>

                    <div className="flex gap-6 mt-2">
                        <label className="flex items-center gap-2 text-sm text-ink-muted cursor-pointer">
                            <input type="checkbox" name="smoker" checked={profile.smoker} onChange={handleChange} className="accent-primary-500 w-4 h-4" />
                            Smoker
                        </label>
                        <label className="flex items-center gap-2 text-sm text-ink-muted cursor-pointer">
                            <input type="checkbox" name="asthma" checked={profile.asthma} onChange={handleChange} className="accent-primary-500 w-4 h-4" />
                            Asthma
                        </label>
                        <label className="flex items-center gap-2 text-sm text-ink-muted cursor-pointer">
                            <input type="checkbox" name="copd" checked={profile.copd} onChange={handleChange} className="accent-primary-500 w-4 h-4" />
                            COPD
                        </label>
                    </div>

                    <div className="pt-2">
                        <button onClick={handleSave} className="w-full bg-primary-600 hover:bg-surface-base0 text-ink-dark font-medium py-2 rounded-lg transition-colors">
                            Save Profile
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
