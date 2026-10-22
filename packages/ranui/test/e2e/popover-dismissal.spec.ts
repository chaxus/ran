import { expect, test } from '@playwright/test';
import { DEV_SERVER } from '../../build/config';
import { insideShadow, isolatedSetup, mount } from './helpers';

test.beforeEach(async ({ page }) => {
  await isolatedSetup(page, DEV_SERVER, 'r-popover');
});

for (const reducedMotion of ['no-preference', 'reduce'] as const) {
  for (const initialFocus of ['none', 'elsewhere'] as const) {
    test(`pointer opening returns to the actual trigger from ${initialFocus} focus (${reducedMotion})`, async ({
      page,
    }) => {
      await page.emulateMedia({ reducedMotion });
      await mount(
        page,
        '<input id="previous" aria-label="Previous field"><r-popover id="parent" trigger="click"><button id="trigger"><span id="label">Options</span></button><r-content><button id="action">Action</button></r-content></r-popover>',
      );
      if (initialFocus === 'elsewhere') await page.locator('#previous').focus();
      await page.locator('#label').click();
      await expect(page.locator('#parent')).toHaveAttribute('open');
      await page.locator('#action').focus();
      await page.keyboard.press('Escape');
      await expect(page.locator('#parent')).not.toHaveAttribute('open');
      await expect(page.locator('#trigger')).toBeFocused();
    });
  }

  test(`keyboard and controlled opening retain their own return targets (${reducedMotion})`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion });
    await mount(
      page,
      '<input id="previous" aria-label="Previous field"><r-popover id="parent" trigger="click"><button id="trigger">Options</button><r-content><button id="action">Action</button></r-content></r-popover>',
    );
    const parent = page.locator('#parent');
    for (const target of [parent, page.locator('#trigger')]) {
      await target.focus();
      await page.keyboard.press('Enter');
      await expect(parent).toHaveAttribute('open');
      await page.locator('#action').focus();
      await page.keyboard.press('Escape');
      await expect(parent).not.toHaveAttribute('open');
      await expect(target).toBeFocused();
    }
    await page.locator('#previous').focus();
    await parent.evaluate((host: HTMLElement & { show(): void }) => host.show());
    await page.locator('#action').focus();
    await page.keyboard.press('Escape');
    await expect(page.locator('#trigger')).toBeFocused();
  });

  test(`the documented r-button opener receives native focus after Escape (${reducedMotion})`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion });
    await mount(
      page,
      '<input id="previous" aria-label="Previous field"><r-popover id="parent" trigger="click"><r-button id="trigger">Options</r-button><r-content><button id="action">Action</button></r-content></r-popover>',
    );
    await page.locator('#previous').focus();
    await page.locator('#trigger').click();
    await page.locator('#action').focus();
    await page.keyboard.press('Escape');
    await expect(page.locator('#parent')).not.toHaveAttribute('open');
    expect(
      await insideShadow(page, '#trigger', (root) => root.activeElement === root.querySelector('[part="button"]')),
    ).toBe(true);
  });

  test(`Escape dismisses one portal layer and restores its trigger (${reducedMotion})`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion });
    await mount(
      page,
      '<r-popover id="parent" trigger="click"><button id="trigger">Options</button><r-content><button id="action">Action</button><r-select id="language" style="width:140px"><r-option value="en">English</r-option><r-option value="pt">Portuguese</r-option></r-select></r-content></r-popover>',
    );
    const parent = page.locator('#parent');
    const trigger = page.locator('#trigger');
    await trigger.click();
    await page.locator('#action').focus();
    await page.keyboard.press('Escape');
    await expect(parent).not.toHaveAttribute('open');
    await expect(trigger).toBeFocused();
    await trigger.click();
    const language = page.locator('#language');
    await language.click();
    await page.keyboard.press('Escape');
    await expect(language).not.toHaveAttribute('open');
    await expect(parent).toHaveAttribute('open');
    await page.keyboard.press('Escape');
    await expect(parent).not.toHaveAttribute('open');
    await expect(trigger).toBeFocused();
    await trigger.click();
    await parent.evaluate((host: HTMLElement & { popoverContent: HTMLElement }) => {
      const child = document.createElement('r-popover');
      child.id = 'child';
      child.setAttribute('trigger', 'click');
      child.innerHTML =
        '<button id="child-trigger">More</button><r-content><button id="child-action">Nested action</button></r-content>';
      host.popoverContent.append(child);
    });
    await page.locator('#child-trigger').click();
    await page.locator('#child-action').focus();
    await page.keyboard.press('Escape');
    await expect(page.locator('#child')).not.toHaveAttribute('open');
    await expect(parent).toHaveAttribute('open');
    await expect(page.locator('#child-trigger')).toBeFocused();
  });

  test(`immediate close never paints a queued entrance (${reducedMotion})`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion });
    await mount(
      page,
      '<r-popover trigger="click"><button>Options</button><r-content><button>Action</button></r-content></r-popover>',
    );
    const state = await page
      .locator('r-popover')
      .evaluate(async (host: HTMLElement & { open: boolean; popoverContent: HTMLElement }) => {
        host.open = true;
        host.open = false;
        await new Promise((resolve) => requestAnimationFrame(resolve));
        return {
          open: host.open,
          aria: host.getAttribute('aria-expanded'),
          transit: host.popoverContent.getAttribute('transit'),
        };
      });
    expect(state.open).toBe(false);
    expect(state.aria).toBe('false');
    expect(state.transit ?? '').not.toMatch(/-in$/);
    await expect(page.locator('r-dropdown')).toBeHidden();
  });
}

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

test('reconnect retains the authored portal controls and draft without rebuilding them', async ({ page }) => {
  await mount(
    page,
    '<r-popover id="parent" trigger="click"><button id="trigger">Options</button><r-content><button id="first">First action</button><input id="draft" value="Draft"><button id="last">Last action</button></r-content></r-popover>',
  );
  await page.locator('#trigger').click();
  await page.locator('#draft').fill('Edited draft');
  await page.locator('#parent').evaluate((host: HTMLElement & { popoverContent: HTMLElement }) => {
    (window as unknown as { originalControls: Element[] }).originalControls = Array.from(host.popoverContent.children);
  });
  for (let i = 0; i < 2; i++) {
    await page.locator('#parent').evaluate((host: HTMLElement & { hide(): void; show(): void }) => {
      host.remove();
      document.body.append(host);
      host.hide();
      host.show();
    });
    await expect(page.locator('#first')).toBeVisible();
    await expect(page.locator('#last')).toBeVisible();
    await expect(page.locator('#draft')).toHaveValue('Edited draft');
    expect(
      await page.locator('#parent').evaluate((host: HTMLElement & { popoverContent: HTMLElement }) => {
        const original = (window as unknown as { originalControls: Element[] }).originalControls;
        return (
          Array.from(host.popoverContent.children).every((node, index) => node === original[index]) &&
          host.popoverContent.children.length === original.length
        );
      }),
    ).toBe(true);
  }
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
