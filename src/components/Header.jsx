import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const Header = () => {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <motion.header
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/80 backdrop-blur-md shadow-sm py-4' : 'bg-transparent py-6'
                }`}
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.8 }}
        >
            <div className="container mx-auto flex items-center justify-between px-6">
                {/* Logo Area */}
                <div className={`text-2xl font-bold tracking-tight transition-colors ${scrolled ? 'text-gray-900' : 'text-gray-800'
                    }`}>
                    Omnibus
                </div>

                {/* Navigation */}
                <nav className="hidden md:flex items-center gap-8">
                    {['About', 'Services', 'Product', 'Contact'].map((item) => (
                        <a
                            key={item}
                            href={`#${item.toLowerCase()}`}
                            className={`text-sm font-medium hover:text-[var(--color-primary)] transition-colors ${scrolled ? 'text-gray-600' : 'text-gray-700'
                                }`}
                        >
                            {item}
                        </a>
                    ))}
                    <a
                        href="#contact"
                        className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all ${scrolled
                                ? 'bg-[var(--color-primary)] text-white shadow-md hover:shadow-lg'
                                : 'bg-white/90 text-[var(--color-primary)] hover:bg-white shadow-sm'
                            }`}
                    >
                        相談する
                    </a>
                </nav>
            </div>
        </motion.header>
    );
};

export default Header;
