import path, { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

export default defineConfig({
  base: '/weread',
  plugins: [react()],
  build: {
    target: 'esnext',
    manifest: true,
    ssrManifest: true,
    rollupOptions: {
      input: 'views/index.html',
    },
  },
  publicDir: 'public',
  resolve: {
    alias: {
      '@/components': resolve(__dirname, '/components'),
      '@/router': resolve(__dirname, '/router'),
      '@/lib': resolve(__dirname, '/lib'),
      '@/store': resolve(__dirname, '/store'),
      '@/assets': resolve(__dirname, '/assets'),
      '@/types': resolve(__dirname, '/types'),
      '@/styles': resolve(__dirname, '/styles'),
      '@/pages': resolve(__dirname, '/pages'),
      '@/locales': resolve(__dirname, '/locales'),
    },
    extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json'],
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@import "@/styles/base.css";`,
      },
    },
  },
  ssr: {
    noExternal: ['react-router-dom'],
  },
});
