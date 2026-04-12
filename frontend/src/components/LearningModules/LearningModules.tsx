import React, { useState } from 'react';
import './LearningModules.css';

const SavingsJar = () => {
  const [amount, setAmount] = useState(0);
  const GOAL = 2000;
  const INCREMENT = 100;

  const addSavings = () => {
    if (amount < GOAL) {
      setAmount(prev => Math.min(prev + INCREMENT, GOAL));
    }
  };

  const pct = (amount / GOAL) * 100;

  return (
    <div className="savings-jar">
      <div className="jar-label">Your Savings Growth</div>
      <div className="jar-body">
        <div className="jar-fill" style={{ height: `${pct}%` }}>
          <div className="jar-bubbles">
            <span></span><span></span><span></span><span></span><span></span>
          </div>
        </div>
      </div>
      <div className="jar-controls">
        <button 
          className="jar-btn" 
          onClick={addSavings}
          disabled={amount >= GOAL}
          style={amount >= GOAL ? { background: 'var(--accent-primary)' } : {}}
        >
          {amount >= GOAL ? '🎉 Goal Reached!' : `+ Add $${INCREMENT}`}
        </button>
        <span className="jar-amount">${amount.toLocaleString()}</span>
      </div>
    </div>
  );
};

const LearningModules = () => {
  const [activeTab, setActiveTab] = useState('saving');

  return (
    <section id="learn" className="section learn-section">
      <div className="container">
        <div className="section-header">
          <span className="section-tag">Foundation</span>
          <h2 className="section-title">Financial Building Blocks</h2>
          <p className="section-desc">Understand the three pillars of personal finance through clear, practical explanations.</p>
        </div>

        <div className="module-tabs" role="tablist">
          <button 
            className={`tab-btn ${activeTab === 'saving' ? 'active' : ''}`} 
            onClick={() => setActiveTab('saving')}
            role="tab"
            aria-selected={activeTab === 'saving'}
          >
            <span className="tab-icon">🏦</span> Saving
          </button>
          <button 
            className={`tab-btn ${activeTab === 'investing' ? 'active' : ''}`} 
            onClick={() => setActiveTab('investing')}
            role="tab"
            aria-selected={activeTab === 'investing'}
          >
            <span className="tab-icon">📈</span> Investing
          </button>
          <button 
            className={`tab-btn ${activeTab === 'budgeting' ? 'active' : ''}`} 
            onClick={() => setActiveTab('budgeting')}
            role="tab"
            aria-selected={activeTab === 'budgeting'}
          >
            <span className="tab-icon">📊</span> Budgeting
          </button>
        </div>

        <div className="module-content">
          {activeTab === 'saving' && (
            <div className="module-panel active">
              <div className="module-grid">
                <div className="module-text">
                  <h3>The Power of Saving</h3>
                  <p>Saving is the foundation of financial health. It means setting aside a portion of your income for future use instead of spending it all today.</p>
                  <div className="key-points">
                    <div className="key-point">
                      <div className="kp-icon">🎯</div>
                      <div>
                        <strong>Emergency Fund First</strong>
                        <p>Aim to save 3-6 months of living expenses as a safety net before anything else.</p>
                      </div>
                    </div>
                    <div className="key-point">
                      <div className="kp-icon">⚡</div>
                      <div>
                        <strong>Pay Yourself First</strong>
                        <p>Automate savings so money goes to savings before you get a chance to spend it.</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="module-visual">
                  <SavingsJar />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'investing' && (
            <div className="module-panel active">
              <div className="module-grid">
                <div className="module-text">
                  <h3>Growing Your Wealth</h3>
                  <p>Investing means putting your money to work so it can grow over time. Unlike saving, investing involves some risk — but also offers much higher potential returns.</p>
                  <div className="investment-types">
                    <h4>Risk Levels</h4>
                    <div className="inv-type-grid">
                      <div className="inv-type">
                        <span className="inv-name">Bonds</span>
                        <div className="risk-meter"><div className="risk-fill" style={{ width: '25%' }}></div></div>
                        <span className="risk-label">Low</span>
                      </div>
                      <div className="inv-type">
                        <span className="inv-name">Index Funds</span>
                        <div className="risk-meter"><div className="risk-fill" style={{ width: '50%' }}></div></div>
                        <span className="risk-label">Medium</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="module-visual">
                   <div className="growth-chart-placeholder">
                      <p>Visualizing 30 Years of Growth...</p>
                      <div className="mini-chart-mock"></div>
                   </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'budgeting' && (
            <div className="module-panel active">
               <div className="module-grid">
                <div className="module-text">
                  <h3>Take Control of Your Spending</h3>
                  <p>A budget is a plan for how you'll use your money. It's not about restriction — it's about making intentional choices.</p>
                  <div className="pro-tip">
                    <span className="tip-badge">Quick Start</span>
                    <p>Use the 50/30/20 rule: 50% Needs, 30% Wants, 20% Savings.</p>
                  </div>
                </div>
                <div className="module-visual">
                    <div className="budget-donut-placeholder">
                        <div className="donut-mock"></div>
                        <p>50/30/20 Breakdown</p>
                    </div>
                </div>
               </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default LearningModules;
