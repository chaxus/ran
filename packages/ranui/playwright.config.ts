import { defineConfig, devices } from '@playwright/test';
import { DEV_SERVER } from './build/config';

export default defineConfig({
  testDir: './test/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  /**
   * Screenshot comparison is a **macOS-local** check. CI runs the functional assertions only.
   *
   * Baselines are committed under `test/e2e/*.spec.ts-snapshots/`, but Playwright puts the
   * platform in the filename — every one of them is `…-darwin.png`. The CI runner is Ubuntu, so
   * it would look for `…-linux.png`, find nothing, fail the first attempt with "A snapshot
   * doesn't exist, writing actual", then pass on retry against the file it just wrote. The job
   * would go green having compared each screenshot with itself; a gate that cannot fail is worse
   * than no gate, because it looks like one.
   *
   * Turning visual regression into a real CI gate needs a Linux-rendered baseline set —
   * generated in a container matching the runner and committed alongside the macOS one. That is
   * deliberately not done here; see CLAUDE.md ("Visual regression is local-only, on purpose").
   */
  ignoreSnapshots: !!process.env.CI,
  reporter: [['html']],
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
