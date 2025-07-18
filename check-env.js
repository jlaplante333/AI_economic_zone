#!/usr/bin/env node

/**
 * Environment validation script
 * Checks if all required environment variables are properly loaded
 */

const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv');

console.log('🔍 Checking environment configuration...\n');

// Load environment variables from root .env file
const envPath = path.join(__dirname, '.env');
if (fs.existsSync(envPath)) {
  console.log('✅ .env file found at:', envPath);
  dotenv.config({ path: envPath });
} else {
  console.error('❌ .env file not found at:', envPath);
  console.error('Please create a .env file in the root directory');
  process.exit(1);
}

// Check required environment variables
const requiredEnvVars = [
  'OPENAI_API_KEY',
  'JWT_SECRET'
];

const optionalEnvVars = [
  'DATABASE_URL',
  'PORT',
  'NODE_ENV',
  'SPEECH_API_KEY',
  'TRANSLATION_API_KEY'
];

console.log('\n📋 Required Environment Variables:');
let allRequiredPresent = true;

requiredEnvVars.forEach(varName => {
  const value = process.env[varName];
  if (value) {
    // Mask sensitive values
    const displayValue = varName.includes('KEY') || varName.includes('SECRET') 
      ? value.substring(0, 8) + '...' 
      : value;
    console.log(`  ✅ ${varName}: ${displayValue}`);
  } else {
    console.log(`  ❌ ${varName}: MISSING`);
    allRequiredPresent = false;
  }
});

console.log('\n📋 Optional Environment Variables:');
optionalEnvVars.forEach(varName => {
  const value = process.env[varName];
  if (value) {
    console.log(`  ✅ ${varName}: ${value}`);
  } else {
    console.log(`  ⚠️  ${varName}: Not set (using default)`);
  }
});

console.log('\n🔧 Environment Configuration:');
console.log(`  NODE_ENV: ${process.env.NODE_ENV || 'development'}`);
console.log(`  PORT: ${process.env.PORT || '3001'}`);

if (allRequiredPresent) {
  console.log('\n🎉 All required environment variables are set!');
  console.log('You can now start the application with:');
  console.log('  npm run start:all');
} else {
  console.log('\n❌ Some required environment variables are missing.');
  console.log('Please add them to your .env file and try again.');
  process.exit(1);
} 