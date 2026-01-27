import path, { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import type { BuildOptions, UserConfig } from 'vite';

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

const external = [
  'react',
  'os',
  'fs',
  'child_process',
  'http',
  'https',
  'tty',
  'process',
  'path',
  'net',
  'stream',
  'util',
  'crypto',
  'events',
  'buffer',
  'readline',
  'node:os',
  'node:fs',
  'node:child_process',
  'node:http',
  'node:https',
  'node:tty',
  'node:process',
  'node:path',
  'node:net',
  'node:stream',
  'node:util',
  'node:crypto',
  'node:events',
  'node:buffer',
  'node:readline',
];

const list2map = (list: string[]): Record<string, string> => {
  return list.reduce((acc: Record<string, string>, cur) => {
    acc[cur] = cur;
    return acc;
  }, {});
};

const chunkOptimization: Partial<BuildOptions> = {
  chunkSizeWarningLimit: 500,
  assetsInlineLimit: 1024,
  reportCompressedSize: false,
  rollupOptions: {
    external,
    output: {
      experimentalMinChunkSize: 500,
      globals: {
        ...list2map(external),
      },
    },
    treeshake: {
      preset: 'recommended',
      manualPureFunctions: ['console.log'],
    },
  } as any,
  minify: 'terser',
};

export const umd: BuildOptions = {
  ...chunkOptimization,
  outDir: resolve(__dirname, 'dist/umd'),
  lib: {
    entry: resolve(__dirname, 'index.ts'),
    name: 'ranuts',
    fileName: 'index',
    formats: ['umd'],
  },
};

export const umdUtil: BuildOptions = {
  ...chunkOptimization,
  outDir: resolve(__dirname, 'dist/umd/utils'),
  lib: {
    entry: resolve(__dirname, 'src/utils/index.ts'),
    name: 'ranuts_utils',
    fileName: 'utils',
    formats: ['umd'],
  },
};
export const umdWasm: BuildOptions = {
  ...chunkOptimization,
  outDir: resolve(__dirname, 'dist/umd/wasm'),
  lib: {
    entry: resolve(__dirname, 'src/wasm/index.ts'),
    name: 'ranuts_wasm',
    fileName: 'wasm',
    formats: ['umd'],
  },
};

export const umdNode: BuildOptions = {
  ...chunkOptimization,
  outDir: resolve(__dirname, 'dist/umd/node'),
  lib: {
    entry: resolve(__dirname, 'src/node/index.ts'),
    name: 'ranuts_node',
    fileName: 'node',
    formats: ['umd'],
  },
};
export const umdMl: BuildOptions = {
  ...chunkOptimization,
  outDir: resolve(__dirname, 'dist/umd/ml'),
  lib: {
    entry: resolve(__dirname, 'src/ml/index.ts'),
    name: 'ranuts_ml',
    fileName: 'ml',
    formats: ['umd'],
  },
};

export const es: BuildOptions = {
  ...chunkOptimization,
  lib: {
    entry: {
      utils: resolve(__dirname, 'src/utils/index.ts'),
      wasm: resolve(__dirname, 'src/wasm/index.ts'),
      node: resolve(__dirname, 'src/node/index.ts'),
      ml: resolve(__dirname, 'src/ml/index.ts'),
      index: resolve(__dirname, 'index.ts'),
    },
    fileName: (_: string, name: string): string => {
      if (name === 'index') {
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
