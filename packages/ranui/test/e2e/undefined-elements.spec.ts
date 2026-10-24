import { fileURLToPath } from 'node:url';
import { test, expect, type Page } from '@playwright/test';
import { insideShadow } from '../../testing';

// Pages load ranui.css before first paint and the components later (a deferred IIFE, a lazy
// chunk). In between, content the upgraded element hides or replaces must not lay out in
// flow. Each case: the stylesheet alone first, then the component's own IIFE.
const stylesheet = fileURLToPath(new URL('../../dist/ranui.css', import.meta.url));
const iife = (name: string): string => fileURLToPath(new URL(`../../dist/iife/${name}.iife.js`, import.meta.url));

const mount = async (page: Page, markup: string): Promise<void> => {
  await page.setContent(`<!doctype html><body>${markup}<p id="after">after</p></body>`);
  await page.addStyleTag({ path: stylesheet });
};

const upgrade = async (page: Page, tag: string, ...bundles: string[]): Promise<void> => {
  for (const bundle of bundles) await page.addScriptTag({ path: iife(bundle) });
  await page.waitForFunction((name) => !!customElements.get(name), tag);
};

const height = (page: Page, selector: string): Promise<number> =>
  page.locator(selector).evaluate((node) => node.getBoundingClientRect().height);

const items = (count: number, tag: string): string =>
  Array.from({ length: count }, (_, i) => `<${tag}>Item ${i + 1}</${tag}>`).join('');

test.describe('before definition, content the component hides stays off the page', () => {
  test('r-popover keeps its r-content panel closed', async ({ page }) => {
    await mount(
      page,
      `<r-popover trigger="click"><span id="trigger">Open</span><r-content><div class="list">${items(7, 'a')}</div></r-content></r-popover>`,
    );
    await expect(page.locator('.list')).toBeHidden();
    expect(await height(page, 'r-popover')).toBeLessThan(30);

    await upgrade(page, 'r-popover', 'popover', 'content');
    await expect(page.locator('.list')).toBeHidden();
    await page.locator('#trigger').click();
    await expect(page.getByText('Item 7')).toBeVisible();
  });

  test('r-select keeps its options out of flow', async ({ page }) => {
    await mount(
      page,
      `<r-select placeholder="Pick">${Array.from({ length: 6 }, (_, i) => `<r-option value="${i}">Option ${i}</r-option>`).join('')}</r-select>`,
    );
    await expect(page.locator('r-option').first()).toBeHidden();

    await upgrade(page, 'r-select', 'select');
    await expect
      .poll(() => page.locator('r-select').evaluate((node) => getComputedStyle(node).display))
      .not.toBe('none');
  });

  test('r-tabs shows only the first pane', async ({ page }) => {
    await mount(
      page,
      `<r-tabs>${[1, 2, 3].map((i) => `<r-tab label="Tab ${i}" key="${i}"><p class="pane">Pane ${i}</p></r-tab>`).join('')}</r-tabs>`,
    );
    await expect(page.getByText('Pane 1')).toBeVisible();
    await expect(page.getByText('Pane 2')).toBeHidden();
    await expect(page.getByText('Pane 3')).toBeHidden();

    await upgrade(page, 'r-tabs', 'tabpane', 'tab');
    await expect(page.getByText('Pane 1')).toBeVisible();
  });

  test('r-modal stays closed', async ({ page }) => {
    await mount(page, `<r-modal heading="Title"><p class="body">Dialog body</p>${items(4, 'p')}</r-modal>`);
    await expect(page.locator('.body')).toBeHidden();
    expect(await height(page, '#after')).toBeGreaterThan(0);
    expect(await page.locator('#after').evaluate((node) => node.getBoundingClientRect().top)).toBeLessThan(40);

    await upgrade(page, 'r-modal', 'modal');
    await page.locator('r-modal').evaluate((node) => node.setAttribute('open', ''));
    await expect
      .poll(() => insideShadow(page, 'r-modal', (root) => !!root.querySelector('[role="dialog"]')))
      .toBe(true);
  });

  test('r-reasoning keeps its body collapsed', async ({ page }) => {
    await mount(page, `<r-reasoning label="Thinking">${items(5, 'p')}</r-reasoning>`);
    await expect(page.getByText('Item 1')).toBeHidden();

    await upgrade(page, 'r-reasoning', 'reasoning');
    await expect.poll(() => height(page, 'r-reasoning')).toBeGreaterThan(0);
  });

  test('r-route outlets do not all render at once', async ({ page }) => {
    await mount(
      page,
      `<r-router><r-route path="/a"><p>Route A</p></r-route><r-route path="/b"><p>Route B</p></r-route></r-router>`,
    );
    await expect(page.getByText('Route A')).toBeHidden();
    await expect(page.getByText('Route B')).toBeHidden();

    await upgrade(page, 'r-route', 'route');
    await expect
      .poll(() =>
        page
          .locator('r-route')
          .first()
          .evaluate((node) => getComputedStyle(node).display),
      )
      .not.toBe('none');
  });

  for (const [tag, source] of [
    ['r-markdown', '# Heading\n\nSome **bold** text'],
    ['r-math', 'E = mc^2 + \\frac{a}{b}'],
    ['r-mermaid', 'graph TD; A[Start] --> B[End]'],
  ] as const) {
    test(`${tag} does not show its raw source`, async ({ page }) => {
      await mount(page, `<${tag}>${source}</${tag}>`);
      expect(await height(page, tag)).toBe(0);

      await upgrade(page, tag, tag.slice(2));
      await expect.poll(() => height(page, tag)).toBeGreaterThan(0);
    });
  }

  test('r-scratch keeps its box but not its prize', async ({ page }) => {
    await mount(page, `<r-scratch style="display:block;width:240px;height:120px">You won 50 coins!</r-scratch>`);
    await expect(page.getByText('You won 50 coins!')).toBeHidden();
    expect(await height(page, 'r-scratch')).toBe(120);

    await upgrade(page, 'r-scratch', 'scratch');
    expect(await page.locator('r-scratch').evaluate((node) => getComputedStyle(node).visibility)).toBe('visible');
    expect(await height(page, 'r-scratch')).toBe(120);
  });
});

// Overlay content can also be hidden by the browser itself, so it stays off the page even when
// ranui.css is not loaded at all. These cases withhold the stylesheet.
const mountBare = async (page: Page, markup: string): Promise<void> => {
  await page.setContent(`<!doctype html><body>${markup}<p id="after">after</p></body>`);
};

test.describe('natively marked overlay content, without ranui.css', () => {
  for (const marker of ['hidden', 'popover']) {
    test(`r-popover hides <r-content ${marker}> until opened`, async ({ page }) => {
      await mountBare(
        page,
        `<r-popover trigger="click"><span id="trigger">Open</span><r-content ${marker}><div class="list">${items(7, 'a')}</div></r-content></r-popover>`,
      );
      await expect(page.locator('.list')).toBeHidden();
      expect(await height(page, 'r-popover')).toBeLessThan(30);

      await upgrade(page, 'r-popover', 'popover', 'content');
      await expect(page.locator('.list')).toBeHidden();
      await page.locator('#trigger').click();
      await expect(page.getByText('Item 7')).toBeVisible();
      await page.keyboard.press('Escape');
      await expect(page.getByText('Item 7')).toBeHidden();
    });

    test(`r-select hides <r-option ${marker}> and still lists them`, async ({ page }) => {
      await mountBare(
        page,
        `<r-select placeholder="Pick">${Array.from({ length: 6 }, (_, i) => `<r-option ${marker} value="${i}">Option ${i}</r-option>`).join('')}</r-select>`,
      );
      await expect(page.locator('r-option').first()).toBeHidden();

      await upgrade(page, 'r-select', 'select');
      await page.locator('r-select').click();
      await expect.poll(() => page.locator('r-dropdown-item').count()).toBe(6);
      await expect(page.locator('r-dropdown-item').last()).toBeVisible();
      await page.locator('r-dropdown-item').nth(2).click();
      await expect.poll(() => page.locator('r-select').evaluate((node) => (node as HTMLElement & { value: string }).value)).toBe('2');
    });
  }
});
