// vite.config.js
import { defineConfig } from 'vite';
import path from 'path';
import glob from 'glob';

// Automatische input detectie
const getInputs = () => {
  const coreFiles = glob.sync('src/core/*.js');
  const moduleFiles = glob.sync('src/modules/**/main.js');
  const pluginFiles = glob.sync('src/plugins/*.js');
  
  const entries = [
    ...coreFiles,
    ...moduleFiles,
    ...pluginFiles
  ].filter(file => !file.includes('.test.js'));

  return {
    main: path.resolve(__dirname, 'public/app.html'),
    ...Object.fromEntries(
      entries.map(file => [
        path.basename(file, '.js'),
        path.resolve(__dirname, file)
      ])
    )
  };
};

export default defineConfig({
  root: './public',
  publicDir: '../public/assets',
  build: {
    outDir: '../dist',
    emptyOutDir: true,
    rollupOptions: {
      input: getInputs(),
      output: {
        assetFileNames: 'assets/[name]-[hash][extname]',
        chunkFileNames: (chunkInfo) => {
          // Speciale handling voor workers
          if (chunkInfo.name.includes('worker')) {
            return 'workers/[name]-[hash].js';
          }
          return 'js/[name]-[hash].js';
        },
        entryFileNames: 'js/[name]-[hash].js',
        manualChunks: (id) => {
          // Dynamische chunks voor dependencies
          if (id.includes('node_modules')) {
            const lib = id.split('node_modules/')[1].split('/')[0];
            if (['three', 'mapbox-gl', 'axios'].includes(lib)) {
              return `vendor-${lib}`;
            }
            return 'vendor';
          }
          
          // Core chunks
          if (id.includes('src/core')) {
            return 'core';
          }
          
          // Module chunks
          if (id.includes('src/modules')) {
            const moduleName = id.split('src/modules/')[1].split('/')[0];
            return `module-${moduleName}`;
          }
          
          // Plugin chunks
          if (id.includes('src/plugins')) {
            const pluginName = id.split('src/plugins/')[1].split('/')[0];
            return `plugin-${pluginName}`;
          }
        }
      }
    },
    target: 'esnext',
    minify: 'terser'
  },
  server: {
    port: 3000,
    open: '/app.html',
    hmr: {
      overlay: true
    },
    fs: {
      strict: false,
      allow: ['..'] // Toegang tot root directory
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@assets': path.resolve(__dirname, './public/assets'),
      '@workers': path.resolve(__dirname, './src/workers'),
      '@plugins': path.resolve(__dirname, './src/plugins')
    }
  },
  optimizeDeps: {
    include: [
      'axios',
      'three',
      'mapbox-gl',
      '@tensorflow/tfjs',
      '@turf/turf',
      'react-3d-viewer',
      'socket.io-client'
    ],
    exclude: ['ar.js']
  },
  worker: {
    format: 'es',
    plugins: []
  },
  define: {
    'process.env': {},
    '__APP_VERSION__': JSON.stringify(process.env.npm_package_version)
  }
});