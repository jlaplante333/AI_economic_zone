const express = require('express');
const router = express.Router();
const admin = require('../lib/firebaseAdmin');
const { getPool } = require('../config/db');
const { body, validationResult } = require('express-validator');

// Middleware to verify Firebase ID token
const verifyFirebaseToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'No token provided' });
    }

    const token = authHeader.split('Bearer ')[1];
    const decodedToken = await admin.auth().verifyIdToken(token);
    
    req.user = {
      uid: decodedToken.uid,
      email: decodedToken.email,
      emailVerified: decodedToken.email_verified
    };
    
    next();
  } catch (error) {
    console.error('Token verification error:', error);
    return res.status(401).json({ success: false, message: 'Invalid token' });
  }
};

// Firebase signup - create user profile in database
router.post('/firebase-signup', [
  body('firebaseUid').notEmpty().withMessage('Firebase UID is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('firstName').notEmpty().withMessage('First name is required'),
  body('lastName').notEmpty().withMessage('Last name is required'),
  body('businessType').notEmpty().withMessage('Business type is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { firebaseUid, email, firstName, lastName, businessType, ...otherFields } = req.body;
    const pool = getPool();

    if (!pool) {
      return res.status(500).json({
        success: false,
        message: 'Database connection failed'
      });
    }

    // Check if user already exists
    const existingUser = await pool.query(
      'SELECT id FROM users WHERE email = $1 OR firebase_uid = $2',
      [email, firebaseUid]
    );

    if (existingUser.rows.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'User already exists'
      });
    }

    // Create user profile
    const result = await pool.query(
      `INSERT INTO users (
        firebase_uid, email, password_hash, first_name, last_name, business_type,
        address_line1, address_line2, city, state, zip_code,
        age, ethnicity, gender, employee_count, years_in_business,
        corporation_type, annual_revenue_2022, annual_revenue_2023, annual_revenue_2024,
        is_verified, created_at, updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, NOW(), NOW())
      RETURNING id, email, first_name, last_name, business_type, is_verified`,
      [
        firebaseUid, email, 'firebase_auth_' + firebaseUid, firstName, lastName, businessType,
        otherFields.addressLine1 || null, otherFields.addressLine2 || null,
        otherFields.city || null, otherFields.state || null, otherFields.zipCode || null,
        otherFields.age ? parseInt(otherFields.age) : null,
        otherFields.ethnicity || null, otherFields.gender || null,
        otherFields.employeeCount ? parseInt(otherFields.employeeCount) : null,
        otherFields.yearsInBusiness ? parseInt(otherFields.yearsInBusiness) : null,
        otherFields.corporationType || null,
        otherFields.annualRevenue2022 ? parseFloat(otherFields.annualRevenue2022) : null,
        otherFields.annualRevenue2023 ? parseFloat(otherFields.annualRevenue2023) : null,
        otherFields.annualRevenue2024 ? parseFloat(otherFields.annualRevenue2024) : null,
        true // is_verified since Firebase handles email verification
      ]
    );

    res.status(201).json({
      success: true,
      message: 'User profile created successfully',
      user: result.rows[0]
    });

  } catch (error) {
    console.error('Firebase signup error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create user profile'
    });
  }
});

// Link Firebase UID to existing profile
router.post('/link-firebase-uid', [
  body('firebaseUid').notEmpty().withMessage('Firebase UID is required'),
  body('email').isEmail().withMessage('Valid email is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { firebaseUid, email } = req.body;
    const pool = getPool();

    if (!pool) {
      return res.status(500).json({
        success: false,
        message: 'Database connection failed'
      });
    }

    // Update existing user with Firebase UID
    const result = await pool.query(
      'UPDATE users SET firebase_uid = $1, updated_at = NOW() WHERE email = $2 RETURNING id, email, first_name, last_name',
      [firebaseUid, email]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      message: 'Firebase UID linked successfully',
      user: result.rows[0]
    });

  } catch (error) {
    console.error('Link Firebase UID error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to link Firebase UID'
    });
  }
});

// Get user profile (protected route)
router.get('/profile', verifyFirebaseToken, async (req, res) => {
  try {
    const { uid } = req.user;
    const pool = getPool();

    if (!pool) {
      return res.status(500).json({
        success: false,
        message: 'Database connection failed'
      });
    }

    const result = await pool.query(
      'SELECT id, email, first_name, last_name, business_type, is_verified, created_at FROM users WHERE firebase_uid = $1',
      [uid]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User profile not found'
      });
    }

    res.json({
      success: true,
      user: result.rows[0]
    });

  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get user profile'
    });
  }
});

module.exports = router;
