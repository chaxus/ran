import { test, expect } from '@playwright/test';
import { isolatedSetup } from './helpers';
import { DEV_SERVER } from '../../build/config';

test('createElement + setAttribute(src) + appendChild loads exactly once (no orphaned dropdown)', async ({ page }) => {
  await isolatedSetup(page, DEV_SERVER, 'r-player');
  const loadCount = await page.evaluate(async () => {
    const container = document.createElement('div');
    container.style.cssText = 'width:800px;height:450px;background:#111;position:relative;';
    const player = document.createElement('r-player') as any;
    // Exactly the pattern that used to double-fire: set the attribute BEFORE connecting.
    player.setAttribute('src', 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8');
    player.setAttribute('debug', 'true');
    let count = 0;
    player.addEventListener('levelsready', () => {
      count += 1;
    });
    container.appendChild(player);
    document.body.innerHTML = '';
    document.body.style.cssText = 'margin:0;padding:24px;background:#222;';
    document.body.appendChild(container);
    return count; // synchronous count right after mount, before manifest resolves
  });
  console.log('sync levelsready count right after mount:', loadCount);

  await page.waitForFunction(() => {
    const el = document.querySelector('r-player') as any;
    const root = el?._shadowDom as ShadowRoot | undefined;
    return !!root?.querySelector('.ran-player-controller-bottom-right-clarity r-select');
  }, { timeout: 15000 });
  await page.waitForTimeout(1000);

  const dropdownCount = await page.evaluate(() => {
    const el = document.querySelector('r-player') as any;
    const root = el._shadowDom as ShadowRoot;
    return root.querySelectorAll('r-dropdown.video-clarity-dropdown').length;
  });
  console.log('final clarity dropdown count:', dropdownCount);
  expect(dropdownCount).toBe(1);

  // Confirm quality levels actually populated correctly (not silently broken).
  const levelCount = await page.evaluate(() => {
    const el = document.querySelector('r-player') as any;
    const root = el._shadowDom as ShadowRoot;
    const select = root.querySelector('.ran-player-controller-bottom-right-clarity r-select');
    return select?.querySelectorAll('r-option').length ?? 0;
  });
  console.log('option count:', levelCount);
  expect(levelCount).toBeGreaterThan(0);
});

test('changing src after the player is already connected still reloads', async ({ page }) => {
  await isolatedSetup(page, DEV_SERVER, 'r-player');
  await page.evaluate(() => {
    const container = document.createElement('div');
    container.style.cssText = 'width:800px;height:450px;background:#111;position:relative;';
    const player = document.createElement('r-player') as any;
    player.setAttribute('debug', 'true');
    container.appendChild(player); // connect FIRST, no src yet
    document.body.innerHTML = '';
    document.body.style.cssText = 'margin:0;padding:24px;background:#222;';
    document.body.appendChild(container);
  });
  await page.waitForTimeout(300);

  const hadVideoBefore = await page.evaluate(() => {
    const el = document.querySelector('r-player') as any;
    return !!el._video?.src || !!el._engine;
  });
  console.log('had engine/video before setting src:', hadVideoBefore);

  await page.evaluate(() => {
    const el = document.querySelector('r-player') as any;
    el.setAttribute('src', 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8');
  });

  await page.waitForFunction(() => {
    const el = document.querySelector('r-player') as any;
    const root = el?._shadowDom as ShadowRoot | undefined;
    return !!root?.querySelector('.ran-player-controller-bottom-right-clarity r-select');
  }, { timeout: 15000 });
  await page.waitForTimeout(1000);

  const dropdownCount = await page.evaluate(() => {
    const el = document.querySelector('r-player') as any;
    const root = el._shadowDom as ShadowRoot;
    return root.querySelectorAll('r-dropdown.video-clarity-dropdown').length;
  });
  console.log('dropdown count after post-connect src set:', dropdownCount);
  expect(dropdownCount).toBe(1);
});
