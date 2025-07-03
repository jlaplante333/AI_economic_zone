const request = require('supertest');
const express = require('express');
const jwt = require('jsonwebtoken');
const analyticsRoutes = require('../routes/analyticsRoutes');

// Mock the database
jest.mock('../config/db', () => ({
  query: jest.fn().mockResolvedValue({
    rows: [
      { total_chats: '10' },
      { active_users: '5' },
      { recent_chats: '3' }
    ]
  })
}));

const app = express();
app.use(express.json());
app.use('/api/analytics', analyticsRoutes);

describe('GET /api/analytics/stats', () => {
  it('should return analytics data', async () => {
    const token = jwt.sign({ userId: 1 }, process.env.JWT_SECRET || 'secret');
    const res = await request(app)
      .get('/api/analytics/stats')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('totalChats');
    expect(res.body).toHaveProperty('activeUsers');
    expect(res.body).toHaveProperty('message');
  });
}); 