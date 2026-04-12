import React, { useState } from 'react';
import './Calculators.css';

const CompoundInterestCalc = () => {
  const [principal, setPrincipal] = useState(10000);
  const [monthly, setMonthly] = useState(200);
  const [rate, setRate] = useState(7);
  const [years, setYears] = useState(20);
  const [result, setResult] = useState(null);

  const calculate = () => {
    const r = rate / 100 / 12;
    const n = years * 12;
    let balance = principal;
    
    for (let i = 0; i < n; i++) {
      balance = balance * (1 + r) + monthly;
    }

    const totalInvested = principal + (monthly * n);
    const interest = balance - totalInvested;

    setResult({
      totalInvested,
      interest,
      finalAmount: balance
    });
  };

  return (
    <div className="calc-card">
      <div className="calc-header">
        <div className="calc-icon">🔄</div>
        <h3>Compound Interest</h3>
        <p>See how your money grows exponentially</p>
      </div>
      <div className="calc-body">
        <div className="input-group">
          <label>Initial Investment</label>
          <input type="number" value={principal} onChange={(e) => setPrincipal(Number(e.target.value))} />
        </div>
        <div className="input-group">
          <label>Monthly Contribution</label>
          <input type="number" value={monthly} onChange={(e) => setMonthly(Number(e.target.value))} />
        </div>
        <div className="row">
          <div className="input-group">
            <label>Annual Return (%)</label>
            <input type="number" value={rate} onChange={(e) => setRate(Number(e.target.value))} />
          </div>
          <div className="input-group">
            <label>Years</label>
            <input type="number" value={years} onChange={(e) => setYears(Number(e.target.value))} />
          </div>
        </div>
        <button className="btn btn-primary calc-btn" onClick={calculate}>Calculate Growth</button>
        
        {result && (
          <div className="calc-result visible">
            <div className="result-row">
              <span>Total Invested</span>
              <span className="result-value">${Math.round(result.totalInvested).toLocaleString()}</span>
            </div>
            <div className="result-row">
              <span>Interest Earned</span>
              <span className="result-value positive">${Math.round(result.interest).toLocaleString()}</span>
            </div>
            <div className="result-row result-total">
              <span>Final Amount</span>
              <span className="result-value">${Math.round(result.finalAmount).toLocaleString()}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const Calculators = () => {
  return (
    <section id="calculators" className="section calc-section">
      <div className="container">
        <div className="section-header">
          <span className="section-tag">Tools</span>
          <h2 className="section-title">Interactive Calculators</h2>
          <p className="section-desc">Run the numbers and see how your financial decisions play out over time.</p>
        </div>
        <div className="calc-grid">
          <CompoundInterestCalc />
          {/* Add more calculators here */}
        </div>
      </div>
    </section>
  );
};

export default Calculators;
