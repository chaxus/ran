import path, { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

export default defineConfig({
  plugins: [],
  resolve: {
    alias: {
      '@/components': resolve(__dirname, '/components'),
      '@/lib': resolve(__dirname, '/lib'),
      '@/assets': resolve(__dirname, '/assets'),
    },
    extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json'],
  },
  css: {
    modules: {
      generateScopedName: '[name--[local]--[hash:base64:5]]',
    },
  },
});
