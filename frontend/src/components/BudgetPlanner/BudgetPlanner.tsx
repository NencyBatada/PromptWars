import React, { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import './BudgetPlanner.css';

interface Expense {
  name: string;
  amount: number;
  category: 'needs' | 'wants' | 'savings';
}

const COLORS = {
  needs: '#6C63FF',
  wants: '#FF6B9D',
  savings: '#00D9A6'
};

const BudgetPlanner: React.FC = () => {
  const [income, setIncome] = useState(5000);
  const [expenses, setExpenses] = useState<Expense[]>([
    { name: 'Rent', amount: 1500, category: 'needs' },
    { name: 'Groceries', amount: 400, category: 'needs' },
    { name: 'Entertainment', amount: 300, category: 'wants' },
  ]);

  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  const remaining = income - totalExpenses;

  const chartData = [
    { name: 'Needs', value: expenses.filter(e => e.category === 'needs').reduce((sum, e) => sum + e.amount, 0) },
    { name: 'Wants', value: expenses.filter(e => e.category === 'wants').reduce((sum, e) => sum + e.amount, 0) },
    { name: 'Savings/Remaining', value: Math.max(0, remaining) },
  ];

  const addExpense = () => {
    setExpenses([...expenses, { name: 'New Expense', amount: 0, category: 'needs' }]);
  };

  const updateExpense = (index: number, field: keyof Expense, value: string | number) => {
    const newExpenses = [...expenses];
    newExpenses[index] = { ...newExpenses[index], [field]: value };
    setExpenses(newExpenses);
  };

  return (
    <section id="budget" className="section budget-section" aria-labelledby="budgetTitle">
      <div className="container">
        <div className="section-header">
          <span className="section-tag">Planner</span>
          <h2 className="section-title" id="budgetTitle">Interactive Budget Planner</h2>
          <p className="section-desc">Track your spending and optimize your 50/30/20 rule.</p>
        </div>

        <div className="budget-grid">
          <div className="budget-inputs">
            <div className="input-card">
              <label htmlFor="budgetIncome"><h3>Monthly Income</h3></label>
              <div className="input-group large">
                <span className="input-prefix">$</span>
                <input 
                  type="number" 
                  id="budgetIncome"
                  aria-label="Monthly Income"
                  value={income} 
                  onChange={(e) => setIncome(Number(e.target.value))} 
                />
              </div>
            </div>

            <div className="expenses-card">
              <div className="card-header">
                <h3>Expenses</h3>
                <button className="add-btn" onClick={addExpense} aria-label="Add new expense row">+ Add</button>
              </div>
              <div className="expense-list">
                {expenses.map((exp, i) => (
                  <div key={i} className="expense-row" role="group" aria-label={`Expense row ${i+1}`}>
                    <input 
                      type="text" 
                      aria-label="Expense Name"
                      value={exp.name} 
                      onChange={(e) => updateExpense(i, 'name', e.target.value)}
                    />
                    <select 
                      aria-label="Expense Category"
                      value={exp.category} 
                      onChange={(e) => updateExpense(i, 'category', e.target.value as Expense['category'])}
                    >
                      <option value="needs">Need</option>
                      <option value="wants">Want</option>
                      <option value="savings">Saving</option>
                    </select>
                    <div className="amt-input">
                      <span>$</span>
                      <input 
                        type="number" 
                        aria-label="Expense Amount"
                        value={exp.amount} 
                        onChange={(e) => updateExpense(i, 'amount', Number(e.target.value))}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="budget-visuals">
             <div className="summary-cards">
                <div className="summary-card">
                    <span className="label">Total Expenses</span>
                    <span className="value">${totalExpenses.toLocaleString()}</span>
                </div>
                <div className="summary-card highlight" aria-live="polite">
                    <span className="label">Remaining</span>
                    <span className="value">${remaining.toLocaleString()}</span>
                </div>
             </div>
             
             <div className="chart-container">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart aria-label="Budget Breakdown Chart">
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                      role="img"
                    >
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={Object.values(COLORS)[index % 3]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
             </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BudgetPlanner;
