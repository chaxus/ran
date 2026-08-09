import { test } from '@playwright/test';
import { DEV_SERVER } from '../../build/config';
import { isolatedSetup, mount } from './helpers';

const POPOVER_HTML = `
  <div id="host-wrap">
    <r-popover trigger="click" style="display: inline-block;">
      <r-button>click</r-button>
      <r-content>
        <div>click content</div>
      </r-content>
    </r-popover>
  </div>
`;

test('popover — host removal (route switch) orphans the portaled panel', async ({ page }) => {
  await isolatedSetup(page, DEV_SERVER, 'r-popover');
  await mount(page, POPOVER_HTML);

  await page.locator('r-button').click();
  await page.waitForTimeout(400);
  const openState = await page.evaluate(
    () => (document.querySelector('.ran-popover-dropdown') as HTMLElement | null)?.style.display,
  );
  console.log('open state:', openState);

  // simulate an SPA route switch: the host element (and its subtree) is torn down
  await page.evaluate(() => {
    document.getElementById('host-wrap')?.remove();
  });
  await page.waitForTimeout(400);

  const stillInDom = await page.evaluate(() => !!document.querySelector('.ran-popover-dropdown'));
  const stillVisible = await page.evaluate(
    () => (document.querySelector('.ran-popover-dropdown') as HTMLElement | null)?.style.display,
  );
  console.log('after host removal — still in DOM:', stillInDom, 'display:', stillVisible);
});
