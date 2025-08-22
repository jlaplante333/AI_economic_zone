const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');
const { authenticateToken } = require('../middleware/authMiddleware');

console.log('🔍 Analytics routes file loaded');

// Optional authentication middleware - doesn't fail if no token
const optionalAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    // If token is provided, validate it
    authenticateToken(req, res, next);
  } else {
    // If no token, continue without authentication
    req.user = null;
    next();
  }
};

// Test endpoint to verify routes are working
router.get('/test', (req, res) => {
  console.log('🔍 Analytics test endpoint hit');
  res.json({ message: 'Analytics routes are working!', timestamp: new Date().toISOString() });
});

router.get('/stats', optionalAuth, analyticsController.getStats);
router.get('/comprehensive', optionalAuth, analyticsController.getComprehensiveStats);
router.get('/popular-questions', optionalAuth, analyticsController.getPopularQuestions);

console.log('🔍 Analytics routes defined:', router.stack.map(r => r.route?.path).filter(Boolean));

module.exports = router; 