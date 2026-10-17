import { expect, test } from '@playwright/test';
import { DEV_SERVER } from '../../build/config';
import { insideShadow, isolatedSetup, mount } from './helpers';

function luminance(color: string): number {
  const channels = color
    .match(/[\d.]+/g)!
    .slice(0, 3)
    .map(Number)
    .map((value) => {
      const channel = value / 255;
      return channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
    });
  return channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722;
}

function contrast(foreground: string, background: string): number {
  const values = [luminance(foreground), luminance(background)].sort((a, b) => b - a);
  return (values[0] + 0.05) / (values[1] + 0.05);
}

for (const theme of ['light', 'dark']) {
  for (const width of [375, 1280]) {
    test(`status label and helper meet AA on semantic surfaces — ${theme}, ${width}px`, async ({ page, baseURL }) => {
      await page.setViewportSize({ width, height: 800 });
      await isolatedSetup(page, baseURL ?? DEV_SERVER, 'r-input');
      await page.evaluate((value) => document.documentElement.setAttribute('data-ran-theme', value), theme);
      for (const surface of ['bg', 'bg-subtle', 'bg-elevated', 'bg-muted']) {
        await mount(
          page,
          `<section style="background:var(--ran-color-${surface});padding:16px">
          <r-input id="warning" status="warning" label="Check the value" message="Review before continuing"></r-input>
          <r-input id="error" status="error" label="Invalid value" message="Correct this value"></r-input>
        </section>`,
        );
        const background = await page.locator('section').evaluate((el) => getComputedStyle(el).backgroundColor);
        for (const status of ['warning', 'error']) {
          const colors = await insideShadow(page, `#${status}`, (root) => ({
            label: getComputedStyle(root.querySelector('[part="label"]')!).color,
            message: getComputedStyle(root.querySelector('[part="message"]')!).color,
            field: getComputedStyle(root.querySelector('[part="input"]')!).backgroundColor,
          }));
          for (const part of ['label', 'message'] as const) {
            expect(contrast(colors[part], background), `${status} ${part} on ${surface}`).toBeGreaterThanOrEqual(4.5);
            expect(contrast(colors[part], colors.field), `${status} ${part} against field`).toBeGreaterThanOrEqual(4.5);
          }
        }
      }
    });
  }
}

test('status text keeps per-component color overrides', async ({ page, baseURL }) => {
  await isolatedSetup(page, baseURL ?? DEV_SERVER, 'r-input');
  await mount(
    page,
    `<r-input id="custom" status="warning" label="Custom" message="Custom helper"
    style="--ran-input-label-warning-color:rgb(20, 40, 60);--ran-input-message-warning-color:rgb(60, 40, 20)"></r-input>`,
  );
  expect(
    await insideShadow(page, '#custom', (root) => ({
      label: getComputedStyle(root.querySelector('[part="label"]')!).color,
      message: getComputedStyle(root.querySelector('[part="message"]')!).color,
    })),
  ).toEqual({ label: 'rgb(20, 40, 60)', message: 'rgb(60, 40, 20)' });
});
