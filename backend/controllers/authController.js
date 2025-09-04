const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');

const smsService = require('../services/smsService');
const { getPool } = require('../config/db');

// Validation rules
const registerValidation = [
  body('email').isEmail().normalizeEmail().withMessage('Please enter a valid email'),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters long'),
  body('firstName').trim().isLength({ min: 1 }).withMessage('First name is required'),
  body('lastName').trim().isLength({ min: 1 }).withMessage('Last name is required'),
  body('phone').optional({ checkFalsy: true }).isMobilePhone().withMessage('Please enter a valid phone number'),
  body('language').optional().isLength({ min: 2, max: 5 }).withMessage('Language code must be 2-5 characters'),
  body('businessType').trim().isLength({ min: 1 }).withMessage('Business type is required')
];

const loginValidation = [
  body('email').isEmail().normalizeEmail().withMessage('Please enter a valid email'),
  body('password').notEmpty().withMessage('Password is required')
];

const passwordResetValidation = [
  body('email').isEmail().normalizeEmail().withMessage('Please enter a valid email')
];

const newPasswordValidation = [
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters long'),
  body('token').notEmpty().withMessage('Reset token is required')
];

// Generate JWT token
const generateToken = (userId, isAdmin = false) => {
  return jwt.sign(
    { userId, isAdmin },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

// Register new user
exports.register = async (req, res) => {
  console.log('Register endpoint called');
  console.log('Request body:', req.body);
  try {
    // Validate input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('Validation errors:', errors.array());
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { 
      email, 
      password, 
      firstName, 
      lastName, 
      phone, 
      language, 
      businessType,
      // Address fields
      addressLine1,
      addressLine2,
      city,
      state,
      zipCode,
      // Demographics
      age,
      ethnicity,
      gender,
      // Business details
      employeeCount,
      yearsInBusiness,
      corporationType,
      // Financial information
      annualRevenue2022,
      annualRevenue2023,
      annualRevenue2024
    } = req.body;

    // Check if user already exists
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists'
      });
    }

    // Create user
    const user = await User.createUser({
      email,
      password,
      firstName,
      lastName,
      phone,
      language: language || 'en',
      businessType,
      // Address fields
      addressLine1,
      addressLine2,
      city,
      state,
      zipCode,
      // Demographics
      age: age ? parseInt(age) : null,
      ethnicity,
      gender,
      // Business details
      employeeCount: employeeCount ? parseInt(employeeCount) : null,
      yearsInBusiness: yearsInBusiness ? parseInt(yearsInBusiness) : null,
      corporationType,
      // Financial information
      annualRevenue2022: annualRevenue2022 ? parseFloat(annualRevenue2022) : null,
      annualRevenue2023: annualRevenue2023 ? parseFloat(annualRevenue2023) : null,
      annualRevenue2024: annualRevenue2024 ? parseFloat(annualRevenue2024) : null
    });

    // Email verification handled by Firebase
    console.log('User registered successfully. Email verification will be sent by Firebase.');

    // Send verification SMS if phone provided
    if (phone) {
      try {
        const verificationCode = smsService.generateVerificationCode();
        const pool = getPool();
        if (pool) {
          await pool.query(
            `INSERT INTO sms_verifications (user_id, phone, code, expires_at) 
             VALUES ($1, $2, $3, $4)`,
            [user.id, phone, verificationCode, new Date(Date.now() + 10 * 60 * 1000)] // 10 minutes
          );
        }
        await smsService.sendVerificationCode(phone, verificationCode);
      } catch (smsError) {
        console.error('Failed to send SMS verification:', smsError);
        // Don't fail registration if SMS fails
      }
    }

    res.status(201).json({
      success: true,
      message: 'User registered successfully. Please check your email to verify your account.',
      user: {
        id: user.id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        phone: user.phone,
        language: user.language,
        business_type: user.business_type,
        is_verified: user.is_verified,
        last_login: user.last_login,
        created_at: user.created_at,
        // Address fields
        address_line1: user.address_line1,
        address_line2: user.address_line2,
        city: user.city,
        state: user.state,
        zip_code: user.zip_code,
        // Demographics
        age: user.age,
        ethnicity: user.ethnicity,
        gender: user.gender,
        // Business details
        employee_count: user.employee_count,
        years_in_business: user.years_in_business,
        corporation_type: user.corporation_type,
        // Financial information
        annual_revenue_2022: user.annual_revenue_2022,
        annual_revenue_2023: user.annual_revenue_2023,
        annual_revenue_2024: user.annual_revenue_2024
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Registration failed. Please try again.'
    });
  }
};

// Login user
exports.login = async (req, res) => {
  try {
    // Validate input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { email, password } = req.body;

    // Find user
    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Check if account is locked
    if (user.locked_until && new Date() < new Date(user.locked_until)) {
      return res.status(423).json({
        success: false,
        message: 'Account is temporarily locked due to too many failed login attempts. Please try again later.'
      });
    }

    // Verify password
    const isValidPassword = await User.verifyPassword(password, user.password_hash);
    if (!isValidPassword) {
      // Increment login attempts
      await User.incrementLoginAttempts(user.id);
      
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Check if email is verified
    if (!user.is_verified) {
      return res.status(403).json({
        success: false,
        message: 'Please verify your email address before logging in',
        needsVerification: true
      });
    }

    // Update last login
    await User.updateLastLogin(user.id);

    // Generate token
    const token = generateToken(user.id, user.is_admin);

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        phone: user.phone,
        language: user.language,
        business_type: user.business_type,
        is_admin: user.is_admin,
        is_verified: user.is_verified,
        last_login: user.last_login,
        created_at: user.created_at,
        // Address fields
        address_line1: user.address_line1,
        address_line2: user.address_line2,
        city: user.city,
        state: user.state,
        zip_code: user.zip_code,
        // Demographics
        age: user.age,
        ethnicity: user.ethnicity,
        gender: user.gender,
        // Business details
        employee_count: user.employee_count,
        years_in_business: user.years_in_business,
        corporation_type: user.corporation_type,
        // Financial information
        annual_revenue_2022: user.annual_revenue_2022,
        annual_revenue_2023: user.annual_revenue_2023,
        annual_revenue_2024: user.annual_revenue_2024
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Login failed. Please try again.'
    });
  }
};

// Verify email
exports.verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;

    const user = await User.verifyEmail(token);
    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired verification token'
      });
    }

    // Welcome email handled by Firebase
    console.log('Email verified successfully. Welcome flow handled by Firebase.');

    res.json({
      success: true,
      message: 'Email verified successfully! You can now log in to your account.'
    });

  } catch (error) {
    console.error('Email verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Email verification failed. Please try again.'
    });
  }
};

// Resend email verification
exports.resendVerification = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.resendEmailVerification(email);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Email verification handled by Firebase
    console.log('Verification email will be sent by Firebase.');

    res.json({
      success: true,
      message: 'Verification email sent successfully'
    });

  } catch (error) {
    console.error('Resend verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to resend verification email. Please try again.'
    });
  }
};

// Request password reset
exports.forgotPassword = async (req, res) => {
  try {
    // Validate input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { email } = req.body;

    const user = await User.createPasswordResetToken(email);
    if (!user) {
      // Don't reveal if email exists or not
      return res.json({
        success: true,
        message: 'If an account with that email exists, a password reset link has been sent.'
      });
    }

    // Password reset email handled by Firebase
    console.log('Password reset email will be sent by Firebase.');

    res.json({
      success: true,
      message: 'If an account with that email exists, a password reset link has been sent.'
    });

  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process password reset request. Please try again.'
    });
  }
};

// Reset password
exports.resetPassword = async (req, res) => {
  try {
    // Validate input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { token, password } = req.body;

    const user = await User.resetPassword(token, password);
    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired reset token'
      });
    }

    res.json({
      success: true,
      message: 'Password reset successfully. You can now log in with your new password.'
    });

  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({
      success: false,
      message: 'Password reset failed. Please try again.'
    });
  }
};

// Get current user profile
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        phone: user.phone,
        language: user.language,
        business_type: user.business_type,
        is_admin: user.is_admin,
        is_verified: user.is_verified,
        last_login: user.last_login,
        created_at: user.created_at,
        // Address fields
        address_line1: user.address_line1,
        address_line2: user.address_line2,
        city: user.city,
        state: user.state,
        zip_code: user.zip_code,
        // Demographics
        age: user.age,
        ethnicity: user.ethnicity,
        gender: user.gender,
        // Business details
        employee_count: user.employee_count,
        years_in_business: user.years_in_business,
        corporation_type: user.corporation_type,
        // Financial information
        annual_revenue_2022: user.annual_revenue_2022,
        annual_revenue_2023: user.annual_revenue_2023,
        annual_revenue_2024: user.annual_revenue_2024
      }
    });

  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get profile. Please try again.'
    });
  }
};

// Update user profile
exports.updateProfile = async (req, res) => {
  try {
    const { firstName, lastName, phone, language, businessType } = req.body;

    const user = await User.updateProfile(req.user.userId, {
      firstName,
      lastName,
      phone,
      language,
      businessType
    });

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        id: user.id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        phone: user.phone,
        language: user.language,
        business_type: user.business_type,
        is_admin: user.is_admin,
        is_verified: user.is_verified,
        last_login: user.last_login,
        created_at: user.created_at,
        // Address fields
        address_line1: user.address_line1,
        address_line2: user.address_line2,
        city: user.city,
        state: user.state,
        zip_code: user.zip_code,
        // Demographics
        age: user.age,
        ethnicity: user.ethnicity,
        gender: user.gender,
        // Business details
        employee_count: user.employee_count,
        years_in_business: user.years_in_business,
        corporation_type: user.corporation_type,
        // Financial information
        annual_revenue_2022: user.annual_revenue_2022,
        annual_revenue_2023: user.annual_revenue_2023,
        annual_revenue_2024: user.annual_revenue_2024
      }
    });

  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update profile. Please try again.'
    });
  }
};

// Logout (client-side token removal)
exports.logout = async (req, res) => {
  try {
    // In a more sophisticated setup, you might want to blacklist the token
    // For now, we'll just return success and let the client remove the token
    res.json({
      success: true,
      message: 'Logged out successfully'
    });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      success: false,
      message: 'Logout failed. Please try again.'
    });
  }
};

// Admin: Get all users
exports.getAllUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;

    const result = await User.getAllUsers(page, limit);

    res.json({
      success: true,
      ...result
    });

  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get users. Please try again.'
    });
  }
};

// Admin: Delete user
exports.deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const deletedUser = await User.deleteUser(userId);
    if (!deletedUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found or cannot be deleted'
      });
    }

    res.json({
      success: true,
      message: 'User deleted successfully'
    });

  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete user. Please try again.'
    });
  }
};

// Admin: Create admin user
exports.createAdmin = async (req, res) => {
  try {
    const { email, password, firstName, lastName } = req.body;

    // Check if user already exists
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists'
      });
    }

    const adminUser = await User.createAdminUser({
      email,
      password,
      firstName,
      lastName
    });

    res.status(201).json({
      success: true,
      message: 'Admin user created successfully',
      user: {
        id: adminUser.id,
        email: adminUser.email,
        firstName: adminUser.first_name,
        lastName: adminUser.last_name,
        isAdmin: adminUser.is_admin
      }
    });

  } catch (error) {
    console.error('Create admin error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create admin user. Please try again.'
    });
  }
};

// Test endpoint to get user data by email (for debugging)
exports.getUserByEmail = async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      });
    }

    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        phone: user.phone,
        language: user.language,
        business_type: user.business_type,
        is_admin: user.is_admin,
        is_verified: user.is_verified,
        last_login: user.last_login,
        created_at: user.created_at,
        // Address fields
        address_line1: user.address_line1,
        address_line2: user.address_line2,
        city: user.city,
        state: user.state,
        zip_code: user.zip_code,
        // Demographics
        age: user.age,
        ethnicity: user.ethnicity,
        gender: user.gender,
        // Business details
        employee_count: user.employee_count,
        years_in_business: user.years_in_business,
        corporation_type: user.corporation_type,
        // Financial information
        annual_revenue_2022: user.annual_revenue_2022,
        annual_revenue_2023: user.annual_revenue_2023,
        annual_revenue_2024: user.annual_revenue_2024
      }
    });

  } catch (error) {
    console.error('Get user by email error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get user data. Please try again.'
    });
  }
};

// Update user language
exports.updateLanguage = async (req, res) => {
  try {
    const { language } = req.body;
    const userId = req.user?.userId;
    
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
    }
    
    if (!language) {
      return res.status(400).json({
        success: false,
        message: 'Language is required'
      });
    }
    
    // Update user language in database
    const pool = getPool();
    if (pool) {
      await pool.query(
        'UPDATE users SET language = $1, updated_at = NOW() WHERE id = $2',
        [language, userId]
      );
      
      console.log(`Updated user ${userId} language to: ${language}`);
      
      res.json({
        success: true,
        message: 'Language updated successfully',
        language: language
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Database not available'
      });
    }
    
  } catch (error) {
    console.error('Update language error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update language. Please try again.'
    });
  }
};

// Export validation rules
exports.registerValidation = registerValidation;
exports.loginValidation = loginValidation;
exports.passwordResetValidation = passwordResetValidation;
exports.newPasswordValidation = newPasswordValidation; 