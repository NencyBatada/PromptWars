import React from 'react';
import Navbar from './components/Navbar/Navbar';
import Hero from './components/Hero/Hero';
import LearningModules from './components/LearningModules/LearningModules';
import Calculators from './components/Calculators/Calculators';
import BudgetPlanner from './components/BudgetPlanner/BudgetPlanner';
import Glossary from './components/Glossary/Glossary';
import Quiz from './components/Quiz/Quiz';
import Footer from './components/Footer/Footer';

const App = () => {
  return (
    <div className="app">
      {/* Ambient Background */}
      <div className="ambient-bg" aria-hidden="true">
        <div className="orb orb-1"></div>
        <div className="orb orb-2"></div>
        <div className="orb orb-3"></div>
      </div>

      <Navbar />
      <main>
        <Hero />
        <LearningModules />
        <Calculators />
        <BudgetPlanner />
        <Glossary />
        <Quiz />
      </main>
      <Footer />
    </div>
  );
};

export default App;
