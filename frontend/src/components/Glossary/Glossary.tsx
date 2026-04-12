import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchGlossary, GlossaryTerm } from '../../services/api';
import './Glossary.css';

const CATEGORIES = ['all', 'saving', 'investing', 'budgeting', 'general'] as const;

const Glossary: React.FC = () => {
  const [terms, setTerms] = useState<GlossaryTerm[]>([]);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchGlossary()
      .then(data => {
        setTerms(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load glossary:', err);
        setError('Unable to load glossary terms. Please try again later.');
        setLoading(false);
      });
  }, []);

  // Debounce search input for efficiency
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(timer);
  }, [search]);

  const filteredTerms = useMemo(() => {
    return terms.filter(t => {
      const matchesSearch = t.term.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
                           t.definition.toLowerCase().includes(debouncedSearch.toLowerCase());
      const matchesFilter = filter === 'all' || t.category === filter;
      return matchesSearch && matchesFilter;
    });
  }, [terms, debouncedSearch, filter]);

  const handleFilterChange = useCallback((cat: string) => {
    setFilter(cat);
  }, []);

  return (
    <section id="glossary" className="section glossary-section" aria-labelledby="glossaryTitle">
      <div className="container">
        <div className="section-header">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="section-tag"
          >
            Reference
          </motion.span>
          <h2 id="glossaryTitle" className="section-title">Financial Glossary</h2>
          <p className="section-desc">Look up key financial terms explained in plain language.</p>
        </div>

        <div className="glossary-search">
          <div className="search-wrap">
            <span className="search-icon" aria-hidden="true">🔍</span>
            <input
              id="glossarySearch"
              type="search"
              aria-label="Search financial glossary terms"
              placeholder="Search terms..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="filter-tags" role="tablist" aria-label="Filter by category">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                role="tab"
                aria-selected={filter === cat}
                id={`glossaryFilter-${cat}`}
                className={`filter-tag ${filter === cat ? 'active' : ''}`}
                onClick={() => handleFilterChange(cat)}
              >
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {error && (
          <div className="glossary-error" role="alert">
            <p>{error}</p>
          </div>
        )}

        {loading ? (
          <div className="loading" aria-live="polite" role="status">Loading terms...</div>
        ) : (
          <motion.div
            layout
            className="glossary-grid"
            role="list"
            aria-live="polite"
          >
            <AnimatePresence mode='popLayout'>
              {filteredTerms.map((t) => (
                <motion.div
                  key={t.term}
                  role="listitem"
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                  className="glossary-card"
                >
                  <span className={`category-tag ${t.category}`}>{t.category}</span>
                  <h3>{t.term}</h3>
                  <p>{t.definition}</p>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {!loading && !error && filteredTerms.length === 0 && (
          <div className="glossary-empty" aria-live="assertive" role="status">
            <p>No terms match your search.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default Glossary;
