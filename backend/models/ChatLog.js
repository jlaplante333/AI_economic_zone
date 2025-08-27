const { getPool } = require('../config/db');
const { v4: uuidv4 } = require('uuid');

// Log chat with enhanced analytics support
const logChat = async (userId, message, response, options = {}) => {
  try {
    const pool = getPool();
    if (!pool) {
      console.log('Database not available, skipping chat log');
      return null;
    }
    
    console.log('=== LOGCHAT DEBUG ===');
    console.log('Saving chat message for user_id:', userId);
    console.log('Message:', message.substring(0, 50) + '...');
    console.log('Response:', response.substring(0, 50) + '...');
    console.log('Options:', options);
    
    const {
      anonymousId = null,
      businessType = null,
      language = 'en',
      sessionId = null,
      ipAddress = null,
      userAgent = null
    } = options;
    
    console.log('INSERT query parameters:');
    console.log('user_id:', userId);
    console.log('anonymous_id:', anonymousId);
    console.log('business_type:', businessType);
    console.log('language:', language);
    
    const result = await pool.query(
      `INSERT INTO chat_logs (
        user_id, anonymous_id, message, response, business_type, language, 
        session_id, ip_address, user_agent
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
      [userId, anonymousId, message, response, businessType, language, 
       sessionId, ipAddress, userAgent]
    );
    
    console.log('Chat message saved successfully. Row ID:', result.rows[0].id);
    console.log('Saved user_id:', result.rows[0].user_id);
    console.log('================================');
    
    return result.rows[0];
  } catch (error) {
    console.log('Database not available, skipping chat log:', error.message);
    return null;
  }
};

// Get chats by user (authenticated users)
const getChatsByUser = async (userId) => {
  try {
    const pool = getPool();
    if (!pool) {
      console.log('Database not available, returning empty chat history');
      return [];
    }
    
    console.log('=== DATABASE QUERY DEBUG ===');
    console.log('Querying chat_logs for user_id:', userId);
    console.log('Query: SELECT * FROM chat_logs WHERE user_id = $1 ORDER BY created_at DESC');
    console.log('Parameter:', [userId]);
    
    const result = await pool.query(
      'SELECT * FROM chat_logs WHERE user_id = $1 ORDER BY created_at DESC',
      [userId]
    );
    
    console.log('Query result rows:', result.rows.length);
    if (result.rows.length > 0) {
      console.log('First row user_id:', result.rows[0].user_id);
      console.log('First row message:', result.rows[0].message.substring(0, 50) + '...');
    }
    console.log('================================');
    
    return result.rows;
  } catch (error) {
    console.log('Database not available, returning empty chat history:', error.message);
    return [];
  }
};

// Get chats by anonymous ID (for unauthenticated users)
const getChatsByAnonymousId = async (anonymousId) => {
  try {
    const pool = getPool();
    if (!pool) {
      console.log('Database not available, returning empty chat history');
      return [];
    }
    
    const result = await pool.query(
      'SELECT * FROM chat_logs WHERE anonymous_id = $1 ORDER BY created_at DESC',
      [anonymousId]
    );
    return result.rows;
  } catch (error) {
    console.log('Database not available, returning empty chat history:', error.message);
    return [];
  }
};

// Get analytics data for admin (anonymous)
const getAnalyticsData = async (filters = {}) => {
  try {
    const pool = getPool();
    if (!pool) {
      console.log('Database not available, returning empty analytics');
      return {
        totalChats: 0,
        uniqueUsers: 0,
        businessTypes: [],
        languages: [],
        recentActivity: [],
        dailyStats: []
      };
    }
    
    const {
      startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
      endDate = new Date(),
      businessType = null,
      language = null
    } = filters;
    
    let whereClause = 'WHERE created_at BETWEEN $1 AND $2';
    let params = [startDate, endDate];
    let paramIndex = 3;
    
    if (businessType) {
      whereClause += ` AND business_type = $${paramIndex}`;
      params.push(businessType);
      paramIndex++;
    }
    
    if (language) {
      whereClause += ` AND language = $${paramIndex}`;
      params.push(language);
      paramIndex++;
    }
    
    // Total chats
    const totalChatsResult = await pool.query(
      `SELECT COUNT(*) as total FROM chat_logs ${whereClause}`,
      params
    );
    
    // Unique users (both authenticated and anonymous)
    const uniqueUsersResult = await pool.query(
      `SELECT COUNT(DISTINCT COALESCE(user_id::text, anonymous_id)) as unique_users 
       FROM chat_logs ${whereClause}`,
      params
    );
    
    // Business types distribution
    const businessTypesResult = await pool.query(
      `SELECT business_type, COUNT(*) as count 
       FROM chat_logs ${whereClause} 
       WHERE business_type IS NOT NULL 
       GROUP BY business_type 
       ORDER BY count DESC`,
      params
    );
    
    // Languages distribution
    const languagesResult = await pool.query(
      `SELECT language, COUNT(*) as count 
       FROM chat_logs ${whereClause} 
       GROUP BY language 
       ORDER BY count DESC`,
      params
    );
    
    // Recent activity (last 10 chats)
    const recentActivityResult = await pool.query(
      `SELECT 
         id, 
         COALESCE(user_id::text, anonymous_id) as user_identifier,
         business_type,
         language,
         LEFT(message, 100) as message_preview,
         created_at
       FROM chat_logs ${whereClause} 
       ORDER BY created_at DESC 
       LIMIT 10`,
      params
    );
    
    // Daily stats for the last 7 days
    const dailyStatsResult = await pool.query(
      `SELECT 
         DATE(created_at) as date,
         COUNT(*) as total_chats,
         COUNT(DISTINCT COALESCE(user_id::text, anonymous_id)) as unique_users
       FROM chat_logs 
       WHERE created_at >= CURRENT_DATE - INTERVAL '7 days'
       GROUP BY DATE(created_at)
       ORDER BY date DESC`,
      []
    );
    
    return {
      totalChats: parseInt(totalChatsResult.rows[0].total),
      uniqueUsers: parseInt(uniqueUsersResult.rows[0].unique_users),
      businessTypes: businessTypesResult.rows,
      languages: languagesResult.rows,
      recentActivity: recentActivityResult.rows,
      dailyStats: dailyStatsResult.rows
    };
  } catch (error) {
    console.log('Database not available, returning empty analytics:', error.message);
    return {
      totalChats: 0,
      uniqueUsers: 0,
      businessTypes: [],
      languages: [],
      recentActivity: [],
      dailyStats: []
    };
  }
};

// Get user engagement metrics
const getUserEngagement = async (userId) => {
  try {
    const pool = getPool();
    if (!pool) {
      console.log('Database not available, returning empty engagement data');
      return {
        totalChats: 0,
        firstChat: null,
        lastChat: null,
        averageMessageLength: 0,
        favoriteTopics: []
      };
    }
    
    // Get user's chat statistics
    const statsResult = await pool.query(
      `SELECT 
         COUNT(*) as total_chats,
         MIN(created_at) as first_chat,
         MAX(created_at) as last_chat,
         AVG(LENGTH(message)) as avg_message_length
       FROM chat_logs 
       WHERE user_id = $1`,
      [userId]
    );
    
    // Get favorite topics (business types)
    const topicsResult = await pool.query(
      `SELECT business_type, COUNT(*) as count 
       FROM chat_logs 
       WHERE user_id = $1 AND business_type IS NOT NULL 
       GROUP BY business_type 
       ORDER BY count DESC 
       LIMIT 5`,
      [userId]
    );
    
    const stats = statsResult.rows[0];
    
    return {
      totalChats: parseInt(stats.total_chats),
      firstChat: stats.first_chat,
      lastChat: stats.last_chat,
      averageMessageLength: Math.round(parseFloat(stats.avg_message_length) || 0),
      favoriteTopics: topicsResult.rows
    };
  } catch (error) {
    console.log('Database not available, returning empty engagement data:', error.message);
    return {
      totalChats: 0,
      firstChat: null,
      lastChat: null,
      averageMessageLength: 0,
      favoriteTopics: []
    };
  }
};

// Generate anonymous ID for unauthenticated users
const generateAnonymousId = () => {
  return `anon_${uuidv4().replace(/-/g, '')}`;
};

// Link anonymous chats to user account
const linkAnonymousChats = async (anonymousId, userId) => {
  try {
    const pool = getPool();
    if (!pool) {
      console.log('Database not available, skipping chat linking');
      return false;
    }
    
    const result = await pool.query(
      `UPDATE chat_logs 
       SET user_id = $1, anonymous_id = NULL 
       WHERE anonymous_id = $2`,
      [userId, anonymousId]
    );
    
    return result.rowCount > 0;
  } catch (error) {
    console.log('Database not available, skipping chat linking:', error.message);
    return false;
  }
};

// Delete old chat logs (for data cleanup)
const deleteOldChats = async (daysOld = 365) => {
  try {
    const pool = getPool();
    if (!pool) {
      console.log('Database not available, skipping chat cleanup');
      return 0;
    }
    
    const result = await pool.query(
      `DELETE FROM chat_logs 
       WHERE created_at < CURRENT_DATE - INTERVAL '${daysOld} days'`,
      []
    );
    
    return result.rowCount;
  } catch (error) {
    console.log('Database not available, skipping chat cleanup:', error.message);
    return 0;
  }
};

module.exports = {
  logChat,
  getChatsByUser,
  getChatsByAnonymousId,
  getAnalyticsData,
  getUserEngagement,
  generateAnonymousId,
  linkAnonymousChats,
  deleteOldChats
}; 