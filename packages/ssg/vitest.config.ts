import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['test/**/*.test.ts'],
    // The engine is pure functions plus filesystem work; nothing here needs a DOM.
    environment: 'node',
  },
});
