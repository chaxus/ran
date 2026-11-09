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

test('header tools share one gap and hug their labels', async ({ page }) => {
  const metrics = await page.evaluate(() => {
    const q = (s: string) => document.querySelector<HTMLElement>(s);
    const gapBetween = (a: HTMLElement | null, b: HTMLElement | null) =>
      a && b ? b.getBoundingClientRect().left - a.getBoundingClientRect().right : NaN;
    const search = q('.search-open');
    const langs = q('.langs__summary');
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
  // Hug content: no 180px floor (computed min-width is auto/0).
  expect(['0px', 'auto']).toContain(metrics.searchMin);
  expect(metrics.searchJustify).not.toBe('space-between');
  expect(metrics.searchWidth).toBeLessThan(160);
  for (const gap of metrics.between) expect(gap).toBeCloseTo(8, 0);
  expect(['0', '0px']).toContain(metrics.themeMin);
  expect(['0', '0px']).toContain(metrics.surfaceMin);
});

test('language menu open transition travels through opacity and rise', async ({ page, browserName }) => {
  test.skip(browserName !== 'chromium', '@starting-style open sampling is chromium-first');
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.mouse.move(0, 0);
  await page.evaluate(() => {
    const details = document.querySelector<HTMLDetailsElement>('details.langs');
    if (details) details.open = false;
  });
  const samples: Array<{ open: boolean; opacity: number; y: number }> = [];
  const hover = page.locator('.langs__summary').hover();
  for (let i = 0; i < 10; i++) {
    samples.push(
      await page.evaluate(() => {
        const list = document.querySelector('.langs__list');
        const cs = list ? getComputedStyle(list) : null;
        const transform = cs?.transform ?? 'none';
        const match = /matrix\(([^)]+)\)/.exec(transform);
        const parts = match?.[1]?.split(',').map((n) => Number(n.trim())) ?? [];
        return {
          open: !!document.querySelector('.langs[open]'),
          opacity: Number(cs?.opacity ?? 0),
          y: parts.length >= 6 ? parts[5]! : 0,
        };
      }),
    );
    await page.waitForTimeout(20);
  }
  await hover;
  const mid = samples.find((s) => s.open && s.opacity > 0.05 && s.opacity < 0.95);
  expect(mid, `expected a mid-flight sample, got ${JSON.stringify(samples)}`).toBeTruthy();
  // Opens by rising from below (positive Y) into place.
  expect(mid!.y).toBeGreaterThan(0);
});
