import { expect, test } from '@playwright/test';
import { DEV_SERVER } from '../../build/config';
import { insideShadow, isolatedSetup, mount } from './helpers';

for (const width of [1280, 360]) {
  test(`composed Select keeps compact proportions at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto(`${DEV_SERVER}components`);
    const selects = page.locator('#component-select r-select');
    await expect(selects).toHaveCount(2);
    await expect.poll(async () => selects.nth(0).evaluate((el) => el.getBoundingClientRect().height)).toBe(32);
    expect(await selects.nth(1).evaluate((el) => el.getBoundingClientRect().height)).toBe(32);
    expect(
      await insideShadow(
        page,
        '#component-select r-select:nth-of-type(2)',
        (root) => root.querySelector('[part="selection-item"]')?.textContent,
      ),
    ).toBe('Pick a teammate');
  });
}

for (const theme of ['light', 'dark']) {
  test(`empty hint survives keyboard selection, clear and recovery in ${theme}`, async ({ page }) => {
    await isolatedSetup(page, DEV_SERVER, 'r-select');
    await page.evaluate((theme) => document.documentElement.setAttribute('data-ran-theme', theme), theme);
    await mount(
      page,
      '<r-select id="pick" label="Teammate" placeholder="Pick a teammate" style="width:240px;height:64px"><r-option value="jack">Jack</r-option><r-option value="lucy">Lucy</r-option></r-select>',
    );
    const field = page.locator('#pick');
    const text = () =>
      insideShadow(page, '#pick', (root) => root.querySelector('[part="selection-item"]')?.textContent);
    const color = () =>
      insideShadow(page, '#pick', (root) => getComputedStyle(root.querySelector('[part="selection-item"]')!).color);
    await expect(field).toHaveAccessibleName('Teammate');
    expect(await field.evaluate((el) => el.getBoundingClientRect().height)).toBe(64);
    expect(await text()).toBe('Pick a teammate');
    const hintColor = await color();
    await field.focus();
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('Enter');
    await expect(field).toHaveAttribute('value', 'jack');
    expect(await text()).toBe('Jack');
    await expect.poll(color).not.toBe(hintColor);
    await field.evaluate((el) => el.removeAttribute('value'));
    expect(await text()).toBe('Pick a teammate');
    await expect.poll(color).toBe(hintColor);
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('Escape');
    await expect(field).not.toHaveAttribute('open');
    expect(await text()).toBe('Pick a teammate');
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('Enter');
    await expect(field).toHaveAttribute('value', 'lucy');
    await expect(field).toBeFocused();
  });
}

test('opening a portaled Select by keyboard preserves page reading position', async ({ page }) => {
  await page.setViewportSize({ width: 900, height: 720 });
  await page.goto(`${DEV_SERVER}components`);
  const field = page.locator('#component-select r-select').nth(1);
  await field.scrollIntoViewIfNeeded();
  await field.focus();
  const before = await page.evaluate(() => scrollY);
  await page.keyboard.press('ArrowDown');
  await expect(field).toHaveAttribute('open');
  await expect.poll(() => page.evaluate(() => scrollY)).toBe(before);
  await page.keyboard.press('End');
  expect(await page.evaluate(() => scrollY)).toBe(before);
});

test('keyboard traversal scrolls only the constrained option surface', async ({ page }) => {
  await isolatedSetup(page, DEV_SERVER, 'r-select');
  await mount(
    page,
    `<style>r-dropdown::part(dropdown) { max-height: 100px; overflow-y: auto; }</style><r-select id="long-list" style="width:240px" label="Teammate">${Array.from({ length: 30 }, (_, index) => `<r-option value="${index}">Teammate ${index}</r-option>`).join('')}</r-select>`,
  );
  await page.locator('#long-list').focus();
  await page.keyboard.press('ArrowDown');
  await expect(page.locator('r-dropdown')).toBeVisible();
  await page.keyboard.press('End');
  const visible = await insideShadow(page, 'r-dropdown', (root) => {
    const surface = root.querySelector('[part="dropdown"]')!;
    const last = root.host.querySelector('r-dropdown-item:last-child')!;
    const box = surface.getBoundingClientRect();
    const item = last.getBoundingClientRect();
    return { scroll: surface.scrollTop, contained: item.top >= box.top - 1 && item.bottom <= box.bottom + 1 };
  });
  expect(visible.scroll).toBeGreaterThan(0);
  expect(visible.contained).toBe(true);
  expect(await page.evaluate(() => scrollY)).toBe(0);
});
