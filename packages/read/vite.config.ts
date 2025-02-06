import path, { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

export default defineConfig({
  plugins: [
    react(),
  ],
  resolve: {
    alias: {
      '@/components': resolve(__dirname, '/components'),
      '@/router': resolve(__dirname, '/router'),
      '@/lib': resolve(__dirname, '/lib'),
      '@/store': resolve(__dirname, '/store'),
    },
    extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json'],
  },
  css: {
    modules: {
      generateScopedName: '[name--[local]--[hash:base64:5]]',
    },
  },
});
