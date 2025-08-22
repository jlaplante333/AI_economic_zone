const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');
const { authenticateToken } = require('../middleware/authMiddleware');

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

router.get('/stats', optionalAuth, analyticsController.getStats);
router.get('/comprehensive', optionalAuth, analyticsController.getComprehensiveStats);
router.get('/popular-questions', optionalAuth, analyticsController.getPopularQuestions);

module.exports = router; 