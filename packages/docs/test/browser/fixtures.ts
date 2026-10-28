import { test as base } from '@playwright/test';

export * from '@playwright/test';

/**
 * Playwright's `test`, kept to the site under test: every request to another host is aborted.
 *
 * A page is not loaded until its images are. `/ranui/` shows a contributors image from
 * contrib.rocks, and in CI that request once never answered, so `page.goto` waited out the
 * whole test timeout on two specs. The analytics tags are cut for the same reason, and so
 * that test runs are not counted as visits.
 */
export const test = base.extend<{ localOnly: void }>({
  localOnly: [
    async ({ context }, use) => {
      // Only network requests: `blob:` and `data:` URLs have no host and are the page's own.
      await context.route(
        (url) => /^https?:$/.test(url.protocol) && url.hostname !== '127.0.0.1' && url.hostname !== 'localhost',
        (route) => route.abort(),
      );
      await use();
    },
    { auto: true },
  ],
});
