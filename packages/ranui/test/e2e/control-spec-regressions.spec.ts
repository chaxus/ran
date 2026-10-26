import { expect, test } from '@playwright/test';
import { DEV_SERVER } from '../../build/config';
import { isolatedSetup, mount } from './helpers';

test('an author tabindex on a popover survives a later slot change', async ({ page }) => {
  await isolatedSetup(page, DEV_SERVER, 'r-popover');
  await mount(page, '<r-popover id="p"><span>Plain text trigger</span><r-content>Panel</r-content></r-popover>');
  await expect(page.locator('#p')).toHaveAttribute('tabindex', '0');
  await page.locator('#p').evaluate((host) => {
    host.setAttribute('tabindex', '-1');
    host.append(document.createElement('span'));
  });
  await page.waitForTimeout(50);
  await expect(page.locator('#p')).toHaveAttribute('tabindex', '-1');
});

test('a field in error keeps its danger border while focused', async ({ page }) => {
  await isolatedSetup(page, DEV_SERVER, 'r-input');
  await mount(page, '<r-input id="i" status="error" message="Required"></r-input>');
  const border = () =>
    page.locator('#i').evaluate((host) => {
      const box = (host as HTMLElement & { _shadowDom: ShadowRoot })._shadowDom.querySelector('.ran-input')!;
      return getComputedStyle(box).borderTopColor;
    });
  const atRest = await border();
  await page.keyboard.press('Tab');
  expect(await border()).toBe(atRest);
});

test('a select without a width never grows past its container', async ({ page }) => {
  await isolatedSetup(page, DEV_SERVER, 'r-select');
  await mount(
    page,
    '<div id="box" style="width:160px"><r-select id="s" value="a"><r-option value="a">A label far too long to fit inside a narrow sidebar column</r-option></r-select></div>',
  );
  await page.waitForTimeout(200);
  const widths = await page.evaluate(() => ({
    box: document.getElementById('box')!.getBoundingClientRect().width,
    select: document.getElementById('s')!.getBoundingClientRect().width,
  }));
  expect(widths.select).toBeLessThanOrEqual(widths.box);
});
