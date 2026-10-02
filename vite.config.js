import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { compression } from 'vite-plugin-compression2';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // Pre-compress assets with Gzip for production servers
    compression({
      algorithm: 'gzip',
      exclude: [/\.(enc|bin|png|jpg|mp4)$/i],
      threshold: 1024,
    }),
    // Pre-compress assets with Brotli for high-performance HTTP/2+ serving
    compression({
      algorithm: 'brotliCompress',
      exclude: [/\.(enc|bin|png|jpg|mp4)$/i],
      threshold: 1024,
    }),
  ],
  build: {
    target: 'esnext',
    cssCodeSplit: true,
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom')) {
              return 'vendor-react';
            }
            if (id.includes('gsap') || id.includes('lenis')) {
              return 'vendor-motion';
            }
            if (id.includes('@noble') || id.includes('idb-keyval')) {
              return 'vendor-security';
            }
            return 'vendor-core';
          }
        },
      },
    },
  },
});
