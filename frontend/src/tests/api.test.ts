import { describe, it, expect, vi } from 'vitest';

/**
 * API Service Tests
 * Tests the API service layer's error handling and response processing.
 */

describe('API Service', () => {
  const mockFetch = vi.fn();

  beforeEach(() => {
    vi.stubGlobal('fetch', mockFetch);
    mockFetch.mockClear();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  describe('fetchGlossary', () => {
    it('should return glossary data on successful fetch', async () => {
      const mockData = [
        { term: 'APY', category: 'saving', definition: 'Annual Percentage Yield' }
      ];
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockData),
      });

      const res = await fetch('/api/glossary');
      const data = await res.json();
      expect(data).toEqual(mockData);
      expect(data[0].term).toBe('APY');
    });

    it('should handle network errors gracefully', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      await expect(fetch('/api/glossary')).rejects.toThrow('Network error');
    });
  });

  describe('fetchQuiz', () => {
    it('should return quiz questions on successful fetch', async () => {
      const mockData = [
        {
          question: 'What is compound interest?',
          options: ['A', 'B', 'C', 'D'],
          correct: 2,
          explanation: 'Compound interest...'
        }
      ];
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockData),
      });

      const res = await fetch('/api/quiz');
      const data = await res.json();
      expect(data).toHaveLength(1);
      expect(data[0].options).toHaveLength(4);
      expect(data[0].correct).toBe(2);
    });
  });

  describe('advisor endpoint', () => {
    it('should send correct request format', async () => {
      const mockResponse = { response: 'Here is some advice...' };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const res = await fetch('/api/advisor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: 'How to save?', context: { topic: 'saving' } }),
      });
      const data = await res.json();

      expect(data.response).toBe('Here is some advice...');
      expect(mockFetch).toHaveBeenCalledWith('/api/advisor', expect.objectContaining({
        method: 'POST',
      }));
    });

    it('should handle rate limit (429) responses', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 429,
        statusText: 'Too Many Requests',
        json: () => Promise.resolve({ error: 'Too many requests' }),
      });

      const res = await fetch('/api/advisor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: 'test' }),
      });

      expect(res.ok).toBe(false);
      expect(res.status).toBe(429);
    });
  });

  describe('health check', () => {
    it('should return healthy status', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ status: 'healthy', timestamp: '2026-01-01T00:00:00Z' }),
      });

      const res = await fetch('/health');
      const data = await res.json();
      expect(data.status).toBe('healthy');
    });
  });
});
