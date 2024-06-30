import path, { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import type { RollupOptions } from 'rollup';
import type { BuildOptions, UserConfig } from 'vite';

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
    external: [
      'react',
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
    ],
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
export const umdReact: BuildOptions = {
  ...chunkOptimization,
  outDir: resolve(__dirname, 'dist/umd/react'),
  lib: {
    entry: resolve(__dirname, 'src/react/index.ts'),
    name: 'ranuts_react',
    fileName: 'react',
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
      react: resolve(__dirname, 'src/react/index.ts'),
      utils: resolve(__dirname, 'src/utils/index.ts'),
      wasm: resolve(__dirname, 'src/wasm/index.ts'),
      node: resolve(__dirname, 'src/node/index.ts'),
      ml: resolve(__dirname, 'src/ml/index.ts'),
      index: resolve(__dirname, 'index.ts'),
    },
    fileName: (_: string, name: string): string => {
      if(name === 'index'){
        return `${name}.js`
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
