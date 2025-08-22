require('dotenv').config({ path: '../.env' });
const request = require('supertest');
const express = require('express');
const jwt = require('jsonwebtoken');

// Mock the database
const mockPool = {
  query: jest.fn()
    .mockResolvedValueOnce({ rows: [{ total_chats: '10' }] }) // total chats
    .mockResolvedValueOnce({ rows: [{ active_users: '5' }] }) // active users
    .mockResolvedValueOnce({ rows: [{ business_type: 'restaurant', count: '3' }] }) // business types
    .mockResolvedValueOnce({ rows: [{ recent_chats: '3' }] }) // recent chats
};

jest.mock('../config/db', () => ({
  getPool: jest.fn().mockReturnValue(mockPool)
}));

const analyticsRoutes = require('../routes/analyticsRoutes');

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