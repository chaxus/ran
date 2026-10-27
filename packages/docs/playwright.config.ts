import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './test/browser',
  outputDir: '../../.temp/docs-preview-results',
  fullyParallel: true,
  workers: process.env.CI ? 1 : 2,
  forbidOnly: Boolean(process.env.CI),
  retries: 0,
  use: {
    baseURL: 'http://127.0.0.1:5281',
    serviceWorkers: 'block',
    trace: 'retain-on-failure',
    // The site scrolls smoothly (`html { scroll-behavior: smooth }`), so the scroll that brings
    // a target into view before a click animates; WebKit then presses on one element and
    // releases on whichever has moved under the pointer, and the click lands on neither.
    // Reduced motion turns smooth scrolling off. A spec about motion opts back in per page.
    contextOptions: { reducedMotion: 'reduce' },
  },
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
