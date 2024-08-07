import path, { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import type { BuildOptions, UserConfig } from 'vite';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import type { RollupOptions } from 'rollup';
import { PORT } from './build/config';

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

interface chunkOptimization {
  assetsInlineLimit: number;
  chunkSizeWarningLimit: number;
  reportCompressedSize: boolean;
  rollupOptions: RollupOptions;
  minify: boolean | 'terser' | 'esbuild' | undefined;
}

const chunkOptimization: Partial<chunkOptimization> = {
  chunkSizeWarningLimit: 500,
  assetsInlineLimit: 1024,
  reportCompressedSize: false,
  rollupOptions: {
    external: ['react'],
    output: {
      experimentalMinChunkSize: 500,
    },
    treeshake: {
      preset: 'recommended',
      manualPureFunctions: ['console.log'],
    },
  },
  minify: 'terser',
};

export const umd: BuildOptions = {
  ...chunkOptimization,
  outDir: resolve(__dirname, 'dist/umd'),
  lib: {
    entry: resolve(__dirname, 'index.ts'),
    name: 'ranuireact',
    fileName: 'index',
    formats: ['umd'],
  },
};

export const es: BuildOptions = {
  ...chunkOptimization,
  lib: {
    entry: resolve(__dirname, 'index.ts'),
    fileName: 'index',
    formats: ['es'],
  },
};

export const viteConfig: UserConfig = {
  plugins: [react()],
  resolve: {
    alias: {
      '@/components': resolve(__dirname, 'components/'),
      '@/utils': resolve(__dirname, 'utils/'),
    },
    extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json'],
  },
  server: {
    port: PORT,
  },
};

export default defineConfig(viteConfig);
