const OpenAI = require('openai');

let openaiClient = null;

const getOpenAIClient = () => {
  if (!openaiClient) {
    try {
      openaiClient = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
      });
    } catch (error) {
      console.warn('OpenAI client not available:', error.message);
      return null;
    }
  }
  return openaiClient;
};

exports.generateSpeech = async (text, voice = 'alloy') => {
  try {
    // Handle "none" voice option
    if (voice === 'none') {
      console.log('🔇 Voice disabled - skipping speech generation');
      return null;
    }
    
    const openai = getOpenAIClient();
    if (!openai) {
      console.warn('OpenAI client not available - skipping speech generation');
      return null;
    }
    
    console.log('🎤 Generating speech for text:', text.substring(0, 100) + '...');
    console.log('🎤 Using voice:', voice);
    console.log('🎤 OpenAI client available:', !!openai);
    
    const mp3 = await openai.audio.speech.create({
      model: "tts-1",
      voice: voice, // Options: alloy, echo, fable, onyx, nova, shimmer
      input: text,
    });
    
    console.log('🎤 Speech generated successfully');
    console.log('🎤 MP3 response type:', typeof mp3);
    console.log('🎤 MP3 response properties:', Object.keys(mp3));
    
    // Convert the response to a buffer
    const arrayBuffer = await mp3.arrayBuffer();
    console.log('🎤 Array buffer created, size:', arrayBuffer.byteLength);
    
    const buffer = Buffer.from(arrayBuffer);
    console.log('🎤 Buffer created, size:', buffer.length);
    
    return buffer;
  } catch (error) {
    console.error('❌ TTS Error:', error);
    console.error('❌ TTS Error stack:', error.stack);
    throw new Error('Failed to generate speech');
  }
};

exports.getAvailableVoices = () => {
  return [
    { id: 'none', name: 'No Voice', description: 'Disable speech output' },
    { id: 'alloy', name: 'Alloy', description: 'Balanced and natural' },
    { id: 'echo', name: 'Echo', description: 'Clear and professional' },
    { id: 'fable', name: 'Fable', description: 'Warm and friendly' },
    { id: 'onyx', name: 'Onyx', description: 'Deep and authoritative' },
    { id: 'nova', name: 'Nova', description: 'Bright and energetic' },
    { id: 'shimmer', name: 'Shimmer', description: 'Smooth and melodic' }
  ];
};

exports.transcribeAudio = async (audioBuffer, language = 'en') => {
  try {
    const openai = getOpenAIClient();
    if (!openai) {
      console.warn('OpenAI client not available - skipping transcription');
      throw new Error('OpenAI client not available');
    }
    
    console.log('🎤 Transcribing audio with Whisper, language:', language);
    
    // Create a file object from the buffer for OpenAI API
    const file = {
      buffer: audioBuffer,
      name: 'audio.webm',
      type: 'audio/webm'
    };
    
    const transcript = await openai.audio.transcriptions.create({
      file: file,
      model: "whisper-1",
      language: language,
      response_format: "text"
    });
    
    console.log('🎤 Transcription completed successfully');
    return transcript;
    
  } catch (error) {
    console.error('❌ Transcription Error:', error);
    throw new Error('Failed to transcribe audio');
  }
}; 