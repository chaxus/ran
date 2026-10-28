import { expect, test } from './fixtures';

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
  '/ranuts/choosing/',
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
        // The last one names the author and leads to their own site, in Chinese for Chinese pages.
        await expect(page.locator('.site-footer a[rel="author"]')).toHaveAttribute(
          'href',
          path.startsWith('/cn/') ? 'https://chaxus.com/zh/' : 'https://chaxus.com/',
        );

        // Reduced motion leaves nothing animating.
        const running = await page.evaluate(
          () => document.getAnimations().filter((animation) => animation.playState === 'running').length,
        );
        expect(running, 'animations running under reduced motion').toBe(0);
      });
    }
  });
}

// Search engines and answer engines tie ran to its author through this graph; chaxus.com
// publishes the same Person under the same @id.
for (const home of ['/', '/cn/', '/ja/']) {
  test(`${home} describes the site and both libraries as the work of one author`, async ({ page }) => {
    await page.goto(home);
    const graph = JSON.parse((await page.locator('script[type="application/ld+json"]').textContent()) ?? '{}')[
      '@graph'
    ];
    const person = graph.find((node: { '@type': string }) => node['@type'] === 'Person');
    expect(person).toMatchObject({ '@id': 'https://chaxus.com/#person', name: 'chaxus', url: 'https://chaxus.com/' });
    const works = graph.filter((node: { '@type': string }) => node['@type'] !== 'Person');
    expect(works.map((node: { name: string }) => node.name)).toEqual(['ran', 'ranui', 'ranuts']);
    for (const work of works) {
      expect(work.author).toEqual({ '@id': person['@id'] });
      expect(work.publisher).toEqual({ '@id': person['@id'] });
    }
  });
}
