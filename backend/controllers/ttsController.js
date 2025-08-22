const { generateSpeech, getAvailableVoices, transcribeAudio } = require('../services/ttsService');

exports.generateTTS = async (req, res) => {
  try {
    const { text, voice = 'alloy' } = req.body;
    
    if (!text || text.trim() === '') {
      console.log('❌ TTS: No text provided');
      return res.status(400).json({ error: 'Text is required' });
    }
    
    console.log('🎤 TTS request received:', { text: text.substring(0, 100) + '...', voice });
    console.log('🔍 TTS: OpenAI API key available:', !!process.env.OPENAI_API_KEY);
    
    const audioBuffer = await generateSpeech(text, voice);
    
    // Handle "none" voice option
    if (audioBuffer === null) {
      console.log('🔇 No audio buffer returned, sending 204');
      return res.status(204).send(); // No content response
    }
    
    console.log('🎤 Audio buffer received, size:', audioBuffer.length);
    console.log('🎤 Audio buffer type:', typeof audioBuffer);
    console.log('🎤 Audio buffer is Buffer:', Buffer.isBuffer(audioBuffer));
    
    // Validate the audio buffer
    if (!audioBuffer || !Buffer.isBuffer(audioBuffer) || audioBuffer.length === 0) {
      console.error('❌ TTS: Invalid audio buffer received');
      return res.status(500).json({ error: 'Generated audio buffer is invalid' });
    }
    
    // Set proper headers for audio response
    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('Content-Length', audioBuffer.length);
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Accept-Ranges', 'bytes');
    res.setHeader('Content-Disposition', 'inline');
    
    console.log('🎤 Headers set, sending audio buffer...');
    
    // Send the audio buffer
    res.send(audioBuffer);
    
    console.log('🎤 Audio buffer sent successfully');
    
  } catch (error) {
    console.error('❌ TTS Controller Error:', error);
    console.error('❌ TTS Controller Error stack:', error.stack);
    
    // Send a more detailed error response
    res.status(500).json({ 
      error: 'Failed to generate speech',
      details: error.message,
      timestamp: new Date().toISOString()
    });
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