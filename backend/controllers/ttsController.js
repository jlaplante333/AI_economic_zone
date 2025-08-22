const { generateSpeech, getAvailableVoices, transcribeAudio } = require('../services/ttsService');

exports.generateTTS = async (req, res) => {
  try {
    const { text, voice = 'alloy' } = req.body;
    
    if (!text || text.trim() === '') {
      return res.status(400).json({ error: 'Text is required' });
    }
    
    console.log('🎤 TTS request received:', { text: text.substring(0, 100) + '...', voice });
    
    const audioBuffer = await generateSpeech(text, voice);
    
    // Handle "none" voice option
    if (audioBuffer === null) {
      return res.status(204).send(); // No content response
    }
    
    // Set headers for audio response
    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('Content-Length', audioBuffer.length);
    res.setHeader('Cache-Control', 'no-cache');
    
    // Send the audio buffer
    res.send(audioBuffer);
    
  } catch (error) {
    console.error('❌ TTS Controller Error:', error);
    res.status(500).json({ error: 'Failed to generate speech' });
  }
};

exports.getVoices = async (req, res) => {
  try {
    const voices = getAvailableVoices();
    res.json({ voices });
  } catch (error) {
    console.error('❌ Get Voices Error:', error);
    res.status(500).json({ error: 'Failed to get available voices' });
  }
}; 

exports.transcribeAudio = async (req, res) => {
  try {
    // Check if audio file is uploaded
    if (!req.files || !req.files.audio) {
      return res.status(400).json({ error: 'Audio file is required' });
    }

    const audioFile = req.files.audio;
    const { language = 'en' } = req.body;
    
    console.log('🎤 Transcription request received:', { 
      filename: audioFile.name, 
      size: audioFile.size, 
      language 
    });
    
    const transcript = await transcribeAudio(audioFile.data, language);
    
    res.json({ 
      success: true, 
      transcript,
      language 
    });
    
  } catch (error) {
    console.error('❌ Transcription Controller Error:', error);
    res.status(500).json({ error: 'Failed to transcribe audio' });
  }
}; 