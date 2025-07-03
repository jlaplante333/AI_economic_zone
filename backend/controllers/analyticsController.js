const { getPool } = require('../config/db');

exports.getStats = async (req, res) => {
  try {
    const pool = getPool();
    if (!pool) {
      // Return mock data if database is not available
      return res.json({
        totalChats: 0,
        activeUsers: 0,
        businessTypes: [],
        recentChats: 0,
        message: 'Analytics data (mock - database not available)'
      });
    }

    // Get total chats
    const chatResult = await pool.query('SELECT COUNT(*) as total_chats FROM chat_logs');
    const totalChats = parseInt(chatResult.rows[0].total_chats);

    // Get unique users
    const userResult = await pool.query('SELECT COUNT(DISTINCT user_id) as active_users FROM chat_logs');
    const activeUsers = parseInt(userResult.rows[0].active_users);

    // Get business types distribution
    const businessResult = await pool.query(`
      SELECT business_type, COUNT(*) as count 
      FROM users 
      WHERE business_type IS NOT NULL 
      GROUP BY business_type
    `);
    const businessTypes = businessResult.rows;

    // Get recent activity (last 7 days)
    const recentResult = await pool.query(`
      SELECT COUNT(*) as recent_chats 
      FROM chat_logs 
      WHERE created_at >= NOW() - INTERVAL '7 days'
    `);
    const recentChats = parseInt(recentResult.rows[0].recent_chats);

    res.json({
      totalChats,
      activeUsers,
      businessTypes,
      recentChats,
      message: 'Analytics data retrieved successfully'
    });
  } catch (error) {
    console.error('Analytics Error:', error);
    res.status(500).json({ error: 'Failed to fetch analytics data' });
  }
}; 