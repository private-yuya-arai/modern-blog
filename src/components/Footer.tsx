import React from 'react';
import './Footer.css';

const Footer: React.FC = () => {
  return (
    <footer className="site-footer">
      <div className="footer-container">
        <p>&copy; {new Date().getFullYear()} Arai Blog. All Rights Reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
