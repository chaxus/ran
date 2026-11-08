import { expect, test } from './fixtures';

/**
 * Header switches and the home invite fields stay inert until their ranui chunks
 * finish loading. CSS must reserve their footprint (and hide raw r-option text)
 * so a refresh does not flash empty hosts or a layout jump.
 */
test('undefined header switches and invite fields keep reserved shells', async ({ page }) => {
  let release!: () => void;
  const held = new Promise<void>((resolve) => {
    release = resolve;
  });
  await page.route(/\/assets\/(theme-switch|surface-switch|select|input)-[^/]+\.js$/, async (route) => {
    await held;
    await route.continue();
  });

  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/');
  await expect.poll(() => page.locator('.theme-switch:not(:defined)').count()).toBe(1);
  await expect.poll(() => page.locator('.example__field:not(:defined)').count()).toBe(2);

  const shells = await page.evaluate(() => {
    const box = (el: Element | null) => {
      if (!el) return null;
      const r = el.getBoundingClientRect();
      return { width: Math.round(r.width), height: Math.round(r.height) };
    };
    const options = [...document.querySelectorAll('.example__field:not(:defined) > r-option')].map((option) => {
      const style = getComputedStyle(option);
      const r = option.getBoundingClientRect();
      return {
        display: style.display,
        visible: r.width > 0 && r.height > 0 && style.visibility !== 'hidden' && style.opacity !== '0',
      };
    });
    return {
      theme: box(document.querySelector('.theme-switch:not(:defined)')),
      surface: box(document.querySelector('.surface-switch:not(:defined)')),
      email: box(document.querySelector('r-input.example__field:not(:defined)')),
      role: box(document.querySelector('r-select.example__field:not(:defined)')),
      options,
    };
  });

  expect(shells.theme, 'theme switch shell').toMatchObject({ height: 32 });
  expect(shells.theme!.width).toBeGreaterThanOrEqual(80);
  expect(shells.surface, 'surface switch shell').toMatchObject({ height: 32 });
  expect(shells.surface!.width).toBeGreaterThanOrEqual(100);
  expect(shells.email!.height).toBeGreaterThanOrEqual(48);
  expect(shells.role!.height).toBeGreaterThanOrEqual(48);
  expect(shells.options.length).toBeGreaterThan(0);
  for (const option of shells.options) {
    expect(option.display).toBe('none');
    expect(option.visible).toBe(false);
  }

  release();
  await page.waitForFunction(
    () =>
      customElements.get('r-theme-switch') &&
      customElements.get('r-surface-switch') &&
      customElements.get('r-input') &&
      customElements.get('r-select'),
  );
  await expect(page.locator('.theme-switch:not(:defined)')).toHaveCount(0);
  await expect(page.locator('.example__field:not(:defined)')).toHaveCount(0);
  await expect(page.locator('.theme-switch')).toBeVisible();
  await expect(page.locator('r-input.example__field')).toBeVisible();
});
