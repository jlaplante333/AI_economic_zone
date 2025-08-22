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

  // Only stop speech when page is actually hidden, not just when tab changes
  const handleVisibilityChange = () => {
    if (document.hidden) {
      console.log('🔇 Global: Page hidden, but not stopping speech immediately');
      // Don't stop speech immediately on visibility change
      // Only stop if the page stays hidden for a while
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