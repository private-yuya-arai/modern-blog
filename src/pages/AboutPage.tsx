
import React from 'react';
import './PageStyles.css'; // Common styles

const AboutPage: React.FC = () => {
    return (
        <div className="page-container">
            <h1 className="page-title">About Arai Blog</h1>
            <div className="page-content">
                <p>Welcome to Arai Blog, a playground for data science, statistics, and machine learning experiments.</p>
                <p>This blog serves as a digital garden for documenting learning journeys, sharing technical insights, and exploring the fascinating world of data.</p>

                <h2>Our Mission</h2>
                <p>To provide clear, practical, and visually engaging content that bridges the gap between theory and application in statistics and programming.</p>

                <h2>The Tech Stack</h2>
                <p>This blog is built with:</p>
                <ul>
                    <li>React & TypeScript</li>
                    <li>Vite</li>
                    <li>Framer Motion</li>
                    <li>Python (for data visualization)</li>
                </ul>
            </div>
        </div>
    );
};

export default AboutPage;
