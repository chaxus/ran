import { test, expect } from '@playwright/test';
import { DEV_SERVER } from '../../build/config';
import { isolatedSetup, insideShadow, mount } from './helpers';
import type { Attachments } from '../../components/attachments';

test.beforeEach(async ({ page, baseURL }) => {
  await isolatedSetup(page, baseURL ?? DEV_SERVER, 'r-attachments');
  await mount(page, `<r-attachments id="strip"></r-attachments><input id="after" aria-label="Continue" />`);
  await page.locator('#strip').evaluate((strip: Attachments) => {
    strip.add(['a.pdf', 'b.pdf', 'c.pdf'].map((name) => new File(['contents'], name, { type: 'application/pdf' })));
  });
});

test('keyboard removal keeps next then previous focus and the last item hands off through the host', async ({
  page,
}) => {
  const focused = async () =>
    insideShadow(page, '#strip', (root) => root.activeElement?.getAttribute('aria-label') ?? null);
  // The testing seam sets initial focus; removal and continuation use real keys.
  await insideShadow(page, '#strip', (root) => root.querySelectorAll<HTMLButtonElement>('button')[1].focus());
  expect(await focused()).toBe('Remove b.pdf');
  await page.keyboard.press('Enter');
  expect(await focused()).toBe('Remove c.pdf');
  await page.keyboard.press('Space');
  expect(await focused()).toBe('Remove a.pdf');
  await page.keyboard.press('Enter');
  await expect(page.locator('#strip')).toBeFocused();
  await expect(page.locator('#strip')).toHaveAttribute('tabindex', '-1');
  await expect(page.locator('#strip')).not.toHaveAttribute('count');
  await page.keyboard.press('Tab');
  await expect(page.locator('#after')).toBeFocused();
});

test('background list mutations preserve existing row focus and never steal external focus', async ({ page }) => {
  // The testing seam sets initial focus; removal and continuation use real keys.
  await insideShadow(page, '#strip', (root) => root.querySelectorAll<HTMLButtonElement>('button')[1].focus());
  await page.locator('#strip').evaluate((strip: Attachments) => {
    strip.add([new File(['d'], 'd.pdf', { type: 'application/pdf' })]);
    strip.detach(strip.attachments[0].id);
  });
  expect(await insideShadow(page, '#strip', (root) => root.activeElement?.getAttribute('aria-label'))).toBe(
    'Remove b.pdf',
  );
  await page.keyboard.press('Enter');
  expect(await insideShadow(page, '#strip', (root) => root.activeElement?.getAttribute('aria-label'))).toBe(
    'Remove c.pdf',
  );
  await page.locator('#after').focus();
  await page.locator('#strip').evaluate((strip: Attachments) => {
    strip.add([new File(['e'], 'e.pdf', { type: 'application/pdf' })]);
    strip.detach(strip.attachments[0].id);
    strip.clear();
  });
  await expect(page.locator('#after')).toBeFocused();
});
