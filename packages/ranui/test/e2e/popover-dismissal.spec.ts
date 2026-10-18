import { expect, test } from '@playwright/test';
import { DEV_SERVER } from '../../build/config';
import { isolatedSetup, mount } from './helpers';

test.beforeEach(async ({ page }) => {
  await isolatedSetup(page, DEV_SERVER, 'r-popover');
});

test('outside Select and propagation-stopping controls dismiss the popover', async ({ page }) => {
  await mount(
    page,
    `
    <div style="display:flex;gap:16px;padding:60px">
      <r-popover trigger="click"><button id="info">Details</button><r-content>Information</r-content></r-popover>
      <r-select style="width:120px"><r-option value="one">One</r-option><r-option value="two">Two</r-option></r-select>
      <button id="outside">Other action</button>
    </div>
  `,
  );
  await page.locator('#info').click();
  await expect(page.locator('r-popover')).toHaveAttribute('open', '');
  await page.locator('r-select').click();
  await expect(page.locator('r-popover')).not.toHaveAttribute('open', '');
  await expect(page.locator('r-select')).toHaveAttribute('open', '');
  await page.locator('#info').click();
  await expect(page.locator('r-select')).not.toHaveAttribute('open', '');
  await page.locator('#outside').evaluate((el) => el.addEventListener('click', (event) => event.stopPropagation()));
  await page.locator('#outside').click();
  await expect(page.locator('r-popover')).not.toHaveAttribute('open', '');
});

test('selecting in a nested portal keeps the parent disclosure open', async ({ page }) => {
  await mount(
    page,
    `
    <r-popover trigger="click" placement="bottom"><button id="info">Details</button><r-content>
      <r-select style="width:120px"><r-option value="one">One</r-option><r-option value="two">Two</r-option></r-select>
    </r-content></r-popover>
  `,
  );
  await page.locator('#info').click();
  await page.locator('r-select').click();
  await expect(page.locator('r-popover')).toHaveAttribute('open', '');
  await page.locator('r-dropdown-item').filter({ hasText: 'Two' }).click();
  await expect(page.locator('r-select')).toHaveAttribute('value', 'two');
  await expect(page.locator('r-popover')).toHaveAttribute('open', '');
  await page.locator('#info').click();
  await expect(page.locator('r-popover')).not.toHaveAttribute('open', '');
});

test('closed shadow popup containers classify local and external clicks', async ({ page }) => {
  await page.evaluate(() => {
    const shell = document.createElement('div');
    const root = shell.attachShadow({ mode: 'closed' });
    const fixture = document.createElement('div');
    fixture.style.padding = '60px';
    fixture.innerHTML =
      '<div id="local-popup" style="position:relative"></div><r-popover trigger="click" placement="bottom" getPopupContainerId="local-popup"><button>Details</button><r-content><button>Panel action</button></r-content></r-popover><button id="outside" style="display:block;margin-top:160px">Outside</button>';
    root.append(fixture);
    document.body.append(shell);
    const popover = fixture.querySelector('r-popover')! as HTMLElement & { show(): void };
    popover.show();
    fixture.querySelector('#outside')!.addEventListener('click', (event) => event.stopPropagation());
    // Keep the fixture reference only in the test: the closed root is not queryable from document.
    (window as unknown as { popupFixture: HTMLElement }).popupFixture = fixture;
  });
  const localPoint = async (selector: string) =>
    page.evaluate((selector) => {
      const fixture = (window as unknown as { popupFixture: HTMLElement }).popupFixture;
      const rect = fixture.querySelector(selector)!.getBoundingClientRect();
      return { x: rect.x + rect.width / 2, y: rect.y + rect.height / 2 };
    }, selector);
  // Allow the opening position to settle before clicking actual pixels.
  await page.evaluate(() => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve))));
  const action = await localPoint('r-dropdown button');
  expect(action.x).toBeGreaterThan(0);
  expect(action.y).toBeGreaterThan(0);
  expect(action.y).toBeLessThan(page.viewportSize()!.height);
  await page.mouse.click(action.x, action.y);
  await page.evaluate(() => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve))));
  const isOpen = () =>
    page.evaluate(() =>
      (window as unknown as { popupFixture: HTMLElement }).popupFixture
        .querySelector('r-popover')!
        .hasAttribute('open'),
    );
  expect(await isOpen()).toBe(true);
  const outside = await localPoint('#outside');
  await page.mouse.click(outside.x, outside.y);
  await expect.poll(isOpen).toBe(false);
  await page.evaluate(() => {
    const fixture = (window as unknown as { popupFixture: HTMLElement }).popupFixture;
    (fixture.querySelector('r-popover')! as HTMLElement & { show(): void }).show();
    const outside = document.createElement('button');
    outside.id = 'document-outside';
    outside.textContent = 'Document action';
    outside.addEventListener('click', (event) => event.stopPropagation());
    document.body.append(outside);
  });
  await page.locator('#document-outside').click();
  await expect.poll(isOpen).toBe(false);
});
