import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'
import { sentryVitePlugin } from "@sentry/vite-plugin";
import dotenv from 'dotenv'
dotenv.config()

// https://vite.dev/config/
export default defineConfig({
  build: {
    sourcemap: false, // Disable sourcemaps in production for better performance
    rollupOptions: {
      output: {
        // This ensures unique filenames for each build to prevent cache issues
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]'
      }
    }
  },
  plugins: [react(),
    tailwindcss(),
    sentryVitePlugin({
      org: "careerforge",
      project: "javascript-react",
      authToken: process.env.SENTRY_AUTH_TOKEN,
    }),],
  resolve  : {
    alias : {
      '@' : path.resolve(__dirname, './src')
    },
  },
  optimizeDeps: {
    include: ['jspdf', 'html2canvas']
  },
  // Add cache busting for development
  server: {
    headers: {
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0'
    }
  }
})
