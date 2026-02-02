'use client';

import { motion } from 'framer-motion';

export function BrainAvatar() {
    // Mini wings for avatar
    const leftWing = "M 30,50 L 10,20 L 40,40 Z";
    const rightWing = "M 70,50 L 90,20 L 60,40 Z";

    return (
        <div className="relative w-12 h-12 flex items-center justify-center group cursor-pointer overflow-visible">
            {/* Glow */}
            <motion.div
                className="absolute inset-0 bg-blue-500/30 rounded-full blur-md"
                animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
                transition={{ duration: 3, repeat: Infinity }}
            />

            <svg viewBox="0 0 100 100" className="w-16 h-16 drop-shadow-md overflow-visible" style={{ marginLeft: '-8px', marginTop: '-8px' }}>
                <defs>
                    <linearGradient id="avatarGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#60a5fa" />
                        <stop offset="100%" stopColor="#3b82f6" />
                    </linearGradient>
                </defs>

                {/* Left Wing */}
                <motion.path
                    d={leftWing}
                    fill="url(#avatarGrad)"
                    opacity="0.8"
                    initial={{ rotate: 10, transformOrigin: "40px 50px" }}
                    animate={{ rotate: 0 }}
                    whileHover={{ rotate: -15, scale: 1.1 }}
                    transition={{ duration: 0.3 }}
                />

                {/* Right Wing */}
                <motion.path
                    d={rightWing}
                    fill="url(#avatarGrad)"
                    opacity="0.8"
                    initial={{ rotate: -10, transformOrigin: "60px 50px" }}
                    animate={{ rotate: 0 }}
                    whileHover={{ rotate: 15, scale: 1.1 }}
                    transition={{ duration: 0.3 }}
                />

                {/* Brain Core */}
                <motion.path
                    d="M35,50 Q35,25 50,25 Q65,25 65,50 Q65,75 50,75 Q35,75 35,50"
                    fill="url(#avatarGrad)"
                    stroke="rgba(255,255,255,0.4)"
                    strokeWidth="1.5"
                />
            </svg>
        </div>
    );
}
