import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { defineConfig } from 'vitest/config';
import loadSvg from './plugins/load-svg';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  plugins: [loadSvg({ svgo: false, defaultImport: 'raw' })],
  test: {
    // Pure Node.js — no DOM globals at all. This is what forces isSSR=true and
    // exercises the HTMLElementMock / ShadowRootMock code paths.
    environment: 'node',
    include: ['test/ssr/**/*.test.ts'],
    globals: true,
  },
  resolve: {
    alias: {
      '@/components': path.resolve(__dirname, 'components/'),
      '@/assets': path.resolve(__dirname, 'assets/'),
      '@/public': path.resolve(__dirname, 'public/'),
      '@/utils': path.resolve(__dirname, 'utils/'),
    },
  },
});
