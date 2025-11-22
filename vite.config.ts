
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  const env = loadEnv(mode, '.', '');

  // Use the provided key from environment variables (VITE_API_KEY or API_KEY)
  const apiKey = env.VITE_API_KEY || env.API_KEY;

  return {
    plugins: [react()],
    define: {
      // Polyfill process.env.API_KEY for the browser environment.
      // This ensures `process.env.API_KEY` is replaced by the actual string value during build.
      'process.env.API_KEY': JSON.stringify(apiKey),
    },
  }
})
