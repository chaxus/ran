import { test, expect } from '@playwright/test';
import { demoSetup } from '../helpers';

test.beforeEach(async ({ page }) => {
  await demoSetup(page, 'r-player');
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
  await expect(container).toHaveScreenshot('player-no-src.png');
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
  await expect(page.locator('r-player')).toHaveScreenshot('player-control-bar.png');
});

test('player with live stream src mounts in the demo', async ({ page }) => {
  // Functional only — deliberately no screenshot. This section holds the demo's live HLS
  // stream, and a decoding <video> never yields two identical frames, so the old
  // `toHaveScreenshot` here could only ever fail with "Failed to take two consecutive stable
  // screenshots". The player's visual chrome is covered deterministically by the two tests
  // above, which mount a standalone player with no src.
  const section = page.locator('#component-player');
  await expect(section).toBeVisible();
  await expect(section.locator('r-player')).toHaveCount(1);
});
