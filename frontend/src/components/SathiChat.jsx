import React, { useState, useRef, useEffect } from 'react';
import { sendChatMessage } from '../services/api';

export default function SathiChat() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { role: 'assistant', text: 'Hi, I am Sathi 🌿 Your Lung Health Companion. How can I help you today?' }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        if (isOpen) scrollToBottom();
    }, [messages, isOpen]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMsg = input.trim();
        setInput('');
        setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
        setIsLoading(true);

        try {
            const aqiStr = localStorage.getItem('breathometer_aqi');
            const riskStr = localStorage.getItem('breathometer_risk');
            const profileStr = localStorage.getItem('breathometer_profile');

            const payload = {
                message: userMsg,
                aqi: aqiStr ? JSON.parse(aqiStr).aqi : null,
                risk_level: riskStr ? JSON.parse(riskStr).risk_level : null,
                user_profile: profileStr ? JSON.parse(profileStr) : null
            };

            const res = await sendChatMessage(payload);
            setMessages(prev => [...prev, { role: 'assistant', text: res.reply }]);
        } catch (err) {
            setMessages(prev => [...prev, { role: 'assistant', text: "I'm having trouble connecting right now. Please try again later." }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            {/* Floating Button */}
            <button
                onClick={() => setIsOpen(true)}
                className={`fixed bottom-6 right-6 w-14 h-14 bg-primary-600 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(26,175,100,0.4)] hover:bg-black hover:scale-110 transition-all z-50 ${isOpen ? 'scale-0 opacity-0 pointer-events-none' : 'scale-100 opacity-100'}`}
                aria-label="Open Chat Sathi"
            >
                <span className="text-2xl">🌿</span>
            </button>

            {/* Chat Window */}
            <div
                className={`fixed bottom-6 right-6 w-96 max-w-[calc(100vw-3rem)] h-[500px] max-h-[80vh] glass-card flex flex-col overflow-hidden transition-all duration-300 transform origin-bottom-right z-50 ${isOpen ? 'scale-100 opacity-100' : 'scale-0 opacity-0 pointer-events-none'}`}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-4 py-3 bg-surface-card shadow-premium border-b border-brand-terracotta/10 shrink-0">
                    <div className="flex items-center gap-2">
                        <span className="text-xl">🌿</span>
                        <div className="flex flex-col">
                            <h3 className="text-ink-dark font-bold text-sm">Sathi</h3>
                            <span className="text-brand-orange text-[10px] uppercase font-bold tracking-wider">Online</span>
                        </div>
                    </div>
                    <button
                        onClick={() => setIsOpen(false)}
                        className="text-ink-muted hover:text-ink-dark transition-colors p-1"
                    >
                        ✕
                    </button>
                </div>

                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages.map((msg, i) => (
                        <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div
                                className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed shadow-lg ${msg.role === 'user'
                                    ? 'bg-primary-600 text-ink-dark rounded-tr-sm'
                                    : 'bg-surface-card shadow-premium hover:shadow-premium-hover transition-shadow duration-300 text-ink-dark border border-brand-terracotta/5 rounded-tl-sm'
                                    }`}
                            >
                                {msg.text}
                            </div>
                        </div>
                    ))}
                    {isLoading && (
                        <div className="flex justify-start">
                            <div className="bg-surface-card shadow-premium hover:shadow-premium-hover transition-shadow duration-300 border border-brand-terracotta/5 rounded-2xl rounded-tl-sm px-4 py-3 shadow-lg flex gap-1.5 items-center">
                                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="p-3 bg-surface-base border-t border-brand-terracotta/5 shrink-0">
                    <form onSubmit={handleSend} className="relative flex items-center">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Ask Sathi about your lung health..."
                            className="w-full bg-black shadow-premium border border-brand-terracotta/10 text-white text-sm rounded-full pl-4 pr-12 py-3 focus:outline-none focus:border-primary-500/50 transition-colors placeholder-gray-400"
                        />
                        <button
                            type="submit"
                            disabled={!input.trim() || isLoading}
                            className="absolute right-2 p-1.5 text-brand-orange hover:text-primary-300 disabled:opacity-50 disabled:hover:text-brand-orange transition-colors bg-black/10 rounded-full"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                                <path d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z" />
                            </svg>
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
}
