import { expect, test } from '@playwright/test';
import { demoSetup, isolatedSetup, mount } from './helpers';
import { DEV_SERVER } from '../../build/config';

test('demo screenshot fixtures exclude the live stream before components upgrade', async ({ page }) => {
  const external: string[] = [];
  page.on('request', (request) => {
    if (request.url().startsWith('http') && new URL(request.url()).origin !== new URL(DEV_SERVER).origin) {
      external.push(request.url());
    }
  });
  await demoSetup(page, 'r-player');
  await expect(page.locator('#component-player r-player')).not.toHaveAttribute('src', /.+/);
  const fits = await page.locator('#component-input').evaluate((card) => {
    const input = card.querySelector('r-input[status="error"]') as HTMLElement & { _shadowDom: ShadowRoot };
    const message = input._shadowDom.querySelector('.ran-input-message')!;
    return message.getBoundingClientRect().bottom <= card.getBoundingClientRect().bottom;
  });
  expect(fits).toBe(true);
  expect(external).toEqual([]);
});

test('isolated fixtures cannot inherit an external media error overlay', async ({ page }) => {
  const requests: string[] = [];
  page.on('request', (request) => {
    if (request.url().includes('test-streams.mux.dev')) requests.push(request.url());
  });
  await isolatedSetup(page, DEV_SERVER, 'r-button');
  await mount(page, '<r-button id="probe">Probe</r-button>');
  await page.locator('#probe').click();
  expect(requests).toEqual([]);
  await expect(page.locator('r-modal[heading="Playback failed"]')).toHaveCount(0);
});

test('frozen fixtures apply geometry, palette and layers without a transitional frame', async ({ page }) => {
  await isolatedSetup(page, DEV_SERVER, 'r-button');
  await mount(page, '<div id="probe" style="position:absolute;left:0;color:rgb(0,0,0);z-index:1">Probe</div>');
  const state = await page.locator('#probe').evaluate(async (node) => {
    const element = node as HTMLElement;
    // Establish the initial computed values before changing all three roles together.
    const before = getComputedStyle(element);
    const initial = [before.left, before.color, before.zIndex];
    element.style.left = '120px';
    element.style.color = 'rgb(255, 255, 255)';
    element.style.zIndex = '1400';
    const read = () => {
      const style = getComputedStyle(element);
      return [style.left, style.color, style.zIndex];
    };
    const immediate = read();
    await new Promise(requestAnimationFrame);
    return { initial, immediate, painted: read() };
  });
  expect(state.initial).toEqual(['0px', 'rgb(0, 0, 0)', '1']);
  expect(state.immediate).toEqual(['120px', 'rgb(255, 255, 255)', '1400']);
  expect(state.painted).toEqual(state.immediate);
});
