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

  const viewportOption = (text: string) => page.locator('.ran-menubar-viewport__option', { hasText: text });

  await page.locator('.lang-switch').hover();
  await expect(page.locator('.ran-menubar-viewport__shell')).toBeVisible();
  await expect(viewportOption('English')).toBeVisible();

  await page.locator('.appearance .theme-switch').hover();
  await expect(viewportOption('Light')).toBeVisible();
  await expect(viewportOption('English')).toHaveCount(0);

  await page.locator('.appearance .surface-switch').hover();
  await expect(viewportOption('Graphite')).toBeVisible();
  await expect(viewportOption('Light')).toHaveCount(0);
});

test('hovering across chrome menus morphs the shared viewport', async ({ page, browserName }) => {
  test.skip(browserName !== 'chromium', 'viewport morph sampling is chromium-first');
  await page.waitForFunction(() => customElements.get('r-menubar'));
  await page.locator('.lang-switch').hover();
  await expect(page.locator('.ran-menubar-viewport__shell')).toBeVisible();
  await expect(page.locator('.ran-menubar-viewport__option', { hasText: 'English' })).toBeVisible();

  const langLeft = await page.locator('.lang-switch').evaluate((el) => el.getBoundingClientRect().left);
  const themeLeft = await page.locator('.appearance .theme-switch').evaluate((el) => el.getBoundingClientRect().left);
  const fromX = await page.locator('.ran-menubar-viewport__shell').evaluate((el) => el.getBoundingClientRect().left);

  await page.locator('.appearance .theme-switch').hover();
  await expect(page.locator('.ran-menubar-viewport__option', { hasText: 'Light' })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.getAttribute('data-ran-menubar-viewport'))).toMatch(
    /left|right/,
  );

  // Shell travels toward the theme trigger while morphing, then settles on it.
  const samples: number[] = [];
  for (let i = 0; i < 8; i++) {
    samples.push(await page.locator('.ran-menubar-viewport__shell').evaluate((el) => el.getBoundingClientRect().left));
    await page.waitForTimeout(30);
  }
  await page.waitForTimeout(280);
  const toX = await page.locator('.ran-menubar-viewport__shell').evaluate((el) => el.getBoundingClientRect().left);
  expect(Math.abs(themeLeft - langLeft)).toBeGreaterThan(8);
  expect(Math.abs(fromX - langLeft)).toBeLessThan(12);
  expect(Math.abs(toX - themeLeft)).toBeLessThan(12);
  expect(Math.abs(toX - fromX)).toBeGreaterThan(8);
  const mid = samples.find((x) => Number.isFinite(x) && Math.abs(x - fromX) > 2 && Math.abs(x - toX) > 2);
  expect(mid, `expected a mid-flight shell left, got ${JSON.stringify(samples)}`).toBeTruthy();
});

test('selected wash paints with the first open frame', async ({ page, browserName }) => {
  test.skip(browserName === 'firefox', 'hover menus need a fine pointer hover path');
  await page.locator('.lang-switch').hover();
  await expect(page.locator('.ran-menubar-viewport__option', { hasText: 'English' })).toBeVisible();
  const fill = page.locator('.ran-menubar-viewport__hover');
  // Opacity must be on already — no “wash faded in late”.
  await expect.poll(async () => fill.evaluate((el) => (el as HTMLElement).style.opacity), { timeout: 200 }).toBe('1');
  // Geometry: full clip row under the selected option (shell border-box → content width).
  await expect
    .poll(async () =>
      page.evaluate(() => {
        const fillEl = document.querySelector('.ran-menubar-viewport__hover') as HTMLElement | null;
        const selected = document.querySelector('.ran-menubar-viewport__option[aria-selected="true"]');
        const clip = document.querySelector('.ran-menubar-viewport__clip');
        if (!fillEl || !selected || !clip) return null;
        const a = fillEl.getBoundingClientRect();
        const b = selected.getBoundingClientRect();
        const row = clip.getBoundingClientRect();
        return Math.abs(a.top - b.top) < 2 && Math.abs(a.left - row.left) < 2 && Math.abs(a.width - row.width) < 2;
      }),
    )
    .toBe(true);
});

test('chrome menu option wash slides between rows', async ({ page, browserName }) => {
  test.skip(browserName === 'firefox', 'hover menus need a fine pointer hover path');
  await page.locator('.lang-switch').hover();
  const shell = page.locator('.ran-menubar-viewport__shell');
  await expect(shell).toBeVisible();
  const fill = page.locator('.ran-menubar-viewport__hover');
  await expect(fill).toBeVisible();
  await expect.poll(async () => fill.evaluate((el) => (el as HTMLElement).style.opacity)).toBe('1');

  const before = await fill.evaluate((el) => (el as HTMLElement).style.transform);
  const portuguese = page.locator('.ran-menubar-viewport__option', { hasText: 'Português' });
  await expect(portuguese).toBeVisible();
  const box = await portuguese.boundingBox();
  expect(box).not.toBeNull();
  await page.mouse.move(box!.x + box!.width / 2, box!.y + box!.height / 2);
  await expect.poll(async () => fill.evaluate((el) => (el as HTMLElement).style.transform)).not.toBe(before);
  // Selected row must not keep a second static fill while the wash travels.
  const paints = await page.evaluate(() => {
    const selected = document.querySelector('.ran-menubar-viewport__option[aria-selected="true"]');
    const hovered = [...document.querySelectorAll('.ran-menubar-viewport__option')].find((el) =>
      (el.textContent || '').includes('Português'),
    );
    if (!selected || !hovered) return null;
    return {
      selectedBg: getComputedStyle(selected).backgroundColor,
      hoveredBg: getComputedStyle(hovered).backgroundColor,
    };
  });
  expect(paints).not.toBeNull();
  expect(paints!.selectedBg).toMatch(/rgba?\(0,\s*0,\s*0,\s*0\)|transparent/i);
  expect(paints!.hoveredBg).toMatch(/rgba?\(0,\s*0,\s*0,\s*0\)|transparent/i);

  // Shell height follows rebuilt rows — no tall empty pad under the last option.
  const gap = await page.evaluate(() => {
    const shell = document.querySelector('.ran-menubar-viewport__shell');
    const options = [...document.querySelectorAll('.ran-menubar-viewport__option')];
    const last = options[options.length - 1];
    if (!shell || !last) return null;
    return Math.round(shell.getBoundingClientRect().bottom - last.getBoundingClientRect().bottom);
  });
  expect(gap).not.toBeNull();
  expect(gap!).toBeGreaterThanOrEqual(2);
  expect(gap!).toBeLessThanOrEqual(12);
});

test('peer hops never keep two content layers painted together', async ({ page, browserName }) => {
  test.skip(browserName !== 'chromium', 'hop residual sampling is chromium-first');
  await page.locator('.lang-switch').hover();
  await expect(page.locator('.ran-menubar-viewport__option', { hasText: 'English' })).toBeVisible();
  const dualDuringHop: number[] = [];
  const sample = page.evaluate(() => {
    const layers = [...document.querySelectorAll('.ran-menubar-viewport__layer')];
    return layers.filter((el) => Number.parseFloat(getComputedStyle(el).opacity) > 0.05).length;
  });
  dualDuringHop.push(await sample);
  await page.locator('.appearance .theme-switch').hover();
  for (let i = 0; i < 8; i += 1) {
    dualDuringHop.push(await sample);
    await page.waitForTimeout(30);
  }
  await page.locator('.appearance .surface-switch').hover();
  for (let i = 0; i < 8; i += 1) {
    dualDuringHop.push(await sample);
    await page.waitForTimeout(30);
  }
  expect(Math.max(...dualDuringHop), `dual layers sampled=${dualDuringHop.join(',')}`).toBeLessThanOrEqual(1);
});

test('after a peer hop the option wash settles on the selected row', async ({ page, browserName }) => {
  test.skip(browserName !== 'chromium', 'hop settle sampling is chromium-first');
  await page.locator('.lang-switch').hover();
  await expect(page.locator('.ran-menubar-viewport__option', { hasText: 'English' })).toBeVisible();
  await page.locator('.appearance .theme-switch').hover();
  await expect(page.locator('.ran-menubar-viewport__option', { hasText: 'Light' })).toBeVisible();
  // Wash lights immediately (no 280ms blank). Geometry catches up when the
  // content slide finishes — mid-flight getBoundingClientRect still includes SLIDE_DX.
  const fill = page.locator('.ran-menubar-viewport__hover');
  await expect.poll(async () => fill.evaluate((el) => (el as HTMLElement).style.opacity), { timeout: 200 }).toBe('1');
  const measure = () =>
    page.evaluate(() => {
      const fillEl = document.querySelector('.ran-menubar-viewport__hover') as HTMLElement | null;
      const selected = document.querySelector(
        '.ran-menubar-viewport__layer:not([data-leaving]) .ran-menubar-viewport__option[aria-selected="true"]',
      );
      const clip = document.querySelector('.ran-menubar-viewport__clip');
      if (!fillEl || !selected || !clip) return null;
      const a = fillEl.getBoundingClientRect();
      const b = selected.getBoundingClientRect();
      const row = clip.getBoundingClientRect();
      return {
        opacity: fillEl.style.opacity,
        dx: Math.abs(a.left - row.left),
        dy: Math.abs(a.top - b.top),
        dw: Math.abs(a.width - row.width),
        emptyGap: (() => {
          const shell = document.querySelector('.ran-menubar-viewport__shell');
          const options = [
            ...document.querySelectorAll(
              '.ran-menubar-viewport__layer:not([data-leaving]) .ran-menubar-viewport__option',
            ),
          ];
          const last = options[options.length - 1];
          if (!shell || !last) return null;
          return Math.round(shell.getBoundingClientRect().bottom - last.getBoundingClientRect().bottom);
        })(),
      };
    });
  await expect
    .poll(async () => {
      const aligned = await measure();
      // Wait for shell height settle too — wash can align mid-morph while a tall
      // previous menu still leaves ~90px under theme/system rows.
      return (
        !!aligned &&
        aligned.dx < 2 &&
        aligned.dy < 2 &&
        aligned.dw < 2 &&
        aligned.emptyGap !== null &&
        aligned.emptyGap <= 12
      );
    })
    .toBe(true);
  const aligned = await measure();
  expect(aligned).not.toBeNull();
  expect(aligned!.opacity).toBe('1');
  expect(aligned!.emptyGap).not.toBeNull();
  expect(aligned!.emptyGap!).toBeLessThanOrEqual(12);
});

test('header chrome triggers hug their labels — short Light does not keep an 80px floor', async ({ page }) => {
  await page.locator('.appearance .theme-switch').evaluate((host: HTMLElement & { value?: string }) => {
    host.value = 'light';
  });
  await expect
    .poll(async () =>
      page.locator('.appearance .theme-switch').evaluate((el) => Math.round(el.getBoundingClientRect().width)),
    )
    .toBeLessThan(72);
  const rhythm = await page.evaluate(() => {
    const gapBetween = (a: Element, b: Element) => b.getBoundingClientRect().left - a.getBoundingClientRect().right;
    const search = document.querySelector('.search-open')!;
    const lang = document.querySelector('.lang-switch')!;
    const theme = document.querySelector('.theme-switch')!;
    const surface = document.querySelector('.surface-switch')!;
    const github = document.querySelector('.header-github')!;
    return {
      gaps: [
        gapBetween(search, lang),
        gapBetween(lang, theme),
        gapBetween(theme, surface),
        gapBetween(surface, github),
      ],
      themeW: Math.round(theme.getBoundingClientRect().width),
      langW: Math.round(lang.getBoundingClientRect().width),
      selectMin: getComputedStyle(lang).getPropertyValue('--ran-select-min-width').trim(),
    };
  });
  for (const gap of rhythm.gaps) expect(gap).toBeCloseTo(8, 0);
  expect(rhythm.selectMin).toBe('0');
  expect(rhythm.themeW).toBeLessThan(72);
  expect(rhythm.langW).toBeLessThan(80);
});

test('language chrome panel is wide enough for longer option labels', async ({ page }) => {
  await page.locator('.lang-switch').evaluate((host: HTMLElement & { open: boolean }) => {
    host.open = true;
  });
  const panel = page.locator('r-dropdown.ran-chrome-menu[role="listbox"]').filter({ hasText: 'English' });
  await expect(panel).toBeVisible();

  // Wait for select measurePanel to lock width — WebKit can paint max-content
  // before the inline floor/vars are readable via CSSOM.
  await expect
    .poll(async () => {
      const hostWidth = await panel.evaluate((el) => Math.round(el.getBoundingClientRect().width));
      const triggerWidth = await page
        .locator('.lang-switch')
        .evaluate((el) => Math.round(el.getBoundingClientRect().width));
      return hostWidth > triggerWidth;
    })
    .toBe(true);

  const metrics = await panel.evaluate((el) => {
    const host = el.getBoundingClientRect();
    const trigger = document.querySelector('.lang-switch')!.getBoundingClientRect();
    const styleAttr = el.getAttribute('style') ?? '';
    const fromAttr =
      /--ran-select-trigger-width:\s*([\d.]+px)/.exec(styleAttr)?.[1] ||
      /min-width:\s*([\d.]+px)/.exec(styleAttr)?.[1] ||
      '';
    // Prefer the inline floor the library sets — WebKit often reports computed
    // min-width as 0px; fall back to the style attribute string.
    const triggerFloor =
      el.style.getPropertyValue('--ran-select-trigger-width') ||
      el.style.minWidth ||
      getComputedStyle(el).getPropertyValue('--ran-select-trigger-width') ||
      fromAttr ||
      getComputedStyle(el).minWidth;
    const items = [...el.querySelectorAll('r-dropdown-item')].map((item) => ({
      text: item.textContent?.trim() ?? '',
      // Light-DOM host width — closed shadow labels are not readable here.
      width: Math.round(item.getBoundingClientRect().width),
    }));
    return {
      hostWidth: Math.round(host.width),
      triggerWidth: Math.round(trigger.width),
      triggerFloor,
      sample: items.find((item) => /Português|简体中文/.test(item.text)) ?? items[0] ?? null,
    };
  });

  // Library floors min-width at the trigger (Floating UI / Radix); content may grow.
  expect(metrics.hostWidth).toBeGreaterThan(metrics.triggerWidth);
  const floor = parseFloat(metrics.triggerFloor);
  if (Number.isFinite(floor) && floor > 0) {
    expect(floor).toBeGreaterThanOrEqual(metrics.triggerWidth - 1);
  } else {
    // WebKit may never expose the floor via CSSOM; locked host width is the guarantee.
    expect(metrics.hostWidth).toBeGreaterThanOrEqual(metrics.triggerWidth);
  }
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

test('menubar language pick navigates (fine pointer viewport commit)', async ({ page, browserName }) => {
  test.skip(browserName === 'firefox', 'hover menus need a fine pointer hover path');
  await page.goto('/');
  await page.waitForFunction(() => customElements.get('r-menubar') && customElements.get('r-select'));
  await page.locator('.lang-switch').hover();
  await expect(page.locator('.ran-menubar-viewport__option', { hasText: 'Português' })).toBeVisible();
  await page.locator('.ran-menubar-viewport__option', { hasText: 'Português' }).click();
  await page.waitForURL('**/pt/**');
  await expect(page.locator('html')).toHaveAttribute('lang', 'pt');
});
