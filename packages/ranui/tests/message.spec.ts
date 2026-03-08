import { expect, test } from '@playwright/test';
import { DEV_SERVER } from '../build/config';

test.describe('message', () => {
  test('supports top, zIndex and getContainer', async ({ page }) => {
    await page.goto(DEV_SERVER, { waitUntil: 'load' });

    await page.evaluate(() => {
      const existed = document.getElementById('custom-message-root');
      if (existed) {
        existed.remove();
      }
      const root = document.createElement('div');
      root.id = 'custom-message-root';
      document.body.appendChild(root);

      window.message?.info({
        content: 'custom container message',
        duration: 5000,
        top: 40,
        zIndex: 2222,
        getContainer: () => root,
      });
    });

    const host = page.locator('#custom-message-root [data-ranui-message-host="true"]');
    await expect(host).toBeVisible();
    await expect(host).toHaveCSS('top', '40px');
    await expect(host).toHaveCSS('z-index', '2222');
    await expect(page.locator('#custom-message-root r-message')).toHaveCount(1);
  });

  test('reuses one host in same container and updates host style per call', async ({ page }) => {
    await page.goto(DEV_SERVER, { waitUntil: 'load' });

    await page.evaluate(() => {
      const existed = document.getElementById('custom-message-root-2');
      if (existed) {
        existed.remove();
      }
      const root = document.createElement('div');
      root.id = 'custom-message-root-2';
      document.body.appendChild(root);

      window.message?.success({
        content: 'first',
        duration: 5000,
        top: 12,
        zIndex: 1300,
        getContainer: () => root,
      });

      window.message?.warning({
        content: 'second',
        duration: 5000,
        top: 28,
        zIndex: 1400,
        getContainer: () => root,
      });
    });

    const host = page.locator('#custom-message-root-2 [data-ranui-message-host="true"]');
    await expect(host).toHaveCount(1);
    await expect(host).toHaveCSS('top', '28px');
    await expect(host).toHaveCSS('z-index', '1400');
    await expect(page.locator('#custom-message-root-2 r-message')).toHaveCount(2);
  });
});
