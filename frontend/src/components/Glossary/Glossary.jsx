import React, { useState, useEffect } from 'react';
import { fetchGlossary } from '../../services/api';
import './Glossary.css';

const Glossary = () => {
  const [terms, setTerms] = useState([]);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGlossary()
      .then(data => {
        setTerms(data);
        setLoading(false);
      })
      .catch(err => console.error(err));
  }, []);

  const filteredTerms = terms.filter(t => {
    const matchesSearch = t.term.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === 'all' || t.category === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <section id="glossary" className="section glossary-section">
      <div className="container">
        <div className="section-header">
          <span className="section-tag">Reference</span>
          <h2 className="section-title">Financial Glossary</h2>
          <p className="section-desc">Look up key financial terms explained in plain language.</p>
        </div>

        <div className="glossary-search">
          <div className="search-wrap">
            <span className="search-icon">🔍</span>
            <input 
              type="search" 
              placeholder="Search terms..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="filter-tags">
            {['all', 'saving', 'investing', 'budgeting', 'general'].map(cat => (
              <button 
                key={cat}
                className={`filter-tag ${filter === cat ? 'active' : ''}`}
                onClick={() => setFilter(cat)}
              >
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="loading">Loading terms...</div>
        ) : (
          <div className="glossary-grid">
            {filteredTerms.map((t, i) => (
              <div key={i} className="glossary-card">
                <span className={`category-tag ${t.category}`}>{t.category}</span>
                <h3>{t.term}</h3>
                <p>{t.definition}</p>
              </div>
            ))}
          </div>
        )}

        {!loading && filteredTerms.length === 0 && (
          <div className="glossary-empty">
            <p>No terms match your search.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default Glossary;
