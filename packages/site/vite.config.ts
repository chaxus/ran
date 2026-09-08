import { defineConfig } from 'vite';
import { resolve } from 'node:path';

/**
 * Bundles the one client entry into `dist/assets/` and writes the manifest the
 * generator reads to discover the hashed filenames.
 *
 * `emptyOutDir: false` because the generator owns `dist/` and clears it once, before
 * calling this — vite clearing it again would delete the pages already written.
 */
export default defineConfig({
  build: {
    outDir: 'dist',
    emptyOutDir: false,
    manifest: true,
    target: 'es2022',
    cssCodeSplit: false,
    rollupOptions: {
      input: { site: resolve(import.meta.dirname, 'client/main.ts') },
      output: { entryFileNames: 'assets/[name].[hash].js', assetFileNames: 'assets/[name].[hash][extname]' },
    },
  },
});
