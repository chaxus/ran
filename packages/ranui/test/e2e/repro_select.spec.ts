import { test } from '@playwright/test';
import { isolatedSetup } from './helpers';
import { DEV_SERVER } from '../../build/config';

test('repro select search + label click-to-focus', async ({ page }) => {
  await isolatedSetup(page, DEV_SERVER, 'r-select');
  await page.evaluate(() => {
    const wrap = document.createElement('div');
    wrap.style.cssText = 'width:400px; display:flex; flex-direction:column; gap:16px;';
    wrap.innerHTML = `
      <r-select label="Search me" showSearch style="width:100%" defaultValue="a">
        <r-option value="a">Apple</r-option>
        <r-option value="b">Banana</r-option>
      </r-select>
    `;
    document.body.appendChild(wrap);
  });
  await page.waitForTimeout(300);
  await page.screenshot({ path: 'repro-select-search.png' });

  await page.evaluate(() => {
    const select = document.querySelector('r-select')! as any;
    const lbl = select._shadowDom.querySelector('.ran-select-label') as HTMLElement;
    lbl.click();
  });
  await page.waitForTimeout(100);
  const focused = await page.evaluate(() => document.activeElement?.tagName);
  console.log('FOCUSED_AFTER_LABEL_CLICK:', focused);
});
