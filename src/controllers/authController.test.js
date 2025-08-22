require('dotenv').config({ path: '../.env' });
const request = require('supertest');
const express = require('express');
const authRoutes = require('../routes/authRoutes');

const app = express();
app.use(express.json());
app.use('/api/auth', authRoutes);

describe('POST /api/auth/login', () => {
  it('should return login endpoint works', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'test@example.com', password: 'test' });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('message', 'Login endpoint works!');
  });
}); 