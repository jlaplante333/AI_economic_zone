const { getPool } = require('../config/db');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

// Create a new user
const createUser = async ({ email, password, firstName, lastName, phone, language, businessType }) => {
  try {
    const pool = getPool();
    if (!pool) {
      throw new Error('Database not available');
    }
    
    // Hash password
    const saltRounds = parseInt(process.env.BCRYPT_ROUNDS) || 12;
    const passwordHash = await bcrypt.hash(password, saltRounds);
    
    // Generate email verification token
    const emailVerificationToken = uuidv4();
    const emailVerificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
    
    const result = await pool.query(
      `INSERT INTO users (
        email, password_hash, first_name, last_name, phone, language, business_type, 
        email_verification_token, email_verification_expires
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
      [email, passwordHash, firstName, lastName, phone, language, businessType, 
       emailVerificationToken, emailVerificationExpires]
    );
    
    return {
      ...result.rows[0],
      emailVerificationToken
    };
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};

// Find user by email
const findByEmail = async (email) => {
  try {
    const pool = getPool();
    if (!pool) {
      throw new Error('Database not available');
    }
    
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    return result.rows[0];
  } catch (error) {
    console.error('Error finding user by email:', error);
    throw error;
  }
};

// Find user by ID
const findById = async (id) => {
  try {
    const pool = getPool();
    if (!pool) {
      throw new Error('Database not available');
    }
    
    const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
    return result.rows[0];
  } catch (error) {
    console.error('Error finding user by ID:', error);
    throw error;
  }
};

// Verify user password
const verifyPassword = async (password, passwordHash) => {
  return await bcrypt.compare(password, passwordHash);
};

// Update user's last login
const updateLastLogin = async (userId) => {
  try {
    const pool = getPool();
    if (!pool) {
      throw new Error('Database not available');
    }
    
    await pool.query(
      'UPDATE users SET last_login = CURRENT_TIMESTAMP, login_attempts = 0 WHERE id = $1',
      [userId]
    );
  } catch (error) {
    console.error('Error updating last login:', error);
    throw error;
  }
};

// Increment login attempts
const incrementLoginAttempts = async (userId) => {
  try {
    const pool = getPool();
    if (!pool) {
      throw new Error('Database not available');
    }
    
    const result = await pool.query(
      'UPDATE users SET login_attempts = login_attempts + 1 WHERE id = $1 RETURNING login_attempts',
      [userId]
    );
    
    // Lock account after 5 failed attempts for 15 minutes
    if (result.rows[0].login_attempts >= 5) {
      const lockedUntil = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes
      await pool.query(
        'UPDATE users SET locked_until = $1 WHERE id = $2',
        [lockedUntil, userId]
      );
    }
    
    return result.rows[0].login_attempts;
  } catch (error) {
    console.error('Error incrementing login attempts:', error);
    throw error;
  }
};

// Verify email
const verifyEmail = async (token) => {
  try {
    const pool = getPool();
    if (!pool) {
      throw new Error('Database not available');
    }
    
    const result = await pool.query(
      `UPDATE users SET 
        is_verified = TRUE, 
        email_verification_token = NULL, 
        email_verification_expires = NULL 
       WHERE email_verification_token = $1 
         AND email_verification_expires > CURRENT_TIMESTAMP 
       RETURNING *`,
      [token]
    );
    
    return result.rows[0];
  } catch (error) {
    console.error('Error verifying email:', error);
    throw error;
  }
};

// Resend email verification
const resendEmailVerification = async (email) => {
  try {
    const pool = getPool();
    if (!pool) {
      throw new Error('Database not available');
    }
    
    const emailVerificationToken = uuidv4();
    const emailVerificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
    
    const result = await pool.query(
      `UPDATE users SET 
        email_verification_token = $1, 
        email_verification_expires = $2 
       WHERE email = $3 
       RETURNING *`,
      [emailVerificationToken, emailVerificationExpires, email]
    );
    
    if (result.rows[0]) {
      return {
        ...result.rows[0],
        emailVerificationToken
      };
    }
    
    return null;
  } catch (error) {
    console.error('Error resending email verification:', error);
    throw error;
  }
};

// Create password reset token
const createPasswordResetToken = async (email) => {
  try {
    const pool = getPool();
    if (!pool) {
      throw new Error('Database not available');
    }
    
    const passwordResetToken = uuidv4();
    const passwordResetExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
    
    const result = await pool.query(
      `UPDATE users SET 
        password_reset_token = $1, 
        password_reset_expires = $2 
       WHERE email = $3 
       RETURNING *`,
      [passwordResetToken, passwordResetExpires, email]
    );
    
    if (result.rows[0]) {
      return {
        ...result.rows[0],
        passwordResetToken
      };
    }
    
    return null;
  } catch (error) {
    console.error('Error creating password reset token:', error);
    throw error;
  }
};

// Reset password
const resetPassword = async (token, newPassword) => {
  try {
    const pool = getPool();
    if (!pool) {
      throw new Error('Database not available');
    }
    
    // Hash new password
    const saltRounds = parseInt(process.env.BCRYPT_ROUNDS) || 12;
    const passwordHash = await bcrypt.hash(newPassword, saltRounds);
    
    const result = await pool.query(
      `UPDATE users SET 
        password_hash = $1, 
        password_reset_token = NULL, 
        password_reset_expires = NULL,
        login_attempts = 0,
        locked_until = NULL
       WHERE password_reset_token = $2 
         AND password_reset_expires > CURRENT_TIMESTAMP 
       RETURNING *`,
      [passwordHash, token]
    );
    
    return result.rows[0];
  } catch (error) {
    console.error('Error resetting password:', error);
    throw error;
  }
};

// Update user profile
const updateProfile = async (userId, { firstName, lastName, phone, language, businessType }) => {
  try {
    const pool = getPool();
    if (!pool) {
      throw new Error('Database not available');
    }
    
    const result = await pool.query(
      `UPDATE users SET 
        first_name = COALESCE($1, first_name),
        last_name = COALESCE($2, last_name),
        phone = COALESCE($3, phone),
        language = COALESCE($4, language),
        business_type = COALESCE($5, business_type)
       WHERE id = $6 
       RETURNING *`,
      [firstName, lastName, phone, language, businessType, userId]
    );
    
    return result.rows[0];
  } catch (error) {
    console.error('Error updating profile:', error);
    throw error;
  }
};

// Get all users (admin only)
const getAllUsers = async (page = 1, limit = 20) => {
  try {
    const pool = getPool();
    if (!pool) {
      throw new Error('Database not available');
    }
    
    const offset = (page - 1) * limit;
    
    const result = await pool.query(
      `SELECT id, email, first_name, last_name, phone, language, business_type, 
              is_verified, is_admin, last_login, created_at 
       FROM users 
       ORDER BY created_at DESC 
       LIMIT $1 OFFSET $2`,
      [limit, offset]
    );
    
    const countResult = await pool.query('SELECT COUNT(*) FROM users');
    const totalUsers = parseInt(countResult.rows[0].count);
    
    return {
      users: result.rows,
      pagination: {
        page,
        limit,
        total: totalUsers,
        pages: Math.ceil(totalUsers / limit)
      }
    };
  } catch (error) {
    console.error('Error getting all users:', error);
    throw error;
  }
};

// Delete user (admin only)
const deleteUser = async (userId) => {
  try {
    const pool = getPool();
    if (!pool) {
      throw new Error('Database not available');
    }
    
    const result = await pool.query(
      'DELETE FROM users WHERE id = $1 AND is_admin = FALSE RETURNING *',
      [userId]
    );
    
    return result.rows[0];
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
};

// Create admin user
const createAdminUser = async ({ email, password, firstName, lastName }) => {
  try {
    const pool = getPool();
    if (!pool) {
      throw new Error('Database not available');
    }
    
    // Hash password
    const saltRounds = parseInt(process.env.BCRYPT_ROUNDS) || 12;
    const passwordHash = await bcrypt.hash(password, saltRounds);
    
    const result = await pool.query(
      `INSERT INTO users (
        email, password_hash, first_name, last_name, language, business_type, 
        is_verified, is_admin
      ) VALUES ($1, $2, $3, $4, 'en', 'admin', TRUE, TRUE) RETURNING *`,
      [email, passwordHash, firstName, lastName]
    );
    
    return result.rows[0];
  } catch (error) {
    console.error('Error creating admin user:', error);
    throw error;
  }
};

module.exports = {
  createUser,
  findByEmail,
  findById,
  verifyPassword,
  updateLastLogin,
  incrementLoginAttempts,
  verifyEmail,
  resendEmailVerification,
  createPasswordResetToken,
  resetPassword,
  updateProfile,
  getAllUsers,
  deleteUser,
  createAdminUser
}; 