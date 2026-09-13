import { defineConfig } from 'vitest/config';

/**
 * One config, two environments.
 *
 * The library has a browser path (real `document`) and a server path (the mocks, where
 * `isSSR` is true because there is no `document` at all). Node is the default so the SSR
 * path is exercised as it really runs; the browser suites opt in with a
 * `@vitest-environment jsdom` docblock. Splitting into two config files, which is what
 * ranui does, would mean two commands and two chances to forget one.
 */
export default defineConfig({
  test: {
    environment: 'node',
    include: ['test/**/*.test.ts'],
    globals: true,
  },
});
