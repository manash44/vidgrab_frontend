import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      'capacitor-plugin-send-intent': path.resolve(__dirname, 'src/fix-send-intent.js')
    }
  },
  server: {
    // Allow access from other devices on the network
    host: '0.0.0.0',
    port: 5173,
  },
  build: {
    // Output to dist folder
    outDir: 'dist',
    // Generate sourcemaps for debugging
    sourcemap: false,
    // Optimize chunk size
    chunkSizeWarningLimit: 500,
  },
})
