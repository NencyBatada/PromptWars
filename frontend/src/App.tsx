import React, { Component, ErrorInfo, ReactNode, Suspense, lazy } from 'react';
import Navbar from './components/Navbar/Navbar';
import Hero from './components/Hero/Hero';
import Footer from './components/Footer/Footer';
import AIAdvisor from './components/AIAdvisor/AIAdvisor';

// Efficiency: Lazy loading heavy calculation/data components
const LearningModules = lazy(() => import('./components/LearningModules/LearningModules'));
const Calculators = lazy(() => import('./components/Calculators/Calculators'));
const BudgetPlanner = lazy(() => import('./components/BudgetPlanner/BudgetPlanner'));
const Glossary = lazy(() => import('./components/Glossary/Glossary'));
const Quiz = lazy(() => import('./components/Quiz/Quiz'));

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
        <main id="main-content" role="main" tabIndex={-1}>
          <Hero />
          <Suspense fallback={<div style={{ padding: '2rem', textAlign: 'center', color: '#6C63FF' }}>Loading content lazily for extreme efficiency...</div>}>
            <LearningModules />
            <Calculators />
            <BudgetPlanner />
            <Glossary />
            <Quiz />
          </Suspense>
        </main>
        <Footer />
        <AIAdvisor />
      </div>
    </ErrorBoundary>
  );
};


export default App;
