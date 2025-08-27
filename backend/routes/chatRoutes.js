const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
const { authenticateToken } = require('../middleware/authMiddleware');

// All chat endpoints require authentication
router.post('/', authenticateToken, chatController.handleChat);
router.get('/status', chatController.getAIStatus); // Keep this public for health checks
router.get('/history', authenticateToken, chatController.getChatHistory);
router.post('/log', authenticateToken, chatController.logChatMessage);
router.delete('/clear-history', authenticateToken, chatController.clearChatHistory);

module.exports = router; 