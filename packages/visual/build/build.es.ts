import path, { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import type { BuildEnvironmentOptions } from 'vite';
import viteConfig from '../vite.config';

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

const build: BuildEnvironmentOptions = {
    lib: {
        entry: resolve(__dirname, '../index.ts'),
        fileName: 'index',
        formats: ['es'],
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
}

export default defineConfig({ ...viteConfig, build });
