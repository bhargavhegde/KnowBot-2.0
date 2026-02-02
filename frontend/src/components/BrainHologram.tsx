'use client';

import { motion } from 'framer-motion';

export function BrainHologram() {
    // Majestic Wing shapes
    const leftWing = [
        "M 150,200 L 80,80 L 160,140 Z", // Top shard
        "M 80,80 L 20,40 L 90,120 Z",   // Tip shard
        "M 160,140 L 70,240 L 140,260 Z" // Bottom shard
    ];

    const rightWing = [
        "M 250,200 L 320,80 L 240,140 Z",
        "M 320,80 L 380,40 L 310,120 Z",
        "M 240,140 L 330,240 L 260,260 Z"
    ];

    return (
        <div className="relative w-[500px] h-[500px] flex items-center justify-center pointer-events-none select-none">
            {/* Ambient Nebula - subtle */}
            <motion.div
                className="absolute inset-0 bg-blue-500/5 rounded-full blur-[100px]"
                animate={{
                    scale: [1, 1.1, 1],
                    opacity: [0.2, 0.4, 0.2]
                }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            />

            <svg viewBox="0 0 400 400" className="w-full h-full drop-shadow-[0_0_30px_rgba(59,130,246,0.3)] overflow-visible">
                <defs>
                    <linearGradient id="holoWing" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#60a5fa" stopOpacity="0.6" />
                        <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.2" />
                    </linearGradient>
                    <linearGradient id="brainGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#93c5fd" />
                        <stop offset="100%" stopColor="#3b82f6" />
                    </linearGradient>
                    <filter id="glow-strong">
                        <feGaussianBlur stdDeviation="4" result="coloredBlur" />
                        <feMerge>
                            <feMergeNode in="coloredBlur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                </defs>

                <g transform="translate(0, -20)">
                    {/* Left Wing Animation */}
                    <g>
                        {leftWing.map((path, i) => (
                            <motion.path
                                key={`l-${i}`}
                                d={path}
                                fill="url(#holoWing)"
                                stroke="rgba(147, 197, 253, 0.3)"
                                strokeWidth="1"
                                initial={{ opacity: 0, x: 20, rotate: 10 }}
                                animate={{ opacity: 1, x: 0, rotate: 0 }}
                                transition={{
                                    duration: 2,
                                    delay: i * 0.2,
                                    type: "spring",
                                    stiffness: 40
                                }}
                            />
                        ))}
                    </g>

                    {/* Right Wing Animation */}
                    <g>
                        {rightWing.map((path, i) => (
                            <motion.path
                                key={`r-${i}`}
                                d={path}
                                fill="url(#holoWing)"
                                stroke="rgba(147, 197, 253, 0.3)"
                                strokeWidth="1"
                                initial={{ opacity: 0, x: -20, rotate: -10 }}
                                animate={{ opacity: 1, x: 0, rotate: 0 }}
                                transition={{
                                    duration: 2,
                                    delay: i * 0.2,
                                    type: "spring",
                                    stiffness: 40
                                }}
                            />
                        ))}
                    </g>

                    {/* Central Brain - Larger */}
                    <g transform="translate(140, 140) scale(1.2)" filter="url(#glow-strong)">
                        <motion.path
                            d="M30,50 Q30,20 50,20 Q70,20 70,50 Q70,80 50,80 Q30,80 30,50"
                            fill="url(#brainGrad)"
                            stroke="#bfdbfe"
                            strokeWidth="1.5"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ duration: 1, ease: "backOut" }}
                        />
                        {/* Synapses / Interaction */}
                        <motion.circle cx="50" cy="50" r="28" fill="none" stroke="white" strokeOpacity="0.1"
                            animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0, 0.1] }}
                            transition={{ duration: 3, repeat: Infinity }}
                        />
                    </g>
                </g>

                {/* Integrated SVG Text - No layout shifts */}
                <text x="200" y="350" textAnchor="middle" fill="url(#brainGrad)"
                    style={{ fontSize: '40px', fontWeight: '900', letterSpacing: '0.1em', fontFamily: 'system-ui' }}
                    filter="url(#glow-strong)">
                    KNOWBOT
                </text>
                <text x="200" y="390" textAnchor="middle" fill="#22d3ee"
                    style={{ fontSize: '32px', fontWeight: '300', letterSpacing: '0.2em', fontFamily: 'system-ui' }}>
                    2.0
                </text>
            </svg>
        </div>
    );
}
