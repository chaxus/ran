import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { defineConfig } from 'vitest/config';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  test: {
    environment: 'jsdom',
    include: ['test/unit/**/*.test.ts', 'test/integration/**/*.test.ts'],
    globals: true,
    clearMocks: true,
    setupFiles: ['test/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: ['components/**/*.ts', 'utils/**/*.ts'],
      exclude: ['components/**/*.test.ts'],
      thresholds: {
        statements: 80,
        branches: 70,
        functions: 85,
        lines: 80,
      },
    },
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
