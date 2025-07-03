const request = require('supertest');
const express = require('express');
const chatRoutes = require('../routes/chatRoutes');

// Mock the dependencies
jest.mock('../services/openaiService', () => ({
  getOpenAIResponse: jest.fn().mockResolvedValue('Mock OpenAI response')
}));

jest.mock('../services/translationService', () => ({
  translate: jest.fn().mockImplementation((text, from, to) => {
    if (from === to) return text;
    return `[${to}] ${text}`;
  })
}));

jest.mock('../models/ChatLog', () => ({
  logChat: jest.fn().mockResolvedValue({ id: 1 })
}));

const app = express();
app.use(express.json());
app.use('/api/chat', chatRoutes);

describe('POST /api/chat', () => {
  it('should return a translated response', async () => {
    const res = await request(app)
      .post('/api/chat')
      .send({ message: 'Hello', language: 'en', businessType: 'restaurant', userId: 1 });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('response');
    expect(typeof res.body.response).toBe('string');
  });
}); 