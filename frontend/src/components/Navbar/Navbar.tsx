import React, { useState, useEffect } from 'react';
import './Navbar.css';

const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const closeMenu = () => setMenuOpen(false);

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="nav-container">
        <a href="#" className="nav-brand">
          <span className="brand-icon">◆</span>
          <span className="brand-text">FinWise</span>
        </a>
        <ul className={`nav-links ${menuOpen ? 'open' : ''}`}>
          <li><a href="#learn" className="nav-link" onClick={closeMenu}>Learn</a></li>
          <li><a href="#calculators" className="nav-link" onClick={closeMenu}>Calculators</a></li>
          <li><a href="#budget" className="nav-link" onClick={closeMenu}>Budget</a></li>
          <li><a href="#glossary" className="nav-link" onClick={closeMenu}>Glossary</a></li>
          <li><a href="#quiz" className="nav-link" onClick={closeMenu}>Quiz</a></li>
        </ul>
        <button 
          className="nav-toggle" 
          onClick={toggleMenu}
          aria-expanded={menuOpen}
          aria-label="Toggle navigation menu"
        >
          <span></span><span></span><span></span>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
