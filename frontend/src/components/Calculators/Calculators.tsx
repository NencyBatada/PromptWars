import React, { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import './Calculators.css';

interface ChartData {
  name: string;
  balance: number;
  invested: number;
}

const CompoundInterestCalc: React.FC = () => {
  const [principal, setPrincipal] = useState(10000);
  const [monthly, setMonthly] = useState(200);
  const [rate, setRate] = useState(7);
  const [years, setYears] = useState(20);
  const [chartData, setChartData] = useState<ChartData[]>([]);

  const calculate = () => {
    const r = rate / 100 / 12;
    const n = years * 12;
    let balance = principal;
    const data: ChartData[] = [];
    
    for (let i = 0; i <= years; i++) {
      const yearBalance = principal * Math.pow(1 + rate/100, i) + (monthly * 12) * ((Math.pow(1 + rate/100, i) - 1) / (rate/100));
      data.push({
        name: `Yr ${i}`,
        balance: Math.round(yearBalance),
        invested: principal + (monthly * 12 * i)
      });
    }
    setChartData(data);
  };

  return (
    <div className="calc-card wide">
      <div className="calc-header">
        <div className="calc-icon">🔄</div>
        <h3>Advanced Compound Interest</h3>
        <p>Interactive projection visualization</p>
      </div>
      <div className="calc-grid-inner">
        <div className="calc-body">
          <div className="input-group">
            <label>Initial Investment ($)</label>
            <input type="number" value={principal} onChange={(e) => setPrincipal(Number(e.target.value))} />
          </div>
          <div className="input-group">
            <label>Monthly Contribution ($)</label>
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
          <button className="btn btn-primary calc-btn" onClick={calculate}>Generate Projection</button>
        </div>

        <div className="calc-visual">
          {chartData.length > 0 ? (
            <div style={{ width: '100%', height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6C63FF" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#6C63FF" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="name" stroke="var(--text-tertiary)" fontSize={12} />
                  <YAxis stroke="var(--text-tertiary)" fontSize={12} tickFormatter={(val) => `$${val/1000}k`} />
                  <Tooltip 
                    contentStyle={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', borderRadius: '12px' }}
                    formatter={(value: number) => [`$${value.toLocaleString()}`, '']}
                  />
                  <Area type="monotone" dataKey="balance" stroke="#6C63FF" fillOpacity={1} fill="url(#colorBalance)" />
                  <Area type="monotone" dataKey="invested" stroke="#FF6B9D" fill="transparent" />
                </AreaChart>
              </ResponsiveContainer>
              <div className="chart-legend-mini">
                <span className="legend-item"><span className="dot primary"></span> Total Balance</span>
                <span className="legend-item"><span className="dot secondary"></span> Principal Invested</span>
              </div>
            </div>
          ) : (
            <div className="vis-placeholder">
              <p>Enter values and calculate to see your growth projection</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const Calculators: React.FC = () => {
  return (
    <section id="calculators" className="section calc-section">
      <div className="container">
        <div className="section-header">
          <span className="section-tag">Tools</span>
          <h2 className="section-title">Professional Financial Tools</h2>
          <p className="section-desc">Run the numbers and see how your financial decisions play out over time.</p>
        </div>
        <div className="calc-grid">
          <CompoundInterestCalc />
        </div>
      </div>
    </section>
  );
};

export default Calculators;
