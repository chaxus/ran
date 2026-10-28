import { test, expect } from '@playwright/test';
import { DEV_SERVER } from '../../build/config';
import { isolatedSetup, mount } from './helpers';

test.use({ viewport: { width: 600, height: 400 } });

const POPOVER_HTML = `
  <div style="padding: 60px;">
    <r-popover placement="top" trigger="click" arrow="true">
      <r-button>Click</r-button>
      <r-content>
        <div style="padding: 8px 12px;">Popover content</div>
      </r-content>
    </r-popover>
  </div>
`;

test.beforeEach(async ({ page }) => {
  await isolatedSetup(page, DEV_SERVER, 'r-popover');
});

// The arrow belongs to the panel: it fades out with it, frame for frame, rather than staying
// fully drawn until the panel is hidden.
test.describe('popover — closing', () => {
  test.use({ contextOptions: { reducedMotion: 'no-preference' } });
  test('the arrow fades out with the panel', async ({ page }) => {
    await mount(page, POPOVER_HTML);
    const trigger = page.locator('r-button');
    const panel = page.locator('.ran-popover-dropdown');
    await trigger.click();
    await expect(panel).toHaveCSS('display', 'block');
    await page.waitForTimeout(400);
    await panel.evaluate((host) => {
      const root = (host as HTMLElement & { _shadowDom: ShadowRoot })._shadowDom;
      const shown = (element: Element) => {
        let opacity = 1;
        for (let node: Element | null = element; node; node = node.parentElement)
          opacity *= Number(getComputedStyle(node).opacity);
        return opacity;
      };
      const body = root.querySelector('.ranui-dropdown')!;
      const arrow = root.querySelector('.ranui-dropdown-arrow')!;
      const samples: Array<[number, number]> = [];
      (window as unknown as { samples: typeof samples }).samples = samples;
      const sample = () => {
        if ((host as HTMLElement).style.display === 'none') return;
        samples.push([shown(body), shown(arrow)]);
        requestAnimationFrame(sample);
      };
      requestAnimationFrame(sample);
    });
    await trigger.click();
    await expect(panel).toHaveCSS('display', 'none');
    const samples = await page.evaluate(() => (window as unknown as { samples: Array<[number, number]> }).samples);
    // The exit was actually caught part-way, and the arrow matched the panel throughout.
    expect(samples.some(([body]) => body > 0.05 && body < 0.95)).toBe(true);
    for (const [body, arrow] of samples) expect(Math.abs(body - arrow)).toBeLessThan(0.02);
  });
});
