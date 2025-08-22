const express = require('express');
const router = express.Router();
const ttsController = require('../controllers/ttsController');

router.post('/generate', ttsController.generateTTS);
router.post('/transcribe', ttsController.transcribeAudio);
router.get('/voices', ttsController.getVoices);

module.exports = router; 