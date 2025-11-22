import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  const env = loadEnv(mode, process.cwd(), '');

  // Use Vercel env var or fallback (Note: Fallback is for demo only)
  const apiKey = env.VITE_API_KEY || "AIzaSyDvwr7glfGoWeFEDlKCMGXW9wzy45ru-nM";

  return {
    plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    define: {
      // Critical Fix: specific replacement for API KEY
      'process.env.API_KEY': JSON.stringify(apiKey),
      // Critical Fix: Define 'process.env' as an empty object to prevent "process is not defined" crashes
      'process.env': {},
      // Define global process to avoid ReferenceError in some libs
      'global': 'window',
    },
    build: {
      outDir: 'dist',
      sourcemap: false,
    }
  }
})
