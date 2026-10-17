import { fileURLToPath } from 'node:url';
import { test, expect } from '@playwright/test';
import { insideShadow } from '../../testing';

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
  await page.evaluate(() => {
    const diagram = document.createElement('r-mermaid') as HTMLElement & { code: string };
    diagram.code = 'graph TD; A[Ready] --> B[Done]';
    document.body.appendChild(diagram);
  });
  await expect.poll(() => insideShadow(page, 'r-mermaid', (root) => !!root.querySelector('svg'))).toBe(true);
  expect(errors).toEqual([]);
});

test('ranui component IIFE stays standalone', async ({ page }) => {
  await page.addScriptTag({ path: fileURLToPath(new URL('../../dist/iife/button.iife.js', import.meta.url)) });
  expect(await page.evaluate('typeof ranui_button.Button')).toBe('function');
  expect(await page.evaluate('typeof customElements.get("r-input")')).toBe('undefined');
  await page.setContent('<r-button>Ready</r-button>');
  await expect(page.locator('r-button')).toBeVisible();
});

test('standalone Markdown highlights default and custom themes with the JavaScript engine', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.addScriptTag({ path: fileURLToPath(new URL('../../dist/iife/markdown.iife.js', import.meta.url)) });
  await page.setContent('<r-markdown highlight></r-markdown>');
  await page.locator('r-markdown').evaluate((node) => {
    (node as HTMLElement & { content: string }).content = '```javascript\nconst value = 42;\n```';
  });
  await expect
    .poll(() => insideShadow(page, 'r-markdown', (root) => root.querySelector('.shiki code')?.textContent))
    .toContain('const value = 42');
  await page.locator('r-markdown').evaluate((node) => {
    node.setAttribute('highlight', 'vitesse-light vitesse-dark');
    (node as HTMLElement & { content: string }).content = '```python\nprint("ready")\n```';
  });
  await expect
    .poll(() => insideShadow(page, 'r-markdown', (root) => root.querySelector('.shiki code')?.textContent))
    .toContain('print("ready")');
  expect(
    await insideShadow(page, 'r-markdown', (root) => root.querySelector('.shiki span[style]')?.getAttribute('style')),
  ).toContain('--shiki-light');
  expect(errors).toEqual([]);
});
