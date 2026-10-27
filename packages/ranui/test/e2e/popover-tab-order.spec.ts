import { expect, test, type Page } from '@playwright/test';
import { DEV_SERVER } from '../../build/config';
import { isolatedSetup, mount } from './helpers';

// Design guide, Focus: one tab stop per popover and per colorpicker, never the host and then its trigger.

/** Names each stop by the deepest focused element, walking into shadow roots. */
async function tabStops(page: Page, key: string, count: number): Promise<string[]> {
  const stops: string[] = [];
  for (let i = 0; i < count; i += 1) {
    await page.keyboard.press(key);
    stops.push(
      await page.evaluate(() => {
        let active: Element | null = document.activeElement;
        let host = '';
        // ranui roots are closed; components expose theirs as `_shadowDom`.
        const rootOf = (el: Element | null) => (el as { _shadowDom?: ShadowRoot } | null)?._shadowDom;
        while (rootOf(active)?.activeElement) {
          host = active!.id || host;
          active = rootOf(active)!.activeElement;
        }
        const element = active as HTMLElement | null;
        return `${element?.id || host}:${element?.localName}${element?.className ? `.${element.className}` : ''}`;
      }),
    );
  }
  return stops;
}

test.beforeEach(async ({ page }) => {
  await isolatedSetup(page, DEV_SERVER, 'r-colorpicker');
  await page.waitForFunction(() => !!customElements.get('r-popover') && !!customElements.get('r-button'));
});

test('a popover with a focusable trigger and a colorpicker are one tab stop each', async ({ page, browserName }) => {
  const tab = browserName === 'webkit' ? 'Alt+Tab' : 'Tab';
  await mount(
    page,
    '<input id="before" aria-label="Before">' +
      '<r-popover id="native" trigger="click"><button id="native-trigger">Native</button><r-content><button>Action</button></r-content></r-popover>' +
      '<r-popover id="ranui" trigger="click"><r-button id="ranui-trigger">Ranui</r-button><r-content><button>Action</button></r-content></r-popover>' +
      '<r-colorpicker id="picker" value="#ff0000"></r-colorpicker>' +
      '<input id="after" aria-label="After">',
  );
  await page.locator('#before').focus();
  const stops = await tabStops(page, tab, 4);
  expect(stops[0]).toBe('native-trigger:button');
  expect(stops[1]).toMatch(/^ranui-trigger:div\.ran-btn/);
  expect(stops[2]).toBe('picker:div.ran-colorpicker-block');
  expect(stops[3]).toBe('after:input');

  // Keyboard opening still works from the trigger and the swatch.
  await page.locator('#native-trigger').focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('#native')).toHaveAttribute('open');
  await page.keyboard.press('Escape');
  await expect(page.locator('#native')).not.toHaveAttribute('open');
  await expect(page.locator('#native-trigger')).toBeFocused();
});

test('a disabled colorpicker leaves the tab order entirely', async ({ page, browserName }) => {
  const tab = browserName === 'webkit' ? 'Alt+Tab' : 'Tab';
  await mount(
    page,
    '<input id="before" aria-label="Before"><r-colorpicker id="picker" disabled></r-colorpicker><input id="after" aria-label="After">',
  );
  await page.locator('#before').focus();
  expect(await tabStops(page, tab, 1)).toEqual(['after:input']);
});

test('a popover whose trigger is plain text keeps the host as its one stop, with the shared ring', async ({
  page,
  browserName,
}) => {
  const tab = browserName === 'webkit' ? 'Alt+Tab' : 'Tab';
  await mount(
    page,
    '<input id="before" aria-label="Before"><r-popover id="text" trigger="click" style="display:inline-block"><span>Text</span><r-content><button>Action</button></r-content></r-popover><input id="after" aria-label="After">',
  );
  await page.locator('#before').focus();
  expect(await tabStops(page, tab, 2)).toEqual(['text:r-popover', 'after:input']);
  await page.locator('#before').focus();
  await page.keyboard.press(tab);
  const ring = await page.locator('#text').evaluate((el) => getComputedStyle(el).boxShadow);
  expect(ring).not.toBe('none');
  await page.keyboard.press('Enter');
  await expect(page.locator('#text')).toHaveAttribute('open');
});
