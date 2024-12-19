import path, { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

export default defineConfig({
  plugins: [react()],
  build: {
    target: 'esnext',
    manifest: true,
    rollupOptions: {
      input: 'views/index.html',
    },
  },
  resolve: {
    alias: {
      '@/client': resolve(__dirname, 'client'),
      '@/app': resolve(__dirname, 'app'),
    },
    extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.css'],
  },
  css: {
    // preprocessorOptions: {
    //   less: {
    //     additionalData: `@import "client/assets/base.css";`,
    //   },
    // },
    modules: {
      generateScopedName: '[name--[local]--[hash:base64:5]]',
    },
  },
});
