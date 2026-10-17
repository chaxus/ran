import { test, expect } from '@playwright/test';
import { DEV_SERVER } from '../../build/config';
import { isolatedSetup, insideShadow, mount } from './helpers';

test.beforeEach(async ({ page, baseURL }) => {
  await isolatedSetup(page, baseURL ?? DEV_SERVER, 'r-select');
  await mount(
    page,
    `<r-select id="select" showsearch style="width:240px">
    <r-option value="a">Alpha</r-option><r-option value="b">Beta</r-option>
    <r-option value="bb">Beta two</r-option></r-select>`,
  );
});

test('search keeps real keyboard text editing, live filtering and clearing', async ({ page }) => {
  const box = await insideShadow(page, '#select', (root) => {
    const input = root.querySelector<HTMLInputElement>('[part="search"]')!;
    const rect = input.getBoundingClientRect();
    return { x: rect.x + rect.width / 2, y: rect.y + rect.height / 2 };
  });
  await page.mouse.click(box.x, box.y);
  await page.keyboard.type('Beta two');
  expect(await insideShadow(page, '#select', (root) => root.querySelector<HTMLInputElement>('input')!.value)).toBe(
    'Beta two',
  );
  await expect(page.locator('r-dropdown-item')).toHaveText(['Beta two']);
  await page.keyboard.press('Home');
  await page.keyboard.type('x');
  await page.keyboard.press('End');
  await page.keyboard.press('Backspace');
  const edited = await insideShadow(page, '#select', (root) => root.querySelector<HTMLInputElement>('input')!.value);
  await page.keyboard.press('ControlOrMeta+A');
  await page.keyboard.press('Backspace');
  await expect(page.locator('r-dropdown-item')).toHaveText(['Alpha', 'Beta', 'Beta two']);
  expect(await insideShadow(page, '#select', (root) => root.activeElement?.tagName)).toBe('INPUT');
  // Home/End follow each engine's native macOS editing conventions.
  await page.evaluate(() => {
    const native = document.createElement('input');
    native.id = 'native';
    native.type = 'search';
    document.body.append(native);
  });
  await page.locator('#native').fill('Beta two');
  await page.keyboard.press('End');
  await page.keyboard.press('Home');
  await page.keyboard.type('x');
  await page.keyboard.press('End');
  await page.keyboard.press('Backspace');
  expect(edited).toBe(await page.locator('#native').inputValue());
});

test('host typeahead selects once with a nonbubbling change; composing Enter does not select', async ({ page }) => {
  await page.locator('#select').evaluate((host) => host.removeAttribute('showsearch'));
  await page.locator('#select').focus();
  await page.keyboard.type('b');
  await page.locator('#select').evaluate((host) => {
    (window as any).changes = [];
    (window as any).delegated = 0;
    host.addEventListener('change', (event) => (window as any).changes.push((event as CustomEvent).detail));
    document.body.addEventListener('change', () => (window as any).delegated++);
    // Synthetic composition covers the guard; this does not emulate an OS IME.
    host.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', isComposing: true, bubbles: true }));
  });
  await expect(page.locator('#select')).not.toHaveAttribute('value');
  await page.keyboard.press('Enter');
  await expect(page.locator('#select')).toHaveAttribute('value', 'b');
  expect(
    await page.evaluate(() => ({ changes: (window as any).changes, delegated: (window as any).delegated })),
  ).toEqual({ changes: [{ value: 'b', label: 'Beta' }], delegated: 0 });
});
