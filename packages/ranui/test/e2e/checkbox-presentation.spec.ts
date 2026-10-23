import { expect, test } from '@playwright/test';
import { DEV_SERVER } from '../../build/config';
import { insideShadow, isolatedSetup, mount } from './helpers';

test.beforeEach(async ({ page }) => isolatedSetup(page, DEV_SERVER, 'r-checkbox'));

test('a long wrapped checkbox label preserves its square and stays inside a narrow section', async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 800 });
  await mount(
    page,
    '<r-section heading="Workspace access"><r-checkbox style="width:216px">Allow collaborators to review this extraordinarily detailed workspace update</r-checkbox></r-section>',
  );
  const geometry = await insideShadow(page, 'r-checkbox', (root) => {
    const square = root.querySelector('.ran-checkbox')!.getBoundingClientRect();
    const label = root.querySelector('.ran-checkbox-label')!.getBoundingClientRect();
    return { width: square.width, height: square.height, labelHeight: label.height, labelRight: label.right };
  });
  expect(geometry.width).toBe(16);
  expect(geometry.height).toBe(16);
  expect(geometry.labelHeight).toBeGreaterThan(21);
  const host = (await page.locator('r-checkbox').boundingBox())!;
  expect(geometry.labelRight).toBeLessThanOrEqual(host.x + host.width + 0.5);
});

test('disabled=false looks and behaves enabled while actual disabled stays quiet', async ({ page }) => {
  await mount(
    page,
    '<r-checkbox id="normal">Normal</r-checkbox><r-checkbox id="enabled" disabled="false">Enabled</r-checkbox><r-checkbox id="disabled" disabled>Disabled</r-checkbox>',
  );
  const opacity = (selector: string) => page.locator(selector).evaluate((el) => getComputedStyle(el).opacity);
  expect(await opacity('#enabled')).toBe(await opacity('#normal'));
  expect(Number(await opacity('#disabled'))).toBeLessThan(1);
  await page.locator('#enabled').click();
  await expect(page.locator('#enabled')).toHaveAttribute('aria-checked', 'true');
  // Actionability correctly rejects a disabled control; send an actual pointer
  // click at its box to verify that receiving pointer input cannot toggle it.
  const box = (await page.locator('#disabled').boundingBox())!;
  await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);
  await expect(page.locator('#disabled')).toHaveAttribute('aria-checked', 'false');
});

for (const label of ['Review update', 'Allow collaborators to review this extraordinarily detailed workspace update']) {
  test(`checkbox square aligns with first text line: ${label}`, async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 800 });
    await mount(page, `<r-checkbox style="width:216px">${label}</r-checkbox>`);
    const geometry = await insideShadow(page, 'r-checkbox', (root) => {
      const square = root.querySelector('.ran-checkbox')!.getBoundingClientRect();
      const label = root.querySelector('.ran-checkbox-label')!;
      const text = root.host.firstChild!;
      const range = document.createRange();
      range.setStart(text, 0);
      range.setEnd(text, text.textContent!.indexOf(' '));
      const firstWord = range.getBoundingClientRect();
      const lineHeight = Number.parseFloat(getComputedStyle(label).lineHeight);
      const firstLineTop = label.getBoundingClientRect().top;
      return {
        squareCenter: square.top + square.height / 2,
        firstLineCenter: firstLineTop + lineHeight / 2,
        firstWordCenter: firstWord.top + firstWord.height / 2,
        firstLineTop,
        lineHeight,
      };
    });
    // The native text Range proves we measured the first rendered line, rather
    // than vertically centering against the entire multi-line label box.
    expect(geometry.firstWordCenter).toBeGreaterThan(geometry.firstLineTop);
    expect(geometry.firstWordCenter).toBeLessThan(geometry.firstLineTop + geometry.lineHeight);
    expect(Math.abs(geometry.squareCenter - geometry.firstLineCenter)).toBeLessThan(0.5);
  });
}

for (const theme of ['light', 'dark']) {
  test(`checked mark remains distinct from its surface in ${theme}`, async ({ page }) => {
    await page.evaluate((value) => {
      document.documentElement.setAttribute('data-ran-theme', value);
      document.body.style.background = 'var(--ran-color-bg)';
    }, theme);
    await mount(page, '<r-checkbox id="check" checked="true">Save preferences</r-checkbox>');
    const colors = () =>
      insideShadow(page, '#check', (root) => {
        const inner = root.querySelector('.ran-checkbox-inner')!;
        const mark = getComputedStyle(inner, '::after');
        return {
          surface: getComputedStyle(inner).backgroundColor,
          mark: mark.borderBottomColor,
          opacity: mark.opacity,
        };
      });
    const luminance = (rgb: string) => {
      const channels = rgb
        .match(/[\d.]+/g)!
        .slice(0, 3)
        .map(Number)
        .map((value) => {
          const srgb = value / 255;
          return srgb <= 0.04045 ? srgb / 12.92 : ((srgb + 0.055) / 1.055) ** 2.4;
        });
      return channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722;
    };
    const enabled = await colors();
    const a = luminance(enabled.surface),
      b = luminance(enabled.mark);
    expect((Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05)).toBeGreaterThanOrEqual(3);
    expect(enabled.opacity).toBe('1');
    await page.locator('#check').evaluate((node) => node.setAttribute('disabled', ''));
    const disabled = await colors();
    expect(disabled.mark).not.toBe(disabled.surface);
    expect(disabled.opacity).toBe('1');
  });
}
