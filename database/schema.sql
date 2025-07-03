-- Oakland AI Chatbot Database Schema

-- Users table
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email TEXT UNIQUE,
  password_hash TEXT,
  language TEXT DEFAULT 'en',
  business_type TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Chat logs table
CREATE TABLE chat_logs (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  message TEXT NOT NULL,
  response TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- FAQ interactions table
CREATE TABLE faq_interactions (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  faq_question TEXT NOT NULL,
  clicked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert some sample data
INSERT INTO users (email, language, business_type) VALUES 
  ('demo@oaklandai.com', 'en', 'restaurant'),
  ('test@oaklandai.com', 'es', 'retail');

-- Create indexes for better performance
CREATE INDEX idx_chat_logs_user_id ON chat_logs(user_id);
CREATE INDEX idx_chat_logs_created_at ON chat_logs(created_at);
CREATE INDEX idx_faq_interactions_user_id ON faq_interactions(user_id);
CREATE INDEX idx_faq_interactions_clicked_at ON faq_interactions(clicked_at); 