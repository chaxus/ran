import path, { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import type { BuildOptions, UserConfig } from 'vite';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import react from '@vitejs/plugin-react';

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

export const umd: BuildOptions = {
  minify: 'terser',
  outDir: resolve(__dirname, 'dist/umd'),
  lib: {
    entry: resolve(__dirname, 'index.ts'),
    name: 'ranml',
    fileName: 'index',
    formats: ['umd'],
  },
};

export const es: BuildOptions = {
  minify: 'terser',
  lib: {
    entry: resolve(__dirname, 'index.ts'),
    fileName: 'index',
    formats: ['es'],
  },
};

export const viteConfig: UserConfig = {
  plugins: [dts(), react()],
  build: {
    target: 'esnext',
    assetsInlineLimit: 8 * 1024,
    manifest: true,
    rollupOptions: {
      input: 'views/index.html',
    },
  },
  resolve: {
    alias: {
      '@/components': resolve(__dirname, 'components/'),
      '@/utils': resolve(__dirname, 'utils/'),
    },
    extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json'],
  },
  server: {
    fs: {
      allow: [resolve(__dirname, '.')],
    },
  },
};

export default defineConfig(viteConfig);
