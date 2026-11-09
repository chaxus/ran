import { expect, test } from './fixtures';

test.use({ viewport: { width: 1440, height: 900 } });

test.beforeEach(async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/');
  await page.waitForFunction(
    () => customElements.get('r-theme-switch') && customElements.get('r-surface-switch') && customElements.get('r-select'),
  );
});

const chromePanel = (page: import('@playwright/test').Page, text: string) =>
  page.locator('r-dropdown.ran-chrome-menu[role="listbox"]').filter({ hasText: text });

test('header chrome menus have no chevron and open on hover', async ({ page, browserName }) => {
  test.skip(browserName === 'firefox', 'hover menus need a fine pointer hover path');
  await expect(page.locator('.langs__chevron, details.langs')).toHaveCount(0);
  await expect(page.locator('.lang-switch')).toHaveCount(1);

  const themeIcon = page.locator('.appearance .theme-switch');
  const iconHidden = await themeIcon.evaluate((host) => {
    const select = host.shadowRoot?.querySelector('r-select');
    const icon = select?.shadowRoot?.querySelector('.icon');
    if (!icon) return true;
    return getComputedStyle(icon).display === 'none';
  });
  expect(iconHidden).toBe(true);

  await page.locator('.lang-switch').hover();
  await expect(chromePanel(page, 'English')).toBeVisible();

  await page.locator('.appearance .theme-switch').hover();
  await expect(chromePanel(page, 'Light')).toBeVisible();
  await expect(chromePanel(page, 'English')).toBeHidden();

  await page.locator('.appearance .surface-switch').hover();
  await expect(chromePanel(page, 'Graphite')).toBeVisible();
  await expect(chromePanel(page, 'Light')).toBeHidden();
});

test('hovering across chrome menus marks a handoff and morphs the panel', async ({ page, browserName }) => {
  test.skip(browserName !== 'chromium', 'FLIP handoff sampling is chromium-first');
  await page.evaluate(() => {
    const state = window as unknown as { chromeHandoff?: boolean; flipSamples?: number[] };
    state.chromeHandoff = false;
    state.flipSamples = [];
    const watch = new MutationObserver(() => {
      if (document.documentElement.hasAttribute('data-chrome-switch')) state.chromeHandoff = true;
    });
    watch.observe(document.documentElement, { attributes: true, attributeFilter: ['data-chrome-switch'] });
  });
  await page.locator('.lang-switch').hover();
  await expect(chromePanel(page, 'English')).toBeVisible();
  const fromLeft = await chromePanel(page, 'English').evaluate((el) => el.getBoundingClientRect().left);

  await page.locator('.appearance .theme-switch').hover();
  await expect(chromePanel(page, 'Light')).toBeVisible();
  expect(await page.evaluate(() => (window as unknown as { chromeHandoff?: boolean }).chromeHandoff)).toBe(true);

  // Sample the morphing host while FLIP runs — left should travel toward the theme trigger.
  const samples: number[] = [];
  for (let i = 0; i < 8; i++) {
    samples.push(
      await page.evaluate(() => {
        const el = [...document.querySelectorAll<HTMLElement>('r-dropdown.ran-chrome-menu')].find(
          (node) => getComputedStyle(node).display !== 'none' && node.getClientRects().length,
        );
        if (!el) return NaN;
        const t = getComputedStyle(el).transform;
        const m = /matrix\(([^)]+)\)/.exec(t);
        const parts = m?.[1]?.split(',').map((n) => Number(n.trim())) ?? [];
        const dx = parts.length >= 6 ? parts[4]! : 0;
        return el.getBoundingClientRect().left - dx;
      }),
    );
    await page.waitForTimeout(25);
  }
  const toLeft = await chromePanel(page, 'Light').evaluate((el) => el.getBoundingClientRect().left);
  expect(Math.abs(toLeft - fromLeft)).toBeGreaterThan(8);
  const mid = samples.find((x) => Number.isFinite(x) && x !== fromLeft && x !== toLeft);
  expect(mid, `expected a mid-flight left, got ${JSON.stringify(samples)}`).toBeTruthy();
});

test('header tools share one gap and hug their labels', async ({ page }) => {
  const metrics = await page.evaluate(() => {
    const q = (s: string) => document.querySelector<HTMLElement>(s);
    const gapBetween = (a: HTMLElement | null, b: HTMLElement | null) =>
      a && b ? b.getBoundingClientRect().left - a.getBoundingClientRect().right : NaN;
    const search = q('.search-open');
    const langs = q('.lang-switch');
    const theme = q('.theme-switch');
    const surface = q('.surface-switch');
    return {
      toolsGap: getComputedStyle(q('.header-tools')!).gap,
      utilsGap: getComputedStyle(q('.header-utils')!).gap,
      appearanceGap: getComputedStyle(q('.appearance')!).gap,
      searchMin: getComputedStyle(search!).minWidth,
      searchJustify: getComputedStyle(search!).justifyContent,
      searchWidth: search!.getBoundingClientRect().width,
      between: [gapBetween(search, langs), gapBetween(langs, theme), gapBetween(theme, surface)],
      themeMin: getComputedStyle(theme!).getPropertyValue('--ran-theme-switch-min-width').trim(),
      surfaceMin: getComputedStyle(surface!).getPropertyValue('--ran-surface-switch-min-width').trim(),
    };
  });
  expect(metrics.toolsGap).toBe('8px');
  expect(metrics.utilsGap).toBe('8px');
  expect(metrics.appearanceGap).toBe('8px');
  expect(['0px', 'auto']).toContain(metrics.searchMin);
  expect(metrics.searchJustify).not.toBe('space-between');
  expect(metrics.searchWidth).toBeLessThan(160);
  for (const gap of metrics.between) expect(gap).toBeCloseTo(8, 0);
  expect(['0', '0px']).toContain(metrics.themeMin);
  expect(['0', '0px']).toContain(metrics.surfaceMin);
});
