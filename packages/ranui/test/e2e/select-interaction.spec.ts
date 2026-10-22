import { test, expect } from '@playwright/test';
import { DEV_SERVER } from '../../build/config';
import { isolatedSetup, insideShadow, mount } from './helpers';

test.beforeEach(async ({ page, baseURL }) => {
  await isolatedSetup(page, baseURL ?? DEV_SERVER, 'r-select');
  await mount(
    page,
    `<r-select id="select" showsearch style="width:240px">
    <r-option value="a">Alpha</r-option><r-option value="b">Beta</r-option>
    <r-option value="bb">Beta two</r-option></r-select>`,
  );
});

test('search keeps real keyboard text editing, live filtering and clearing', async ({ page }) => {
  const box = await insideShadow(page, '#select', (root) => {
    const input = root.querySelector<HTMLInputElement>('[part="search"]')!;
    const rect = input.getBoundingClientRect();
    return { x: rect.x + rect.width / 2, y: rect.y + rect.height / 2 };
  });
  await page.mouse.click(box.x, box.y);
  await page.keyboard.type('Beta two');
  expect(await insideShadow(page, '#select', (root) => root.querySelector<HTMLInputElement>('input')!.value)).toBe(
    'Beta two',
  );
  await expect(page.locator('r-dropdown-item')).toHaveText(['Beta two']);
  await page.keyboard.press('Home');
  await page.keyboard.type('x');
  await page.keyboard.press('End');
  await page.keyboard.press('Backspace');
  const edited = await insideShadow(page, '#select', (root) => root.querySelector<HTMLInputElement>('input')!.value);
  await page.keyboard.press('ControlOrMeta+A');
  await page.keyboard.press('Backspace');
  await expect(page.locator('r-dropdown-item')).toHaveText(['Alpha', 'Beta', 'Beta two']);
  expect(await insideShadow(page, '#select', (root) => root.activeElement?.tagName)).toBe('INPUT');
  // Home/End follow each engine's native macOS editing conventions.
  await page.evaluate(() => {
    const native = document.createElement('input');
    native.id = 'native';
    native.type = 'search';
    document.body.append(native);
  });
  await page.locator('#native').fill('Beta two');
  await page.keyboard.press('End');
  await page.keyboard.press('Home');
  await page.keyboard.type('x');
  await page.keyboard.press('End');
  await page.keyboard.press('Backspace');
  expect(edited).toBe(await page.locator('#native').inputValue());
});

test('host typeahead selects once with a nonbubbling change; composing Enter does not select', async ({ page }) => {
  await page.locator('#select').evaluate((host) => host.removeAttribute('showsearch'));
  await page.locator('#select').focus();
  await page.keyboard.type('b');
  await page.locator('#select').evaluate((host) => {
    (window as any).changes = [];
    (window as any).delegated = 0;
    host.addEventListener('change', (event) => (window as any).changes.push((event as CustomEvent).detail));
    document.body.addEventListener('change', () => (window as any).delegated++);
    // Synthetic composition covers the guard; this does not emulate an OS IME.
    host.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', isComposing: true, bubbles: true }));
  });
  await expect(page.locator('#select')).not.toHaveAttribute('value');
  await page.keyboard.press('Enter');
  await expect(page.locator('#select')).toHaveAttribute('value', 'b');
  expect(
    await page.evaluate(() => ({ changes: (window as any).changes, delegated: (window as any).delegated })),
  ).toEqual({ changes: [{ value: 'b', label: 'Beta' }], delegated: 0 });
});

for (const key of ['ArrowDown', 'Home', 'Enter', 'g']) {
  test(`normal-motion selection immediately reopens with ${key} during its exit`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    const select = page.locator('#select');
    await select.evaluate((host) => {
      host.removeAttribute('showsearch');
      (window as unknown as { selectionChanges: unknown[] }).selectionChanges = [];
      host.addEventListener('change', (event) =>
        (window as unknown as { selectionChanges: unknown[] }).selectionChanges.push((event as CustomEvent).detail),
      );
    });
    await select.focus();
    await page.keyboard.press('End');
    await page.keyboard.press('Enter');
    // Prove the closing visual still exists before reopening; never wait out the defect.
    expect(await select.getAttribute('open')).toBeNull();
    const panel = page.locator('r-dropdown');
    expect(await panel.evaluate((node) => (node as HTMLElement).style.display)).toBe('block');
    expect(await select.getAttribute('aria-expanded')).toBe('false');
    await page.keyboard.press(key);
    await expect(select).toHaveAttribute('open');
    await expect(select).toHaveAttribute('aria-expanded', 'true');
    await expect(select).toHaveAttribute('value', 'bb');
    expect(await page.evaluate(() => (window as unknown as { selectionChanges: unknown[] }).selectionChanges)).toEqual([
      { value: 'bb', label: 'Beta two' },
    ]);
    // The old exit completion cannot hide the newly opened panel.
    await expect(panel).not.toHaveAttribute('transit');
    await expect(panel).toBeVisible();
    await expect(select).toHaveAttribute('open');
  });
}

for (const attribute of ['value', 'defaultvalue']) {
  test(`matching search preserves preselected ${attribute} and accepts replacement`, async ({ page }) => {
    await page.locator('#select').evaluate((host, name) => host.setAttribute(name, 'a'), attribute);
    const box = await insideShadow(page, '#select', (root) => {
      const input = root.querySelector<HTMLInputElement>('input')!;
      const rect = input.getBoundingClientRect();
      return { x: rect.x + rect.width / 2, y: rect.y + rect.height / 2 };
    });
    await page.mouse.click(box.x, box.y);
    await expect(page.locator('#select')).toHaveAttribute('open');
    await page.keyboard.type('a');
    await expect(page.locator('#select')).toHaveAttribute('open');
    await expect(page.locator('r-dropdown-item')).toHaveText(['Alpha', 'Beta', 'Beta two']);
    expect(
      await insideShadow(page, '#select', (root) => ({
        query: root.querySelector<HTMLInputElement>('input')!.value,
        focused: root.activeElement?.tagName,
      })),
    ).toEqual({ query: 'a', focused: 'INPUT' });
    await expect(page.locator('#select')).toHaveAttribute('value', 'a');
    await page.keyboard.press('ControlOrMeta+A');
    await page.keyboard.press('Backspace');
    await expect(page.locator('#select')).toHaveAttribute('open');
    await expect(page.locator('#select')).toHaveAttribute('value', 'a');
    expect(await insideShadow(page, '#select', (root) => root.activeElement?.tagName)).toBe('INPUT');
    await page.keyboard.type('Beta');
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('Enter');
    await expect(page.locator('#select')).toHaveAttribute('value', 'b');
    await expect(page.locator('#select')).not.toHaveAttribute('open');
    await page.mouse.click(box.x, box.y);
    await page.keyboard.type('b');
    await expect(page.locator('#select')).toHaveAttribute('open');
    await expect(page.locator('#select')).toHaveAttribute('value', 'b');
    expect(
      await insideShadow(page, '#select', (root) => root.querySelector('[part="selection-item"]')?.textContent),
    ).toBe('Beta');
  });
}

for (const initial of ['empty', 'value', 'defaultvalue']) {
  for (const composing of [false, true]) {
    test(`typed ${composing ? 'composition commit' : 'search'} commits pointer selection from ${initial}`, async ({
      page,
      hasTouch,
    }) => {
      const host = page.locator('#select');
      if (initial !== 'empty') await host.evaluate((node, name) => node.setAttribute(name, 'a'), initial);
      await host.evaluate((node) => {
        const state = window as unknown as Window & { selectionChanges: Array<{ value: string; label: string }> };
        state.selectionChanges = [];
        node.addEventListener('change', (event) => state.selectionChanges.push((event as CustomEvent).detail));
      });
      const point = await insideShadow(page, '#select', (root) => {
        const rect = root.querySelector<HTMLInputElement>('[part="search"]')!.getBoundingClientRect();
        return { x: rect.x + rect.width / 2, y: rect.y + rect.height / 2 };
      });
      if (hasTouch) await page.touchscreen.tap(point.x, point.y);
      else await page.mouse.click(point.x, point.y);
      if (composing) {
        // Exercise the composition guard with native typing; this is not an OS IME emulator.
        await host.evaluate((node) => {
          (node as HTMLElement & { _search: HTMLInputElement })._search.dispatchEvent(
            new CompositionEvent('compositionstart', { bubbles: true }),
          );
        });
      }
      await page.keyboard.type('Beta');
      if (composing) {
        await host.evaluate((node) => {
          (node as HTMLElement & { _search: HTMLInputElement })._search.dispatchEvent(
            new CompositionEvent('compositionend', { bubbles: true }),
          );
        });
      }
      await expect(page.locator('r-dropdown-item')).toHaveText(['Beta', 'Beta two']);
      const option = page.locator('r-dropdown-item').filter({ hasText: /^Beta$/ });
      if (hasTouch) await option.tap();
      else await option.click();
      await expect(host).toHaveAttribute('value', 'b');
      await expect(host).not.toHaveAttribute('open');
      await expect(host).toBeFocused();
      expect(
        await page.evaluate(
          () =>
            (window as unknown as Window & { selectionChanges: Array<{ value: string; label: string }> })
              .selectionChanges,
        ),
      ).toEqual([{ value: 'b', label: 'Beta' }]);
    });
  }
}
