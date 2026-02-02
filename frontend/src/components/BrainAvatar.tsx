'use client';

import { motion } from 'framer-motion';

export function BrainAvatar() {
    // Mini wings for avatar
    const leftWing = "M 30,50 L 10,20 L 40,40 Z";
    const rightWing = "M 70,50 L 90,20 L 60,40 Z";

    return (
        <div className="relative w-12 h-12 flex items-center justify-center group cursor-pointer overflow-visible">
            <svg viewBox="0 0 100 100" className="w-16 h-16 drop-shadow-2xl overflow-visible" style={{ marginLeft: '-8px', marginTop: '-8px' }}>
                <defs>
                    <linearGradient id="avatarGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#60a5fa" />
                        <stop offset="50%" stopColor="#3b82f6" />
                        <stop offset="100%" stopColor="#1e40af" />
                    </linearGradient>
                    <linearGradient id="wingGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#93c5fd" stopOpacity="0.9" />
                        <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.4" />
                    </linearGradient>
                    <filter id="glow">
                        <feGaussianBlur stdDeviation="2.5" result="coloredBlur" />
                        <feMerge>
                            <feMergeNode in="coloredBlur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                </defs>

                {/* Left Wing - Multi-faceted */}
                <g>
                    <motion.path
                        d={leftWing}
                        fill="url(#wingGrad)"
                        stroke="rgba(255,255,255,0.6)"
                        strokeWidth="0.5"
                        initial={{ rotate: 10, transformOrigin: "42px 50px" }}
                        animate={{ rotate: 0 }}
                        whileHover={{ rotate: -20, scale: 1.15 }}
                        transition={{ duration: 0.4, type: "spring", stiffness: 200 }}
                    />
                    <motion.path
                        d="M 30,50 L 15,25 L 35,40 Z" // Inner wing shard
                        fill="white"
                        fillOpacity="0.2"
                        initial={{ rotate: 10, transformOrigin: "42px 50px" }}
                        animate={{ rotate: 0 }}
                        whileHover={{ rotate: -20, scale: 1.15 }}
                        transition={{ duration: 0.4 }}
                    />
                </g>

                {/* Right Wing - Multi-faceted */}
                <g>
                    <motion.path
                        d={rightWing}
                        fill="url(#wingGrad)"
                        stroke="rgba(255,255,255,0.6)"
                        strokeWidth="0.5"
                        initial={{ rotate: -10, transformOrigin: "58px 50px" }}
                        animate={{ rotate: 0 }}
                        whileHover={{ rotate: 20, scale: 1.15 }}
                        transition={{ duration: 0.4, type: "spring", stiffness: 200 }}
                    />
                    <motion.path
                        d="M 70,50 L 85,25 L 65,40 Z" // Inner wing shard
                        fill="white"
                        fillOpacity="0.2"
                        initial={{ rotate: -10, transformOrigin: "58px 50px" }}
                        animate={{ rotate: 0 }}
                        whileHover={{ rotate: 20, scale: 1.15 }}
                        transition={{ duration: 0.4 }}
                    />
                </g>

                {/* Brain Core - Complex */}
                <g filter="url(#glow)">
                    <motion.path
                        d="M35,50 Q35,25 50,25 Q65,25 65,50 Q65,75 50,75 Q35,75 35,50"
                        fill="url(#avatarGrad)"
                        stroke="rgba(147, 197, 253, 0.5)"
                        strokeWidth="1"
                    />
                    {/* Synaptic Network Lines */}
                    <path d="M42,40 L50,32 M50,32 L58,40 M42,60 L50,68 M50,68 L58,60 M35,50 L65,50"
                        stroke="rgba(255,255,255,0.3)" strokeWidth="0.5" fill="none" />
                    <circle cx="50" cy="50" r="2" fill="white" fillOpacity="0.8" />
                </g>
            </svg>
        </div>
    );
}
