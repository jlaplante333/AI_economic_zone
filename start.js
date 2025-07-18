#!/usr/bin/env node

/**
 * Startup script to ensure environment variables are properly loaded
 * This script should be run from the root directory
 */

const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv');

// Load environment variables from root .env file
const envPath = path.join(__dirname, '.env');
if (fs.existsSync(envPath)) {
  console.log('Loading environment variables from:', envPath);
  dotenv.config({ path: envPath });
} else {
  console.warn('Warning: .env file not found in root directory');
  console.warn('Please create a .env file in the root directory with your configuration');
}

// Verify required environment variables
const requiredEnvVars = [
  'OPENAI_API_KEY',
  'DATABASE_URL',
  'JWT_SECRET'
];

const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingVars.length > 0) {
  console.error('Missing required environment variables:', missingVars);
  console.error('Please add them to your .env file');
  process.exit(1);
}

console.log('Environment variables loaded successfully');
console.log('Starting applications...');

// Start PM2 with the ecosystem config
const { spawn } = require('child_process');
const pm2 = spawn('pm2', ['start', 'ecosystem.config.js'], {
  stdio: 'inherit',
  shell: true
});

pm2.on('close', (code) => {
  console.log(`PM2 process exited with code ${code}`);
  process.exit(code);
}); 