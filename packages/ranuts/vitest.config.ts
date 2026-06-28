import { resolve } from 'node:path';
import { configDefaults, defineConfig } from 'vitest/config';

export default defineConfig({
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
    extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json'],
  },
  test: {
    // Only run TS sources under src/ and test/. The build emits compiled *.test.js
    // into dist/, which would otherwise be picked up as stale duplicate suites.
    exclude: [...configDefaults.exclude, 'dist/**'],
    onConsoleLog(log, type) {
      throw new Error(`Unexpected console.${type} in test: ${log}`);
    },
  },
});
