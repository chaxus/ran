import { test, expect } from '@playwright/test';
import { DEV_SERVER } from '../../build/config';
import { isolatedSetup, mount } from './helpers';

test.use({ viewport: { width: 600, height: 400 } });

const POPOVER_HTML = `
  <div style="padding: 60px;">
    <r-popover placement="top" trigger="hover,click" arrow="true">
      <r-button>Hover or click</r-button>
      <r-content>
        <div style="padding: 8px 12px;">Popover content</div>
      </r-content>
    </r-popover>
  </div>
`;

test.beforeEach(async ({ page }) => {
  await isolatedSetup(page, DEV_SERVER, 'r-popover');
});

test('popover — closed', async ({ page }) => {
  await mount(page, POPOVER_HTML);
  await expect(page.locator('r-button')).toBeVisible();
  await expect(page.locator('div').first()).toHaveScreenshot('popover-closed.png');
});

test('popover — open on hover', async ({ page }) => {
  await mount(page, POPOVER_HTML);
  const trigger = page.locator('r-button');
  await expect(trigger).toBeVisible();
  await trigger.hover();
  await page.waitForTimeout(200);
  // Popup is appended to body outside the component — capture full viewport
  await expect(page).toHaveScreenshot('popover-open.png');
});

test('popover — open on click', async ({ page }) => {
  await mount(page, POPOVER_HTML);
  const trigger = page.locator('r-button');
  await expect(trigger).toBeVisible();
  await trigger.click();
  await page.waitForTimeout(200);
  await expect(page).toHaveScreenshot('popover-click-open.png');
});

test('popover — click trigger again closes it', async ({ page }) => {
  await mount(page, POPOVER_HTML);
  const trigger = page.locator('r-button');
  const content = page.locator('.ran-popover-dropdown');
  await trigger.click();
  await expect(content).toHaveCSS('display', 'block');
  await trigger.click();
  await expect(content).toHaveCSS('display', 'none');
});

test('popover — removing the host while open also removes the portaled panel', async ({ page }) => {
  await mount(page, `<div id="host-wrap">${POPOVER_HTML}</div>`);
  const trigger = page.locator('r-button');
  await trigger.click();
  await expect(page.locator('.ran-popover-dropdown')).toHaveCSS('display', 'block');

  // Simulates an SPA route swap / conditional unmount tearing down the host
  // while its panel is open and portaled to document.body.
  await page.evaluate(() => document.getElementById('host-wrap')?.remove());

  await expect(page.locator('.ran-popover-dropdown')).toHaveCount(0);
});

// ── open state, shared with r-select through the floating controller ─────────

// Same contract as r-select's: `open` is the state, the trigger toggles it, and
// the announced state cannot drift from the panel. Both components run the same
// controller now, so this is here to make sure the wiring on this side is
// actually connected — not to re-test the controller.
test('popover — clicking the trigger toggles open, however fast the clicks arrive', async ({ page }) => {
  await mount(
    page,
    `
    <div style="padding: 60px;">
      <r-popover id="pop" placement="bottom" trigger="click">
        <r-button>Trigger</r-button>
        <r-content><div style="padding: 8px 12px;">Content</div></r-content>
      </r-popover>
    </div>
  `,
  );
  const popover = page.locator('#pop');
  const trigger = page.locator('r-button');
  await page.waitForTimeout(50);

  const readings: { open: boolean; aria: string | null }[] = [];
  for (let i = 0; i < 4; i++) {
    await trigger.click();
    await page.waitForTimeout(40);
    readings.push(
      await popover.evaluate((node) => ({
        open: node.hasAttribute('open'),
        aria: node.getAttribute('aria-expanded'),
      })),
    );
  }

  expect(readings.map((r) => r.open)).toEqual([true, false, true, false]);
  for (const r of readings) expect(r.aria).toBe(String(r.open));
});

test('popover — the open property drives the panel, and the events bracket it', async ({ page }) => {
  await mount(
    page,
    `
    <div style="padding: 60px;">
      <r-popover id="pop" placement="bottom" trigger="click">
        <r-button>Trigger</r-button>
        <r-content><div id="body" style="padding: 8px 12px;">Content</div></r-content>
      </r-popover>
    </div>
  `,
  );
  const popover = page.locator('#pop');
  await page.waitForTimeout(50);

  await popover.evaluate((node) => {
    (window as unknown as { seen: string[] }).seen = [];
    for (const name of ['show', 'after-show', 'hide', 'after-hide']) {
      node.addEventListener(name, () => (window as unknown as { seen: string[] }).seen.push(name));
    }
  });

  await popover.evaluate((node: HTMLElement & { show: () => void }) => node.show());
  await page.waitForTimeout(500);
  await expect(page.locator('#body')).toBeVisible();
  await expect(popover).toHaveAttribute('open', '');

  await popover.evaluate((node: HTMLElement & { hide: () => void }) => node.hide());
  await page.waitForTimeout(500);
  await expect(page.locator('#body')).toBeHidden();

  const seen = await page.evaluate(() => (window as unknown as { seen: string[] }).seen);
  expect(seen).toEqual(['show', 'after-show', 'hide', 'after-hide']);
});
