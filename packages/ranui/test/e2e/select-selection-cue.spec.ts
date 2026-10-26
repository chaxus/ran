import { test, expect, type Page } from '@playwright/test';
import { DEV_SERVER } from '../../build/config';
import { isolatedSetup, mount } from './helpers';

test.beforeEach(async ({ page, baseURL }) => {
  await isolatedSetup(page, baseURL ?? DEV_SERVER, 'r-select');
  await mount(
    page,
    `<r-select id="select" value="b" style="width:240px">
    <r-option value="a">Alpha</r-option><r-option value="b">Beta</r-option>
    <r-option value="c">Gamma</r-option></r-select>`,
  );
});

/** What a reader sees on each row: its fill, its weight and whether a check mark is painted. */
const rows = (page: Page) =>
  page.locator('r-dropdown-item').evaluateAll((items) =>
    items.map((item) => {
      const row = (item as HTMLElement & { _shadowDom: ShadowRoot })._shadowDom.querySelector(
        '.ranui-dropdown-option-item',
      )!;
      const style = getComputedStyle(row);
      const check = getComputedStyle(row, '::after');
      return {
        label: item.textContent!.trim(),
        fill: style.backgroundColor,
        weight: style.fontWeight,
        check: check.content !== 'none' && check.width !== 'auto' && parseFloat(check.width) > 0,
      };
    }),
  );

const transparent = 'rgba(0, 0, 0, 0)';

test('the selected row keeps its check and weight while the keyboard cursor sits on another row', async ({ page }) => {
  await page.locator('#select').focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('r-dropdown-item').first()).toBeVisible();
  await page.keyboard.press('ArrowDown');
  await expect(page.locator('#select')).toHaveAttribute('aria-activedescendant', /.+/);

  const [alpha, beta, gamma] = await rows(page);
  expect(beta).toMatchObject({ label: 'Beta', check: true, weight: '500', fill: transparent });
  expect(gamma.label).toBe('Gamma');
  expect(gamma.check).toBe(false);
  expect(gamma.weight).toBe('400');
  expect(gamma.fill).not.toBe(transparent);
  expect(alpha).toMatchObject({ check: false, fill: transparent });
  await expect(page.locator('#select')).toHaveAttribute('value', 'b');
});

test('pointer hover moves the one cursor fill and leaves the selection cue in place', async ({ page }) => {
  await page.locator('#select').click();
  const alphaItem = page.locator('r-dropdown-item').filter({ hasText: 'Alpha' });
  await expect(alphaItem).toBeVisible();
  const box = (await alphaItem.boundingBox())!;
  await page.mouse.move(box.x + 10, box.y + box.height / 2);
  await page.mouse.move(box.x + 20, box.y + box.height / 2);
  await expect.poll(async () => (await rows(page))[0].fill).not.toBe(transparent);

  const [alpha, beta, gamma] = await rows(page);
  expect(alpha.check).toBe(false);
  expect(beta).toMatchObject({ check: true, weight: '500', fill: transparent });
  expect(gamma.fill).toBe(transparent);
  // The keyboard continues from where the pointer left the cursor.
  await page.keyboard.press('ArrowDown');
  const after = await rows(page);
  expect(after[0].fill).toBe(transparent);
  expect(after[1]).toMatchObject({ check: true, weight: '500' });
  expect(after[1].fill).not.toBe(transparent);
});

test('a value set in code after a hovered-and-dismissed menu still commits, and reopening starts on it', async ({
  page,
}) => {
  await page.locator('#select').click();
  const gammaItem = page.locator('r-dropdown-item').filter({ hasText: 'Gamma' });
  await expect(gammaItem).toBeVisible();
  const box = (await gammaItem.boundingBox())!;
  await page.mouse.move(box.x + 10, box.y + box.height / 2);
  await page.mouse.move(box.x + 20, box.y + box.height / 2);
  await page.keyboard.press('Escape');
  await expect(page.locator('#select')).toHaveAttribute('value', 'b');

  await page.locator('#select').evaluate((select) => ((select as HTMLElement & { value: string }).value = 'c'));
  const shown = () =>
    page.locator('#select').evaluate((select) => (select as HTMLElement & { _text: HTMLElement })._text.textContent);
  await expect.poll(shown).toBe('Gamma');

  await page.locator('#select').focus();
  await page.keyboard.press('Enter');
  await expect(gammaItem).toBeVisible();
  await expect(page.locator('#select')).toHaveAttribute('aria-activedescendant', (await gammaItem.getAttribute('id'))!);
});
