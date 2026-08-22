import { defineConfig, devices } from '@playwright/test';
import { LOCAL_URL } from './app/lib/constant';

/**
 * End-to-end tests for the assembled application.
 *
 * The unit tests cover the pieces — the wire mapping, the budget, where a cut may land — and
 * every defect this app has shipped was in none of them. They were in what the browser draws
 * once the pieces are wired together: rows hidden by a stylesheet rule, a bubble collapsed to
 * one character, a transcript clipped at the right edge. That is what this suite is for.
 *
 * **It runs without an API key, on purpose.** The demo provider streams a canned answer
 * through the same controller, the same SSE framing and the same client pipeline as a real
 * one, so the whole path is exercised and CI needs no secret. A spec that needed a key would
 * be a spec that never ran.
 */
export default defineConfig({
  testDir: './test/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [['list']],
  use: {
    baseURL: LOCAL_URL,
    trace: 'on-first-retry',
    // Components live in closed shadow roots, so the only animation freeze that reaches them
    // is the media query ranui ships inside each root. See ranui's playwright.config.ts.
    contextOptions: { reducedMotion: 'reduce' },
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    // No key in the environment: the app answers from its built-in sample, which is the
    // point — see the note above.
    command: `IM_API_KEY= DEEPSEEK_API_KEY= ./node_modules/.bin/tsx ./app/index.ts`,
    url: LOCAL_URL,
    reuseExistingServer: false,
    timeout: 60_000,
  },
});
