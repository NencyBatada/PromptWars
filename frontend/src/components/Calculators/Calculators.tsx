import React, { useState, useCallback } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import './Calculators.css';

interface ChartData {
  name: string;
  balance: number;
  invested: number;
}

/**
 * Compound Interest Calculator with interactive chart.
 * Calculates growth projection based on principal, monthly contribution, rate, and time.
 */
const CompoundInterestCalc: React.FC = () => {
  const [principal, setPrincipal] = useState(10000);
  const [monthly, setMonthly] = useState(200);
  const [rate, setRate] = useState(7);
  const [years, setYears] = useState(20);
  const [chartData, setChartData] = useState<ChartData[]>([]);

  const calculate = useCallback(() => {
    if (rate <= 0 || years <= 0) return;

    const annualRate = rate / 100;
    const data: ChartData[] = [];

    for (let i = 0; i <= years; i++) {
      const growthFactor = Math.pow(1 + annualRate, i);
      const yearBalance = principal * growthFactor +
        (monthly * 12) * ((growthFactor - 1) / annualRate);
      data.push({
        name: `Yr ${i}`,
        balance: Math.round(yearBalance),
        invested: principal + (monthly * 12 * i)
      });
    }
    setChartData(data);
  }, [principal, monthly, rate, years]);

  const finalBalance = chartData.length > 0 ? chartData[chartData.length - 1].balance : 0;
  const totalInvested = chartData.length > 0 ? chartData[chartData.length - 1].invested : 0;
  const totalGains = finalBalance - totalInvested;

  return (
    <div className="calc-card wide">
      <div className="calc-header">
        <div className="calc-icon" aria-hidden="true">🔄</div>
        <h3 id="compoundCalcTitle">Advanced Compound Interest</h3>
        <p>Interactive projection visualization</p>
      </div>
      <div className="calc-grid-inner" role="group" aria-labelledby="compoundCalcTitle">
        <div className="calc-body">
          <div className="input-group">
            <label htmlFor="calcPrincipal">Initial Investment ($)</label>
            <input
              id="calcPrincipal"
              type="number"
              value={principal}
              onChange={(e) => setPrincipal(Number(e.target.value))}
              min={0}
              aria-describedby="calcPrincipalDesc"
            />
            <span id="calcPrincipalDesc" className="sr-only">Enter the starting amount to invest</span>
          </div>
          <div className="input-group">
            <label htmlFor="calcMonthly">Monthly Contribution ($)</label>
            <input
              id="calcMonthly"
              type="number"
              value={monthly}
              onChange={(e) => setMonthly(Number(e.target.value))}
              min={0}
            />
          </div>
          <div className="row">
            <div className="input-group">
              <label htmlFor="calcRate">Annual Return (%)</label>
              <input
                id="calcRate"
                type="number"
                value={rate}
                onChange={(e) => setRate(Number(e.target.value))}
                min={0.1}
                step={0.1}
              />
            </div>
            <div className="input-group">
              <label htmlFor="calcYears">Years</label>
              <input
                id="calcYears"
                type="number"
                value={years}
                onChange={(e) => setYears(Number(e.target.value))}
                min={1}
                max={50}
              />
            </div>
          </div>
          <button
            type="button"
            className="btn btn-primary calc-btn"
            onClick={calculate}
            id="calcGenerateBtn"
            aria-label="Generate compound interest projection"
          >
            Generate Projection
          </button>

          {chartData.length > 0 && (
            <div className="calc-result" aria-live="polite" role="status">
              <div className="result-row">
                <span>Total Invested</span>
                <span className="result-value">${totalInvested.toLocaleString()}</span>
              </div>
              <div className="result-row">
                <span>Interest Earned</span>
                <span className="result-value positive">${totalGains.toLocaleString()}</span>
              </div>
              <div className="result-row result-total">
                <span>Final Balance</span>
                <span className="result-value">${finalBalance.toLocaleString()}</span>
              </div>
            </div>
          )}
        </div>

        <div className="calc-visual">
          {chartData.length > 0 ? (
            <div style={{ width: '100%', height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} aria-label="Investment growth chart">
                  <defs>
                    <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6C63FF" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#6C63FF" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="name" stroke="var(--text-tertiary)" fontSize={12} />
                  <YAxis stroke="var(--text-tertiary)" fontSize={12} tickFormatter={(val: number) => `$${val/1000}k`} />
                  <Tooltip
                    contentStyle={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', borderRadius: '12px' }}
                    formatter={(value: number) => [`$${value.toLocaleString()}`, '']}
                  />
                  <Area type="monotone" dataKey="balance" stroke="#6C63FF" fillOpacity={1} fill="url(#colorBalance)" name="Total Balance" />
                  <Area type="monotone" dataKey="invested" stroke="#FF6B9D" fill="transparent" name="Principal Invested" />
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
    <section id="calculators" className="section calc-section" aria-labelledby="calcSectionTitle">
      <div className="container">
        <div className="section-header">
          <span className="section-tag">Tools</span>
          <h2 className="section-title" id="calcSectionTitle">Professional Financial Tools</h2>
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
