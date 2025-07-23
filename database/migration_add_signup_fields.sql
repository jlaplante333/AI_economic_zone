-- Migration to add comprehensive signup fields to users table
-- Run this with: psql -U oaklandai_user -d oaklandai -f database/migration_add_signup_fields.sql

-- Add address fields
ALTER TABLE users ADD COLUMN IF NOT EXISTS address_line1 TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS address_line2 TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS city TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS state TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS zip_code TEXT;

-- Add demographics fields
ALTER TABLE users ADD COLUMN IF NOT EXISTS age INTEGER;
ALTER TABLE users ADD COLUMN IF NOT EXISTS ethnicity TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS gender TEXT;

-- Add business details fields
ALTER TABLE users ADD COLUMN IF NOT EXISTS employee_count INTEGER;
ALTER TABLE users ADD COLUMN IF NOT EXISTS years_in_business INTEGER;
ALTER TABLE users ADD COLUMN IF NOT EXISTS corporation_type TEXT;

-- Add financial information fields
ALTER TABLE users ADD COLUMN IF NOT EXISTS annual_revenue_2022 DECIMAL(15,2);
ALTER TABLE users ADD COLUMN IF NOT EXISTS annual_revenue_2023 DECIMAL(15,2);
ALTER TABLE users ADD COLUMN IF NOT EXISTS annual_revenue_2024 DECIMAL(15,2);

-- Verify the changes
\d users; 