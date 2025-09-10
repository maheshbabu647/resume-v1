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
    sourcemap: true,
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
  }
})
