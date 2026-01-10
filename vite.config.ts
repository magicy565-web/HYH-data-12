import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  const env = loadEnv(mode, '.', '');

  // 修改这里：加入您的硬编码 Key 作为默认值
  const apiKey = env.VITE_API_KEY || env.API_KEY || "AIzaSyBF1G0He0QsalkIHiXBIeNlQcbkudJjWKs";

  return {
    plugins: [react()],
    define: {
      // 确保构建时能正确替换变量，避免 JSON.stringify(undefined)
      'process.env.API_KEY': JSON.stringify(apiKey),
    },
  }
})
