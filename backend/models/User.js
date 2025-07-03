const { getPool } = require('../config/db');

const createUser = async ({ email, passwordHash, language, businessType }) => {
  try {
    const pool = getPool();
    if (!pool) {
      console.log('Database not available, skipping user creation');
      return null;
    }
    
    const result = await pool.query(
      'INSERT INTO users (email, password_hash, language, business_type) VALUES ($1, $2, $3, $4) RETURNING *',
      [email, passwordHash, language, businessType]
    );
    return result.rows[0];
  } catch (error) {
    console.log('Database not available, skipping user creation:', error.message);
    return null;
  }
};

const findByEmail = async (email) => {
  try {
    const pool = getPool();
    if (!pool) {
      console.log('Database not available, user not found');
      return null;
    }
    
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    return result.rows[0];
  } catch (error) {
    console.log('Database not available, user not found:', error.message);
    return null;
  }
};

const updateBusinessType = async (userId, businessType) => {
  try {
    const pool = getPool();
    if (!pool) {
      console.log('Database not available, skipping business type update');
      return null;
    }
    
    const result = await pool.query(
      'UPDATE users SET business_type = $1 WHERE id = $2 RETURNING *',
      [businessType, userId]
    );
    return result.rows[0];
  } catch (error) {
    console.log('Database not available, skipping business type update:', error.message);
    return null;
  }
};

module.exports = { createUser, findByEmail, updateBusinessType }; 