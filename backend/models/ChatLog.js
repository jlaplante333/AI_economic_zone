const { getPool } = require('../config/db');

const logChat = async (userId, message, response) => {
  try {
    const pool = getPool();
    if (!pool) {
      console.log('Database not available, skipping chat log');
      return null;
    }
    
    const result = await pool.query(
      'INSERT INTO chat_logs (user_id, message, response) VALUES ($1, $2, $3) RETURNING *',
      [userId, message, response]
    );
    return result.rows[0];
  } catch (error) {
    console.log('Database not available, skipping chat log:', error.message);
    return null;
  }
};

const getChatsByUser = async (userId) => {
  try {
    const pool = getPool();
    if (!pool) {
      console.log('Database not available, returning empty chat history');
      return [];
    }
    
    const result = await pool.query('SELECT * FROM chat_logs WHERE user_id = $1 ORDER BY created_at DESC', [userId]);
    return result.rows;
  } catch (error) {
    console.log('Database not available, returning empty chat history:', error.message);
    return [];
  }
};

module.exports = { logChat, getChatsByUser }; 