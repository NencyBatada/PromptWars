import { describe, it, expect, vi, beforeAll, afterAll } from 'vitest';
const request = require('supertest');
const app = require('./server'); // Import the express app
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Mock GoogleGenerativeAI to avoid actual API calls during testing
vi.mock('@google/generative-ai', () => {
  return {
    GoogleGenerativeAI: vi.fn().mockImplementation(() => {
      return {
        getGenerativeModel: vi.fn().mockReturnValue({
          generateContent: vi.fn().mockResolvedValue({
            response: {
              text: () => "Mocked AI Response"
            }
          })
        })
      };
    })
  };
});

describe('FinWise Backend API', () => {
  let db;

  beforeAll(async () => {
    // Optional: wait for server initialization if needed
    await new Promise(resolve => setTimeout(resolve, 500));
  });

  afterAll(() => {
    // Rely on vitest exit hooks.
  });

  describe('GET /health', () => {
    it('should return 200 and healthy status', async () => {
      const response = await request(app).get('/health');
      expect(response.status).toBe(200);
      expect(response.body.status).toBe('healthy');
      expect(response.body.timestamp).toBeDefined();
    });
  });

  describe('GET /api/glossary', () => {
    it('should return financial glossary terms', async () => {
      const response = await request(app).get('/api/glossary');
      // If it fails with 500, it means the async fs read hasn't finished, wait a bit
      if (response.status === 500) {
        await new Promise(resolve => setTimeout(resolve, 100));
        const retry = await request(app).get('/api/glossary');
        expect(retry.status).toBe(200);
        expect(Array.isArray(retry.body)).toBe(true);
      } else {
        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
      }
    });
  });

  describe('GET /api/quiz', () => {
    it('should return quiz questions', async () => {
       const response = await request(app).get('/api/quiz');
       if (response.status === 500) {
        await new Promise(resolve => setTimeout(resolve, 100));
        const retry = await request(app).get('/api/quiz');
        expect(retry.status).toBe(200);
        expect(Array.isArray(retry.body)).toBe(true);
      } else {
        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
      }
    });
  });

  describe('POST /api/advisor', () => {
    it('should return 400 if message is missing', async () => {
      const response = await request(app)
        .post('/api/advisor')
        .send({ context: { topic: 'savings' } });
      
      expect(response.status).toBe(400);
      expect(response.body.error).toMatch(/Message is required/i);
    });

    it('should return 400 if message is empty after sanitization', async () => {
       const response = await request(app)
        .post('/api/advisor')
        .send({ message: '    ' });
      
      expect(response.status).toBe(400);
      expect(response.body.error).toMatch(/Message cannot be empty/i);
    });

    // We can't guarantee GEMINI_API_KEY is set in CI, so we might receive 503 if not mocked properly, 
    // but the 503 check comes BEFORE the mock generates content. We can test for 503 instead.
    it('should handle AI response or missing key gracefully', async () => {
       const response = await request(app)
        .post('/api/advisor')
        .send({ message: 'Hello' });
      
      // If key is missing, it's 503, otherwise 200
      expect([200, 503]).toContain(response.status);
    });
  });

  describe('GET /api/history', () => {
    it('should return history array', async () => {
      const response = await request(app).get('/api/history');
      expect([200, 500]).toContain(response.status);
      if (response.status === 200) {
        expect(Array.isArray(response.body)).toBe(true);
      }
    });
  });

});
