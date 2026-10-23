import { expect, test } from '@playwright/test';
import { DEV_SERVER } from '../../build/config';
import { insideShadow, isolatedSetup, mount } from './helpers';

for (const type of ['flat', 'line']) {
  test(`long ${type} tabs preserve labels and keyboard targets without scrolling the page`, async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 800 });
    await isolatedSetup(page, DEV_SERVER, 'r-tabs');
    await mount(
      page,
      `<div style="height:300px"></div><r-tabs id="tabs" type="${type}"><r-tab r-key="a" label="Overview">Overview</r-tab><r-tab r-key="b" label="Conversations with extraordinarily long translated names"><input id="draft" value="Keep this draft"></r-tab><r-tab r-key="c" label="Sources">Sources</r-tab></r-tabs><div style="height:900px"></div>`,
    );
    await page.locator('#tabs').evaluate((node) => {
      const tabs = node as HTMLElement & { _nav: HTMLElement; tabFocusable: (header: Element) => HTMLElement };
      tabs.tabFocusable(tabs._nav.children[0]).focus({ preventScroll: true });
    });
    const originalY = await page.evaluate(() => scrollY);
    const geometry = () =>
      insideShadow(page, '#tabs', (root) => {
        const header = root.querySelector<HTMLElement>('[part="header"]')!;
        const selected = root.querySelector<HTMLElement>('[part="nav"] .active')!;
        const box = selected.getBoundingClientRect();
        const bounds = header.getBoundingClientRect();
        const line = root.querySelector<HTMLElement>('[part="indicator"]')!.getBoundingClientRect();
        return {
          overflow: header.scrollWidth > header.clientWidth,
          fullLabel: box.width + 1 >= (selected as HTMLElement & { _btn: HTMLElement })._btn.scrollWidth,
          visible: box.left >= bounds.left + 1 && box.right <= bounds.right - 1,
          aligned: Math.abs(box.left - line.left) < 1 && Math.abs(box.width - line.width) < 1,
        };
      });
    await expect.poll(async () => (await geometry()).fullLabel).toBe(true);
    await expect.poll(async () => (await geometry()).overflow).toBe(true);
    await page.keyboard.press('End');
    await expect(page.locator('#tabs')).toHaveAttribute('active', 'c');
    await expect.poll(async () => (await geometry()).visible).toBe(true);
    await expect.poll(async () => (await geometry()).aligned).toBe(true);
    expect(await page.evaluate(() => scrollY)).toBe(originalY);
    await page.keyboard.press('Home');
    await expect(page.locator('#tabs')).toHaveAttribute('active', 'a');
    await expect.poll(async () => (await geometry()).visible).toBe(true);
    expect(await page.evaluate(() => scrollY)).toBe(originalY);
    await expect(page.locator('#draft')).toHaveValue('Keep this draft');
  });
}

for (const align of ['center', 'end']) {
  test(`aligned ${align} tabs retain indicator geometry when their header overflows`, async ({ page }) => {
    await isolatedSetup(page, DEV_SERVER, 'r-tabs');
    await mount(
      page,
      `<r-tabs id="tabs" align="${align}" style="width:600px"><r-tab r-key="a" label="Overview">A</r-tab><r-tab r-key="b" label="Conversations with extraordinarily long translated names">B</r-tab><r-tab r-key="c" label="Sources">C</r-tab></r-tabs>`,
    );
    const aligned = () =>
      insideShadow(page, '#tabs', (root) => {
        const selected = root.querySelector('[part="nav"] .active')!.getBoundingClientRect();
        const indicator = root.querySelector('[part="indicator"]')!.getBoundingClientRect();
        return Math.abs(selected.left - indicator.left) < 1 && Math.abs(selected.width - indicator.width) < 1;
      });
    await expect.poll(aligned).toBe(true);
    await page.locator('#tabs').evaluate((node) => {
      node.style.width = '280px';
    });
    await expect.poll(aligned).toBe(true);
    await page.locator('#tabs').evaluate((node) => {
      (node as HTMLElement & { active: string }).active = 'c';
    });
    await expect.poll(aligned).toBe(true);
  });
}

test('theme switch updates the accessible group label after mounting', async ({ page }) => {
  await isolatedSetup(page, DEV_SERVER, 'r-theme-switch');
  await mount(page, '<r-theme-switch id="theme"></r-theme-switch>');
  await page.locator('#theme').evaluate((node) => node.setAttribute('label', 'Workspace appearance'));
  await expect
    .poll(() =>
      insideShadow(page, '#theme', (root) => root.querySelector('[role="group"]')!.getAttribute('aria-label')),
    )
    .toBe('Workspace appearance');
});

test('theme switch coarse targets support touch and synchronize siblings', async ({ browser }) => {
  const context = await browser.newContext({ hasTouch: true, viewport: { width: 360, height: 800 } });
  const page = await context.newPage();
  try {
    await isolatedSetup(page, DEV_SERVER, 'r-theme-switch');
    await mount(page, '<r-theme-switch id="theme"></r-theme-switch><r-theme-switch id="sibling"></r-theme-switch>');
    const choices = await insideShadow(page, '#theme', (root) =>
      [...root.querySelectorAll('button')].map((button) => {
        const rect = button.getBoundingClientRect();
        return { width: rect.width, height: rect.height, x: rect.x + rect.width / 2, y: rect.y + rect.height / 2 };
      }),
    );
    expect(choices.every((choice) => choice.width >= 44 && choice.height >= 44)).toBe(true);
    await page.touchscreen.tap(choices[2].x, choices[2].y);
    await expect
      .poll(() =>
        insideShadow(page, '#sibling', (root) =>
          root.querySelector('[aria-pressed="true"]')?.getAttribute('data-choice'),
        ),
      )
      .toBe('dark');
  } finally {
    await context.close();
  }
});
