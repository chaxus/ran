import { defineConfig, devices } from '@playwright/test';
import base from './playwright.config';

/** All visual baselines are rendered by the same digest-pinned Linux arm64 image. */
export default defineConfig({
  ...base,
  forbidOnly: true,
  grep: /@visual/,
  retries: 0,
  workers: 2,
  ignoreSnapshots: false,
  updateSnapshots: 'none',
  globalSetup: './test/visual/setup.mjs',
  outputDir: './test-results/visual/results',
  reporter: [['html', { outputFolder: './test-results/visual/report', open: 'never' }], ['line']],
  snapshotPathTemplate: '{testDir}/__screenshots__/linux-arm64/{testFilePath}/{projectName}/{arg}{ext}',
  use: {
    ...base.use,
    locale: 'en-US',
    timezoneId: 'UTC',
    colorScheme: 'light',
    launchOptions: { args: ['--use-angle=swiftshader'] },
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'Mobile Chrome', use: { ...devices['Pixel 5'] } },
  ],
  webServer: { ...base.webServer!, reuseExistingServer: false },
});
