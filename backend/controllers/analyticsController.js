const { getPool } = require('../config/db');

// Helper function to format timestamps into "time ago" format
const getTimeAgo = (timestamp) => {
  const now = new Date();
  const time = new Date(timestamp);
  const diffInSeconds = Math.floor((now - time) / 1000);
  
  if (diffInSeconds < 60) {
    return `${diffInSeconds} seconds ago`;
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  } else {
    const days = Math.floor(diffInSeconds / 86400);
    return `${days} day${days > 1 ? 's' : ''} ago`;
  }
};

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

// Get comprehensive analytics data
exports.getComprehensiveStats = async (req, res) => {
  try {
    console.log('🔍 Analytics: getComprehensiveStats called');
    
    const pool = getPool();
    console.log('🔍 Analytics: Database pool:', pool ? 'Available' : 'Not available');
    
    if (!pool) {
      console.log('🔍 Analytics: No database pool, returning mock data');
      return res.json({
        userStats: {
          totalUsers: 0,
          activeUsers: 0,
          newUsersThisWeek: 0,
          totalChats: 0,
          avgSessionDuration: '0 min',
          userSatisfaction: 0
        },
        businessTypeData: [],
        popularQuestions: [],
        dailyActivity: [],
        questionCategories: [],
        recentActivity: [],
        message: 'Analytics data (mock - database not available)'
      });
    }

    console.log('🔍 Analytics: Starting database queries...');

    // Get total users
    const totalUsersResult = await pool.query('SELECT COUNT(*) as total_users FROM users');
    const totalUsers = parseInt(totalUsersResult.rows[0].total_users);
    console.log('🔍 Analytics: Total users:', totalUsers);

    // Get active users (users who have chatted)
    const activeUsersResult = await pool.query('SELECT COUNT(DISTINCT user_id) as active_users FROM chat_logs WHERE user_id IS NOT NULL');
    const activeUsers = parseInt(activeUsersResult.rows[0].active_users);
    console.log('🔍 Analytics: Active users:', activeUsers);

    // Get new users this week
    const newUsersResult = await pool.query('SELECT COUNT(*) as new_users FROM users WHERE created_at >= NOW() - INTERVAL \'7 days\'');
    const newUsersThisWeek = parseInt(newUsersResult.rows[0].new_users);
    console.log('🔍 Analytics: New users this week:', newUsersThisWeek);

    // Get total chats
    const totalChatsResult = await pool.query('SELECT COUNT(*) as total_chats FROM chat_logs');
    const totalChats = parseInt(totalChatsResult.rows[0].total_chats);
    console.log('🔍 Analytics: Total chats:', totalChats);

    // Get business type distribution
    const businessTypeResult = await pool.query(`
      SELECT business_type, COUNT(*) as count 
      FROM users 
      WHERE business_type IS NOT NULL 
      GROUP BY business_type
      ORDER BY count DESC
    `);
    const businessTypeData = businessTypeResult.rows.map(row => ({
      name: row.business_type || 'Unknown',
      value: parseInt(row.count)
    }));
    console.log('🔍 Analytics: Business type data:', businessTypeData.length, 'types');

    // Get popular questions
    const popularQuestionsResult = await pool.query(`
      SELECT 
        message as question,
        COUNT(*) as count
      FROM chat_logs 
      WHERE message IS NOT NULL AND message != ''
      GROUP BY message
      ORDER BY count DESC
      LIMIT 10
    `);
    const popularQuestions = popularQuestionsResult.rows.map(row => ({
      question: row.question,
      count: parseInt(row.count)
    }));
    console.log('🔍 Analytics: Popular questions:', popularQuestions.length, 'questions');

    // Get daily activity for the last 7 days
    const dailyActivityResult = await pool.query(`
      SELECT 
        DATE(created_at) as date,
        COUNT(*) as chats
      FROM chat_logs 
      WHERE created_at >= NOW() - INTERVAL '7 days'
      GROUP BY DATE(created_at)
      ORDER BY date
    `);
    const dailyActivity = dailyActivityResult.rows.map(row => ({
      date: row.date,
      chats: parseInt(row.chats)
    }));
    console.log('🔍 Analytics: Daily activity:', dailyActivity.length, 'days');

    // Get question categories (mock data for now)
    const questionCategories = [
      { name: 'Business Setup', value: Math.floor(Math.random() * 50) + 10 },
      { name: 'Marketing', value: Math.floor(Math.random() * 30) + 5 },
      { name: 'Legal', value: Math.floor(Math.random() * 20) + 3 },
      { name: 'Financial', value: Math.floor(Math.random() * 40) + 8 },
      { name: 'Operations', value: Math.floor(Math.random() * 25) + 4 }
    ];

    // Get recent activity
    const recentActivityResult = await pool.query(`
      SELECT 
        'chat_started' as type,
        u.first_name,
        u.last_name,
        cl.created_at as timestamp,
        'Chat session started' as description
      FROM chat_logs cl
      JOIN users u ON cl.user_id = u.id
      WHERE cl.created_at >= NOW() - INTERVAL '24 hours'
        AND cl.message IS NOT NULL
      UNION ALL
      SELECT 
        'user_registered' as type,
        u.first_name,
        u.last_name,
        u.created_at as timestamp,
        'New user registered' as description
      FROM users u
      WHERE u.created_at >= NOW() - INTERVAL '24 hours'
      ORDER BY timestamp DESC
      LIMIT 10
    `);

    const recentActivity = recentActivityResult.rows.map(row => ({
      type: row.type,
      userName: `${row.first_name} ${row.last_name}`,
      timestamp: row.timestamp,
      description: row.description,
      timeAgo: getTimeAgo(row.timestamp)
    }));
    console.log('🔍 Analytics: Recent activity:', recentActivity.length, 'activities');

    console.log('🔍 Analytics: All queries completed successfully, sending response');
    
    res.json({
      userStats: {
        totalUsers,
        activeUsers,
        newUsersThisWeek,
        totalChats,
        avgSessionDuration: '0 min',
        userSatisfaction: 0
      },
      businessTypeData,
      popularQuestions,
      dailyActivity,
      questionCategories,
      recentActivity,
      message: 'Comprehensive analytics data retrieved successfully'
    });

  } catch (error) {
    console.error('❌ Comprehensive Analytics Error:', error);
    console.error('❌ Error stack:', error.stack);
    res.status(500).json({ error: 'Failed to fetch comprehensive analytics data' });
  }
};

// Get popular questions by business type
exports.getPopularQuestions = async (req, res) => {
  try {
    const pool = getPool();
    if (!pool) {
      return res.json({
        questions: [],
        message: 'Popular questions data (mock - database not available)'
      });
    }

    const { businessType } = req.query;
    let query = `
      SELECT 
        message as question,
        COUNT(*) as count,
        business_type
      FROM chat_logs 
      WHERE message IS NOT NULL AND message != ''
    `;
    
    const params = [];
    if (businessType) {
      query += ` AND business_type = $1`;
      params.push(businessType);
    }
    
    query += `
      GROUP BY message, business_type
      ORDER BY count DESC
      LIMIT 20
    `;

    const result = await pool.query(query, params);
    
    res.json({
      questions: result.rows.map(row => ({
        question: row.question,
        count: parseInt(row.count),
        businessType: row.business_type
      })),
      message: 'Popular questions retrieved successfully'
    });

  } catch (error) {
    console.error('Popular Questions Error:', error);
    res.status(500).json({ error: 'Failed to fetch popular questions' });
  }
}; 