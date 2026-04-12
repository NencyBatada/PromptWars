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

  const toggleMenu = () => {
    const nextItem = !menuOpen;
    setMenuOpen(nextItem);
    const btn = document.getElementById('navToggle');
    if (btn) btn.setAttribute('aria-expanded', String(nextItem));
  };
  
  const closeMenu = () => setMenuOpen(false);

  return (
    <nav id="navbar" className={`navbar ${scrolled ? 'scrolled' : ''}`} role="navigation" aria-label="Main navigation">
      <div className="nav-container">
        <a href="#" className="nav-brand" aria-label="FinWise - Home">
          <span className="brand-icon">◆</span>
          <span className="brand-text">FinWise</span>
        </a>
        <ul id="navLinks" className={`nav-links ${menuOpen ? 'open' : ''}`} role="menubar">
          <li role="none"><a href="#learn" className="nav-link" role="menuitem" onClick={closeMenu}>Learn</a></li>
          <li role="none"><a href="#calculators" className="nav-link" role="menuitem" onClick={closeMenu}>Calculators</a></li>
          <li role="none"><a href="#budget" className="nav-link" role="menuitem" onClick={closeMenu}>Budget</a></li>
          <li role="none"><a href="#glossary" className="nav-link" role="menuitem" onClick={closeMenu}>Glossary</a></li>
          <li role="none"><a href="#quiz" className="nav-link" role="menuitem" onClick={closeMenu}>Quiz</a></li>
        </ul>
        <button 
          id="navToggle"
          className="nav-toggle" 
          onClick={toggleMenu}
          aria-expanded={menuOpen}
          aria-label="Toggle navigation menu"
          aria-controls="navLinks"
        >
          <span></span><span></span><span></span>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
