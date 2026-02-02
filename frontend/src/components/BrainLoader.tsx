'use client';

import { motion } from 'framer-motion';

export function BrainLoader() {
    // Prism-style polygons forming a brain shape
    // Left Hemisphere (Analytical)
    const leftPolygons = [
        "M 40,50 L 60,30 L 70,60 Z", // Frontal
        "M 60,30 L 90,20 L 80,55 Z", // Top Parietal
        "M 40,50 L 70,60 L 50,80 Z", // Temporal
        "M 70,60 L 80,55 L 90,80 Z", // Central
        "M 50,80 L 90,80 L 70,100 Z", // Lower Temporal
    ];

    // Right Hemisphere (Creative) - Mirrored/Shifted
    const rightPolygons = [
        "M 100,25 L 130,35 L 120,60 Z", // Top Parietal
        "M 85,55 L 110,50 L 100,80 Z", // Central Connection
        "M 130,35 L 150,55 L 120,60 Z", // Frontal
        "M 120,60 L 150,55 L 140,85 Z", // Temporal
        "M 100,80 L 140,85 L 120,105 Z", // Occipital
    ];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0a0f18] backdrop-blur-xl">
            <div className="relative w-64 h-64">
                {/* Glowing Background Orb */}
                <motion.div
                    className="absolute inset-0 bg-blue-500/20 rounded-full blur-3xl"
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                />

                <svg viewBox="0 0 200 150" className="w-full h-full drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]">
                    <g transform="translate(10, 10)">
                        {/* Left Hemisphere - Cooling Blues */}
                        {leftPolygons.map((path, i) => (
                            <motion.path
                                key={`l-${i}`}
                                d={path}
                                fill="url(#gradLeft)"
                                stroke="rgba(147, 197, 253, 0.3)"
                                strokeWidth="0.5"
                                initial={{ opacity: 0, scale: 0, x: -20, y: 10 }}
                                animate={{ opacity: 0.8, scale: 1, x: 0, y: 0 }}
                                transition={{
                                    duration: 0.8,
                                    delay: i * 0.1,
                                    type: "spring",
                                    stiffness: 100
                                }}
                                whileHover={{ scale: 1.05, fillOpacity: 1 }}
                            />
                        ))}

                        {/* Right Hemisphere - Vibrant Cyans/Purples */}
                        {rightPolygons.map((path, i) => (
                            <motion.path
                                key={`r-${i}`}
                                d={path}
                                fill="url(#gradRight)"
                                stroke="rgba(196, 181, 253, 0.3)"
                                strokeWidth="0.5"
                                initial={{ opacity: 0, scale: 0, x: 20, y: 10 }}
                                animate={{ opacity: 0.8, scale: 1, x: 0, y: 0 }}
                                transition={{
                                    duration: 0.8,
                                    delay: 0.5 + (i * 0.1),
                                    type: "spring",
                                    stiffness: 100
                                }}
                                whileHover={{ scale: 1.05, fillOpacity: 1 }}
                            />
                        ))}
                    </g>

                    {/* Gradients */}
                    <defs>
                        <linearGradient id="gradLeft" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.8" /> {/* Blue-500 */}
                            <stop offset="100%" stopColor="#1e40af" stopOpacity="0.6" /> {/* Blue-800 */}
                        </linearGradient>
                        <linearGradient id="gradRight" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.8" /> {/* Violet-500 */}
                            <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.6" /> {/* Cyan-500 */}
                        </linearGradient>
                    </defs>
                </svg>

                {/* Loading Text */}
                <motion.div
                    className="absolute -bottom-8 left-0 right-0 text-center"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.5 }}
                >
                    <span className="text-blue-400 font-light tracking-[0.3em] text-sm uppercase">Initializing</span>
                    <motion.span
                        animate={{ opacity: [0, 1, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                    >...</motion.span>
                </motion.div>
            </div>
        </div>
    );
}
