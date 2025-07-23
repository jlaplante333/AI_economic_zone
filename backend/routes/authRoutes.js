const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const {
  authenticateToken,
  requireAdmin,
  authRateLimit,
  registerRateLimit,
  passwordResetRateLimit
} = require('../middleware/authMiddleware');

// Public routes (no authentication required)
router.post('/register', 
  registerRateLimit,
  authController.registerValidation,
  authController.register
);

router.post('/signup', 
  registerRateLimit,
  authController.registerValidation,
  authController.register
);

router.post('/login', 
  authRateLimit,
  authController.loginValidation,
  authController.login
);

router.get('/verify-email/:token', 
  authController.verifyEmail
);

router.post('/resend-verification', 
  authRateLimit,
  authController.resendVerification
);

router.post('/forgot-password', 
  passwordResetRateLimit,
  authController.passwordResetValidation,
  authController.forgotPassword
);

router.post('/reset-password', 
  passwordResetRateLimit,
  authController.newPasswordValidation,
  authController.resetPassword
);

// Protected routes (authentication required)
router.get('/profile', 
  authenticateToken,
  authController.getProfile
);

router.put('/profile', 
  authenticateToken,
  authController.updateProfile
);

router.post('/logout', 
  authenticateToken,
  authController.logout
);

// Admin routes (admin authentication required)
router.get('/users', 
  authenticateToken,
  requireAdmin,
  authController.getAllUsers
);

router.delete('/users/:userId', 
  authenticateToken,
  requireAdmin,
  authController.deleteUser
);

router.post('/admin', 
  authenticateToken,
  requireAdmin,
  authController.createAdmin
);

module.exports = router; 