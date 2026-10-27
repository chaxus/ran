import { test, expect } from '@playwright/test';
import { DEV_SERVER } from '../../build/config';
import { isolatedSetup, mount } from './helpers';

// Every component sets its own `display` on :host, which outranks the browser's own `[hidden]`
// rule; the shared rule ensureShadowRoot appends puts `hidden` back. The first five never had
// a copy of their own, and the rest lost theirs to the shared one.
const TAGS = ['r-input', 'r-popover', 'r-glass', 'r-link', 'r-icon', 'r-button', 'r-select', 'r-card', 'r-modal'];

test('the hidden attribute hides every component, and removing it shows them again', async ({ page }) => {
  await isolatedSetup(page, DEV_SERVER, 'r-button');
  await mount(page, TAGS.map((tag) => `<${tag} hidden></${tag}>`).join(''));
  await page.waitForFunction((tags) => tags.every((tag) => customElements.get(tag)), TAGS);
  const displays = () =>
    page.evaluate((tags) => tags.map((tag) => getComputedStyle(document.querySelector(tag)!).display), TAGS);
  expect(await displays()).toEqual(TAGS.map(() => 'none'));
  await page.evaluate((tags) => tags.forEach((tag) => document.querySelector(tag)!.removeAttribute('hidden')), TAGS);
  expect((await displays()).filter((display) => display === 'none')).toEqual([]);
});
