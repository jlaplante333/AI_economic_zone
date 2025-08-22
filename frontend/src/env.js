// Frontend environment loader
// This ensures environment variables are loaded from the root directory

// For development, Vite will handle this via vite.config.js
// For production, we can access process.env directly

const getEnvVar = (key, defaultValue = '') => {
  // Try to get from process.env (works in production)
  if (typeof process !== 'undefined' && process.env && process.env[key]) {
    return process.env[key];
  }
  
  // Try to get from import.meta.env (Vite's way)
  if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env[key]) {
    return import.meta.env[key];
  }
  
  // Try to get from window.__ENV__ (if we set it up)
  if (typeof window !== 'undefined' && window.__ENV__ && window.__ENV__[key]) {
    return window.__ENV__[key];
  }
  
  return defaultValue;
};

// Export commonly used environment variables
export const config = {
  VITE_API_URL: getEnvVar('VITE_API_URL', 'http://localhost:3002'),
  VITE_APP_NAME: getEnvVar('VITE_APP_NAME', 'Oakland AI'),
  NODE_ENV: getEnvVar('NODE_ENV', 'development'),
};

// Make config available globally for debugging
if (typeof window !== 'undefined') {
  window.__APP_CONFIG__ = config;
}

export default config; 