import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig(({ mode }) => {
  // Load env file from root directory
  const env = loadEnv(mode, path.resolve(__dirname, '../'), '');
  
  // Only expose VITE_ prefixed variables to the client for security
  const clientEnv = {};
  Object.keys(env).forEach(key => {
    if (key.startsWith('VITE_')) {
      clientEnv[key] = env[key];
    }
  });
  
  return {
    plugins: [react()],
    server: {
      port: 3003, // Frontend on 3003
      proxy: {
        '/api': {
          target: 'http://localhost:3000', // Backend on 3000
          changeOrigin: true,
        },
      },
    },
    // Make only VITE_ prefixed environment variables available to the client
    define: {
      'process.env': clientEnv
    },
    // Ensure Vite looks for .env in root directory
    envDir: path.resolve(__dirname, '../'),
  };
}); 