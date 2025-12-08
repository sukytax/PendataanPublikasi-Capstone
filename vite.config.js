import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    proxy: {
      '/admin': {
        target: 'http://localhost:8000/api',
        changeOrigin: true,
      },
      '/client': {
        target: 'http://localhost:8000/api',
        changeOrigin: true,
      },
    },
  },
})
