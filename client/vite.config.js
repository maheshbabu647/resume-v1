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
    minify: 'esbuild', // Use esbuild for faster builds
    target: 'esnext',
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunks
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui-vendor': ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu', '@radix-ui/react-select', '@radix-ui/react-tabs'],
          'form-vendor': ['react-hook-form', '@hookform/resolvers', 'zod'],
          'utils-vendor': ['axios', 'lodash', 'clsx', 'class-variance-authority'],
          'pdf-vendor': ['jspdf', 'html2canvas', 'html2pdf.js', 'dom-to-image-more'],
          'charts-vendor': ['recharts'],
          'analytics-vendor': ['react-ga4', '@sentry/react'],
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },
  plugins: [
    react(),
    tailwindcss(),
    sentryVitePlugin({
      org: "careerforge",
      project: "javascript-react",
      authToken: process.env.SENTRY_AUTH_TOKEN,
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    },
  },
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'jspdf',
      'html2canvas',
      'axios',
      'lodash',
      'framer-motion'
    ]
  },
  server: {
    hmr: {
      overlay: false
    }
  }
})
