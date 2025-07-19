import { fileURLToPath, URL } from 'node:url';

import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';
import { defineConfig } from 'vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // Bundle analyzer - generates stats.html after build
    visualizer({
      filename: 'dist/stats.html',
      open: true,
      gzipSize: true,
      brotliSize: true,
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '@/components': fileURLToPath(new URL('./src/components', import.meta.url)),
      '@/pages': fileURLToPath(new URL('./src/pages', import.meta.url)),
      '@/hooks': fileURLToPath(new URL('./src/hooks', import.meta.url)),
      '@/services': fileURLToPath(new URL('./src/services', import.meta.url)),
      '@/utils': fileURLToPath(new URL('./src/utils', import.meta.url)),
      '@/types': fileURLToPath(new URL('./src/types', import.meta.url)),
      '@/stores': fileURLToPath(new URL('./src/stores', import.meta.url)),
      '@/constants': fileURLToPath(new URL('./src/constants', import.meta.url)),
      '@/configs': fileURLToPath(new URL('./src/configs', import.meta.url)),
      '@/styles': fileURLToPath(new URL('./src/styles', import.meta.url)),
      '@/assets': fileURLToPath(new URL('./src/assets', import.meta.url)),
    },
  },
  build: {
    // Enable source maps for production debugging
    sourcemap: false,
    // Optimize chunk size
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        // Advanced code splitting strategy
        manualChunks: (id) => {
          // Vendor chunks
          if (id.includes('node_modules')) {
            // React ecosystem
            if (id.includes('react') || id.includes('react-dom')) {
              return 'react-vendor';
            }
            // Router
            if (id.includes('react-router')) {
              return 'router-vendor';
            }
            // Query/State management
            if (id.includes('@tanstack/react-query') || id.includes('axios')) {
              return 'data-vendor';
            }
            // UI/Styling
            if (id.includes('clsx') || id.includes('framer-motion')) {
              return 'ui-vendor';
            }
            // Other vendor libraries
            return 'vendor';
          }

          // Feature-based splitting
          if (id.includes('/src/pages/')) {
            return 'pages';
          }
          if (id.includes('/src/components/ui/')) {
            return 'ui-components';
          }
          if (id.includes('/src/components/')) {
            return 'components';
          }
          if (id.includes('/src/services/')) {
            return 'services';
          }
          if (id.includes('/src/utils/')) {
            return 'utils';
          }
        },
        // Optimize chunk naming
        chunkFileNames: 'js/[name]-[hash].js',
        entryFileNames: 'js/[name]-[hash].js',
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name?.split('.') || [];
          let extType = info[info.length - 1];
          if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(extType)) {
            extType = 'images';
          } else if (/woff|woff2|eot|ttf|otf/i.test(extType)) {
            extType = 'fonts';
          }
          return `${extType}/[name]-[hash][extname]`;
        },
      },
      // Tree shaking optimization
      treeshake: {
        moduleSideEffects: false,
        propertyReadSideEffects: false,
        unknownGlobalSideEffects: false,
      },
    },
    // Minification options
    minify: 'terser',
    // Enable CSS code splitting
    cssCodeSplit: true,
    // Optimize dependencies
    commonjsOptions: {
      include: [/node_modules/],
    },
  },
  server: {
    port: 3000,
    open: true,
  },
});
