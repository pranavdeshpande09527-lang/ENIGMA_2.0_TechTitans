import React from 'react';

export default function BreathometerLogo({ className = "w-10 h-10" }) {
    return (
        <svg
            className={className}
            viewBox="0 0 240 240"
            xmlns="http://www.w3.org/2000/svg"
            style={{ filter: "drop-shadow(0px 4px 12px rgba(56, 189, 248, 0.5))" }}
        >
            {/* Trachea main stem */}
            <path
                d="M120,50 L120,105"
                fill="none"
                stroke="#38bdf8"
                strokeWidth="2.5"
                strokeLinecap="round"
            />
            {/* Horizontal Trachea nodes (Cartilage rings) */}
            <path d="M110,65 L130,65" fill="none" stroke="#38bdf8" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M110,80 L130,80" fill="none" stroke="#38bdf8" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M110,95 L130,95" fill="none" stroke="#38bdf8" strokeWidth="2.5" strokeLinecap="round" />

            {/* Left Bronchus & inner branches */}
            <path d="M120,105 L85,125" fill="none" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" />
            <path d="M102,115 L70,110" fill="none" stroke="#38bdf8" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M90,122 L65,145" fill="none" stroke="#38bdf8" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M85,125 L75,160" fill="none" stroke="#38bdf8" strokeWidth="1.5" strokeLinecap="round" />

            {/* Right Bronchus & inner branches */}
            <path d="M120,105 L155,125" fill="none" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" />
            <path d="M138,115 L170,110" fill="none" stroke="#38bdf8" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M150,122 L175,145" fill="none" stroke="#38bdf8" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M155,125 L165,160" fill="none" stroke="#38bdf8" strokeWidth="1.5" strokeLinecap="round" />

            {/* Left Lung Outer Outline */}
            <path
                d="M120,105 C90,100 55,120 50,165 C45,195 55,215 90,215 C115,215 120,185 120,150"
                fill="none"
                stroke="#38bdf8"
                strokeWidth="2.5"
                strokeLinecap="round"
            />

            {/* Right Lung Outer Outline */}
            <path
                d="M120,105 C150,100 185,120 190,165 C195,195 185,215 150,215 C125,215 120,185 120,150"
                fill="none"
                stroke="#38bdf8"
                strokeWidth="2.5"
                strokeLinecap="round"
            />

            {/* Bottom Glow / Shadow Base */}
            <ellipse cx="120" cy="225" rx="60" ry="8" fill="#000" />
            <path d="M60,225 Q120,220 180,225" fill="none" stroke="rgba(56,189,248,0.3)" strokeWidth="3" />
        </svg>
    );
}
