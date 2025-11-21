
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Using '.' is standard for current directory and avoids process.cwd() TS errors.
  const env = loadEnv(mode, '.', '');

  return {
    plugins: [react()],
    define: {
      // Polyfill process.env.API_KEY for the browser environment.
      // We ONLY replace the specific key to avoid conflicts with global process object.
      'process.env.API_KEY': JSON.stringify(env.VITE_API_KEY || ""),
    },
  }
})
