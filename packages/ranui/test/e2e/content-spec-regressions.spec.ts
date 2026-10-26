import { expect, test } from '@playwright/test';
import { DEV_SERVER } from '../../build/config';
import { isolatedSetup, mount } from './helpers';

test('a meaningful image that fails to load keeps its accessible name', async ({ page }) => {
  await isolatedSetup(page, DEV_SERVER, 'r-img');
  await mount(page, '<r-img id="img" src="data:image/png;base64,AAAA" alt="Product photo"></r-img>');
  const named = () =>
    page.locator('#img').evaluate((host) => {
      const box = (host as HTMLElement & { _shadowDom: ShadowRoot })._shadowDom.querySelector('[data-state]')!;
      return {
        state: box.getAttribute('data-state'),
        role: box.getAttribute('role'),
        name: box.getAttribute('aria-label'),
      };
    });
  await expect.poll(async () => (await named()).state).toBe('error');
  expect(await named()).toEqual({ state: 'error', role: 'img', name: 'Product photo' });
});

test('a card whose body is a forwarded empty slot hides the body', async ({ page }) => {
  await isolatedSetup(page, DEV_SERVER, 'r-card');
  await page.evaluate(() => {
    customElements.define(
      'x-card-wrapper',
      class extends HTMLElement {
        constructor() {
          super();
          this.attachShadow({ mode: 'open' }).innerHTML =
            '<r-card id="inner" heading="Heading only"><slot></slot></r-card>';
        }
      },
    );
  });
  await mount(page, '<x-card-wrapper id="wrap"></x-card-wrapper>');
  const bodyShown = await page.locator('#wrap').evaluate((wrap) => {
    const card = wrap.shadowRoot!.querySelector('#inner') as HTMLElement & { _shadowDom: ShadowRoot };
    return getComputedStyle(card._shadowDom.querySelector('[part="body"]')!).display !== 'none';
  });
  expect(bodyShown).toBe(false);
});

test("removing label restores the author's own aria-label on r-loading", async ({ page }) => {
  await isolatedSetup(page, DEV_SERVER, 'r-loading');
  await mount(page, '<r-loading id="l" aria-label="Fetching invoices"></r-loading>');
  const loading = page.locator('#l');
  await expect(loading).toHaveAttribute('aria-label', 'Fetching invoices');
  await loading.evaluate((host) => host.setAttribute('label', 'Saving'));
  await expect(loading).toHaveAttribute('aria-label', 'Saving');
  await loading.evaluate((host) => host.removeAttribute('label'));
  await expect(loading).toHaveAttribute('aria-label', 'Fetching invoices');
});
