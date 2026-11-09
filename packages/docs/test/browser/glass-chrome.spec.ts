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

test('under glass the theme menu uses a sliding wash, weight-selected, and no check', async ({ page }) => {
  await stampSurface(page, 'light');
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/');
  await expect.poll(async () => (await rootTokens(page)).surface).toBe('glass');
  await page.waitForFunction(() => customElements.get('r-theme-switch') && customElements.get('r-select'));

  const theme = page.locator('.appearance .theme-switch');
  // Open via the host API so this assertion does not depend on hover-controller timing.
  await theme.evaluate((host: HTMLElement & { open: boolean }) => {
    host.open = true;
  });
  // Home also mounts a Role r-select — scope to the chrome menu class.
  const panel = page
    .locator('r-dropdown.ran-chrome-menu[role="listbox"][data-hover-fill]')
    .filter({ hasText: 'Light' });
  await expect(panel).toBeVisible();

  // r-dropdown-item uses a closed shadow root — assert the host CSS-var contract
  // (weight / no-check) rather than shadow computed styles.
  const chrome = await page.evaluate(() => {
    const list = [...document.querySelectorAll('r-dropdown.ran-chrome-menu[role="listbox"][data-hover-fill]')].find(
      (el) => el.textContent?.includes('Light'),
    );
    if (!list) return null;
    const fill = list.querySelector('.ran-select-option-hover') as HTMLElement | null;
    const items = [...list.querySelectorAll('r-dropdown-item')];
    const selected = items.find((el) => el.hasAttribute('selected'));
    const itemCs = selected ? getComputedStyle(selected) : null;
    return {
      hasFill: !!fill,
      fillOpacity: fill?.style.opacity ?? '',
      fillWidth: fill?.style.width ?? '',
      itemCount: items.length,
      listClass: list.className,
      hasHoverFill: list.hasAttribute('data-hover-fill'),
      varWeight: itemCs?.getPropertyValue('--ran-dropdown-option-selected-font-weight').trim() ?? '',
      varCheck: itemCs?.getPropertyValue('--ran-dropdown-option-selected-check-display').trim() ?? '',
      varPad: itemCs?.getPropertyValue('--ran-dropdown-option-selected-padding-inline-end').trim() ?? '',
    };
  });

  expect(chrome).not.toBeNull();
  expect(chrome!.listClass).toContain('ran-chrome-menu');
  expect(chrome!.hasHoverFill).toBe(true);
  expect(chrome!.varWeight).toBe('600');
  expect(chrome!.varCheck).toBe('none');
  expect(chrome!.varPad).not.toBe('');
  expect(chrome!.hasFill).toBe(true);
  expect(chrome!.fillOpacity).toBe('1');
  expect(chrome!.fillWidth).not.toBe('0px');
  expect(chrome!.itemCount).toBeGreaterThanOrEqual(2);

  // Move the cursor to another option; the wash should follow.
  const before = await page.evaluate(() => {
    const list = [...document.querySelectorAll('r-dropdown.ran-chrome-menu[data-hover-fill]')].find((el) =>
      el.textContent?.includes('Light'),
    );
    const fill = list?.querySelector('.ran-select-option-hover') as HTMLElement | null;
    return fill?.style.transform ?? '';
  });
  // Light is selected under stampSurface('light'); move to Dark so the wash must travel.
  const option = panel.locator('r-dropdown-item').nth(2);
  const box = await option.boundingBox();
  expect(box).not.toBeNull();
  await page.mouse.move(box!.x + box!.width / 2, box!.y + box!.height / 2);
  await expect
    .poll(async () =>
      page.evaluate(() => {
        const list = [...document.querySelectorAll('r-dropdown.ran-chrome-menu[data-hover-fill]')].find((el) =>
          el.textContent?.includes('Light'),
        );
        const fill = list?.querySelector('.ran-select-option-hover') as HTMLElement | null;
        return fill?.style.transform ?? '';
      }),
    )
    .not.toBe(before);
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
