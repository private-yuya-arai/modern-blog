import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Post } from '../types';
import { motion, AnimatePresence } from 'framer-motion';
import { normalizePath } from '../lib/posts';
import './HeroSection.css';

interface HeroSectionProps {
    latestPost: Post;
}

const HeroSection: React.FC<HeroSectionProps> = ({ latestPost }) => {
    const [timeContext, setTimeContext] = useState<'morning' | 'day' | 'night'>('day');

    useEffect(() => {
        const hour = new Date().getHours();
        if (hour >= 6 && hour < 12) {
            setTimeContext('morning');
        } else if (hour >= 12 && hour < 18) {
            setTimeContext('day');
        } else {
            setTimeContext('night');
        }
    }, []);

    const fallbackImages = {
        morning: '/images/hero_morning.png',
        day: '/images/hero_day.png',
        night: '/images/hero_night.png',
    };

    // Use post image if available, else use fallback gradient
    const heroBg = latestPost.image || normalizePath(fallbackImages[timeContext]);

    return (
        <section className="hero-section">
            <AnimatePresence mode="wait">
                <motion.div
                    key={heroBg}
                    className="hero-background"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1.5 }}
                    style={{ backgroundImage: `url(${heroBg})` }}
                />
            </AnimatePresence>
            <div className="hero-overlay">
                <div className="hero-container">
                    <motion.div
                        className="hero-content"
                        initial={{ y: 30, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.8, delay: 0.5 }}
                    >
                        <div className="hero-card-layout">
                            {latestPost.image && (
                                <div className="hero-card-image-wrapper">
                                    <img src={latestPost.image} alt={latestPost.title} className="hero-card-image" />
                                </div>
                            )}
                            <div className="hero-text-content">
                                <span className="hero-label">LATEST STORY</span>
                                <h2 className="hero-title">{latestPost.title}</h2>
                                <p className="hero-excerpt">{latestPost.excerpt}</p>
                                <Link to={`/post/${latestPost.slug}`} className="hero-button">
                                    READ STORY
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default HeroSection;
