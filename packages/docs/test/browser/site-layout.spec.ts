import { expect, test } from '@playwright/test';

/**
 * Layout invariants for the pages a visitor is most likely to land on, at phone, tablet and
 * desktop widths. Each is a rule the site states (no horizontal page scroll, navigation
 * reachable at every width, nothing moving under reduced motion), checked by measurement
 * rather than by a reviewed screenshot, so it runs on every engine in CI.
 */
const PAGES = [
  '/',
  '/cn/',
  '/fa/',
  '/design/',
  '/design/guide',
  '/ranui/',
  '/ranui/button/',
  '/ranui/select/',
  '/cn/ranui/input/',
  '/ranuts/',
  '/agents/',
  '/articles/doc_preview',
];
const WIDTHS = [320, 768, 1280];

for (const width of WIDTHS) {
  test.describe(`${width}px`, () => {
    test.use({ viewport: { width, height: 900 } });

    for (const path of PAGES) {
      test(`${path} stays within the viewport and keeps every way out`, async ({ page }) => {
        // `use.reducedMotion` is not a top-level option in this Playwright; emulate it per page.
        await page.emulateMedia({ reducedMotion: 'reduce' });
        await page.goto(path);
        // Not `networkidle`: the site keeps prefetching in idle time by design.
        await page.waitForFunction(() => document.readyState === 'complete' && customElements.get('r-theme-switch'));

        // The page itself never scrolls sideways; wide tables and code scroll in their wrappers.
        const overflow = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth);
        expect(overflow, 'horizontal page overflow').toBeLessThanOrEqual(0);

        // The product navigation is reachable: in the header when it fits, else in the drawer.
        const header = page.locator('.site-header .nav__link');
        const drawer = page.locator('.drawer__button');
        if (await header.first().isVisible()) await expect(header).toHaveCount(4);
        else await expect(drawer).toBeVisible();

        // The secondary destinations stay one link away on every page.
        await expect(page.locator('.site-footer a')).toHaveCount(2);

        // Reduced motion leaves nothing animating.
        const running = await page.evaluate(
          () => document.getAnimations().filter((animation) => animation.playState === 'running').length,
        );
        expect(running, 'animations running under reduced motion').toBe(0);
      });
    }
  });
}
