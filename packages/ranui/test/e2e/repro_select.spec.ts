import { test } from '@playwright/test';
import { isolatedSetup } from './helpers';
import { DEV_SERVER } from '../../build/config';

test('measure select vs input box metrics', async ({ page }) => {
  await isolatedSetup(page, DEV_SERVER, 'r-select');
  await page.evaluate(() => {
    const wrap = document.createElement('div');
    wrap.style.cssText = 'width:400px; display:flex; gap:12px; align-items:flex-start;';
    wrap.innerHTML = `
      <r-input placeholder="No label input" style="flex:1"></r-input>
      <r-select style="flex:1" defaultValue="a">
        <r-option value="a">Option A</r-option>
        <r-option value="b">Option B</r-option>
      </r-select>
    `;
    document.body.appendChild(wrap);
  });
  await page.waitForTimeout(300);
  const metrics = await page.evaluate(() => {
    const input = document.querySelector('r-input')!;
    const select = document.querySelector('r-select')!;
    const inputRect = input.getBoundingClientRect();
    const selectRect = select.getBoundingClientRect();
    const inputBox = (input as any)._shadowDom.querySelector('.ran-input').getBoundingClientRect();
    const selectSelection = (select as any).shadowRoot
      ? null
      : (select as any)._shadowDom?.querySelector('.selection')?.getBoundingClientRect();
    return {
      hostInput: { h: inputRect.height, top: inputRect.top },
      hostSelect: { h: selectRect.height, top: selectRect.top },
      inputBox: { h: inputBox.height, top: inputBox.top },
      selectSelection,
    };
  });
  console.log('METRICS:', JSON.stringify(metrics, null, 2));
});
