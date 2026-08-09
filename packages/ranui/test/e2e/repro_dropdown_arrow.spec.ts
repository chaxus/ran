import { test } from '@playwright/test';
import { isolatedSetup } from './helpers';
import { DEV_SERVER } from '../../build/config';

test('zoomed screenshot dropdown arrow per placement', async ({ page }) => {
  await isolatedSetup(page, DEV_SERVER, 'r-dropdown');
  await page.evaluate(() => {
    const wrap = document.createElement('div');
    wrap.style.cssText = 'padding:150px; display:flex; gap:200px; background:#d9e2ff;';
    wrap.innerHTML = `
      <r-dropdown arrow="top" style="position:relative; width:160px; height:60px;">
        <div style="padding:8px;">top</div>
      </r-dropdown>
      <r-dropdown arrow="bottom" style="position:relative; width:160px; height:60px;">
        <div style="padding:8px;">bottom</div>
      </r-dropdown>
      <r-dropdown arrow="left" style="position:relative; width:160px; height:60px;">
        <div style="padding:8px;">left</div>
      </r-dropdown>
      <r-dropdown arrow="right" style="position:relative; width:160px; height:60px;">
        <div style="padding:8px;">right</div>
      </r-dropdown>
    `;
    document.body.appendChild(wrap);
  });
  await page.waitForTimeout(300);
  await page.setViewportSize({ width: 1600, height: 800 });
  const dropdowns = page.locator('r-dropdown');
  const count = await dropdowns.count();
  for (let i = 0; i < count; i++) {
    const box = await dropdowns.nth(i).boundingBox();
    if (!box) continue;
    await page.screenshot({
      path: `repro-arrow-${i}.png`,
      clip: { x: box.x - 40, y: box.y - 40, width: box.width + 80, height: box.height + 80 },
    });
  }
});
