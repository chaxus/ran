import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import { singleFileResolve, viteConfig } from '../vite.config.ts';

// Build one CommonJS graph so helpers and registered components share the same
// SSR registry and class identities. IIFE bundles remain self-contained.
export default defineConfig({
  ...viteConfig,
  resolve: singleFileResolve,
  define: {
    'import.meta.env.DEV': 'false',
    'import.meta.env.PROD': 'true',
    'import.meta.env.SSR': 'false',
  },
  build: {
    outDir: resolve('dist'),
    emptyOutDir: false,
    minify: 'esbuild',
    lib: {
      entry: Object.fromEntries(
        ['index', 'builder', 'ssr', 'ssr-stream', 'theme', 'testing', 'i18n'].map((entry) => [
          entry,
          resolve(`${entry}.ts`),
        ]),
      ),
      formats: ['cjs'],
      fileName: (_format, entry) => `${entry}.cjs`,
    },
    rollupOptions: {
      external: (id) =>
        ['react', 'react-dom', 'vue', 'ranuts', 'ranuts/utils', '@alixex/ranview'].some(
          (name) => id === name || (name !== 'ranuts' && id.startsWith(`${name}/`)),
        ),
      output: { exports: 'named', chunkFileNames: '[name]-[hash].cjs' },
    },
  },
});
