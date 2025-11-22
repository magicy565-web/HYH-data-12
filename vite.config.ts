
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  const env = loadEnv(mode, '.', '');

  // Use the provided key or the environment variable
  // WARNING: Hardcoding keys in code is not recommended for public repos. 
  // Please move this to Vercel Environment Variables (VITE_API_KEY) for production security.
  const apiKey = env.VITE_API_KEY || "AIzaSyDvwr7glfGoWeFEDlKCMGXW9wzy45ru-nM";

  return {
    plugins: [react()],
    define: {
      // Polyfill process.env.API_KEY for the browser environment.
      'process.env.API_KEY': JSON.stringify(apiKey),
    },
  }
})
