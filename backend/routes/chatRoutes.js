const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');

router.post('/', chatController.handleChat);
router.get('/status', chatController.getAIStatus);
router.get('/history', chatController.getChatHistory);
router.post('/log', chatController.logChatMessage);

module.exports = router; 