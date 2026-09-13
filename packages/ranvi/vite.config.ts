import { resolve } from 'node:path';
import { defineConfig } from 'vite';

/**
 * A library build with three entry points, and `ranuts` left external.
 *
 * `escapeHtml` lives in ranuts and is a runtime dependency, not something to inline —
 * bundling it would give a consumer that already has ranuts two copies of the same
 * function and, worse, two different ones the day the versions drift.
 */
export default defineConfig({
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: true,
    lib: {
      entry: {
        index: resolve(__dirname, 'src/index.ts'),
        signal: resolve(__dirname, 'src/signal.ts'),
        mocks: resolve(__dirname, 'src/mocks.ts'),
      },
      formats: ['es', 'cjs'],
      fileName: (format, name) => `${name}.${format === 'es' ? 'js' : 'cjs'}`,
    },
    rollupOptions: {
      external: (id: string): boolean => id === 'ranuts' || id.startsWith('ranuts/'),
    },
  },
});
