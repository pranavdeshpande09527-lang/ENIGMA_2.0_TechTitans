import React, { useEffect, useState } from 'react';
import '../styles/loader.css';

export default function FullScreenLoader({ isLoading, onComplete }) {
    const [renderLevel, setRenderLevel] = useState(isLoading ? 2 : 0);
    // 2 = Showing loader fully
    // 1 = Fading out
    // 0 = Unmounted completely

    useEffect(() => {
        if (!isLoading && renderLevel === 2) {
            setRenderLevel(1);
            // Give the animation time to elegantly fade out (CSS handles the opacity transition)
            const timeout = setTimeout(() => {
                setRenderLevel(0);
                if (onComplete) onComplete();
            }, 800);
            return () => clearTimeout(timeout);
        } else if (isLoading && renderLevel === 0) {
            setRenderLevel(2);
        }
    }, [isLoading, renderLevel, onComplete]);

    if (renderLevel === 0) return null;

    return (
        <div className={`loader-overlay transition-opacity duration-700 ${renderLevel === 2 ? 'opacity-100' : 'opacity-0'}`}>
            <div className={`loader-container ${renderLevel === 2 ? 'stabilized-breathing' : ''}`}>

                {/* Initial Swarming Energy Trails */}
                <div className="trail trail-1"></div>
                <div className="trail trail-2"></div>
                <div className="trail trail-3"></div>

                {/* The Detailed Glowing Schematic Lung */}
                <svg className="schematic-lung" viewBox="0 0 240 240" xmlns="http://www.w3.org/2000/svg">

                    {/* Trachea Cartilage Rings & Main Stem */}
                    <g className="schematic-path">
                        {/* Vertical Stem */}
                        <path d="M120,20 L120,75" />
                        {/* Rings */}
                        <path d="M115,30 Q120,32 125,30" />
                        <path d="M115,45 Q120,47 125,45" />
                        <path d="M115,60 Q120,62 125,60" />
                    </g>

                    {/* Left Main Bronchus & Detailed Bronchioles */}
                    <g className="bronchi-path">
                        <path d="M120,75 L85,110" />
                        <path d="M102,93 L75,90" />
                        <path d="M90,105 L65,125" />
                        <path d="M85,110 L70,145" />
                        <path d="M75,130 L50,145" />
                        <path d="M72,138 L65,170" />
                    </g>

                    {/* Right Main Bronchus & Detailed Bronchioles */}
                    <g className="bronchi-path">
                        <path d="M120,75 L155,110" />
                        <path d="M138,93 L165,90" />
                        <path d="M150,105 L175,125" />
                        <path d="M155,110 L170,145" />
                        <path d="M165,130 L190,145" />
                        <path d="M168,138 L175,170" />
                    </g>

                    {/* Left Lung Outer Lobe Trace */}
                    <path className="schematic-path"
                        d="M105,65 C75,65 40,85 30,135 C25,160 35,185 60,200 C80,210 100,195 105,170 C108,155 105,120 105,65 Z" />

                    {/* Right Lung Outer Lobe Trace (has three lobes anatomically, adding a subtle indent) */}
                    <path className="schematic-path"
                        d="M135,65 C165,65 200,85 210,135 C215,160 205,185 180,200 C160,210 140,195 135,170 C132,155 135,120 135,65 Z" />

                    {/* Subtle Diaphragm curve below */}
                    <path className="bronchi-path" style={{ strokeOpacity: 0.4 }}
                        d="M50,220 Q120,195 190,220" />
                </svg>

                <div className="loader-text">BREATHOMETER</div>
            </div>
        </div>
    );
}
