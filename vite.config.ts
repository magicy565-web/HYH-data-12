
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // process.cwd() is required for loading .env files correctly
  const env = loadEnv(mode, (process as any).cwd(), '');

  return {
    plugins: [react()],
    define: {
      // Polyfill process.env.API_KEY for the browser environment.
      // If VITE_API_KEY is not set in Vercel, it falls back to an empty string to prevent crashes.
      'process.env.API_KEY': JSON.stringify(env.VITE_API_KEY || ""),
      
      // Define process.env as an empty object to prevent "process is not defined" errors
      // in third-party libraries that might check for it.
      'process.env': {},
    },
  }
})
