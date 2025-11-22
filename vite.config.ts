import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  const env = loadEnv(mode, process.cwd(), '');

  // Use the provided key or the environment variable from Vercel
  const apiKey = env.VITE_API_KEY || "AIzaSyDvwr7glfGoWeFEDlKCMGXW9wzy45ru-nM";

  return {
    plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    define: {
      // This ensures that process.env.API_KEY is replaced with the actual string during build
      'process.env.API_KEY': JSON.stringify(apiKey),
      // Prevent "process is not defined" error in browser if some library accesses it
      'process.env': {},
    },
    build: {
      outDir: 'dist',
      sourcemap: false,
    }
  }
})
