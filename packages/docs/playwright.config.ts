import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './test/browser',
  outputDir: '../../.temp/docs-preview-results',
  fullyParallel: true,
  workers: process.env.CI ? 1 : 2,
  forbidOnly: Boolean(process.env.CI),
  retries: 0,
  use: { baseURL: 'http://127.0.0.1:5281', serviceWorkers: 'block', trace: 'retain-on-failure' },
  projects: [
    { name: 'chromium', use: devices['Desktop Chrome'] },
    { name: 'firefox', use: devices['Desktop Firefox'] },
    { name: 'webkit', use: devices['Desktop Safari'] },
  ],
  webServer: {
    command: 'pnpm preview',
    env: { PORT: '5281' },
    url: 'http://127.0.0.1:5281',
    reuseExistingServer: false,
  },
});
