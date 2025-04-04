import path, { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, './index.ts'),
      name: 'visual',
      fileName: 'index',
      formats: ['umd'],
    },
    chunkSizeWarningLimit: 500,
    assetsInlineLimit: 1024,
    reportCompressedSize: false,
    rollupOptions: {
      output: {
        experimentalMinChunkSize: 500,
      },
      treeshake: {
        preset: 'recommended',
        manualPureFunctions: ['console.log'],
      },
    },
    minify: 'terser',
  },
  resolve: {
    alias: {
      '@/lib': resolve(__dirname, '/lib'),
      '@/src': resolve(__dirname, '/src'),
      '@/assets': resolve(__dirname, '/assets'),
    },
    extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json'],
  },
});
