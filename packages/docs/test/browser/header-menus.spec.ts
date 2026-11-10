import { expect, test } from './fixtures';

test.use({ viewport: { width: 1440, height: 900 } });

test.beforeEach(async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/');
  await page.waitForFunction(
    () =>
      customElements.get('r-menubar') &&
      customElements.get('r-theme-switch') &&
      customElements.get('r-surface-switch') &&
      customElements.get('r-select'),
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
      if (document.documentElement.hasAttribute('data-ran-menubar-switch')) state.chromeHandoff = true;
    });
    watch.observe(document.documentElement, { attributes: true, attributeFilter: ['data-ran-menubar-switch'] });
  });
  await page.waitForFunction(() => customElements.get('r-menubar'));
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

test('language chrome panel is wide enough for longer option labels', async ({ page }) => {
  await page.locator('.lang-switch').evaluate((host: HTMLElement & { open: boolean }) => {
    host.open = true;
  });
  const panel = page.locator('r-dropdown.ran-chrome-menu[role="listbox"]').filter({ hasText: 'English' });
  await expect(panel).toBeVisible();
  const metrics = await panel.evaluate((el) => {
    const host = el.getBoundingClientRect();
    const trigger = document.querySelector('.lang-switch')!.getBoundingClientRect();
    const items = [...el.querySelectorAll('r-dropdown-item')].map((item) => ({
      text: item.textContent?.trim() ?? '',
      // Light-DOM host width — closed shadow labels are not readable here.
      width: Math.round(item.getBoundingClientRect().width),
    }));
    return {
      hostWidth: Math.round(host.width),
      triggerWidth: Math.round(trigger.width),
      // Prefer the inline floor the library sets — WebKit can report computed
      // min-width as 0px while width:max-content still grows past the trigger.
      triggerFloor:
        el.style.minWidth || el.style.getPropertyValue('--ran-select-trigger-width') || getComputedStyle(el).minWidth,
      sample: items.find((item) => /Português|简体中文/.test(item.text)) ?? items[0] ?? null,
    };
  });
  // Library floors min-width at the trigger (Floating UI / Radix); content may grow.
  expect(metrics.hostWidth).toBeGreaterThan(metrics.triggerWidth);
  expect(parseFloat(metrics.triggerFloor)).toBeGreaterThanOrEqual(metrics.triggerWidth - 1);
  expect(metrics.sample).not.toBeNull();
  // Option row sits inside the panel's 4px inset padding on each side.
  expect(metrics.sample!.width).toBeGreaterThanOrEqual(metrics.hostWidth - 16);
});

test('surface chrome panel does not clip Liquid glass', async ({ page }) => {
  // Surface may be hidden below ~1100px; this suite uses 1440.
  await page.locator('.appearance .surface-switch').evaluate((host: HTMLElement & { open: boolean }) => {
    host.open = true;
  });
  const panel = page.locator('r-dropdown.ran-chrome-menu[role="listbox"]').filter({ hasText: 'Liquid glass' });
  await expect(panel).toBeVisible();
  const metrics = await panel.evaluate((el) => {
    const host = el.getBoundingClientRect();
    const trigger = document.querySelector('.appearance .surface-switch')!.getBoundingClientRect();
    const liquid = [...el.querySelectorAll('r-dropdown-item')].find((item) =>
      /Liquid glass|液态玻璃/.test(item.textContent ?? ''),
    );
    const item = liquid?.getBoundingClientRect();
    return {
      hostWidth: Math.round(host.width),
      triggerWidth: Math.round(trigger.width),
      itemWidth: item ? Math.round(item.width) : 0,
      itemRight: item ? Math.round(item.right) : 0,
      hostRight: Math.round(host.right),
      clipped: item ? item.right > host.right + 1 : true,
    };
  });
  expect(metrics.hostWidth).toBeGreaterThan(metrics.triggerWidth);
  expect(metrics.itemWidth).toBeGreaterThan(0);
  expect(metrics.clipped, `Liquid glass clipped: itemRight=${metrics.itemRight} hostRight=${metrics.hostRight}`).toBe(
    false,
  );
});

test('header tools share one gap and hug their labels', async ({ page }) => {
  const metrics = await page.evaluate(() => {
    const q = (s: string) => document.querySelector<HTMLElement>(s);
    const gapBetween = (a: HTMLElement | null, b: HTMLElement | null) =>
      a && b ? b.getBoundingClientRect().left - a.getBoundingClientRect().right : NaN;
    const search = q('.search-open');
    const github = q('.header-github');
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
      searchPad: getComputedStyle(search!).paddingInline,
      githubHref: github?.getAttribute('href') ?? '',
      githubLabel: github?.getAttribute('aria-label') ?? '',
      utils: q('.header-utils'),
      between: [
        gapBetween(search, q('.header-utils')),
        gapBetween(langs, theme),
        gapBetween(theme, surface),
        gapBetween(q('.header-utils'), github),
      ],
      order: [search, langs, theme, surface, github].map((el) => Math.round(el!.getBoundingClientRect().left)),
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
  expect(metrics.searchPad).toMatch(/12px/);
  expect(metrics.githubHref).toBe('https://github.com/chaxus/ran');
  expect(metrics.githubLabel).toBe('GitHub');
  for (const gap of metrics.between) expect(gap).toBeCloseTo(8, 0);
  // Search → chrome utils → GitHub (outbound last / rightmost).
  for (let i = 1; i < metrics.order.length; i++) {
    expect(metrics.order[i]!).toBeGreaterThan(metrics.order[i - 1]!);
  }
  expect(['0', '0px']).toContain(metrics.themeMin);
  expect(['0', '0px']).toContain(metrics.surfaceMin);
});

test('language select navigates on change without fine-pointer hover', async ({ page }) => {
  await page.addInitScript(() => {
    const original = window.matchMedia.bind(window);
    window.matchMedia = ((query: string) => {
      if (/\(hover:\s*hover\)|\(pointer:\s*fine\)/.test(query)) {
        return {
          matches: false,
          media: query,
          onchange: null,
          addListener() {},
          removeListener() {},
          addEventListener() {},
          removeEventListener() {},
          dispatchEvent() {
            return false;
          },
        } as MediaQueryList;
      }
      return original(query);
    }) as typeof window.matchMedia;
  });
  await page.goto('/');
  await page.waitForFunction(() => customElements.get('r-select'));
  await page.locator('.lang-switch').evaluate((host: HTMLElement & { open: boolean }) => {
    host.open = true;
  });
  const deutsch = page
    .locator('r-dropdown.ran-chrome-menu[role="listbox"]')
    .filter({ hasText: 'English' })
    .locator('r-dropdown-item')
    .filter({ hasText: 'Deutsch' });
  await deutsch.click();
  await page.waitForURL('**/de/**');
});
