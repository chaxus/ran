import { expect, test } from './fixtures';

/**
 * Header chrome (menubar / select / theme / surface) upgrades with the main
 * module graph so a refresh does not flash inert hosts. Home invite fields that
 * are still deferred (input) keep a CSS-reserved footprint until their chunk
 * finishes — raw r-option text stays hidden.
 */
test('eager header chrome upgrades; deferred invite input keeps a reserved shell', async ({ page }) => {
  let release!: () => void;
  const held = new Promise<void>((resolve) => {
    release = resolve;
  });
  await page.route(/\/assets\/input-[^/]+\.js$/, async (route) => {
    await held;
    await route.continue();
  });

  await page.setViewportSize({ width: 1440, height: 900 });
  // Held input never finishes, so `load` may never fire (WebKit). DOM is enough
  // to assert the CSS shell before the deferred chunk upgrades the host.
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  // Closed DSD is consumed into a closed root — it will not appear in page.content().
  // Assert the wire HTML still ships the declarative templates for header chrome.
  const wire = await page.request.get(page.url());
  const wireHtml = await wire.text();
  expect(wireHtml).toMatch(/header-utils[\s\S]*shadowrootmode="closed"/);
  expect(wireHtml).toMatch(/r-input class="example__field"[\s\S]*shadowrootmode="closed"/);
  expect(wireHtml).toMatch(/r-select class="example__field"[\s\S]*shadowrootmode="closed"/);
  expect(wireHtml).toMatch(/r-button class="example__submit"[^>]*data-ran-dsd/);

  await page.waitForFunction(
    () =>
      customElements.get('r-theme-switch') &&
      customElements.get('r-surface-switch') &&
      customElements.get('r-select') &&
      customElements.get('r-menubar'),
  );
  await expect(page.locator('.theme-switch:not(:defined)')).toHaveCount(0);
  await expect(page.locator('.lang-switch:not(:defined)')).toHaveCount(0);
  await expect(page.locator('.theme-switch')).toBeVisible();
  await expect(page.locator('.lang-switch')).toBeVisible();

  await expect.poll(() => page.locator('r-input.example__field:not(:defined)').count()).toBe(1);

  const shells = await page.evaluate(() => {
    const box = (el: Element | null) => {
      if (!el) return null;
      const r = el.getBoundingClientRect();
      return { width: Math.round(r.width), height: Math.round(r.height) };
    };
    return {
      lang: box(document.querySelector('.lang-switch')),
      theme: box(document.querySelector('.theme-switch')),
      surface: box(document.querySelector('.surface-switch')),
      email: box(document.querySelector('r-input.example__field:not(:defined)')),
      role: box(document.querySelector('r-select.example__field')),
    };
  });

  expect(shells.lang, 'language select').toMatchObject({ height: 32 });
  expect(shells.lang!.width).toBeGreaterThanOrEqual(56);
  expect(shells.theme, 'theme switch').toMatchObject({ height: 32 });
  expect(shells.theme!.width).toBeGreaterThanOrEqual(56);
  expect(shells.surface, 'surface switch').toMatchObject({ height: 32 });
  expect(shells.surface!.width).toBeGreaterThanOrEqual(72);
  expect(shells.email!.height).toBeGreaterThanOrEqual(48);
  expect(shells.role!.height).toBeGreaterThanOrEqual(48);

  release();
  await page.waitForFunction(() => customElements.get('r-input'));
  await expect(page.locator('r-input.example__field:not(:defined)')).toHaveCount(0);
  await expect(page.locator('r-input.example__field')).toBeVisible();
});
