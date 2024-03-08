import path, { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

export default defineConfig({
  build: {
    minify: 'terser',
    rollupOptions: {
      output: {
        // inlineDynamicImports: true,
        experimentalMinChunkSize: 1000,
      },
      external: ['node:fs', 'fs', 'react', 'node:os', 'os'],
    },
    lib: {
      entry: './index.ts',
      name: 'ranuts',
      fileName: 'index',
      // 导出模块格式
      formats: ['es', 'umd'],
    },
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
    extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json'],
  },
  plugins: [],
});
