import { defineConfig } from 'vitest/config';
import { resolve } from 'node:path';

export default defineConfig({
  resolve: {
    alias: { '@': resolve(__dirname, '.') },
  },
  test: {
    // Node environment: the only thing under test here is the wire mapping, which is pure.
    include: ['test/**/*.test.ts'],
  },
});
