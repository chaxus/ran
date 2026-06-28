import { test, expect } from '@playwright/test';
import { argosScreenshot } from '@argos-ci/playwright';
import { DEV_SERVER } from '../../../build/config';

test.beforeEach(async ({ page }) => {
  await page.goto(`${DEV_SERVER}components`, { waitUntil: 'domcontentloaded' });
  await page.waitForFunction(() => customElements.get('r-player'));
});

test('player initial UI (no video loaded)', async ({ page }) => {
  // Inject a standalone player with no src so the video area is deterministic
  await page.evaluate(() => {
    const container = document.createElement('div');
    container.style.cssText = 'width:700px;height:400px;background:#000;border-radius:8px;overflow:hidden;';
    const player = document.createElement('r-player');
    player.setAttribute('debug', 'true');
    container.appendChild(player);

    document.body.innerHTML = '';
    document.body.style.cssText = 'margin:0;padding:24px;background:#f5f7fb;';
    document.body.appendChild(container);
  });

  await page.waitForTimeout(500);
  const container = page.locator('div').first();
  await expect(container).toBeVisible();
  await argosScreenshot(page, 'player-no-src', { element: container });
});

test('player control bar layout', async ({ page }) => {
  // Inject player and let it partially initialize, then screenshot just the controls
  await page.evaluate(() => {
    const container = document.createElement('div');
    container.style.cssText =
      'width:700px;height:400px;background:#000;border-radius:8px;overflow:hidden;position:relative;';
    const player = document.createElement('r-player');
    player.setAttribute('debug', 'true');
    container.appendChild(player);

    document.body.innerHTML = '';
    document.body.style.cssText = 'margin:0;padding:0;background:#000;';
    document.body.appendChild(container);
  });

  await page.waitForTimeout(800);

  // Try to screenshot just the control bar area if it exists in shadow DOM
  await argosScreenshot(page, 'player-control-bar', {
    element: page.locator('r-player'),
  });
});

test('player with live stream src (UI ready state)', async ({ page }) => {
  // Use the existing demo section with the HLS stream; only screenshot the container before playback
  const section = page.locator('#component-player');
  await expect(section).toBeVisible();
  // Don't wait for stream to load — just verify the initial UI chrome renders
  await page.waitForTimeout(1000);
  await argosScreenshot(page, 'player-demo-section', { element: section });
});
