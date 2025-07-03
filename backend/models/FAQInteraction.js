const { getPool } = require('../config/db');

const logInteraction = async (userId, faqQuestion) => {
  try {
    const pool = getPool();
    if (!pool) {
      console.log('Database not available, skipping FAQ interaction log');
      return null;
    }
    
    const result = await pool.query(
      'INSERT INTO faq_interactions (user_id, faq_question) VALUES ($1, $2) RETURNING *',
      [userId, faqQuestion]
    );
    return result.rows[0];
  } catch (error) {
    console.log('Database not available, skipping FAQ interaction log:', error.message);
    return null;
  }
};

const getInteractionsByUser = async (userId) => {
  try {
    const pool = getPool();
    if (!pool) {
      console.log('Database not available, returning empty FAQ interactions');
      return [];
    }
    
    const result = await pool.query('SELECT * FROM faq_interactions WHERE user_id = $1 ORDER BY clicked_at DESC', [userId]);
    return result.rows;
  } catch (error) {
    console.log('Database not available, returning empty FAQ interactions:', error.message);
    return [];
  }
};

module.exports = { logInteraction, getInteractionsByUser }; 