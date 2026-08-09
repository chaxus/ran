import { test } from '@playwright/test';
import { isolatedSetup } from './helpers';
import { DEV_SERVER } from '../../build/config';

test('inspect real popover arrow geometry', async ({ page }) => {
  await isolatedSetup(page, DEV_SERVER, 'r-popover');
  await page.evaluate(() => {
    const wrap = document.createElement('div');
    wrap.style.cssText = 'padding:200px 60px; background:#d9e2ff; width:1400px;';
    const p = document.createElement('r-popover') as any;
    p.setAttribute('placement', 'top');
    p.setAttribute('trigger', 'click');
    p.setAttribute('arrow', 'true');
    p.innerHTML = `
      <r-button>top</r-button>
      <r-content>
        <div style="padding: 8px 12px; width:140px;">Popover content for top</div>
      </r-content>
    `;
    wrap.appendChild(p);
    document.body.appendChild(wrap);
  });
  await page.waitForTimeout(300);
  await page.locator('r-button').click();
  await page.waitForTimeout(300);

  const info = await page.evaluate(() => {
    const popover = document.querySelector('r-popover') as any;
    const dd = popover.popoverContent as HTMLElement;
    const shadow = (dd as any)._shadowDom as ShadowRoot;
    const container = shadow.querySelector('.ranui-dropdown-container') as HTMLElement;
    const panel = shadow.querySelector('.ranui-dropdown') as HTMLElement;
    const arrow = shadow.querySelector('.ranui-dropdown-arrow') as HTMLElement;
    const cs = arrow ? getComputedStyle(arrow) : null;
    const ddStyle = getComputedStyle(dd);
    return {
      ddArrowAttr: dd.getAttribute('arrow'),
      arrowClass: arrow?.className,
      anchorWidthVar: ddStyle.getPropertyValue('--ran-dropdown-arrow-anchor-width'),
      anchorHeightVar: ddStyle.getPropertyValue('--ran-dropdown-arrow-anchor-height'),
      panelRect: panel?.getBoundingClientRect(),
      arrowRect: arrow?.getBoundingClientRect(),
      arrowTransform: cs?.transform,
    };
  });
  console.log('POPOVER_ARROW_INFO:', JSON.stringify(info, null, 2));
  await page.screenshot({ path: 'repro-popover-zoom.png', clip: { x: 60, y: 100, width: 300, height: 200 } });
});
