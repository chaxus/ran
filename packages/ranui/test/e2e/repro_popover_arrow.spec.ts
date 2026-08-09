import { test } from '@playwright/test';
import { isolatedSetup } from './helpers';
import { DEV_SERVER } from '../../build/config';

test('screenshot real popover arrow per placement after fix', async ({ page }) => {
  await isolatedSetup(page, DEV_SERVER, 'r-popover');
  await page.evaluate(() => {
    const wrap = document.createElement('div');
    wrap.style.cssText = 'padding:200px 60px; display:flex; gap:180px; background:#d9e2ff; width:1400px;';
    (['top', 'bottom', 'left', 'right'] as const).forEach((placement) => {
      const cell = document.createElement('div');
      cell.style.cssText = 'display:inline-block;';
      const p = document.createElement('r-popover') as any;
      p.setAttribute('placement', placement);
      p.setAttribute('trigger', 'click');
      p.setAttribute('arrow', 'true');
      p.innerHTML = `
        <r-button>${placement}</r-button>
        <r-content>
          <div style="padding: 8px 12px; width:140px;">Popover content for ${placement}</div>
        </r-content>
      `;
      cell.appendChild(p);
      wrap.appendChild(cell);
    });
    document.body.appendChild(wrap);
  });
  await page.waitForTimeout(300);
  const buttons = page.locator('r-button');
  const count = await buttons.count();
  for (let i = 0; i < count; i++) {
    await buttons.nth(i).click();
    await page.waitForTimeout(300);
    const box = await buttons.nth(i).boundingBox();
    if (box) {
      await page.screenshot({
        path: `repro-popover-fixed-${i}.png`,
        clip: { x: box.x - 100, y: box.y - 130, width: box.width + 200, height: box.height + 200 },
      });
    }
    await buttons.nth(i).click();
    await page.waitForTimeout(200);
  }
});
