import { expect, test, type Page } from '@playwright/test';
import type { ColorPicker } from '@/components/colorpicker';
import { DEV_SERVER } from '../../build/config';
import { insideShadow, isolatedSetup, mount } from './helpers';

async function setup(page: Page, theme: 'light' | 'dark') {
  await isolatedSetup(page, DEV_SERVER, 'r-colorpicker');
  await page.evaluate((theme) => {
    document.documentElement.setAttribute('data-ran-theme', theme);
    document.body.style.background = 'var(--ran-color-bg)';
    document.body.style.color = 'var(--ran-color-text)';
  }, theme);
  await mount(
    page,
    '<section style="max-width:360px;padding:24px;background:var(--ran-color-bg-elevated)"><h1>Accent color</h1><input id="outside" aria-label="Other field"><r-colorpicker id="picker" value="#ff0000"></r-colorpicker></section>',
  );
  await expect(page.locator('body')).toHaveCSS(
    'background-color',
    theme === 'dark' ? 'rgb(10, 10, 11)' : 'rgb(255, 255, 255)',
  );
  await page.locator('#picker').evaluate((picker) => {
    (window as unknown as { pickerChanges: unknown[] }).pickerChanges = [];
    picker.addEventListener('change', (event) =>
      (window as unknown as { pickerChanges: unknown[] }).pickerChanges.push((event as CustomEvent).detail),
    );
  });
}

async function open(page: Page) {
  await insideShadow(page, '#picker', (root) => {
    root
      .querySelector('r-popover')!
      .addEventListener('after-show', () => root.host.setAttribute('data-painted', ''), { once: true });
    root.host.removeAttribute('data-painted');
  });
  await page.locator('#picker').click();
  await expect(page.locator('#picker')).toHaveAttribute('data-painted');
  await expect(page.locator('.ran-color-picker-inner')).toBeVisible();
}

const read = (page: Page) =>
  page.locator('#picker').evaluate((node) => ({
    value: (node as ColorPicker).value,
    changes: (window as unknown as { pickerChanges: unknown[] }).pickerChanges.length,
  }));

for (const [motion, theme] of [
  ['no-preference', 'light'],
  ['reduce', 'dark'],
] as const) {
  test.describe(`colorpicker disabled interaction: ${motion}`, () => {
    test.use({ contextOptions: { reducedMotion: motion } });

    test('disabling an open picker closes it without another keyboard change and supports re-enabling', async ({
      page,
    }) => {
      await setup(page, theme);
      await open(page);
      const hue = page.getByRole('slider', { name: 'Hue', exact: true });
      await hue.focus();
      await page.locator('#picker').evaluate((node) => ((node as ColorPicker).disabled = true));
      await page.keyboard.press('ArrowRight');
      expect(await read(page)).toEqual({ value: '#ff0000', changes: 0 });
      expect(await insideShadow(page, '#picker', (root) => root.querySelector('r-popover')!.hasAttribute('open'))).toBe(
        false,
      );
      expect(
        await page.locator('.ran-color-picker-slider-hue').evaluate((node) => node === document.activeElement),
      ).toBe(false);
      await expect(page.locator('.ran-popover-dropdown')).toBeHidden();
      await page.locator('#picker').click();
      await expect(page.locator('.ran-popover-dropdown')).toBeHidden();
      await page.locator('#picker').evaluate((node) => ((node as ColorPicker).value = '#00ff00'));
      expect(await read(page)).toEqual({ value: '#00ff00', changes: 0 });
      await page.locator('#picker').evaluate((node) => ((node as ColorPicker).disabled = false));
      await open(page);
      await hue.focus();
      await page.keyboard.press('ArrowRight');
      expect((await read(page)).value).not.toBe('#00ff00');
      expect((await read(page)).changes).toBe(1);
      await page.locator('#outside').focus();
      await page.locator('#picker').evaluate((node) => ((node as ColorPicker).disabled = true));
      await expect(page.locator('#outside')).toBeFocused();
    });

    for (const kind of ['palette', 'hue', 'alpha'] as const) {
      test(`disabling cancels an active ${kind} drag even when enabled again before pointerup`, async ({ page }) => {
        await setup(page, theme);
        await open(page);
        const target = page.locator(
          kind === 'palette' ? '.ran-color-picker-palette' : `.ran-color-picker-slider-${kind}`,
        );
        const box = (await target.boundingBox())!;
        await page.mouse.move(box.x + box.width * 0.4, box.y + box.height * 0.4);
        await page.mouse.down();
        const before = await read(page);
        expect(before.changes).toBeGreaterThan(0);
        await page.locator('#picker').evaluate((node) => ((node as ColorPicker).disabled = true));
        await page.mouse.move(box.x + box.width * 0.8, box.y + box.height * 0.8);
        expect(await read(page)).toEqual(before);
        await page.locator('#picker').evaluate((node) => ((node as ColorPicker).disabled = false));
        await page.mouse.move(box.x + box.width * 0.2, box.y + box.height * 0.2);
        expect(await read(page)).toEqual(before);
        await page.mouse.up();
      });
    }

    test('disabling closes the owned format Select and releases only picker focus', async ({ page }) => {
      await setup(page, theme);
      await open(page);
      const format = page.locator('.ran-color-picker-format');
      await format.click();
      await expect(format).toHaveAttribute('open');
      const popup = page.locator(`#${await format.getAttribute('aria-controls')}`);
      await expect(popup).toBeVisible();
      const rgb = (await popup.locator('r-dropdown-item').filter({ hasText: 'RGB' }).boundingBox())!;
      await page.locator('#picker').evaluate((node) => ((node as ColorPicker).disabled = true));
      if (motion === 'no-preference') await page.mouse.click(rgb.x + rgb.width / 2, rgb.y + rgb.height / 2);
      await expect(format).toHaveAttribute('value', 'HEX');
      await expect(format).not.toHaveAttribute('open');
      await expect(format).toHaveAttribute('disabled');
      await expect(popup).toBeHidden();
      expect(await format.evaluate((node) => node === document.activeElement)).toBe(false);
      expect(await read(page)).toEqual({ value: '#ff0000', changes: 0 });
      await page.locator('#picker').evaluate((node) => ((node as ColorPicker).disabled = false));
      await open(page);
      await format.click();
      await popup.locator('r-dropdown-item').filter({ hasText: 'RGB' }).click();
      await expect(format).toHaveAttribute('value', 'RGB');
      expect(
        await page
          .locator('.ran-color-picker-value')
          .evaluate((node) => (node as HTMLElement & { value: string }).value),
      ).toBe('rgb(255, 0, 0)');
      expect(await read(page)).toEqual({ value: '#ff0000', changes: 0 });
    });
  });
}
