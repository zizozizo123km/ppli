import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  
  // Configuration for cleaner imports (e.g., using @/components)
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },

  // Optimized build settings suitable for a large application like Facebook
  build: {
    outDir: 'dist',
    sourcemap: false,
    
    // Manual chunking to split vendors and core libraries for better caching and loading speed
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            // Group specific large libraries (React, Framer Motion, Axios)
            if (id.includes('react') || id.includes('react-dom') || id.includes('axios') || id.includes('framer-motion')) {
              return 'vendor_core';
            }
            // Group general node modules
            return 'vendor';
          }
        },
      },
    },
  },
  
  // Development server settings
  server: {
    port: 3000,
    open: true,
  }
})