#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const { getPool } = require('./backend/config/db');
const User = require('./backend/models/User');

console.log('🚀 Oakland AI Setup Script');
console.log('========================\n');

async function checkEnvironment() {
  console.log('📋 Checking environment configuration...');
  
  const envPath = path.join(__dirname, '.env');
  if (!fs.existsSync(envPath)) {
    console.log('❌ .env file not found!');
    console.log('📝 Please create a .env file with the following variables:');
    console.log(`
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=oaklandai
DB_USER=oaklandai_user
DB_PASSWORD=your_secure_password

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_random
JWT_EXPIRES_IN=7d

# Email Configuration (Resend - Free Tier)
EMAIL_SERVICE=resend
RESEND_API_KEY=your_resend_api_key_here
EMAIL_FROM=noreply@oaklandai.com

# SMS Configuration (Twilio - Free Trial)
TWILIO_ACCOUNT_SID=your_twilio_account_sid_here
TWILIO_AUTH_TOKEN=your_twilio_auth_token_here
TWILIO_PHONE_NUMBER=your_twilio_phone_number_here

# Server Configuration
PORT=3000
NODE_ENV=development

# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key_here

# Security
BCRYPT_ROUNDS=12
SESSION_SECRET=your_session_secret_here

# Frontend URL
FRONTEND_URL=http://localhost:3001

# Admin Configuration
ADMIN_EMAIL=admin@oaklandai.com
ADMIN_PASSWORD=admin123456
    `);
    return false;
  }
  
  console.log('✅ .env file found');
  return true;
}

async function checkDatabase() {
  console.log('\n🗄️  Checking database connection...');
  
  try {
    const pool = getPool();
    if (!pool) {
      console.log('❌ Database connection failed!');
      console.log('📝 Please ensure PostgreSQL is running and configured correctly.');
      console.log('💡 Run: npm run db:migrate to set up the database');
      return false;
    }
    
    const result = await pool.query('SELECT NOW() as current_time');
    console.log('✅ Database connected successfully');
    console.log(`⏰ Database time: ${result.rows[0].current_time}`);
    return true;
  } catch (error) {
    console.log('❌ Database connection failed:', error.message);
    return false;
  }
}

async function setupAdminUser() {
  console.log('\n👤 Setting up admin user...');
  
  try {
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@oaklandai.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123456';
    
    // Check if admin user already exists
    const existingAdmin = await User.findByEmail(adminEmail);
    if (existingAdmin) {
      console.log('✅ Admin user already exists');
      return true;
    }
    
    // Create admin user
    const adminUser = await User.createAdminUser({
      email: adminEmail,
      password: adminPassword,
      firstName: 'Admin',
      lastName: 'User'
    });
    
    console.log('✅ Admin user created successfully');
    console.log(`📧 Email: ${adminEmail}`);
    console.log(`🔑 Password: ${adminPassword}`);
    console.log('⚠️  Please change the default password after first login!');
    
    return true;
  } catch (error) {
    console.log('❌ Failed to create admin user:', error.message);
    return false;
  }
}

async function checkDependencies() {
  console.log('\n📦 Checking dependencies...');
  
  const requiredDeps = [
    'express', 'pg', 'bcryptjs', 'jsonwebtoken', 'cors', 'helmet',
    'express-rate-limit', 'express-validator', 'nodemailer', 'resend', 'twilio'
  ];
  
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  const installedDeps = Object.keys(packageJson.dependencies || {});
  
  const missing = requiredDeps.filter(dep => !installedDeps.includes(dep));
  
  if (missing.length > 0) {
    console.log('❌ Missing dependencies:', missing.join(', '));
    console.log('💡 Run: npm install to install missing dependencies');
    return false;
  }
  
  console.log('✅ All required dependencies are installed');
  return true;
}

async function runTests() {
  console.log('\n🧪 Running basic tests...');
  
  try {
    // Test database connection
    const pool = getPool();
    if (pool) {
      await pool.query('SELECT 1 as test');
      console.log('✅ Database test passed');
    }
    
    // Test bcrypt
    const testHash = await bcrypt.hash('test', 10);
    const testVerify = await bcrypt.compare('test', testHash);
    if (testVerify) {
      console.log('✅ Password hashing test passed');
    }
    
    console.log('✅ All basic tests passed');
    return true;
  } catch (error) {
    console.log('❌ Tests failed:', error.message);
    return false;
  }
}

async function main() {
  console.log('Welcome to Oakland AI Setup!\n');
  
  const checks = [
    { name: 'Environment', fn: checkEnvironment },
    { name: 'Dependencies', fn: checkDependencies },
    { name: 'Database', fn: checkDatabase },
    { name: 'Admin User', fn: setupAdminUser },
    { name: 'Tests', fn: runTests }
  ];
  
  let allPassed = true;
  
  for (const check of checks) {
    const passed = await check.fn();
    if (!passed) {
      allPassed = false;
      console.log(`\n❌ ${check.name} check failed`);
    }
  }
  
  console.log('\n' + '='.repeat(50));
  
  if (allPassed) {
    console.log('🎉 Setup completed successfully!');
    console.log('\n🚀 Next steps:');
    console.log('1. Start the backend: npm run dev');
    console.log('2. Start the frontend: cd frontend && npm run dev');
    console.log('3. Access the application: http://localhost:3001');
    console.log('4. Login as admin: admin@oaklandai.com / admin123456');
    console.log('\n📚 For more information, see README.md');
  } else {
    console.log('❌ Setup incomplete. Please fix the issues above and run again.');
    console.log('\n💡 Common solutions:');
    console.log('- Create .env file with proper configuration');
    console.log('- Install dependencies: npm install');
    console.log('- Set up PostgreSQL database');
    console.log('- Run database migration: npm run db:migrate');
  }
  
  console.log('\n' + '='.repeat(50));
}

// Run setup
main().catch(error => {
  console.error('Setup failed:', error);
  process.exit(1);
}); 