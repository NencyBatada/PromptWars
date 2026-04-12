import React, { useState, useEffect, useRef } from 'react';
import './Hero.css';

const StatItem = ({ target, label }) => {
  const [count, setCount] = useState(0);
  const elementRef = useRef(null);
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !hasStarted) {
        setHasStarted(true);
      }
    }, { threshold: 0.5 });

    if (elementRef.current) observer.observe(elementRef.current);
    return () => observer.disconnect();
  }, [hasStarted]);

  useEffect(() => {
    if (!hasStarted) return;

    let current = 0;
    const duration = 1500;
    const step = target / (duration / 16);
    let frameId;

    const animate = () => {
      current += step;
      if (current >= target) {
        setCount(target);
        return;
      }
      setCount(Math.floor(current));
      frameId = requestAnimationFrame(animate);
    };

    frameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameId);
  }, [hasStarted, target]);

  return (
    <div className="stat-item" ref={elementRef}>
      <span className="stat-number">{count}{target === 30 ? '+' : ''}</span>
      <span className="stat-label">{label}</span>
    </div>
  );
};

const Hero = () => {
  return (
    <header className="hero">
      <div className="hero-content">
        <div className="hero-badge">✦ Your Financial Journey Starts Here</div>
        <h1 className="hero-title">
          Master Your <span className="gradient-text">Money</span>,<br />
          Shape Your <span className="gradient-text-alt">Future</span>
        </h1>
        <p className="hero-subtitle">
          Interactive tools and clear explanations to help you understand saving, investing, and budgeting — no jargon, just practical knowledge.
        </p>
        <div className="hero-cta">
          <a href="#learn" className="btn btn-primary">
            Start Learning
            <span className="btn-arrow">→</span>
          </a>
          <a href="#calculators" className="btn btn-secondary">
            Try Calculators
          </a>
        </div>
        <div className="hero-stats">
          <StatItem target={3} label="Core Topics" />
          <StatItem target={5} label="Calculators" />
          <StatItem target={30} label="Key Terms" />
        </div>
      </div>
      <div className="hero-visual" aria-hidden="true">
        <div className="floating-card card-1">
          <div className="card-icon">📈</div>
          <div className="card-info">
            <span className="card-label">Investment Growth</span>
            <span className="card-value positive">+12.4%</span>
          </div>
        </div>
        <div className="floating-card card-2">
          <div className="card-icon">🏦</div>
          <div className="card-info">
            <span className="card-label">Savings Goal</span>
            <span className="card-value">78% Complete</span>
          </div>
        </div>
        <div className="floating-card card-3">
          <div className="card-icon">💳</div>
          <div className="card-info">
            <span className="card-label">Monthly Budget</span>
            <span className="card-value">On Track ✓</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Hero;
