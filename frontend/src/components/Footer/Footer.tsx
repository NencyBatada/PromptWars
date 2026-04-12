import React from 'react';
import './Footer.css';

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-brand">
            <span className="brand-icon">◆</span>
            <span className="brand-text">FinWise</span>
            <p className="footer-tagline">Making financial literacy accessible to everyone.</p>
          </div>
          <nav className="footer-links">
            <a href="#learn">Learn</a>
            <a href="#calculators">Calculators</a>
            <a href="#budget">Budget</a>
            <a href="#glossary">Glossary</a>
            <a href="#quiz">Quiz</a>
          </nav>
        </div>
        <div className="footer-bottom">
          <p>© 2026 FinWise. Educational purposes only — not financial advice.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
