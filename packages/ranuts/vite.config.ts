import path, { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import type { BuildOptions, UserConfig } from 'vite';

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

const chunkOptimization: Partial<BuildOptions> = {
  chunkSizeWarningLimit: 500,
  assetsInlineLimit: 1024,
  reportCompressedSize: false,
  rollupOptions: {
    treeshake: {
      manualPureFunctions: ['console.log'],
    },
  },
  minify: 'terser',
};

export const iife: BuildOptions = {
  ...chunkOptimization,
  outDir: resolve(__dirname, 'dist/iife'),
  emptyOutDir: false,
  lib: {
    entry: resolve(__dirname, 'index.ts'),
    name: 'ranuts',
    fileName: 'index',
    formats: ['iife'],
  },
};

export const iifeUtil: BuildOptions = {
  ...chunkOptimization,
  outDir: resolve(__dirname, 'dist/iife'),
  emptyOutDir: false,
  lib: {
    entry: resolve(__dirname, 'src/utils/index.ts'),
    name: 'ranuts_utils',
    fileName: 'utils',
    formats: ['iife'],
  },
};

export const es: BuildOptions = {
  ...chunkOptimization,
  // Keep unrelated initialization in separate modules so consumer tree shaking
  // does not depend on how many public entry points happen to share a chunk.
  minify: 'esbuild',
  rollupOptions: {
    ...chunkOptimization.rollupOptions,
    output: { preserveModules: true, preserveModulesRoot: __dirname },
  },
  lib: {
    entry: {
      utils: resolve(__dirname, 'src/utils/index.ts'),
      index: resolve(__dirname, 'index.ts'),
      'utils/visual': resolve(__dirname, 'src/utils/visual/index.ts'),
      // Its own entry so `ranuts/i18n` costs only the i18n engine and its two helpers,
      // instead of dragging in whatever else the `ranuts/utils` barrel happens to share.
      'utils/i18n': resolve(__dirname, 'src/utils/i18n.ts'),
      // Its own entry because it runs in a ServiceWorkerGlobalScope — no window, no document.
      sw: resolve(__dirname, 'src/sw/index.ts'),
      vnode: resolve(__dirname, 'src/vnode/index.ts'),
      // Its own entry so a consumer folding a model stream on a server or in a test
      // does not pull the DOM-oriented `ranuts/utils` barrel along with it.
      stream: resolve(__dirname, 'src/stream/index.ts'),
      // Its own entry for the same reason as `stream`: projecting a log into nodes is
      // DOM-free, and a consumer doing it on a server should not pull `ranuts/utils`.
      conversation: resolve(__dirname, 'src/conversation/index.ts'),
    },
    fileName: (_: string, name: string): string => {
      if (name === 'index' || name.startsWith('src/')) {
        return `${name}.js`;
      }
      return `src/${name}/index.js`;
    },
    formats: ['es'],
  },
};

export const viteConfig: UserConfig = {
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
    extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json'],
  },
  plugins: [],
};

export default defineConfig(viteConfig);
