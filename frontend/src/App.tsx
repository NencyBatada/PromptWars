import React, { Component, ErrorInfo, ReactNode } from 'react';
import Navbar from './components/Navbar/Navbar';
import Hero from './components/Hero/Hero';
import LearningModules from './components/LearningModules/LearningModules';
import Calculators from './components/Calculators/Calculators';
import BudgetPlanner from './components/BudgetPlanner/BudgetPlanner';
import Glossary from './components/Glossary/Glossary';
import Quiz from './components/Quiz/Quiz';
import Footer from './components/Footer/Footer';
import AIAdvisor from './components/AIAdvisor/AIAdvisor';

// --- Error Boundary ---
interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<{ children: ReactNode }, ErrorBoundaryState> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div
          role="alert"
          style={{
            padding: '60px 24px',
            textAlign: 'center',
            color: '#f0f0f5',
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#0a0a0f',
          }}
        >
          <h2>Something went wrong</h2>
          <p style={{ color: '#a0a0b8', marginTop: '12px', maxWidth: '480px' }}>
            We encountered an unexpected error. Please reload the page to try again.
          </p>
          <button
            onClick={() => window.location.reload()}
            style={{
              marginTop: '24px',
              padding: '12px 28px',
              background: 'linear-gradient(135deg, #6C63FF, #FF6B9D)',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              fontWeight: 600,
              cursor: 'pointer',
              fontSize: '1rem',
            }}
          >
            Reload Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

// --- Main App Component ---
const App: React.FC = () => {

  return (
    <ErrorBoundary>
      <div className="app">
        {/* Ambient Background */}
        <div className="ambient-bg" aria-hidden="true">
          <div className="orb orb-1"></div>
          <div className="orb orb-2"></div>
          <div className="orb orb-3"></div>
        </div>

        <Navbar />
        <main id="main-content" role="main">
          <Hero />
          <LearningModules />
          <Calculators />
          <BudgetPlanner />
          <Glossary />
          <Quiz />
        </main>
        <Footer />
        <AIAdvisor />
      </div>
    </ErrorBoundary>
  );
};


export default App;
