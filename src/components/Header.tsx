import React from 'react';
import { Link } from 'react-router-dom';
import SearchBar from './SearchBar';
import { motion } from 'framer-motion';
import './Header.css';

const Header: React.FC = () => {
  return (
    <motion.header
      className="site-header"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
    >
      <div className="header-container">
        <div className="header-top">
          <div className="social-links-placeholder">
            {/* Social icons could go here */}
          </div>
          <div className="site-branding">
            <Link to="/" className="site-title-link">
              <h1 className="site-title">ARAIBLOG</h1>
            </Link>
            <p className="site-tagline">Data Science & Statistics</p>
          </div>
          <div className="header-actions">
            <SearchBar />
          </div>
        </div>
        <nav className="main-nav">
          <ul className="nav-list">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/about">About</Link></li>
            <li><Link to="/category/statistics">Statistics</Link></li>
            <li><Link to="/tag/Python">Python</Link></li>
            <li><Link to="/contact">Contact</Link></li>
          </ul>
        </nav>
      </div>
    </motion.header>
  );
};

export default Header;
