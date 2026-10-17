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
