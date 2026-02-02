'use client';

import { motion } from 'framer-motion';

export function BrainHologram() {
    // Wing shapes composed of crystal shards
    const leftWing = [
        "M 150,200 L 100,100 L 140,140 Z",
        "M 100,100 L 50,80 L 90,120 Z",
        "M 50,80 L 20,50 L 60,90 Z",
        "M 140,140 L 80,180 L 130,220 Z",
        "M 80,180 L 40,220 L 90,240 Z"
    ];

    const rightWing = [
        "M 250,200 L 300,100 L 260,140 Z",
        "M 300,100 L 350,80 L 310,120 Z",
        "M 350,80 L 380,50 L 340,90 Z",
        "M 260,140 L 320,180 L 270,220 Z",
        "M 320,180 L 360,220 L 310,240 Z"
    ];

    return (
        <div className="relative w-96 h-96 flex items-center justify-center">
            {/* Ambient Nebula */}
            <motion.div
                className="absolute inset-0 bg-blue-500/10 rounded-full blur-[80px]"
                animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.3, 0.6, 0.3]
                }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            />

            <svg viewBox="0 0 400 400" className="w-full h-full drop-shadow-[0_0_20px_rgba(59,130,246,0.6)]">
                <defs>
                    <linearGradient id="holoWing" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#60a5fa" stopOpacity="0.8" />
                        <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.4" />
                    </linearGradient>
                    <linearGradient id="brainGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#93c5fd" />
                        <stop offset="100%" stopColor="#3b82f6" />
                    </linearGradient>
                </defs>

                {/* Left Wing Animation */}
                <g>
                    {leftWing.map((path, i) => (
                        <motion.path
                            key={`l-${i}`}
                            d={path}
                            fill="url(#holoWing)"
                            stroke="rgba(255,255,255,0.4)"
                            strokeWidth="1"
                            initial={{ opacity: 0, x: 20, rotate: 10 }}
                            animate={{ opacity: 1, x: 0, rotate: 0 }}
                            transition={{
                                duration: 1.5,
                                delay: i * 0.1,
                                type: "spring",
                                stiffness: 50
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
                            stroke="rgba(255,255,255,0.4)"
                            strokeWidth="1"
                            initial={{ opacity: 0, x: -20, rotate: -10 }}
                            animate={{ opacity: 1, x: 0, rotate: 0 }}
                            transition={{
                                duration: 1.5,
                                delay: i * 0.1,
                                type: "spring",
                                stiffness: 50
                            }}
                        />
                    ))}
                </g>

                {/* Central Brain */}
                <g transform="translate(150, 150) scale(1)">
                    <motion.path
                        d="M30,50 Q30,20 50,20 Q70,20 70,50 Q70,80 50,80 Q30,80 30,50"
                        fill="url(#brainGrad)"
                        stroke="#bfdbfe"
                        strokeWidth="1"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.8, ease: "backOut" }}
                    />
                    {/* Brain folds */}
                    <motion.path
                        d="M40,35 Q50,30 60,35 M35,50 Q50,45 65,50 M40,65 Q50,70 60,65"
                        stroke="rgba(255,255,255,0.3)"
                        strokeWidth="1"
                        fill="none"
                        animate={{ pathLength: [0, 1] }}
                        transition={{ duration: 2, delay: 0.5 }}
                    />
                </g>

                {/* Text: KnowBot 2.0 */}
                <foreignObject x="0" y="320" width="400" height="80">
                    <div className="flex justify-center items-center h-full">
                        <div className="text-4xl font-black italic tracking-widest text-transparent bg-clip-text bg-gradient-to-b from-white to-blue-400 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]" style={{ fontFamily: 'system-ui' }}>
                            <span className="inline-block relative">
                                KNOWBOT
                                <span className="absolute inset-0 text-transparent bg-clip-text bg-gradient-to-t from-blue-500/20 to-transparent blur-sm transform translate-y-1">KNOWBOT</span>
                            </span>
                            <span className="ml-3 text-cyan-400">2.0</span>
                        </div>
                    </div>
                </foreignObject>
            </svg>

            {/* Holographic Base Ring */}
            <div className="absolute top-[75%] w-48 h-12 border-2 border-blue-400/20 rounded-[100%] animate-spin-slow blur-[1px]"></div>
        </div>
    );
}
