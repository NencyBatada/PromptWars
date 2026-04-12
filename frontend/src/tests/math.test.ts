import { describe, it, expect } from 'vitest';

describe('Financial Math Logic', () => {
  it('should calculate compound interest correctly', () => {
    const principal = 1000;
    const rate = 0.1; // 10%
    const years = 1;
    const monthly = 0;
    
    // Simple compound: P(1+r)^t
    const balance = principal * Math.pow(1 + rate, years);
    expect(balance).toBe(1100);
  });

  it('should handle zero interest growth', () => {
    const principal = 1000;
    const rate = 0;
    const years = 10;
    expect(principal * Math.pow(1 + rate, years)).toBe(1000);
  });
});
