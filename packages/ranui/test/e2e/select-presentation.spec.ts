import { expect, test, type Page } from '@playwright/test';
import { DEV_SERVER } from '../../build/config';
import { insideShadow, isolatedSetup, mount } from './helpers';

const triggerStyle = (page: Page) =>
  insideShadow(page, '#select', (root) => {
    const surface = getComputedStyle(root.querySelector('[part="selection"]')!);
    return {
      color: getComputedStyle(root.querySelector('[part="selection-item"]')!).color,
      shadow: surface.boxShadow,
      borderWidth: surface.borderLeftWidth,
    };
  });

for (const theme of ['light', 'dark'] as const) {
  test.describe(`r-select presentation in ${theme}`, () => {
    test.beforeEach(async ({ page }) => {
      await isolatedSetup(page, DEV_SERVER, 'r-select');
      await page.emulateMedia({ colorScheme: theme });
      await page.evaluate((value) => {
        document.documentElement.setAttribute('data-ran-theme', value);
        document.body.style.background = 'var(--ran-color-bg)';
      }, theme);
      expect(
        await page.evaluate(() =>
          getComputedStyle(document.documentElement).getPropertyValue('--ran-gray-1000').trim(),
        ),
      ).toBe(theme === 'dark' ? '#ededed' : '#171717');
    });

    test('text variant paints keyboard focus while retaining its chromeless surface', async ({ page }) => {
      await mount(
        page,
        '<r-select id="select" type="text" label="Workspace visibility" value="a" trigger="click" style="width:240px"><r-option value="a">Private workspace</r-option><r-option value="c">Team workspace</r-option></r-select>',
      );
      expect((await triggerStyle(page)).shadow).toBe('none');
      await page.keyboard.press('Tab');
      await expect(page.locator('#select')).toBeFocused();
      expect(await page.locator('#select').evaluate((el) => el.matches(':focus-visible'))).toBe(true);
      expect((await triggerStyle(page)).shadow).not.toBe('none');
      expect((await triggerStyle(page)).borderWidth).toBe('0px');
      await page.keyboard.press('Enter');
      await expect(page.locator('#select')).toHaveAttribute('open');
      await page.keyboard.press('Escape');
      await expect(page.locator('#select')).not.toHaveAttribute('open');
      expect((await triggerStyle(page)).shadow).not.toBe('none');
    });

    test('keeps a valid selected value readable on keyboard focus and hover', async ({ page }) => {
      await mount(
        page,
        '<r-select id="select" label="Workspace visibility" value="a" trigger="click" style="width:240px"><r-option value="a">Private workspace</r-option><r-option value="c">Team workspace</r-option></r-select>',
      );
      await page.mouse.move(500, 500);
      const resting = await triggerStyle(page);
      await page.keyboard.press('Tab');
      await expect(page.locator('#select')).toBeFocused();
      expect((await triggerStyle(page)).shadow).not.toBe('none');
      expect((await triggerStyle(page)).color).toBe(resting.color);
      await page.keyboard.press('Tab');
      await page.locator('#select').hover();
      await expect.poll(async () => (await triggerStyle(page)).color).toBe(resting.color);
    });

    test('distinguishes a disabled option without hover feedback and preserves selection guards', async ({ page }) => {
      await mount(
        page,
        '<r-select id="select" label="Workspace visibility" value="a" trigger="click" style="width:280px"><r-option value="a">Private workspace</r-option><r-option value="b" disabled>Public workspace</r-option><r-option value="c">Team workspace</r-option></r-select>',
      );
      await page.locator('#select').click();
      const disabled = page.locator('r-dropdown-item[value="b"]');
      await expect(disabled).toBeVisible();
      const style = (selector: string) =>
        insideShadow(page, selector, (root) => {
          const item = getComputedStyle(root.querySelector('[part="item"]')!);
          return {
            color: getComputedStyle(root.querySelector('[part="content"]')!).color,
            cursor: item.cursor,
            background: item.backgroundColor,
          };
        });
      const resting = await style('r-dropdown-item[value="b"]');
      expect(resting.color).not.toBe((await style('r-dropdown-item[value="c"]')).color);
      expect(resting.cursor).toBe('not-allowed');
      await disabled.hover();
      expect((await style('r-dropdown-item[value="b"]')).background).toBe(resting.background);
      const target = await disabled.boundingBox();
      expect(target?.width).toBeGreaterThan(0);
      // Playwright's locator click refuses aria-disabled targets. Send the actual pointer
      // at its measured box so the component's own selection guard is exercised.
      await page.mouse.click(target!.x + target!.width / 2, target!.y + target!.height / 2);
      await expect(page.locator('#select')).toHaveAttribute('value', 'a');
      await page.locator('#select').focus();
      await page.keyboard.press('ArrowDown');
      await expect(disabled).toHaveAttribute('aria-selected', 'false');
      await page.keyboard.press('Enter');
      await expect(page.locator('#select')).toHaveAttribute('value', 'c');
      await expect(page.locator('#select')).not.toHaveAttribute('open');
    });
  });
}
