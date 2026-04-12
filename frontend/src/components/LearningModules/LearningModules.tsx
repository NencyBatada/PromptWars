import React, { useState } from 'react';
import './LearningModules.css';

const SavingsJar: React.FC = () => {

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
    <div className="savings-jar" role="group" aria-label="Interactive Savings Jar">
      <div className="jar-label" id="jarLabel">Your Savings Growth</div>
      <div className="jar-body" role="progressbar" aria-valuenow={amount} aria-valuemin={0} aria-valuemax={GOAL} aria-label={`Savings progress: $${amount} of $${GOAL}`}>
        <div className="jar-fill" style={{ height: `${pct}%` }}>
          <div className="jar-bubbles" aria-hidden="true">
            <span></span><span></span><span></span><span></span><span></span>
          </div>
        </div>
      </div>
      <div className="jar-controls">
        <button 
          className="jar-btn" 
          onClick={addSavings}
          disabled={amount >= GOAL}
          id="addSavingsBtn"
          aria-label={amount >= GOAL ? 'Savings goal reached' : `Add $${INCREMENT} to savings`}
          style={amount >= GOAL ? { background: 'var(--accent-primary)' } : {}}
        >
          {amount >= GOAL ? '🎉 Goal Reached!' : `+ Add $${INCREMENT}`}
        </button>
        <span className="jar-amount" aria-live="polite">${amount.toLocaleString()}</span>
      </div>
    </div>
  );
};

const LearningModules: React.FC = () => {
  const [activeTab, setActiveTab] = useState('saving');

  return (
    <section id="learn" className="section learn-section" aria-labelledby="learnTitle">
      <div className="container">
        <div className="section-header">
          <span className="section-tag">Foundation</span>
          <h2 className="section-title" id="learnTitle">Financial Building Blocks</h2>
          <p className="section-desc">Understand the three pillars of personal finance through clear, practical explanations.</p>
        </div>

        <div className="module-tabs" role="tablist" aria-label="Financial topics">
          <button 
            className={`tab-btn ${activeTab === 'saving' ? 'active' : ''}`} 
            onClick={() => setActiveTab('saving')}
            role="tab"
            id="tab-saving"
            aria-selected={activeTab === 'saving'}
            aria-controls="panel-saving"
          >
            <span className="tab-icon" aria-hidden="true">🏦</span> Saving
          </button>
          <button 
            className={`tab-btn ${activeTab === 'investing' ? 'active' : ''}`} 
            onClick={() => setActiveTab('investing')}
            role="tab"
            id="tab-investing"
            aria-selected={activeTab === 'investing'}
            aria-controls="panel-investing"
          >
            <span className="tab-icon" aria-hidden="true">📈</span> Investing
          </button>
          <button 
            className={`tab-btn ${activeTab === 'budgeting' ? 'active' : ''}`} 
            onClick={() => setActiveTab('budgeting')}
            role="tab"
            id="tab-budgeting"
            aria-selected={activeTab === 'budgeting'}
            aria-controls="panel-budgeting"
          >
            <span className="tab-icon" aria-hidden="true">📊</span> Budgeting
          </button>
        </div>

        <div className="module-content">
          {activeTab === 'saving' && (
            <div className="module-panel active" role="tabpanel" id="panel-saving" aria-labelledby="tab-saving">
              <div className="module-grid">
                <div className="module-text">
                  <h3>The Power of Saving</h3>
                  <p>Saving is the foundation of financial health. It means setting aside a portion of your income for future use instead of spending it all today.</p>
                  <div className="key-points">
                    <div className="key-point">
                      <div className="kp-icon" aria-hidden="true">🎯</div>
                      <div>
                        <strong>Emergency Fund First</strong>
                        <p>Aim to save 3-6 months of living expenses as a safety net before anything else.</p>
                      </div>
                    </div>
                    <div className="key-point">
                      <div className="kp-icon" aria-hidden="true">⚡</div>
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
            <div className="module-panel active" role="tabpanel" id="panel-investing" aria-labelledby="tab-investing">
              <div className="module-grid">
                <div className="module-text">
                  <h3>Growing Your Wealth</h3>
                  <p>Investing means putting your money to work so it can grow over time. Unlike saving, investing involves some risk — but also offers much higher potential returns.</p>
                  <div className="investment-types">
                    <h4>Risk Levels</h4>
                    <div className="inv-type-grid">
                      <div className="inv-type">
                        <span className="inv-name">Bonds</span>
                        <div className="risk-meter" role="meter" aria-valuenow={25} aria-valuemin={0} aria-valuemax={100} aria-label="Bonds risk level: Low"><div className="risk-fill" style={{ width: '25%' }}></div></div>
                        <span className="risk-label">Low</span>
                      </div>
                      <div className="inv-type">
                        <span className="inv-name">Index Funds</span>
                        <div className="risk-meter" role="meter" aria-valuenow={50} aria-valuemin={0} aria-valuemax={100} aria-label="Index Funds risk level: Medium"><div className="risk-fill" style={{ width: '50%' }}></div></div>
                        <span className="risk-label">Medium</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="module-visual">
                   <div className="growth-chart-placeholder">
                      <p>Visualizing 30 Years of Growth...</p>
                      <div className="mini-chart-mock" aria-hidden="true"></div>
                   </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'budgeting' && (
            <div className="module-panel active" role="tabpanel" id="panel-budgeting" aria-labelledby="tab-budgeting">
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
                        <div className="donut-mock" aria-hidden="true"></div>
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
