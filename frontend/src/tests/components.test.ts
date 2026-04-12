import { describe, it, expect } from 'vitest';


/**
 * Component Render Tests
 * Validates that components export valid React components and basic rendering logic.
 */

describe('Component Exports', () => {
  it('App exports a valid React component', async () => {
    const { default: App } = await import('../App');
    expect(App).toBeDefined();
    expect(typeof App).toBe('function');
  });

  it('Navbar exports a valid React component', async () => {
    const { default: Navbar } = await import('../components/Navbar/Navbar');
    expect(Navbar).toBeDefined();
    expect(typeof Navbar).toBe('function');
  });

  it('Hero exports a valid React component', async () => {
    const { default: Hero } = await import('../components/Hero/Hero');
    expect(Hero).toBeDefined();
    expect(typeof Hero).toBe('function');
  });

  it('LearningModules exports a valid React component', async () => {
    const { default: LearningModules } = await import('../components/LearningModules/LearningModules');
    expect(LearningModules).toBeDefined();
    expect(typeof LearningModules).toBe('function');
  });

  it('Calculators exports a valid React component', async () => {
    const { default: Calculators } = await import('../components/Calculators/Calculators');
    expect(Calculators).toBeDefined();
    expect(typeof Calculators).toBe('function');
  });

  it('BudgetPlanner exports a valid React component', async () => {
    const { default: BudgetPlanner } = await import('../components/BudgetPlanner/BudgetPlanner');
    expect(BudgetPlanner).toBeDefined();
    expect(typeof BudgetPlanner).toBe('function');
  });

  it('Glossary exports a valid React component', async () => {
    const { default: Glossary } = await import('../components/Glossary/Glossary');
    expect(Glossary).toBeDefined();
    expect(typeof Glossary).toBe('function');
  });

  it('Quiz exports a valid React component', async () => {
    const { default: Quiz } = await import('../components/Quiz/Quiz');
    expect(Quiz).toBeDefined();
    expect(typeof Quiz).toBe('function');
  });

  it('Footer exports a valid React component', async () => {
    const { default: Footer } = await import('../components/Footer/Footer');
    expect(Footer).toBeDefined();
    expect(typeof Footer).toBe('function');
  });

  it('AIAdvisor exports a valid React component', async () => {
    const { default: AIAdvisor } = await import('../components/AIAdvisor/AIAdvisor');
    expect(AIAdvisor).toBeDefined();
    expect(typeof AIAdvisor).toBe('function');
  });
});

describe('API Service Exports', () => {
  it('should export all API functions', async () => {
    const api = await import('../services/api');
    expect(api.fetchGlossary).toBeDefined();
    expect(api.fetchQuiz).toBeDefined();
    expect(api.fetchAdvisorResponse).toBeDefined();
    expect(api.fetchHistory).toBeDefined();
    expect(typeof api.fetchGlossary).toBe('function');
    expect(typeof api.fetchQuiz).toBe('function');
    expect(typeof api.fetchAdvisorResponse).toBe('function');
    expect(typeof api.fetchHistory).toBe('function');
  });

  it('should export type interfaces', async () => {
    const api = await import('../services/api');
    // Verify ApiError class is exported
    expect(api.ApiError).toBeDefined();
  });
});
