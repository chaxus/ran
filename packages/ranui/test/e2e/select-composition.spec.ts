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

/**
 * A labelled Select's field stays inside its own box. With the field at 100% of a host whose
 * height is definite (a flex item, or an explicit height), the label was counted twice and
 * the field ran into whatever came next — measured 29px into the following row.
 */
const fieldGeometry = (page: import('@playwright/test').Page, selector: string) =>
  insideShadow(page, selector, (root) => {
    const host = (root as ShadowRoot).host.getBoundingClientRect();
    const label = root.querySelector('.ran-select-label')!.getBoundingClientRect();
    const field = root.querySelector('.ran-select')!.getBoundingClientRect();
    return { hostBottom: host.bottom, labelBottom: label.bottom, fieldTop: field.top, fieldBottom: field.bottom };
  });

test('a labelled Select in a flex column keeps its field inside its host', async ({ page }) => {
  await isolatedSetup(page, DEV_SERVER, 'r-select');
  await mount(
    page,
    // A definite container height is what makes a flex item's height definite (the home
    // page's hero panel was one): only then does the field's 100% resolve against the host.
    '<div style="display:flex;flex-direction:column;gap:16px;width:280px;height:320px">' +
      '<r-select id="role" label="Role" value="editor"><r-option value="editor">Editor</r-option></r-select>' +
      '<div id="next" style="height:32px">next</div></div>',
  );
  const geometry = await fieldGeometry(page, '#role');
  const next = await page.locator('#next').evaluate((el) => el.getBoundingClientRect().top);
  expect(geometry.fieldTop).toBeGreaterThanOrEqual(geometry.labelBottom);
  expect(geometry.fieldBottom).toBeLessThanOrEqual(geometry.hostBottom + 0.5);
  expect(geometry.fieldBottom).toBeLessThanOrEqual(next);
  expect(geometry.fieldBottom - geometry.fieldTop).toBe(32);
});

test('a labelled Select with an explicit height fills the rest of it with the field', async ({ page }) => {
  await isolatedSetup(page, DEV_SERVER, 'r-select');
  await mount(
    page,
    '<r-select id="tall" label="Role" style="width:240px;height:72px"><r-option value="a">A</r-option></r-select>',
  );
  const geometry = await fieldGeometry(page, '#tall');
  expect(geometry.fieldBottom).toBeCloseTo(geometry.hostBottom, 0);
  expect(geometry.fieldTop).toBeGreaterThanOrEqual(geometry.labelBottom);
});
