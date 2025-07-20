-- Oakland AI Database Setup Script
-- This script creates the database, user, and initial schema

-- Connect as postgres superuser first
-- sudo -u postgres psql -f database/setup.sql

-- Create database (if it doesn't exist)
SELECT 'CREATE DATABASE oaklandai'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'oaklandai')\gexec

-- Create user (if it doesn't exist)
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_user WHERE usename = 'oaklandai_user') THEN
        CREATE USER oaklandai_user WITH PASSWORD 'your_secure_password_here';
    END IF;
END
$$;

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE oaklandai TO oaklandai_user;

-- Connect to the oaklandai database
\c oaklandai;

-- Grant schema privileges
GRANT ALL ON SCHEMA public TO oaklandai_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO oaklandai_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO oaklandai_user;

-- Set default privileges for future objects
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO oaklandai_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO oaklandai_user;

-- Create extensions if needed
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Run the main schema
\i database/schema.sql

-- Create initial admin user with proper password hash
-- Note: This will be updated by the application on first run
UPDATE users 
SET password_hash = '$2b$12$placeholder_hash_will_be_updated_by_app'
WHERE email = 'admin@oaklandai.com';

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email_lower ON users(LOWER(email));
CREATE INDEX IF NOT EXISTS idx_users_created_at ON users(created_at);
CREATE INDEX IF NOT EXISTS idx_chat_logs_business_type_language ON chat_logs(business_type, language);
CREATE INDEX IF NOT EXISTS idx_analytics_events_date ON analytics_events(created_at);

-- Create a function to clean up old data
CREATE OR REPLACE FUNCTION cleanup_old_data()
RETURNS void AS $$
BEGIN
    -- Delete chat logs older than 1 year
    DELETE FROM chat_logs WHERE created_at < CURRENT_DATE - INTERVAL '1 year';
    
    -- Delete analytics events older than 6 months
    DELETE FROM analytics_events WHERE created_at < CURRENT_DATE - INTERVAL '6 months';
    
    -- Delete old email verifications
    DELETE FROM email_verifications WHERE expires_at < CURRENT_TIMESTAMP;
    
    -- Delete old SMS verifications
    DELETE FROM sms_verifications WHERE expires_at < CURRENT_TIMESTAMP;
    
    -- Delete old user sessions
    DELETE FROM user_sessions WHERE expires_at < CURRENT_TIMESTAMP;
END;
$$ LANGUAGE plpgsql;

-- Create a function to get user statistics
CREATE OR REPLACE FUNCTION get_user_stats(user_id INTEGER)
RETURNS TABLE(
    total_chats BIGINT,
    first_chat TIMESTAMP,
    last_chat TIMESTAMP,
    avg_message_length NUMERIC,
    favorite_business_type TEXT,
    total_sessions BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COUNT(cl.id)::BIGINT as total_chats,
        MIN(cl.created_at) as first_chat,
        MAX(cl.created_at) as last_chat,
        ROUND(AVG(LENGTH(cl.message)), 2) as avg_message_length,
        (SELECT business_type FROM chat_logs 
         WHERE user_id = $1 
         GROUP BY business_type 
         ORDER BY COUNT(*) DESC 
         LIMIT 1) as favorite_business_type,
        COUNT(DISTINCT us.id)::BIGINT as total_sessions
    FROM chat_logs cl
    LEFT JOIN user_sessions us ON us.user_id = cl.user_id
    WHERE cl.user_id = $1;
END;
$$ LANGUAGE plpgsql;

-- Create a function to get daily analytics
CREATE OR REPLACE FUNCTION get_daily_analytics(days_back INTEGER DEFAULT 7)
RETURNS TABLE(
    date DATE,
    total_chats BIGINT,
    unique_users BIGINT,
    new_users BIGINT,
    active_sessions BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        DATE(cl.created_at) as date,
        COUNT(cl.id)::BIGINT as total_chats,
        COUNT(DISTINCT COALESCE(cl.user_id::text, cl.anonymous_id))::BIGINT as unique_users,
        COUNT(DISTINCT CASE WHEN u.created_at::date = DATE(cl.created_at) THEN u.id END)::BIGINT as new_users,
        COUNT(DISTINCT us.id)::BIGINT as active_sessions
    FROM chat_logs cl
    LEFT JOIN users u ON u.id = cl.user_id
    LEFT JOIN user_sessions us ON us.user_id = cl.user_id 
        AND DATE(us.created_at) = DATE(cl.created_at)
    WHERE cl.created_at >= CURRENT_DATE - (days_back || ' days')::INTERVAL
    GROUP BY DATE(cl.created_at)
    ORDER BY date DESC;
END;
$$ LANGUAGE plpgsql;

-- Grant execute permissions on functions
GRANT EXECUTE ON FUNCTION cleanup_old_data() TO oaklandai_user;
GRANT EXECUTE ON FUNCTION get_user_stats(INTEGER) TO oaklandai_user;
GRANT EXECUTE ON FUNCTION get_daily_analytics(INTEGER) TO oaklandai_user;

-- Create a view for admin dashboard
CREATE OR REPLACE VIEW admin_dashboard_stats AS
SELECT 
    (SELECT COUNT(*) FROM users WHERE is_verified = true) as verified_users,
    (SELECT COUNT(*) FROM users WHERE is_admin = true) as admin_users,
    (SELECT COUNT(*) FROM chat_logs WHERE created_at >= CURRENT_DATE) as today_chats,
    (SELECT COUNT(*) FROM chat_logs WHERE created_at >= CURRENT_DATE - INTERVAL '7 days') as weekly_chats,
    (SELECT COUNT(DISTINCT COALESCE(user_id::text, anonymous_id)) FROM chat_logs WHERE created_at >= CURRENT_DATE - INTERVAL '30 days') as monthly_active_users,
    (SELECT COUNT(*) FROM analytics_events WHERE created_at >= CURRENT_DATE - INTERVAL '24 hours') as daily_events;

-- Grant select on view
GRANT SELECT ON admin_dashboard_stats TO oaklandai_user;

-- Insert some sample data for testing
INSERT INTO users (email, password_hash, first_name, last_name, language, business_type, is_verified) VALUES 
  ('demo@oaklandai.com', '$2b$12$placeholder_hash_will_be_updated', 'Demo', 'User', 'en', 'restaurant', TRUE),
  ('test@oaklandai.com', '$2b$12$placeholder_hash_will_be_updated', 'Test', 'User', 'es', 'retail', TRUE)
ON CONFLICT (email) DO NOTHING;

-- Create a comment on the database
COMMENT ON DATABASE oaklandai IS 'Oakland AI Chatbot Database - Smart help for small businesses in Oakland';

-- Display setup completion message
SELECT 'Database setup completed successfully!' as status;
SELECT 'Database: ' || current_database() as database_name;
SELECT 'User: oaklandai_user' as database_user;
SELECT 'Tables created: ' || COUNT(*) as table_count FROM information_schema.tables WHERE table_schema = 'public'; 