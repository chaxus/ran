import { fileURLToPath } from 'node:url';
import { test, expect } from '@playwright/test';

test('ranuts IIFEs expose browser globals without a module loader', async ({ page }) => {
  await page.addScriptTag({ path: fileURLToPath(new URL('../../../ranuts/dist/iife/index.iife.js', import.meta.url)) });
  await page.addScriptTag({ path: fileURLToPath(new URL('../../../ranuts/dist/iife/utils.iife.js', import.meta.url)) });
  expect(await page.evaluate('ranuts.rgbToHex(1, 2, 3)')).toBe('#010203');
  expect(await page.evaluate('ranuts_utils.rgbToHex(4, 5, 6)')).toBe('#040506');
});

test('ranui full IIFE registers components without a module loader', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.addScriptTag({ path: fileURLToPath(new URL('../../dist/index.iife.js', import.meta.url)) });
  expect(errors).toEqual([]);
  expect(await page.evaluate('typeof ranui.Button')).toBe('function');
  expect(await page.evaluate('typeof customElements.get("r-input")')).toBe('function');
  await page.setContent('<r-button>Ready</r-button>');
  await expect(page.locator('r-button')).toBeVisible();
});

test('ranui component IIFE stays standalone', async ({ page }) => {
  await page.addScriptTag({ path: fileURLToPath(new URL('../../dist/iife/button.iife.js', import.meta.url)) });
  expect(await page.evaluate('typeof ranui_button.Button')).toBe('function');
  expect(await page.evaluate('typeof customElements.get("r-input")')).toBe('undefined');
  await page.setContent('<r-button>Ready</r-button>');
  await expect(page.locator('r-button')).toBeVisible();
});
