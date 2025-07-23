const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');
const { authenticateToken } = require('../middleware/authMiddleware');

router.get('/stats', authenticateToken, analyticsController.getStats);

module.exports = router; 