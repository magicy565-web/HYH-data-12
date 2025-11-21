import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Fix: Cast process to any to avoid TS error "Property 'cwd' does not exist on type 'Process'"
  const env = loadEnv(mode, (process as any).cwd(), '');

  return {
    plugins: [react()],
    define: {
      // CRITICAL: This replaces `process.env.API_KEY` in your source code 
      // with the actual value of `VITE_API_KEY` from Vercel environment variables.
      'process.env.API_KEY': JSON.stringify(env.VITE_API_KEY),
    },
  }
})