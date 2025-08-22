const { Pool } = require('pg');
require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });

let pool = null;

const getPool = () => {
  if (!pool) {
    try {
      let config;
      
      // Check if we have a DATABASE_URL (Render style)
      if (process.env.DATABASE_URL) {
        console.log('Using DATABASE_URL for database connection');
        config = {
          connectionString: process.env.DATABASE_URL,
          ssl: {
            rejectUnauthorized: false
          }
        };
      } else {
        // Fallback to individual environment variables
        console.log('Using individual DB environment variables');
        config = {
          host: process.env.DB_HOST || 'localhost',
          port: process.env.DB_PORT || 5432,
          database: process.env.DB_NAME || 'oaklandai',
          user: process.env.DB_USER || 'oaklandai_user',
          password: process.env.DB_PASSWORD,
        };

        // Validate required configuration
        if (!config.password) {
          console.log('Database password not configured, skipping database connection');
          return null;
        }
      }

      pool = new Pool(config);
      
      // Test the connection
      pool.on('connect', () => {
        console.log('Connected to PostgreSQL database');
      });
      
      pool.on('error', (err) => {
        console.error('Unexpected error on idle client', err);
        pool = null;
      });
      
    } catch (error) {
      console.log('Database connection failed:', error.message);
      return null;
    }
  }
  return pool;
};

module.exports = { getPool }; 