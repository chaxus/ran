import { defineConfig } from 'vite';
import { resolve } from 'node:path';

/**
 * Bundles the documentation site's one client entry into `dist-next/assets/`.
 *
 * `emptyOutDir: false` because the generator owns the output and clears it once, before
 * calling this — vite clearing it again would delete what was already copied in.
 */
export default defineConfig({
  build: {
    outDir: 'dist',
    emptyOutDir: false,
    manifest: true,
    target: 'es2022',
    cssCodeSplit: false,
    rollupOptions: {
      input: { docs: resolve(import.meta.dirname, 'client/main.ts') },
      output: { entryFileNames: 'assets/[name].[hash].js', assetFileNames: 'assets/[name].[hash][extname]' },
    },
  },
});
