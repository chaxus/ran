import { expect, test } from './fixtures';
import type { Page } from './fixtures';

/**
 * Glass chrome invariants — the defects that slipped past visual review.
 *
 * 1. Open header menus hang below their trigger and hit-test above page glass plates.
 * 2. Interactive wash tokens stay defined in light and dark glass.
 * 3. Search placeholder reads as search, not a machine-translated list label.
 * 4. The shell ceiling stays wide enough that ≥1920 viewports are not 240px gutters.
 *
 * Prefer geometry + computed style + elementFromPoint over screenshots: frosted panels
 * show content through them and look "covered" in a capture even when hit-testing is correct.
 */

test.use({ viewport: { width: 1440, height: 900 } });

const stampSurface = async (page: Page, theme: 'light' | 'dark'): Promise<void> => {
  await page.addInitScript(
    ({ theme: t }) => {
      localStorage.setItem('ran-surface', 'glass');
      localStorage.setItem('ran-theme', t);
    },
    { theme },
  );
};

const rootTokens = (page: Page) =>
  page.evaluate(() => {
    const root = getComputedStyle(document.documentElement);
    return {
      surface: document.documentElement.getAttribute('data-ran-surface'),
      theme: document.documentElement.getAttribute('data-ran-theme'),
      hover: root.getPropertyValue('--ran-surface-glass-hover').trim(),
      glassHover: root.getPropertyValue('--glass-hover').trim(),
      selected: root.getPropertyValue('--glass-selected').trim(),
      shell: root.getPropertyValue('--shell-max').trim(),
    };
  });

test('under glass header tools keep the same 8px peer gap as Graphite', async ({ page }) => {
  await stampSurface(page, 'light');
  await page.goto('/');
  await expect.poll(async () => (await rootTokens(page)).surface).toBe('glass');
  await page.waitForFunction(
    () =>
      customElements.get('r-theme-switch') && customElements.get('r-surface-switch') && customElements.get('r-select'),
  );
  const gaps = await page.evaluate(() => {
    const cs = (s: string) => getComputedStyle(document.querySelector<HTMLElement>(s)!);
    const resolve = (prop: string, value: string) => {
      const el = document.createElement('span');
      el.style.setProperty(prop, value);
      document.body.append(el);
      const out = getComputedStyle(el).getPropertyValue(prop).trim();
      el.remove();
      return out;
    };
    // Sliding wash owns hover under fine pointers — drop it so we assert the
    // touch/coarse glass token recipe (glass-hover, not Graphite --bg-soft).
    document.querySelector('.header-tools')?.removeAttribute('data-hover-fill');
    const lang = cs('.lang-switch');
    const rawColor = lang.getPropertyValue('--ran-select-color').trim();
    const rawHover = lang.getPropertyValue('--ran-select-hover-background-color').trim();
    return {
      tools: cs('.header-tools').gap,
      utils: cs('.header-utils').gap,
      appearance: cs('.appearance').gap,
      searchPad: cs('.search-open').paddingInline,
      rawColor,
      rawHover,
      selectColor: resolve('color', rawColor || 'transparent'),
      muted: resolve('color', 'var(--fg-muted)'),
      selectHover: resolve('background-color', rawHover || 'transparent'),
      glassHover: resolve('background-color', 'var(--glass-hover)'),
      soft: resolve('background-color', 'var(--bg-soft)'),
    };
  });
  expect(gaps.tools).toBe('8px');
  expect(gaps.utils).toBe('8px');
  expect(gaps.appearance).toBe('8px');
  expect(gaps.searchPad).toMatch(/12px/);
  expect(gaps.selectColor, `idle ink raw=${gaps.rawColor}`).toBe(gaps.muted);
  expect(gaps.selectHover, `hover wash raw=${gaps.rawHover}`).toBe(gaps.glassHover);
  expect(gaps.selectHover, 'must not fall back to Graphite soft grey').not.toBe(gaps.soft);
});

test('under glass the language menu hangs below the trigger and stays above the home hero plate', async ({ page }) => {
  await stampSurface(page, 'light');
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/');
  await expect.poll(async () => (await rootTokens(page)).surface).toBe('glass');
  await page.waitForFunction(() => customElements.get('r-select'));

  const lang = page.locator('.lang-switch');
  await lang.evaluate((host: HTMLElement & { open: boolean }) => {
    host.open = true;
  });
  const list = page.locator('r-dropdown.ran-chrome-menu[role="listbox"]').filter({ hasText: 'English' });
  await expect(list).toBeVisible();

  const panelGeometry = async () =>
    page.evaluate(() => {
      const triggerEl = document.querySelector('.lang-switch');
      // Prefer a panel that is actually painted under the header — closed/portal
      // leftovers can report display:block with a bogus off-screen top on WebKit.
      const listEl = [...document.querySelectorAll<HTMLElement>('r-dropdown.ran-chrome-menu')].find((el) => {
        const cs = getComputedStyle(el);
        if (cs.display === 'none' || cs.visibility === 'hidden') return false;
        if (!el.textContent?.includes('English')) return false;
        const r = el.getBoundingClientRect();
        return r.width > 8 && r.height > 8 && r.top > 0 && r.top < innerHeight * 0.5;
      });
      if (!triggerEl || !listEl) return null;
      const sr = triggerEl.getBoundingClientRect();
      const lr = listEl.getBoundingClientRect();
      const cs = getComputedStyle(listEl);
      const x = lr.left + lr.width / 2;
      const samples = [0.2, 0.5, 0.85].map((t) => {
        const y = lr.top + lr.height * t;
        const el = document.elementFromPoint(x, y);
        return {
          t,
          hit: el
            ? el.closest('r-dropdown.ran-chrome-menu')
              ? 'panel'
              : el.closest('.hero-live')
                ? 'hero'
                : (el.className || el.tagName).toString().slice(0, 40)
            : 'null',
        };
      });
      return {
        position: cs.position,
        gap: Math.round(lr.top - sr.bottom),
        listTop: Math.round(lr.top),
        samples,
      };
    });

  await expect.poll(async () => (await panelGeometry())?.gap ?? -1).toBeGreaterThanOrEqual(0);
  await expect.poll(async () => (await panelGeometry())?.gap ?? 9999).toBeLessThanOrEqual(24);
  const geometry = await panelGeometry();
  expect(geometry, 'language chrome panel should be painted under the trigger').not.toBeNull();
  expect(geometry!.position, 'chrome menu must stay absolute (relative put it in the hero flow)').toBe('absolute');
  expect(geometry!.listTop).toBeGreaterThan(0);
  for (const sample of geometry!.samples) {
    expect(sample.hit, `point at ${sample.t} of the open menu`).toBe('panel');
  }

  const deutsch = list.locator('r-dropdown-item').filter({ hasText: 'Deutsch' });
  await deutsch.click();
  await page.waitForURL('**/de/**');
});

test('under glass the invite Role menu stays above the hero plate', async ({ page }) => {
  await stampSurface(page, 'light');
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/');
  await expect.poll(async () => (await rootTokens(page)).surface).toBe('glass');
  await page.waitForFunction(() => customElements.get('r-select'));

  const role = page.locator('.example r-select').first();
  await role.scrollIntoViewIfNeeded();
  await role.evaluate((host: HTMLElement & { open: boolean }) => {
    host.open = true;
  });
  const list = page.locator('r-dropdown[role="listbox"]').filter({ hasText: 'Editor' });
  await expect(list).toBeVisible();

  const readStacking = () =>
    page.evaluate(() => {
      // Prefer a panel that is actually painted in the viewport — WebKit/Firefox can
      // briefly report display:block at a pre-position off-screen box after open=.
      const panel = [...document.querySelectorAll<HTMLElement>('r-dropdown')].find((el) => {
        const cs = getComputedStyle(el);
        if (cs.display === 'none' || cs.visibility === 'hidden') return false;
        if (!/Admin|Editor|Viewer/.test(el.textContent || '')) return false;
        const box = el.getBoundingClientRect();
        return box.width > 8 && box.height > 8 && box.top > 0 && box.top < innerHeight * 0.9;
      });
      const hero = document.querySelector('.hero-live');
      if (!panel || !hero) return null;
      const r = panel.getBoundingClientRect();
      /** Closed-shadow hits: closest() stops at the root; also walk the host. */
      const ownsHit = (el: Element | null): boolean => {
        if (!el) return false;
        if (el === panel || panel.contains(el)) return true;
        if (el.closest?.('r-dropdown') === panel) return true;
        let node: Element | null = el;
        for (let i = 0; i < 6 && node; i += 1) {
          const root = node.getRootNode();
          if (!(root instanceof ShadowRoot)) break;
          if (root.host === panel || root.host.closest?.('r-dropdown') === panel) return true;
          node = root.host;
        }
        return false;
      };
      const samples = [0.2, 0.5, 0.85].map((t) => {
        const x = r.left + r.width / 2;
        const y = r.top + r.height * t;
        const stack = document.elementsFromPoint(x, y);
        const panelIdx = stack.findIndex((el) => ownsHit(el));
        const heroIdx = stack.findIndex((el) => el === hero || el.closest?.('.hero-live') === hero);
        if (panelIdx >= 0 && (heroIdx < 0 || panelIdx < heroIdx)) return 'panel';
        if (heroIdx === 0) return 'hero';
        const top = document.elementFromPoint(x, y);
        if (!top) return `null@${Math.round(x)},${Math.round(y)}`;
        return (top.className || top.tagName).toString().slice(0, 40);
      });
      const heroStyle = getComputedStyle(hero);
      return {
        panelZ: getComputedStyle(panel).zIndex,
        heroZ: heroStyle.zIndex,
        heroFilter: heroStyle.backdropFilter || heroStyle.getPropertyValue('-webkit-backdrop-filter'),
        rect: { top: Math.round(r.top), left: Math.round(r.left), w: Math.round(r.width), h: Math.round(r.height) },
        samples,
      };
    });

  // FloatingController places on rAF — poll until samples land on the panel.
  await expect
    .poll(async () => {
      const snap = await readStacking();
      if (!snap) return 'missing';
      if (snap.samples.every((hit) => hit === 'panel')) return 'ok';
      return snap.samples.join('|');
    })
    .toBe('ok');

  const stacking = await readStacking();
  expect(stacking, 'Role panel should be painted').not.toBeNull();
  expect(Number.parseInt(stacking!.panelZ, 10), `rect=${JSON.stringify(stacking!.rect)}`).toBeGreaterThanOrEqual(1100);
  expect(stacking!.heroZ).toBe('0');
  // Frost is on ::before — the plate itself must not run backdrop-filter.
  expect(stacking!.heroFilter === 'none' || stacking!.heroFilter === '').toBe(true);
});

for (const theme of ['light', 'dark'] as const) {
  test(`glass interactive washes resolve under ${theme}`, async ({ page }) => {
    await stampSurface(page, theme);
    await page.goto('/ranui/button/');
    await expect.poll(async () => (await rootTokens(page)).surface).toBe('glass');
    await expect.poll(async () => (await rootTokens(page)).theme).toBe(theme);

    const tokens = await rootTokens(page);
    expect(tokens.hover, '--ran-surface-glass-hover').not.toBe('');
    expect(tokens.glassHover, '--glass-hover').not.toBe('');
    expect(tokens.selected, '--glass-selected').not.toBe('');
    // Aliases must agree with the library token so menus and chrome do not diverge.
    expect(tokens.glassHover).toBe(tokens.hover);
  });
}

test('under glass the theme menu uses a sliding wash, weight-selected, and no check', async ({
  page,
  browserName,
}) => {
  // Header theme lives under `<r-menubar>` — assert the shared viewport wash, not the
  // suppressed native `r-dropdown` portal (opening via `host.open` then moving the
  // mouse arms menubar and freezes `.ran-select-option-hover`).
  test.skip(browserName === 'firefox', 'hover menus need a fine pointer hover path');
  await stampSurface(page, 'light');
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/');
  await expect.poll(async () => (await rootTokens(page)).surface).toBe('glass');
  await page.waitForFunction(
    () => customElements.get('r-theme-switch') && customElements.get('r-menubar'),
  );

  await page.locator('.appearance .theme-switch').hover();
  const shell = page.locator('.ran-menubar-viewport__shell');
  await expect(shell).toBeVisible();
  await expect(page.locator('.ran-menubar-viewport__option', { hasText: 'Light' })).toBeVisible();

  const fill = page.locator('.ran-menubar-viewport__hover');
  await expect.poll(async () => fill.evaluate((el) => (el as HTMLElement).style.opacity)).toBe('1');
  await expect.poll(async () => fill.evaluate((el) => (el as HTMLElement).style.width)).not.toBe('0px');

  const live = page.locator('.ran-menubar-viewport__layer:not([data-leaving])');
  const selected = live.locator('.ran-menubar-viewport__option[aria-selected="true"]');
  await expect(selected).toHaveText(/Light/i);
  await expect(selected).toHaveCSS('font-weight', '600');
  // Weight marks selection — no check glyph in the rebuilt option list.
  await expect(selected.locator('svg, [class*="check"]')).toHaveCount(0);

  const before = await fill.evaluate((el) => (el as HTMLElement).style.transform);
  const dark = live.locator('.ran-menubar-viewport__option', { hasText: 'Dark' });
  await expect(dark).toBeVisible();
  const box = await dark.boundingBox();
  expect(box).not.toBeNull();
  await page.mouse.move(box!.x + box!.width / 2, box!.y + box!.height / 2);
  await expect.poll(async () => fill.evaluate((el) => (el as HTMLElement).style.transform)).not.toBe(before);
});

test('search placeholder reads as search', async ({ page }) => {
  await stampSurface(page, 'light');
  await page.goto('/');
  await page.locator('.search-open').click();
  const placeholder = await page.locator('.search__input').getAttribute('placeholder');
  expect(placeholder).toBeTruthy();
  expect(placeholder!.toLowerCase()).toMatch(/search|検索|검색|buscar|pesquis|durchsuchen|جستجو|搜索/);
  expect(placeholder!.toLowerCase()).not.toMatch(/detailed list|详细列表|詳細リスト/);
});

test('the shell ceiling is 1600px so wide viewports keep modest gutters', async ({ page }) => {
  await stampSurface(page, 'light');
  await page.setViewportSize({ width: 1920, height: 1080 });
  await page.goto('/ranui/button/');
  await expect.poll(async () => (await rootTokens(page)).surface).toBe('glass');

  const layout = await page.evaluate(() => {
    const root = getComputedStyle(document.documentElement);
    const el = document.querySelector('.layout');
    if (!el) return null;
    const box = el.getBoundingClientRect();
    return {
      shell: root.getPropertyValue('--shell-max').trim(),
      width: Math.round(box.width),
      leftGap: Math.round(box.x),
      rightGap: Math.round(innerWidth - (box.x + box.width)),
    };
  });

  expect(layout).not.toBeNull();
  expect(layout!.shell).toBe('1600px');
  expect(layout!.width).toBe(1600);
  // Was ~240px at 1440 shell; keep gutters clearly under that.
  expect(layout!.leftGap).toBeLessThanOrEqual(180);
  expect(layout!.rightGap).toBeLessThanOrEqual(180);
});
