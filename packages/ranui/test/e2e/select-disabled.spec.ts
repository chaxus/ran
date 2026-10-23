import { expect, test } from '@playwright/test';
import { DEV_SERVER } from '../../build/config';
import { insideShadow, isolatedSetup, mount } from './helpers';

test.beforeEach(async ({ page }) => {
  await isolatedSetup(page, DEV_SERVER, 'r-select');
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await mount(
    page,
    '<r-select id="select" value="a" style="width:240px"><r-option value="a">Alpha</r-option><r-option value="b">Beta</r-option></r-select><button id="after">Continue</button>',
  );
});

test('disabling during a real option press cancels selection and closes the portal', async ({ page }) => {
  await page.locator('#select').click();
  await expect(page.locator('#select')).toHaveAttribute('open');
  const option = page.locator('r-dropdown-item[value="b"]');
  await option.evaluate((node) => {
    const host = document.querySelector('#select')!;
    host.setAttribute('data-changes', '0');
    host.addEventListener('change', () =>
      host.setAttribute('data-changes', String(Number(host.getAttribute('data-changes')) + 1)),
    );
    node.addEventListener('pointerdown', () => host.setAttribute('disabled', ''), { once: true });
  });
  await option.click();
  await expect(page.locator('#select')).toHaveAttribute('disabled', '');
  await expect(page.locator('#select')).toHaveAttribute('value', 'a');
  await expect(page.locator('#select')).toHaveAttribute('data-changes', '0');
  await expect(page.locator('#select')).not.toHaveAttribute('open');
  await expect(page.locator('#select')).not.toBeFocused();
  await expect(page.locator('r-dropdown')).toBeHidden();
  await page.locator('#select').evaluate((host) => host.removeAttribute('disabled'));
  await page.locator('#select').click();
  await page.locator('r-dropdown-item[value="b"]').click();
  await expect(page.locator('#select')).toHaveAttribute('value', 'b');
  await expect(page.locator('#select')).toHaveAttribute('data-changes', '1');
});

test('disabled search preserves its draft without accepting queued input or reopening', async ({ page }) => {
  await page.locator('#select').evaluate((host) => host.setAttribute('showsearch', ''));
  await page.locator('#select').click();
  await page.keyboard.type('Al');
  await page.locator('#select').evaluate((host) => {
    host.setAttribute('data-searches', '0');
    host.addEventListener('search', () =>
      host.setAttribute('data-searches', String(Number(host.getAttribute('data-searches')) + 1)),
    );
    host.setAttribute('disabled', '');
    const input = (host as HTMLElement & { _shadowDom: ShadowRoot })._shadowDom.querySelector('input')!;
    input.dispatchEvent(new InputEvent('input', { bubbles: true, data: 'late' }));
  });
  expect(
    await insideShadow(page, '#select', (root) => {
      const input = root.querySelector('input')!;
      return { value: input.value, disabled: input.disabled };
    }),
  ).toEqual({ value: 'Al', disabled: true });
  await expect(page.locator('#select')).toHaveAttribute('data-searches', '0');
  await expect(page.locator('#select')).not.toHaveAttribute('open');
  await page.locator('#select').evaluate((host) => host.setAttribute('open', ''));
  await expect(page.locator('#select')).not.toHaveAttribute('open');
  await page.locator('#select').evaluate((host) => host.setAttribute('value', 'b'));
  await expect(page.locator('#select')).toHaveAttribute('value', 'b');
});
