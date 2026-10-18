import { fileURLToPath } from 'node:url';
import { expect, test } from '@playwright/test';

for (const order of [
  ['popover', 'select'],
  ['select', 'popover'],
]) {
  test(`nested portals work across standalone IIFEs loaded ${order.join(' then ')}`, async ({ page }) => {
    for (const component of order) {
      await page.addScriptTag({
        path: fileURLToPath(new URL(`../../dist/iife/${component}.iife.js`, import.meta.url)),
      });
    }
    await page.evaluate(() => {
      const fixture = document.createElement('div');
      fixture.innerHTML = `
      <r-popover trigger="click" placement="bottom"><button id="info">Details</button><r-content>
        <r-select style="width:120px"><r-option value="one">One</r-option><r-option value="two">Two</r-option></r-select>
      </r-content></r-popover>
    `;
      document.body.replaceChildren(fixture);
    });
    await page.locator('#info').click();
    await page.locator('r-select').click();
    await page.locator('r-dropdown-item').filter({ hasText: 'Two' }).click();
    await expect(page.locator('r-select')).toHaveAttribute('value', 'two');
    await page.evaluate(() => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve))));
    await expect(page.locator('r-popover')).toHaveAttribute('open', '');
  });
}
