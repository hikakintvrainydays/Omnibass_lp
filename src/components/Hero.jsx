import React from 'react';
import { motion } from 'framer-motion';
import heroBg from '../assets/omnibass-bg.png';

const Hero = () => {
    return (
        <section className="relative w-full h-screen min-h-[700px] flex items-center justify-center overflow-hidden bg-white">
            {/* Background Graphic - Omni Bass (Sakana AI style) */}
            <div className="absolute inset-0 z-0">
                <img
                    src={heroBg}
                    alt="Omni Bass Flow"
                    className="w-full h-full object-cover opacity-90"
                />
                <div className="absolute inset-0 bg-white/20 mix-blend-overlay"></div>
            </div>

            <div className="container relative z-10 flex flex-col items-center justify-center text-center px-4 h-full">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                >
                    {/* Main Title - Smaller, Fish-themed Logo Text */}
                    <div className="mb-4">
                        {/* Simple CSS shape or icon could go here, but focusing on text for now */}
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900 mb-6 font-sans">
                        Omni Bass
                    </h1>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.8, duration: 1 }}
                        className="text-sm md:text-base text-gray-600 font-mono tracking-widest uppercase"
                    >
                        Digital Stream from Lake Biwa
                    </motion.p>
                </motion.div>

                {/* Scroll Indicator */}
                <motion.div
                    className="absolute bottom-10 left-1/2 -translate-x-1/2"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.5, duration: 1, repeat: Infinity, repeatType: "reverse" }}
                >
                    <div className="w-px h-12 bg-gray-300"></div>
                </motion.div>
            </div>
        </section>
    );
};

export default Hero;
