import { expect, test, type Page } from '@playwright/test';
import { DEV_SERVER } from '../../build/config';
import { insideShadow, isolatedSetup, mount } from './helpers';

const TABS =
  '<r-tabs id="tabs" active="a"><r-tab r-key="a" label="Overview">A</r-tab><r-tab r-key="b" label="Conversations">B</r-tab><r-tab r-key="c" label="Sources" disabled>C</r-tab><r-tab r-key="d" label="Settings">D</r-tab></r-tabs>';

const fill = (page: Page) =>
  insideShadow(page, '#tabs', (root) => {
    const box = root.querySelector<HTMLElement>('[part="hover"]')!.getBoundingClientRect();
    return {
      left: Math.round(box.left),
      width: Math.round(box.width),
      opacity: getComputedStyle(root.querySelector('[part="hover"]')!).opacity,
    };
  });

const header = (page: Page, index: number) =>
  page.locator('#tabs').evaluate((node, i) => {
    const root = (node as unknown as { _shadowDom: ShadowRoot })._shadowDom;
    const box = root.querySelectorAll('[part="nav"] > *')[i].getBoundingClientRect();
    return {
      x: box.x + box.width / 2,
      y: box.y + box.height / 2,
      left: Math.round(box.left),
      width: Math.round(box.width),
    };
  }, index);

test.beforeEach(async ({ page }) => {
  await isolatedSetup(page, DEV_SERVER, 'r-tabs');
  await mount(page, TABS);
});

test('one hover fill slides between tab headers and leaves with the pointer', async ({ page }) => {
  const first = await header(page, 0);
  await page.mouse.move(first.x, first.y);
  await expect.poll(async () => (await fill(page)).opacity).toBe('1');
  const second = await header(page, 1);
  await page.mouse.move(second.x, second.y);
  await expect.poll(async () => (await fill(page)).left).toBe(second.left);
  expect((await fill(page)).width).toBe(second.width);
  await page.mouse.move(first.x, first.y + 300);
  await expect.poll(async () => (await fill(page)).opacity).toBe('0');
});

test('a disabled tab gets no hover fill', async ({ page }) => {
  const enabled = await header(page, 1);
  await page.mouse.move(enabled.x, enabled.y);
  await expect.poll(async () => (await fill(page)).opacity).toBe('1');
  const disabled = await header(page, 2);
  await page.mouse.move(disabled.x, disabled.y);
  await expect.poll(async () => (await fill(page)).opacity).toBe('0');
});

test('the fill follows keyboard focus between headers', async ({ page }) => {
  await page.locator('#tabs').evaluate((node) => {
    const tabs = node as HTMLElement & { _nav: HTMLElement; tabFocusable: (header: Element) => HTMLElement };
    tabs.tabFocusable(tabs._nav.children[0]).focus();
  });
  await page.keyboard.press('ArrowRight');
  await page.keyboard.press('ArrowLeft');
  await page.keyboard.press('ArrowRight');
  const second = await header(page, 1);
  await expect.poll(async () => (await fill(page)).left).toBe(second.left);
  expect((await fill(page)).opacity).toBe('1');
});

test('with a header focused from the keyboard, the fill returns to it when the pointer leaves', async ({ page }) => {
  await page.locator('#tabs').evaluate((node) => {
    const tabs = node as HTMLElement & { _nav: HTMLElement; tabFocusable: (header: Element) => HTMLElement };
    tabs.tabFocusable(tabs._nav.children[0]).focus();
  });
  await page.keyboard.press('ArrowRight');
  await page.keyboard.press('ArrowLeft');
  const focused = await header(page, 0);
  const hovered = await header(page, 3);
  await page.mouse.move(hovered.x, hovered.y);
  await expect.poll(async () => (await fill(page)).left).toBe(hovered.left);
  await page.mouse.move(hovered.x, hovered.y + 300);
  await expect.poll(async () => (await fill(page)).left).toBe(focused.left);
  expect((await fill(page)).opacity).toBe('1');
});

test('a hovered header that becomes disabled loses the fill', async ({ page }) => {
  const target = await header(page, 1);
  await page.mouse.move(target.x, target.y);
  await expect.poll(async () => (await fill(page)).opacity).toBe('1');
  await page.locator('r-tab[r-key="b"]').evaluate((tab) => tab.setAttribute('disabled', ''));
  await expect.poll(async () => (await fill(page)).opacity).toBe('0');
});
