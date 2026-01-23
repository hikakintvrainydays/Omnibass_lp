import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

const Header = () => {
    const [scrolled, setScrolled] = useState(false);
    const location = useLocation();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToSection = (sectionId) => {
        if (location.pathname !== '/') {
            // Navigate to home page first, then scroll
            window.location.href = `/#${sectionId}`;
        } else {
            const element = document.getElementById(sectionId);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
            }
        }
    };

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
                <Link
                    to="/"
                    className={`text-2xl font-bold tracking-tight transition-colors ${scrolled ? 'text-gray-900' : 'text-gray-800'
                        }`}
                >
                    Omnibus
                </Link>

                {/* Navigation */}
                <nav className="hidden md:flex items-center gap-8">
                    <button
                        onClick={() => scrollToSection('about')}
                        className={`text-sm font-medium hover:text-[var(--color-primary)] transition-colors ${scrolled ? 'text-gray-600' : 'text-gray-700'
                            }`}
                    >
                        About
                    </button>
                    <button
                        onClick={() => scrollToSection('services')}
                        className={`text-sm font-medium hover:text-[var(--color-primary)] transition-colors ${scrolled ? 'text-gray-600' : 'text-gray-700'
                            }`}
                    >
                        Services
                    </button>
                    <button
                        onClick={() => scrollToSection('product')}
                        className={`text-sm font-medium hover:text-[var(--color-primary)] transition-colors ${scrolled ? 'text-gray-600' : 'text-gray-700'
                            }`}
                    >
                        Product
                    </button>
                    <Link
                        to="/contact"
                        className={`text-sm font-medium hover:text-[var(--color-primary)] transition-colors ${scrolled ? 'text-gray-600' : 'text-gray-700'
                            }`}
                    >
                        Contact
                    </Link>
                    <Link
                        to="/contact"
                        className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all ${scrolled
                                ? 'bg-[var(--color-primary)] text-white shadow-md hover:shadow-lg'
                                : 'bg-white/90 text-[var(--color-primary)] hover:bg-white shadow-sm'
                            }`}
                    >
                        相談する
                    </Link>
                </nav>
            </div>
        </motion.header>
    );
};

export default Header;
