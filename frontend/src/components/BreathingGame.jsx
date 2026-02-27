import React, { useState, useEffect, useRef } from 'react';

// Define the game stages for visual progression
const STAGES = [
    { threshold: 0, name: 'Beginner Diver', color: 'border-brand-teal', glow: 'shadow-[0_0_30px_rgba(26,175,100,0.4)]', bgGlow: 'bg-brand-teal/5', text: 'text-brand-teal' },
    { threshold: 15, name: 'Pearl Diver', color: 'border-primary-400', glow: 'shadow-[0_0_40px_rgba(45,130,210,0.5)]', bgGlow: 'bg-primary-400/10', text: 'text-primary-400' },
    { threshold: 30, name: 'Deep Sea Explorer', color: 'border-brand-purple', glow: 'shadow-[0_0_50px_rgba(157,78,221,0.6)]', bgGlow: 'bg-brand-purple/15', text: 'text-brand-purple' },
    { threshold: 60, name: 'Free Dive Champion', color: 'border-amber-400', glow: 'shadow-[0_0_60px_rgba(251,191,36,0.8)]', bgGlow: 'bg-amber-400/20', text: 'text-amber-400' }
];

export default function BreathingGame() {
    const [gameState, setGameState] = useState('idle'); // 'idle', 'playing', 'finished'
    const [timeMs, setTimeMs] = useState(0);
    const [finalScore, setFinalScore] = useState(0);
    const [bestScore, setBestScore] = useState(0);
    const [isNewRecord, setIsNewRecord] = useState(false);

    const intervalRef = useRef(null);
    const startTimeRef = useRef(0);

    // Load best score on mount
    useEffect(() => {
        const savedBest = localStorage.getItem('breathometer_best_score');
        if (savedBest) {
            setBestScore(parseFloat(savedBest));
        }
    }, []);

    // Format time: MM:SS:ms (e.g., 01:23:4)
    const formatTime = (ms) => {
        const totalSeconds = Math.floor(ms / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        const milliseconds = Math.floor((ms % 1000) / 100);

        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${milliseconds}`;
    };

    // Determine current stage based on elapsed seconds
    const elapsedSeconds = timeMs / 1000;
    const currentStage = [...STAGES].reverse().find(s => elapsedSeconds >= s.threshold) || STAGES[0];

    const startGame = (e) => {
        // Prevent default actions to stop text selection/context menus on mobile holding
        if (e && e.preventDefault && e.type !== 'mousedown') e.preventDefault();

        // Don't start if already playing to prevent multiple intervals
        if (gameState === 'playing') return;

        setGameState('playing');
        setTimeMs(0);
        setIsNewRecord(false);
        startTimeRef.current = Date.now();

        intervalRef.current = setInterval(() => {
            setTimeMs(Date.now() - startTimeRef.current);
        }, 50); // Update every 50ms for smooth UI
    };

    const stopGame = () => {
        if (gameState !== 'playing') return;

        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }

        const finalTimeSec = parseFloat((timeMs / 1000).toFixed(1));
        setGameState('finished');
        setFinalScore(finalTimeSec);

        // Check for new high score
        if (finalTimeSec > bestScore) {
            setBestScore(finalTimeSec);
            localStorage.setItem('breathometer_best_score', finalTimeSec.toString());
            setIsNewRecord(true);
        }
    };

    const resetGame = () => {
        setGameState('idle');
        setTimeMs(0);
        setFinalScore(0);
        setIsNewRecord(false);
    };

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, []);

    // Helper logic to provide text feedback based on score
    const getFeedback = (score) => {
        if (score < 15) return { message: "Good start! Keep practicing.", color: "text-amber-400" };
        if (score < 30) return { message: "Great job! Better than average.", color: "text-brand-teal" };
        if (score < 60) return { message: "Excellent limit! Strong lungs.", color: "text-brand-purple" };
        return { message: "Legendary! You are a master of breath.", color: "text-amber-400" };
    };

    const feedback = getFeedback(finalScore);

    // SVG Ring Calculations for growing progress bar feel
    // A full circle is ~283 dasharray (2 * pi * 45)
    const circleCircumference = 283;
    // Map time to a dashoffset (e.g., fill ring over 60 seconds)
    const maxReferenceTime = 60000;
    const fillPercentage = Math.min((timeMs / maxReferenceTime), 1);
    const strokeDashoffset = circleCircumference - (fillPercentage * circleCircumference);

    return (
        <div
            className="glass-card p-6 rounded-2xl flex flex-col items-center justify-center space-y-6 relative overflow-hidden group select-none touch-none"
            onMouseUp={stopGame}
            onMouseLeave={stopGame}
            onTouchEnd={stopGame}
            onTouchCancel={stopGame}
        >
            {/* Background animated glowing effect during play depending on stage */}
            {gameState === 'playing' && (
                <div className={`absolute inset-0 ${currentStage.bgGlow} animate-pulse-glow pointer-events-none transition-colors duration-1000`}></div>
            )}

            {/* Header section with Best Score */}
            <div className="w-full flex justify-between items-start z-10">
                <div className="flex items-center gap-2">
                    <span className="text-2xl animate-bounce-slow">🫁</span>
                    <div>
                        <h2 className="text-xl font-bold text-ink-dark">Lung Capacity</h2>
                        <p className="text-xs text-ink-muted hidden sm:block">Hold breath to play</p>
                    </div>
                </div>
                {/* Personal Best Display */}
                <div className="text-right glass-card px-3 py-1 rounded-lg border-primary-500/20 bg-primary-500/5">
                    <p className="text-[10px] text-primary-400 uppercase tracking-wider font-bold">Best Score</p>
                    <p className="text-lg font-bold text-ink-dark">{bestScore > 0 ? `${bestScore}s` : '--'}</p>
                </div>
            </div>

            {/* Stage/Rank Display Indicator */}
            <div className="z-10 h-6">
                {gameState === 'playing' ? (
                    <div className={`font-bold px-4 py-1 rounded-full bg-surface-base border border-white/10 ${currentStage.text} animate-fade-in shadow-premium`}>
                        Rank: {currentStage.name}
                    </div>
                ) : (
                    gameState === 'idle' && <p className="text-sm text-ink-muted">Press and hold button below</p>
                )}
            </div>

            {/* Timer Display - Gamified Interactive Ring */}
            <div className={`relative flex items-center justify-center w-48 h-48 rounded-full border-4 transition-all duration-300 z-10 bg-surface-base/50 backdrop-blur-sm ${gameState === 'playing' ? `${currentStage.color} ${currentStage.glow} scale-110` : 'border-surface-base0/20 scale-100'}`}>

                {/* SVG Progress Ring */}
                {gameState === 'playing' && (
                    <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none" viewBox="0 0 100 100">
                        <circle
                            cx="50" cy="50" r="45"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="4"
                            className={`${currentStage.text} opacity-50 transition-colors duration-500`}
                            strokeDasharray={circleCircumference}
                            strokeDashoffset={strokeDashoffset}
                            strokeLinecap="round"
                        />
                    </svg>
                )}

                {/* Inner Beating Heart/Lung hint */}
                {gameState === 'playing' && (
                    <div className={`absolute inset-0 rounded-full border border-white/20 animate-ping opacity-30`}></div>
                )}

                <div className={`text-3xl sm:text-4xl font-mono font-bold tracking-wider transition-colors duration-300 ${gameState === 'playing' ? currentStage.text : 'text-ink-dark'}`}>
                    {formatTime(timeMs)}
                </div>
            </div>

            {/* Game Controls & Feedback */}
            <div className="z-10 w-full flex flex-col items-center space-y-4 pt-4 relative">
                {gameState === 'idle' && (
                    <button
                        onMouseDown={startGame}
                        onTouchStart={startGame}
                        className="btn-primary w-full max-w-sm py-4 text-xl font-bold shadow-premium hover:shadow-[0_0_25px_rgba(255,107,53,0.5)] active:scale-95 transition-all select-none group relative overflow-hidden"
                        onContextMenu={(e) => e.preventDefault()} // Prevent context menu on long mobile touch
                    >
                        <span className="relative z-10 flex items-center justify-center gap-2">
                            <span>Press & Hold Breath</span>
                            <span className="text-2xl animate-pulse">👆</span>
                        </span>
                        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                    </button>
                )}

                {gameState === 'playing' && (
                    <div className="text-center animate-fade-in w-full max-w-sm py-4 rounded-xl bg-danger-500/10 border border-danger-500/30">
                        <p className="text-danger-400 font-bold uppercase tracking-widest text-sm animate-pulse">Release to Exhale & Stop</p>
                    </div>
                )}

                {gameState === 'finished' && (
                    <div className="text-center w-full animate-fade-in space-y-4 max-w-sm">
                        <div className={`p-6 rounded-xl bg-surface-base border ${isNewRecord ? 'border-amber-400 shadow-[0_0_30px_rgba(251,191,36,0.3)]' : 'border-surface-base0/20'}`}>
                            {isNewRecord && (
                                <p className="text-amber-400 font-bold uppercase tracking-widest text-xs mb-2 animate-bounce">🏆 New Personal Record! 🏆</p>
                            )}
                            <p className="text-sm text-ink-muted uppercase tracking-wider">You Reached</p>
                            <p className={`text-lg font-bold mt-1 ${currentStage.text}`}>{currentStage.name}</p>

                            <div className="my-4 pt-4 border-t border-white/5">
                                <p className="text-4xl font-mono font-bold text-ink-dark">{finalScore} <span className="text-lg text-ink-muted font-sans font-normal">seconds</span></p>
                            </div>

                            <p className={`text-sm font-medium ${feedback.color}`}>{feedback.message}</p>
                        </div>
                        <button
                            onClick={resetGame}
                            className="btn-secondary w-full py-3 font-bold hover:bg-surface-base0/30 transition-all duration-300 hover:scale-[1.02]"
                        >
                            Try Again
                        </button>
                    </div>
                )}
            </div>

            {/* Decorative Elements */}
            <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-primary-500/10 rounded-full blur-2xl pointer-events-none transition-colors duration-1000" style={{ backgroundColor: gameState === 'playing' ? 'var(--tw-color-primary-500)' : '' }}></div>
            <div className="absolute bottom-0 left-0 -ml-8 -mb-8 w-24 h-24 bg-brand-teal/10 rounded-full blur-xl pointer-events-none transition-colors duration-1000"></div>
        </div>
    );
}
