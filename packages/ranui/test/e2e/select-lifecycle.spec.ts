import { test, expect, type Page } from '@playwright/test';
import { DEV_SERVER } from '../../build/config';
import { isolatedSetup, insideShadow, mount } from './helpers';

test.beforeEach(async ({ page }) => {
  await isolatedSetup(page, DEV_SERVER, 'r-select');
});

async function clickSearch(page: Page): Promise<void> {
  // Target coordinates relative to the host so Playwright can wait for layout
  // stability and follow scrolling. WebKit retargets closed-root hit tests to
  // the host, so a direct input-handle click cannot pass its actionability check.
  const position = await insideShadow(page, '#select', (root) => {
    const input = root.querySelector('input')!.getBoundingClientRect();
    const host = root.host.getBoundingClientRect();
    return { x: input.x + input.width / 2 - host.x, y: input.y + input.height / 2 - host.y };
  });
  await page.locator('#select').click({ position });
  await expect
    .poll(() => insideShadow(page, '#select', (root) => root.activeElement === root.querySelector('input')))
    .toBe(true);
}

for (const method of ['property', 'attribute', 'remove']) {
  for (const defaultValue of [false, true]) {
    test(`clearing select by ${method} (${defaultValue ? 'with default' : 'without default'}) synchronizes its label, selection and form value`, async ({
      page,
    }) => {
      await mount(
        page,
        `<form id="form"><r-select id="select" name="choice" required showsearch value="a" ${defaultValue ? 'defaultvalue="a"' : ''}><r-option value="a">Alpha</r-option><r-option value="b">Beta</r-option></r-select></form>`,
      );
      const select = page.locator('#select');
      await expect
        .poll(() => insideShadow(page, '#select', (root) => root.querySelector('[part="selection-item"]')!.textContent))
        .toBe('Alpha');
      await select.evaluate((node, method) => {
        if (method === 'property') (node as HTMLElement & { value: string }).value = '';
        else if (method === 'attribute') node.setAttribute('value', '');
        else node.removeAttribute('value');
      }, method);
      await expect
        .poll(() =>
          insideShadow(page, '#select', (root) => ({
            label: root.querySelector('[part="selection-item"]')!.textContent,
            title: root.querySelector('[part="selection-item"]')!.getAttribute('title'),
            placeholder: root.querySelector('input')!.getAttribute('placeholder'),
          })),
        )
        .toEqual({ label: '', title: null, placeholder: null });
      await expect(select).not.toHaveAttribute('aria-activedescendant');
      expect(
        await page.evaluate(() => {
          const form = document.querySelector<HTMLFormElement>('#form')!;
          return { submitted: new FormData(form).get('choice'), valid: form.checkValidity() };
        }),
      ).toEqual({ submitted: '', valid: false });
      await select.evaluate((node) => {
        const parent = node.parentElement!;
        node.remove();
        parent.append(node);
        (node as HTMLElement & { show(): void }).show();
      });
      await expect
        .poll(() => insideShadow(page, '#select', (root) => root.querySelector('[part="selection-item"]')!.textContent))
        .toBe('');
      expect(
        await page
          .locator('r-dropdown-item')
          .evaluateAll((options) => options.map((option) => option.getAttribute('aria-selected'))),
      ).toEqual(['false', 'false']);
      await page
        .locator('r-dropdown-item')
        .filter({ hasText: /^Beta$/ })
        .click();
      await expect(select).toHaveAttribute('value', 'b');
      expect(await page.evaluate(() => document.querySelector<HTMLFormElement>('#form')!.checkValidity())).toBe(true);
    });
  }
}

for (const initiallyOpen of [false, true]) {
  for (const customContainer of [false, true]) {
    test(`select reconnect restores pointer and search interaction (${initiallyOpen ? 'open' : 'closed'}, ${customContainer ? 'custom portal' : 'body'})`, async ({
      page,
    }) => {
      await mount(
        page,
        `<div id="portal" style="position:relative"></div><form><r-select id="select" name="choice" showsearch value="a" ${customContainer ? 'getpopupcontainerid="portal"' : ''} style="width:240px"><r-option value="a">Alpha</r-option><r-option value="b">Beta</r-option></r-select></form>`,
      );
      const select = page.locator('#select');
      await select.evaluate((node, open) => {
        (window as unknown as { changes: unknown[] }).changes = [];
        node.addEventListener('change', (event) =>
          (window as unknown as { changes: unknown[] }).changes.push((event as CustomEvent).detail),
        );
        if (open) (node as HTMLElement & { show(): void }).show();
      }, initiallyOpen);
      for (let cycle = 0; cycle < 2; cycle++) {
        await select.evaluate((node, cycle) => {
          const parent = node.parentElement!;
          node.remove();
          if (cycle === 0) {
            const option = document.createElement('r-option');
            option.setAttribute('value', 'c');
            option.textContent = 'Gamma';
            node.append(option);
          }
          parent.append(node);
        }, cycle);
        await select.evaluate((node) => (node as HTMLElement & { show(): void }).show());
        const scope = customContainer ? page.locator('#portal') : page.locator('body');
        await expect(scope.locator('r-dropdown')).toHaveCount(1);
        await expect(scope.locator('r-dropdown-item')).toHaveText(['Alpha', 'Beta', 'Gamma']);
        await clickSearch(page);
        await page.keyboard.type(cycle === 0 ? 'Beta' : 'Gamma');
        const label = cycle === 0 ? 'Beta' : 'Gamma';
        await expect(scope.locator('r-dropdown-item')).toHaveText([label]);
        await scope.locator('r-dropdown-item').click();
        await expect(select).toHaveAttribute('value', cycle === 0 ? 'b' : 'c');
        await expect(select).not.toHaveAttribute('open');
      }
      expect(await page.evaluate(() => (window as unknown as { changes: unknown[] }).changes)).toEqual([
        { value: 'b', label: 'Beta' },
        { value: 'c', label: 'Gamma' },
      ]);
      await select.evaluate((node) => node.remove());
      await expect(page.locator('r-dropdown')).toHaveCount(0);
    });
  }
}

for (const timing of ['close while detached', 'detach during close']) {
  test(`reconnected select keeps a closed popup hidden (${timing})`, async ({ page }) => {
    await mount(page, '<r-select id="select"><r-option value="a">Alpha</r-option></r-select>');
    const select = page.locator('#select');
    await select.evaluate((node) => (node as HTMLElement & { show(): void }).show());
    await expect(page.locator('r-dropdown')).toBeVisible();
    await select.evaluate((node, timing) => {
      const control = node as HTMLElement & { hide(): void };
      const parent = node.parentElement!;
      if (timing === 'detach during close') control.hide();
      node.remove();
      if (timing === 'close while detached') control.hide();
      parent.append(node);
    }, timing);
    await expect(select).not.toHaveAttribute('open');
    await expect(select).toHaveAttribute('aria-expanded', 'false');
    await expect(page.locator('r-dropdown')).toHaveCount(1);
    await expect(page.locator('r-dropdown')).toBeHidden();
  });
}

test('reconnected searchable select preserves its draft filter without committing or repeating search events', async ({
  page,
}) => {
  await mount(
    page,
    '<r-select id="select" showsearch value="a" style="width:240px"><r-option value="a">Alpha</r-option><r-option value="b">Beta</r-option></r-select>',
  );
  const select = page.locator('#select');
  await clickSearch(page);
  await page.keyboard.type('Beta');
  await expect(page.locator('r-dropdown-item')).toHaveText(['Beta']);
  await select.evaluate((node) => {
    (window as unknown as { reconnectEvents: string[] }).reconnectEvents = [];
    for (const type of ['search', 'change'])
      node.addEventListener(type, () =>
        (window as unknown as { reconnectEvents: string[] }).reconnectEvents.push(type),
      );
    const parent = node.parentElement!;
    node.remove();
    parent.append(node);
  });
  expect(await insideShadow(page, '#select', (root) => root.querySelector('input')!.value)).toBe('Beta');
  await expect(page.locator('r-dropdown-item')).toHaveText(['Beta']);
  await expect(select).toHaveAttribute('value', 'a');
  expect(await page.evaluate(() => (window as unknown as { reconnectEvents: string[] }).reconnectEvents)).toEqual([]);
  await page.locator('r-dropdown-item').click();
  await expect(select).toHaveAttribute('value', 'b');
  expect(
    await page.evaluate(() =>
      (window as unknown as { reconnectEvents: string[] }).reconnectEvents.filter((type) => type === 'change'),
    ),
  ).toEqual(['change']);
});

test('hovering filtered search results preserves the query and pointer target', async ({ page, isMobile }) => {
  test.skip(isMobile, 'Hover triggers apply to desktop pointers.');
  await mount(
    page,
    '<r-select id="select" trigger="hover" showsearch style="width:240px"><r-option value="a">Alpha</r-option><r-option value="b">Beta</r-option><r-option value="c">Gamma</r-option></r-select>',
  );
  await clickSearch(page);
  await page.keyboard.type('Beta');
  await expect(page.locator('r-dropdown-item')).toHaveText(['Beta']);
  const beta = page.locator('r-dropdown-item');
  const bounds = await beta.boundingBox();
  expect(bounds).not.toBeNull();
  const point = { x: bounds!.x + bounds!.width / 2, y: bounds!.y + bounds!.height / 2 };
  // Keep the original pointer coordinates: resolving a fresh locator after the
  // hover could silently follow Beta after a broken handler replaces the list.
  await page.mouse.move(point.x, point.y);
  await expect.poll(() => insideShadow(page, '#select', (root) => root.querySelector('input')!.value)).toBe('Beta');
  await expect(page.locator('r-dropdown-item')).toHaveText(['Beta']);
  await page.mouse.click(point.x, point.y);
  await expect(page.locator('#select')).toHaveAttribute('value', 'b');
  await expect(page.locator('#select')).not.toHaveAttribute('open');
});
