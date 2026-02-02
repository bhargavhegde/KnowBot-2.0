'use client';

import { motion } from 'framer-motion';

export function BrainAvatar() {
    return (
        <div className="relative w-12 h-12 flex items-center justify-center group cursor-pointer overflow-visible">
            {/* Glow */}
            <motion.div
                className="absolute inset-0 bg-blue-500/30 rounded-full blur-md"
                animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
                transition={{ duration: 3, repeat: Infinity }}
            />

            <svg viewBox="0 0 100 100" className="w-16 h-16 drop-shadow-2xl overflow-visible" style={{ marginLeft: '-8px', marginTop: '-8px' }}>
                <defs>
                    <linearGradient id="avatarGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#60a5fa" />
                        <stop offset="50%" stopColor="#3b82f6" />
                        <stop offset="100%" stopColor="#1e40af" />
                    </linearGradient>
                    <filter id="glow">
                        <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                        <feMerge>
                            <feMergeNode in="coloredBlur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                </defs>

                {/* Brain Body with Animated "Horns" (Lobes) */}
                <g filter="url(#glow)">
                    {/* Left Lobe (Horn) */}
                    <motion.path
                        d="M30,50 Q30,20 50,20 L 50,80 Q30,80 30,50"
                        fill="url(#avatarGrad)"
                        stroke="rgba(255,255,255,0.4)"
                        strokeWidth="1.5"
                        initial={{ rotate: 0, transformOrigin: "50px 80px" }}
                        whileHover={{ rotate: -15 }}
                        transition={{ type: "spring", stiffness: 300, damping: 10 }}
                    />

                    {/* Right Lobe (Horn) */}
                    <motion.path
                        d="M70,50 Q70,20 50,20 L 50,80 Q70,80 70,50"
                        fill="url(#avatarGrad)"
                        stroke="rgba(255,255,255,0.4)"
                        strokeWidth="1.5"
                        initial={{ rotate: 0, transformOrigin: "50px 80px" }}
                        whileHover={{ rotate: 15 }}
                        transition={{ type: "spring", stiffness: 300, damping: 10 }}
                    />

                    {/* Central Connector/Face Base */}
                    <path d="M45,20 L55,20 L55,80 L45,80 Z" fill="url(#avatarGrad)" opacity="0" />

                    {/* Eyes Container - Stays Stable */}
                    <g transform="translate(0, 5)">
                        {/* Left Eye */}
                        <motion.ellipse
                            cx="42" cy="45" rx="4" ry="5" fill="white"
                            animate={{ ry: [5, 5, 0.5, 5] }} // Blink
                            transition={{ duration: 4, repeat: Infinity, times: [0, 0.9, 0.95, 1] }}
                        />
                        <motion.circle
                            cx="42" cy="45" r="2" fill="#0f172a"
                            animate={{ x: [-1, 1, -1] }} // Look around
                            transition={{ duration: 5, repeat: Infinity }}
                        />

                        {/* Right Eye */}
                        <motion.ellipse
                            cx="58" cy="45" rx="4" ry="5" fill="white"
                            animate={{ ry: [5, 5, 0.5, 5] }} // Blink
                            transition={{ duration: 4, repeat: Infinity, times: [0, 0.9, 0.95, 1] }}
                        />
                        <motion.circle
                            cx="58" cy="45" r="2" fill="#0f172a"
                            animate={{ x: [-1, 1, -1] }} // Look around
                            transition={{ duration: 5, repeat: Infinity }}
                        />
                    </g>
                    {/* Blush */}
                    <motion.circle cx="35" cy="62" r="3" fill="#ec4899" opacity="0.3" animate={{ opacity: [0.2, 0.4, 0.2] }} transition={{ duration: 2, repeat: Infinity }} />
                    <motion.circle cx="65" cy="62" r="3" fill="#ec4899" opacity="0.3" animate={{ opacity: [0.2, 0.4, 0.2] }} transition={{ duration: 2, repeat: Infinity }} />
                </g>
            </svg>
        </div>
    );
}
