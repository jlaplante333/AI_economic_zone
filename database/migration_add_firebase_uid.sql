-- Add firebase_uid column to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS firebase_uid TEXT UNIQUE;

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_users_firebase_uid ON users(firebase_uid);

-- Update existing users to have a placeholder firebase_uid if they don't have one
-- This ensures the unique constraint doesn't break existing data
UPDATE users SET firebase_uid = 'legacy_' || id::text WHERE firebase_uid IS NULL;
