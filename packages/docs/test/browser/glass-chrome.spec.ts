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

test('under glass the language menu hangs below the trigger and stays above the home hero plate', async ({ page }) => {
  await stampSurface(page, 'light');
  // Opt into motion: reduced-motion kills the open transition and can leave display:none mid-way
  // under allow-discrete in some engines.
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/');
  await expect.poll(async () => (await rootTokens(page)).surface).toBe('glass');

  const summary = page.locator('.langs__summary');
  await summary.click();
  const list = page.locator('.langs[open] > .langs__list');
  await expect(list).toBeVisible();

  const geometry = await page.evaluate(() => {
    const summaryEl = document.querySelector('.langs__summary')!;
    const listEl = document.querySelector('.langs[open] > .langs__list')!;
    const hero = document.querySelector('.hero-live');
    const sr = summaryEl.getBoundingClientRect();
    const lr = listEl.getBoundingClientRect();
    const cs = getComputedStyle(listEl);
    const x = lr.left + lr.width / 2;
    const samples = [0.2, 0.5, 0.85].map((t) => {
      const y = lr.top + lr.height * t;
      const el = document.elementFromPoint(x, y);
      return {
        t,
        hit: el
          ? el.closest('.langs__list')
            ? 'langs'
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
      heroTop: hero ? Math.round(hero.getBoundingClientRect().top) : null,
      samples,
    };
  });

  expect(geometry.position, 'langs list must stay absolute (relative put it in the hero flow)').toBe('absolute');
  expect(geometry.gap, 'menu should sit just under the summary').toBeGreaterThanOrEqual(4);
  expect(geometry.gap).toBeLessThanOrEqual(12);
  expect(geometry.listTop).toBeGreaterThan(0);
  for (const sample of geometry.samples) {
    expect(sample.hit, `point at ${sample.t} of the open menu`).toBe('langs');
  }

  // A real click through the overlap proves the menu is not only painted but interactive.
  const deutsch = page.locator('.langs__link', { hasText: 'Deutsch' });
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
  await theme.click();
  const panel = page.locator('r-dropdown[role="listbox"][data-hover-fill]');
  await expect(panel).toBeVisible();

  // r-dropdown-item uses a closed shadow root — assert the host CSS-var contract
  // (weight / no-check) rather than shadow computed styles.
  const chrome = await page.evaluate(() => {
    const list = document.querySelector('r-dropdown[role="listbox"][data-hover-fill]');
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
    const fill = document.querySelector('r-dropdown[data-hover-fill] .ran-select-option-hover') as HTMLElement;
    return fill?.style.transform ?? '';
  });
  await page.keyboard.press('ArrowDown');
  const after = await page.evaluate(() => {
    const fill = document.querySelector('r-dropdown[data-hover-fill] .ran-select-option-hover') as HTMLElement;
    return fill?.style.transform ?? '';
  });
  expect(after).not.toBe(before);
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
