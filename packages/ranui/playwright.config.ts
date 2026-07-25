import { defineConfig, devices, type ReporterDescription } from '@playwright/test';
import { DEV_SERVER } from './build/config';

const reporters: ReporterDescription[] = [['html']];
if (process.env.ARGOS_TOKEN) {
  reporters.push(['@argos-ci/playwright/reporter']);
}

export default defineConfig({
  testDir: './test/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  /**
   * `toHaveScreenshot` is a **local** tool only; on CI the visual gate is Argos.
   *
   * Its baselines live in the gitignored `screenshots/`, so a CI checkout has none. Without
   * this flag the first attempt would fail with "A snapshot doesn't exist, writing actual",
   * the retry would find the file it just wrote and pass, and the job would go green having
   * compared each screenshot against itself — a gate that can never fail is worse than no
   * gate, because it looks like one. Argos holds the real baselines and compares
   * cross-platform, which is what a Linux runner needs against macOS-authored screenshots.
   */
  ignoreSnapshots: !!process.env.CI,
  reporter: reporters,
  use: {
    baseURL: DEV_SERVER,
    trace: 'on-first-retry',
    /**
     * The only animation freeze that actually reaches a ranui component.
     *
     * Every component lives in a **closed** shadow root, and both of the obvious approaches
     * stop at that boundary: `page.addStyleTag()` injects into the document, whose stylesheets
     * do not cascade into a shadow tree, and Playwright's own `animations: 'disabled'` works
     * through `document.getAnimations()`, which cannot see into a closed root either. Neither
     * fails loudly — the animation simply keeps running, and `toHaveScreenshot` then dies with
     * "Failed to take two consecutive stable screenshots" on every spinner.
     *
     * Emulating the media query works because ranui ships `REDUCED_MOTION_CSS` *inside* each
     * shadow root (see `utils/component.ts`), so the rule is already on the right side of the
     * boundary. It zeroes durations and iteration counts only — nothing appears or disappears,
     * so screenshots still capture the real component.
     *
     * Goes through `contextOptions`: `@playwright/test` 1.61 does not expose `reducedMotion`
     * as a top-level `use` key, only on the browser context.
     */
    contextOptions: { reducedMotion: 'reduce' },
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] },
    // },
    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },

    /* Test against mobile viewports. */
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },

    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },
    {
      name: 'Google Chrome',
      use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    },
  ],

  /* Run your local dev server before starting the tests */
  webServer: {
    command: 'npm run dev',
    url: DEV_SERVER,
    reuseExistingServer: !process.env.CI,
  },
});
