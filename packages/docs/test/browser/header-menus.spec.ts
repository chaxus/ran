import { expect, test } from './fixtures';

test.use({ viewport: { width: 1440, height: 900 } });

test.beforeEach(async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/');
  await page.waitForFunction(() => customElements.get('r-theme-switch') && customElements.get('r-select'));
});

test('header chrome menus have no chevron and open on hover', async ({ page, browserName }) => {
  test.skip(browserName === 'firefox', 'hover menus need a fine pointer hover path');
  await expect(page.locator('.langs__chevron')).toHaveCount(0);

  const themeIcon = page.locator('.appearance .theme-switch');
  const iconHidden = await themeIcon.evaluate((host) => {
    const select = host.shadowRoot?.querySelector('r-select');
    const icon = select?.shadowRoot?.querySelector('.icon');
    if (!icon) return true;
    return getComputedStyle(icon).display === 'none';
  });
  expect(iconHidden).toBe(true);

  await page.locator('.langs__summary').hover();
  await expect(page.locator('.langs[open] > .langs__list')).toBeVisible();

  await page.locator('.appearance .theme-switch').hover();
  await expect(page.locator('.langs[open]')).toHaveCount(0);
  await expect(page.locator('r-dropdown.ran-chrome-menu').filter({ hasText: 'Light' })).toBeVisible();
});

test('hovering across language and theme skips the close-open blink', async ({ page, browserName }) => {
  test.skip(browserName !== 'chromium', 'data-chrome-switch is a fine-pointer handoff');
  await page.evaluate(() => {
    const state = window as unknown as { chromeHandoff?: boolean };
    state.chromeHandoff = false;
    const watch = new MutationObserver(() => {
      if (document.documentElement.hasAttribute('data-chrome-switch')) state.chromeHandoff = true;
    });
    watch.observe(document.documentElement, { attributes: true, attributeFilter: ['data-chrome-switch'] });
  });
  await page.locator('.langs__summary').hover();
  await expect(page.locator('.langs[open] > .langs__list')).toBeVisible();
  await page.locator('.appearance .theme-switch').hover();
  await expect(page.locator('.langs[open]')).toHaveCount(0);
  await expect(page.locator('r-dropdown.ran-chrome-menu').filter({ hasText: 'Light' })).toBeVisible();
  expect(await page.evaluate(() => (window as unknown as { chromeHandoff?: boolean }).chromeHandoff)).toBe(true);
});

test('language row wash sits under the label, not over it', async ({ page }) => {
  await page.locator('.langs__summary').hover();
  const list = page.locator('.langs[open] > .langs__list');
  await expect(list).toBeVisible();
  const row = list.locator('.langs__link').nth(1);
  await row.hover();
  const contrast = await row.evaluate((link) => {
    const fill = link.closest('.langs__list')?.querySelector('.hu__hover') as HTMLElement | null;
    const cs = getComputedStyle(link);
    const fillZ = fill ? getComputedStyle(fill).zIndex : 'none';
    return {
      color: cs.color,
      zIndex: cs.zIndex,
      position: cs.position,
      fillZ,
      fillOpacity: fill ? getComputedStyle(fill).opacity : '0',
    };
  });
  expect(contrast.position).toBe('relative');
  expect(Number(contrast.zIndex)).toBeGreaterThan(Number(contrast.fillZ === 'auto' ? 0 : contrast.fillZ));
  // Not washed-out white-on-wash — body ink on the soft pill.
  expect(contrast.color).not.toMatch(/^rgba?\(255/);
});
