import { test } from '@playwright/test';
import { DEV_SERVER } from '../../build/config';
import { isolatedSetup, mount } from './helpers';

const POPOVER_HTML = `
  <div style="padding: 60px;">
    <r-popover placement="top" trigger="click" arrow="true">
      <r-button>click</r-button>
      <r-content>
        <div style="padding: 8px 12px;">click content</div>
      </r-content>
    </r-popover>
  </div>
`;

test('popover click open then close by outside click', async ({ page }) => {
  await isolatedSetup(page, DEV_SERVER, 'r-popover');
  await mount(page, POPOVER_HTML);
  const trigger = page.locator('r-button');
  await trigger.click();
  await page.waitForTimeout(400);
  const displayAfterOpen = await page.evaluate(() => {
    const el = document.querySelector('.ran-popover-dropdown') as HTMLElement | null;
    return el ? el.style.display : 'NOT FOUND';
  });
  console.log('after open:', displayAfterOpen);

  await page.mouse.click(500, 350);
  await page.waitForTimeout(400);
  const displayAfterOutsideClick = await page.evaluate(() => {
    const el = document.querySelector('.ran-popover-dropdown') as HTMLElement | null;
    return el ? el.style.display : 'NOT FOUND';
  });
  console.log('after outside click:', displayAfterOutsideClick);

  await trigger.click();
  await page.waitForTimeout(400);
  const displayAfterReclick = await page.evaluate(() => {
    const el = document.querySelector('.ran-popover-dropdown') as HTMLElement | null;
    return el ? el.style.display : 'NOT FOUND';
  });
  console.log('after re-click trigger while open:', displayAfterReclick);
});
