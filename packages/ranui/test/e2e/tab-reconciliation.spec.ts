import { test, expect } from '@playwright/test';
import { DEV_SERVER } from '../../build/config';
import { isolatedSetup, insideShadow, mount } from './helpers';

test('tabs preserve active key and real keyboard focus through keyed slot changes', async ({ page, baseURL }) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await isolatedSetup(page, baseURL ?? DEV_SERVER, 'r-tabs');
  await mount(
    page,
    `<r-tabs id="tabs"><r-tab r-key="a" label="A">A</r-tab>
    <r-tab r-key="b" label="B">B</r-tab><r-tab r-key="c" label="C">C</r-tab></r-tabs><button id="outside">Outside</button>`,
  );
  await page.keyboard.press('Tab');
  await page.keyboard.press('ArrowRight');
  await expect(page.locator('#tabs')).toHaveAttribute('active', 'b');
  const state = async () =>
    insideShadow(page, '#tabs', (root) => ({
      keys: [...root.querySelectorAll('.tab-header-nav-item')].map((header) => header.getAttribute('r-key')),
      focused: root.activeElement?.getAttribute('r-key'),
    }));
  await page.locator('#tabs').evaluate((tabs) => {
    const pane = document.createElement('r-tab');
    pane.setAttribute('r-key', 'd');
    pane.setAttribute('label', 'D');
    tabs.append(pane);
  });
  await expect.poll(state).toEqual({ keys: ['a', 'b', 'c', 'd'], focused: 'b' });
  await page.locator('#tabs').evaluate((tabs) => tabs.prepend(tabs.children[1]));
  await expect.poll(state).toEqual({ keys: ['b', 'a', 'c', 'd'], focused: 'b' });
  await expect(page.locator('#tabs')).toHaveAttribute('active', 'b');
  await page.locator('#tabs').evaluate((tabs) => tabs.children[0].remove());
  await expect.poll(state).toEqual({ keys: ['a', 'c', 'd'], focused: 'a' });
  await expect(page.locator('#tabs')).toHaveAttribute('active', 'a');
  await page.locator('#tabs').evaluate((tabs) => tabs.children[0].setAttribute('disabled', ''));
  await expect.poll(state).toEqual({ keys: ['a', 'c', 'd'], focused: 'c' });
  await expect(page.locator('#tabs')).toHaveAttribute('active', 'c');
  await page.keyboard.press('ArrowRight');
  await expect(page.locator('#tabs')).toHaveAttribute('active', 'd');
  await page.locator('#outside').focus();
  await page.locator('#tabs').evaluate((tabs) => tabs.append(tabs.children[1]));
  await expect(page.locator('#outside')).toBeFocused();
  expect(errors).toEqual([]);
});
