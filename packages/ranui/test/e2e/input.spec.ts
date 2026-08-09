import { test, expect } from '@playwright/test';
import { DEV_SERVER } from '../../build/config';
import { isolatedSetup, mount } from './helpers';

test.use({ viewport: { width: 600, height: 300 } });

test.beforeEach(async ({ page }) => {
  await isolatedSetup(page, DEV_SERVER, 'r-input');
});

test('input — default with label', async ({ page }) => {
  await mount(
    page,
    `
    <r-input style="width: 240px" label="Username" placeholder="Enter username"></r-input>
  `,
  );
  const el = page.locator('r-input');
  await expect(el).toBeVisible();
  await expect(el).toHaveScreenshot('input-default.png');
});

test('input — with icon', async ({ page }) => {
  await mount(
    page,
    `
    <r-input style="width: 240px" label="Password" type="password" icon="lock"></r-input>
  `,
  );
  const el = page.locator('r-input');
  await expect(el).toBeVisible();
  await expect(el).toHaveScreenshot('input-with-icon.png');
});

test('input — focused', async ({ page }) => {
  await mount(
    page,
    `
    <r-input id="inp" style="width: 240px" label="Email" placeholder="you@example.com"></r-input>
  `,
  );
  const el = page.locator('#inp');
  await expect(el).toBeVisible();
  // Click the native input inside shadow DOM to trigger focus styles
  await page.evaluate(() => {
    const host = document.querySelector('#inp') as any;
    host?.shadowRoot?.querySelector('input')?.focus();
  });
  await page.waitForTimeout(50);
  await expect(el).toHaveScreenshot('input-focused.png');
});

test('input — disabled', async ({ page }) => {
  await mount(
    page,
    `
    <r-input style="width: 240px" label="Read only" disabled value="Cannot edit"></r-input>
  `,
  );
  const el = page.locator('r-input');
  await expect(el).toBeVisible();
  await expect(el).toHaveScreenshot('input-disabled.png');
});

test('input — Enter key submits the host <form>', async ({ page }) => {
  // The real <input> that receives the keypress lives in a closed shadow root, so its form
  // owner resolves to null along the real DOM ancestor chain — Enter's native implicit
  // submission never fires on its own. Regression test for that gap.
  await mount(
    page,
    `
    <form id="f">
      <r-input name="username" label="Username"></r-input>
    </form>
  `,
  );
  await page.evaluate(() => {
    (window as unknown as { submitted?: boolean }).submitted = false;
    document.getElementById('f')?.addEventListener('submit', (e) => {
      e.preventDefault();
      (window as unknown as { submitted?: boolean }).submitted = true;
    });
  });
  const host = page.locator('r-input');
  await host.evaluate((el) => (el as HTMLElement & { focus: () => void }).focus());
  await page.keyboard.type('alice');
  await page.keyboard.press('Enter');
  await expect.poll(() => page.evaluate(() => (window as unknown as { submitted?: boolean }).submitted)).toBe(true);
});
