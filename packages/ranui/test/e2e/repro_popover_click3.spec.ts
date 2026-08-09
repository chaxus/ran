import { test } from '@playwright/test';
import { DEV_SERVER } from '../../build/config';
import { isolatedSetup, mount } from './helpers';

const POPOVER_HTML = `
  <r-popover trigger="hover" style="display: inline-block;">
    <r-button>hover</r-button>
    <r-content>
      <div>hover</div>
    </r-content>
  </r-popover>
  <r-popover trigger="click" style="display: inline-block;">
    <r-button>click</r-button>
    <r-content>
      <div>click</div>
    </r-content>
  </r-popover>
`;

test('trigger mode demo — click popover close', async ({ page }) => {
  page.on('console', (msg) => console.log('BROWSER:', msg.type(), msg.text()));
  page.on('pageerror', (err) => console.log('PAGEERROR:', err.message));
  await isolatedSetup(page, DEV_SERVER, 'r-popover');
  await mount(page, POPOVER_HTML);

  const clickBtn = page.locator('r-popover', { hasText: 'click' }).locator('r-button');
  const hoverBtn = page.locator('r-popover', { hasText: 'hover' }).locator('r-button');

  // Simulate mouse traveling over the hover trigger on the way to the click trigger,
  // like a real user would in the demo layout.
  await hoverBtn.hover();
  await page.waitForTimeout(100);
  await clickBtn.click();
  await page.waitForTimeout(400);

  const state1 = await page.evaluate(() => {
    const nodes = Array.from(document.querySelectorAll('.ran-popover-dropdown')) as HTMLElement[];
    return nodes.map((n) => ({ display: n.style.display, text: n.textContent?.trim() }));
  });
  console.log('after click-open:', JSON.stringify(state1));

  // click elsewhere on the page (outside both popovers)
  await page.mouse.click(10, 300);
  await page.waitForTimeout(400);

  const state2 = await page.evaluate(() => {
    const nodes = Array.from(document.querySelectorAll('.ran-popover-dropdown')) as HTMLElement[];
    return nodes.map((n) => ({ display: n.style.display, text: n.textContent?.trim() }));
  });
  console.log('after outside click:', JSON.stringify(state2));
});

test('trigger mode demo — re-click trigger while open', async ({ page }) => {
  await isolatedSetup(page, DEV_SERVER, 'r-popover');
  await mount(page, `
    <r-popover trigger="click" style="display: inline-block;">
      <r-button>click</r-button>
      <r-content>
        <div>click</div>
      </r-content>
    </r-popover>
  `);
  const clickBtn = page.locator('r-button');
  await clickBtn.click();
  await page.waitForTimeout(400);
  const state1 = await page.evaluate(() => (document.querySelector('.ran-popover-dropdown') as HTMLElement)?.style.display);
  console.log('after 1st click:', state1);

  await clickBtn.click();
  await page.waitForTimeout(400);
  const state2 = await page.evaluate(() => (document.querySelector('.ran-popover-dropdown') as HTMLElement)?.style.display);
  console.log('after 2nd click on SAME trigger:', state2);
});
