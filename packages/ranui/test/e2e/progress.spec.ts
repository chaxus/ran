import { test, expect } from '@playwright/test';
import { DEV_SERVER } from '../../build/config';
import { isolatedSetup, mount } from './helpers';

test.use({ viewport: { width: 600, height: 200 } });

test.beforeEach(async ({ page }) => {
  await isolatedSetup(page, DEV_SERVER, 'r-progress');
});

test('progress — 0%', { tag: '@visual' }, async ({ page }) => {
  await mount(page, `<r-progress style="width: 400px" percent="0"></r-progress>`);
  const el = page.locator('r-progress');
  await expect(el).toBeVisible();
  await expect(el).toHaveScreenshot('progress-0.png');
});

test('progress — 50%', { tag: '@visual' }, async ({ page }) => {
  await mount(page, `<r-progress style="width: 400px" percent="50"></r-progress>`);
  const el = page.locator('r-progress');
  await expect(el).toBeVisible();
  await expect(el).toHaveScreenshot('progress-50.png');
});

test('progress — 100%', { tag: '@visual' }, async ({ page }) => {
  await mount(page, `<r-progress style="width: 400px" percent="100"></r-progress>`);
  const el = page.locator('r-progress');
  await expect(el).toBeVisible();
  await expect(el).toHaveScreenshot('progress-100.png');
});

test('progress — drag type', { tag: '@visual' }, async ({ page }) => {
  await mount(page, `<r-progress style="width: 400px" type="drag" percent="40"></r-progress>`);
  const el = page.locator('r-progress');
  await expect(el).toBeVisible();
  await expect(el).toHaveScreenshot('progress-drag.png');
});

test('progress presents finite normalized values while preserving supplied attributes', async ({ page }) => {
  await mount(page, '<r-progress type="drag" style="width:100%" percent="32" aria-label="Volume"></r-progress>');
  const slider = page.locator('r-progress');
  for (const [percent, total, value, maximum, fraction] of [
    ['-20', '100', '0', '100', '0'],
    ['150', '100', '100', '100', '1'],
    ['invalid', '100', '0', '100', '0'],
    ['Infinity', '100', '0', '100', '0'],
    ['50', '0', '0', '0', '0'],
    ['50', '-2', '50', '100', '0.5'],
    ['50', 'invalid', '50', '100', '0.5'],
  ]) {
    const state = await slider.evaluate(
      (node, { percent, total }) => {
        node.setAttribute('total', total);
        node.setAttribute('percent', percent);
        return { raw: node.getAttribute('percent'), fraction: node.style.getPropertyValue('--progress-percent') };
      },
      { percent, total },
    );
    expect(state).toEqual({ raw: percent, fraction });
    await expect(slider).toHaveAttribute('aria-valuenow', value);
    await expect(slider).toHaveAttribute('aria-valuemax', maximum);
  }
  await slider.evaluate((node) => {
    node.setAttribute('total', '0');
  });
  await slider.focus();
  await page.keyboard.press('ArrowRight');
  await expect(slider).toHaveAttribute('aria-valuenow', '0');
  expect(await slider.evaluate((node) => node.style.getPropertyValue('--progress-percent'))).toBe('0');
});
