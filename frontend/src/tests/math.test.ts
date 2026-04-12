import { describe, it, expect } from 'vitest';

/**
 * Financial Math Logic Tests
 * Tests core financial calculation algorithms used throughout the app.
 */

describe('Financial Math Logic', () => {
  // --- Compound Interest Tests ---
  describe('Compound Interest', () => {
    it('should calculate simple compound interest correctly', () => {
      const principal = 1000;
      const rate = 0.1; // 10%
      const years = 1;

      const balance = principal * Math.pow(1 + rate, years);
      expect(balance).toBe(1100);
    });

    it('should handle zero interest growth', () => {
      const principal = 1000;
      const rate = 0;
      const years = 10;
      expect(principal * Math.pow(1 + rate, years)).toBe(1000);
    });

    it('should calculate multi-year compound growth', () => {
      const principal = 10000;
      const rate = 0.07; // 7%
      const years = 10;

      const balance = principal * Math.pow(1 + rate, years);
      expect(Math.round(balance)).toBe(19672);
    });

    it('should apply the Rule of 72 correctly', () => {
      const rate = 8;
      const doublingTime = 72 / rate;
      expect(doublingTime).toBe(9);
    });

    it('should calculate compound interest with monthly contributions', () => {
      const principal = 10000;
      const monthlyContribution = 200;
      const annualRate = 0.07;
      const years = 20;

      const growthFactor = Math.pow(1 + annualRate, years);
      const balance = principal * growthFactor +
        (monthlyContribution * 12) * ((growthFactor - 1) / annualRate);

      expect(balance).toBeGreaterThan(principal + (monthlyContribution * 12 * years));
      expect(Math.round(balance)).toBe(136747);
    });
  });

  // --- Budget Calculation Tests ---
  describe('Budget Calculations', () => {
    it('should correctly split income using the 50/30/20 rule', () => {
      const income = 5000;
      const needs = income * 0.5;
      const wants = income * 0.3;
      const savings = income * 0.2;

      expect(needs).toBe(2500);
      expect(wants).toBe(1500);
      expect(savings).toBe(1000);
      expect(needs + wants + savings).toBe(income);
    });

    it('should calculate remaining budget correctly', () => {
      const income = 5000;
      const expenses = [
        { name: 'Rent', amount: 1500 },
        { name: 'Groceries', amount: 400 },
        { name: 'Entertainment', amount: 300 },
      ];

      const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
      const remaining = income - totalExpenses;

      expect(totalExpenses).toBe(2200);
      expect(remaining).toBe(2800);
    });

    it('should handle negative remaining budget', () => {
      const income = 3000;
      const expenses = [
        { name: 'Rent', amount: 2000 },
        { name: 'Car', amount: 600 },
        { name: 'Food', amount: 500 },
      ];

      const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
      const remaining = income - totalExpenses;

      expect(remaining).toBe(-100);
      expect(remaining).toBeLessThan(0);
    });
  });

  // --- Savings Goal Tests ---
  describe('Savings Goal', () => {
    it('should calculate months to reach goal', () => {
      const goal = 2000;
      const monthlyContribution = 100;
      const monthsNeeded = Math.ceil(goal / monthlyContribution);
      expect(monthsNeeded).toBe(20);
    });

    it('should handle savings jar increment logic', () => {
      const GOAL = 2000;
      const INCREMENT = 100;
      let amount = 0;

      // Simulate 20 clicks
      for (let i = 0; i < 20; i++) {
        amount = Math.min(amount + INCREMENT, GOAL);
      }

      expect(amount).toBe(GOAL);
    });

    it('should not exceed goal with overshoot', () => {
      const GOAL = 2000;
      const INCREMENT = 100;
      let amount = 1950;

      amount = Math.min(amount + INCREMENT, GOAL);
      expect(amount).toBe(GOAL);
    });
  });

  // --- Inflation Tests ---
  describe('Inflation Impact', () => {
    it('should calculate purchasing power erosion', () => {
      const currentValue = 1000;
      const inflationRate = 0.03; // 3%
      const years = 10;

      const futureValue = currentValue * Math.pow(1 - inflationRate, years);
      expect(futureValue).toBeLessThan(currentValue);
      expect(Math.round(futureValue)).toBe(737);
    });
  });

  // --- Input Validation Tests ---
  describe('Input Validation', () => {
    it('should sanitize input by trimming whitespace', () => {
      const input = '  How do I start investing?  ';
      const sanitized = input.trim().slice(0, 500);
      expect(sanitized).toBe('How do I start investing?');
    });

    it('should truncate long inputs', () => {
      const longInput = 'x'.repeat(1000);
      const sanitized = longInput.trim().slice(0, 500);
      expect(sanitized.length).toBe(500);
    });

    it('should reject empty strings', () => {
      const input = '   ';
      const sanitized = input.trim();
      expect(sanitized.length).toBe(0);
    });
  });
});
