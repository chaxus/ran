import path, { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import vitePluginBanner from './plugins/vite-plugins-banner';

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

export default defineConfig({
  build: {
    minify: 'terser',
    rollupOptions: {
      inlineDynamicImports: true,
      external: ['node:fs', 'fs'],
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
  plugins: [dts(), vitePluginBanner()],
});
