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
    
    const mp3 = await openai.audio.speech.create({
      model: "tts-1",
      voice: voice, // Options: alloy, echo, fable, onyx, nova, shimmer
      input: text,
    });
    
    console.log('🎤 Speech generated successfully');
    
    // Convert the response to a buffer
    const buffer = Buffer.from(await mp3.arrayBuffer());
    return buffer;
  } catch (error) {
    console.error('❌ TTS Error:', error);
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