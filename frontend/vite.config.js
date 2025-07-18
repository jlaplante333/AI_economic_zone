import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig(({ mode }) => {
  // Load env file from root directory
  const env = loadEnv(mode, path.resolve(__dirname, '../'), '');
  
  return {
    plugins: [react()],
    server: {
      port: 3000,
      proxy: {
        '/api': {
          target: 'http://localhost:3001',
          changeOrigin: true,
        },
      },
    },
    // Make environment variables available to the client
    define: {
      'process.env': env
    },
    // Ensure Vite looks for .env in root directory
    envDir: path.resolve(__dirname, '../'),
  };
}); 