const express = require('express');
const router = express.Router();
const ttsController = require('../controllers/ttsController');

console.log('🔍 TTS routes file loaded');

// Test endpoint to verify TTS is working
router.get('/test', (req, res) => {
  console.log('🔍 TTS test endpoint hit');
  res.json({ 
    message: 'TTS routes are working!', 
    timestamp: new Date().toISOString(),
    openaiKey: process.env.OPENAI_API_KEY ? 'Configured' : 'Not configured'
  });
});

router.post('/generate', ttsController.generateTTS);
router.post('/transcribe', ttsController.transcribeAudio);
router.get('/voices', ttsController.getVoices);

console.log('🔍 TTS routes defined:', router.stack.map(r => r.route?.path).filter(Boolean));

module.exports = router; 