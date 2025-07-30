// Utility functions for speech synthesis cleanup

let currentAudioElement = null;

export const stopAllSpeech = () => {
  console.log('🔇 Stopping all speech synthesis');
  
  // Stop browser speech synthesis
  if ('speechSynthesis' in window && window.speechSynthesis.speaking) {
    window.speechSynthesis.cancel();
  }
  
  // Stop OpenAI TTS audio
  if (currentAudioElement) {
    currentAudioElement.pause();
    currentAudioElement.currentTime = 0;
    currentAudioElement = null;
  }
};

export const setCurrentAudio = (audioElement) => {
  currentAudioElement = audioElement;
};

export const getCurrentAudio = () => {
  return currentAudioElement;
};

// Add global event listeners for navigation
export const initializeSpeechCleanup = () => {
  const handleBeforeUnload = () => {
    console.log('🔇 Global: Stopping speech before page unload');
    stopAllSpeech();
  };

  const handleVisibilityChange = () => {
    if (document.hidden) {
      console.log('🔇 Global: Stopping speech when page becomes hidden');
      stopAllSpeech();
    }
  };

  const handlePageHide = () => {
    console.log('🔇 Global: Stopping speech on page hide');
    stopAllSpeech();
  };

  window.addEventListener('beforeunload', handleBeforeUnload);
  document.addEventListener('visibilitychange', handleVisibilityChange);
  window.addEventListener('pagehide', handlePageHide);

  // Return cleanup function
  return () => {
    window.removeEventListener('beforeunload', handleBeforeUnload);
    document.removeEventListener('visibilitychange', handleVisibilityChange);
    window.removeEventListener('pagehide', handlePageHide);
  };
}; 