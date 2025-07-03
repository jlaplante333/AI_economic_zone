const { Pool } = require('pg');
require('dotenv').config({ path: '../.env' });

let pool = null;

const getPool = () => {
  if (!pool) {
    try {
      pool = new Pool({
        connectionString: process.env.DATABASE_URL,
      });
    } catch (error) {
      console.log('Database connection failed (this is OK for testing):', error.message);
      return null;
    }
  }
  return pool;
};

module.exports = { getPool }; 