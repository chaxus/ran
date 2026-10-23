import { expect, test } from '@playwright/test';
import { DEV_SERVER } from '../../build/config';
import { insideShadow, isolatedSetup, mount } from './helpers';

const headerVisible = (page: Parameters<typeof insideShadow>[0], host = '#card') =>
  insideShadow(page, host, (root) => (root.querySelector('[part="header"]') as HTMLElement).checkVisibility());

test.describe('r-card header composition', () => {
  test.beforeEach(async ({ page }) => {
    await isolatedSetup(page, DEV_SERVER, 'r-card');
    await page.waitForFunction(() => !!customElements.get('r-button'));
  });

  test('keeps a heading-only header and its action visible and keyboard reachable', async ({ page }) => {
    await mount(
      page,
      '<r-card id="card" heading="Workspace access"><r-button id="action" slot="extra">Manage members</r-button><p>Choose who can update this workspace.</p><a id="footer" slot="footer" href="#notes">View notes</a></r-card>',
    );
    expect(await headerVisible(page)).toBe(true);
    const title = await insideShadow(page, '#card', (root) => {
      const element = root.querySelector('[part="title"]') as HTMLElement;
      return { text: element.textContent, width: element.getBoundingClientRect().width };
    });
    expect(title.text).toBe('Workspace access');
    expect(title.width).toBeGreaterThan(0);
    await expect(page.locator('#action')).toBeVisible();
    await page.keyboard.press('Tab');
    expect(await page.evaluate(() => document.activeElement?.id)).toBe('action');
    expect(await insideShadow(page, '#action', (root) => root.activeElement?.matches(':focus-visible'))).toBe(true);
    await page.keyboard.press('Tab');
    await expect(page.locator('#footer')).toBeFocused();
  });

  test('shows an extra-only header without requiring a heading or description', async ({ page }) => {
    await mount(
      page,
      '<r-card id="card"><r-button id="action" slot="extra">Manage members</r-button><p>Workspace members</p></r-card>',
    );
    expect(await headerVisible(page)).toBe(true);
    await expect(page.locator('#action')).toBeVisible();
    await page.keyboard.press('Tab');
    expect(await page.evaluate(() => document.activeElement?.id)).toBe('action');
  });

  test('empty header attributes reserve the same space as omitted attributes', async ({ page }) => {
    await mount(
      page,
      '<r-card id="card" heading="" description="">Workspace members</r-card><r-card id="plain">Workspace members</r-card>',
    );
    expect(await headerVisible(page)).toBe(false);
    const inset = (host: string) =>
      insideShadow(page, host, (root) => {
        const body = root.querySelector('[part="body"]')!.getBoundingClientRect();
        const card = root.querySelector('[part="card"]')!.getBoundingClientRect();
        return { top: body.top - card.top, height: card.height };
      });
    expect(await inset('#card')).toEqual(await inset('#plain'));
  });

  test('updates header presence for changing attributes and extra-slot assignment', async ({ page }) => {
    await mount(
      page,
      '<r-card id="card">Workspace members<a id="footer" slot="footer" href="#">View notes</a></r-card>',
    );
    await expect.poll(() => headerVisible(page)).toBe(false);
    await page.locator('#card').evaluate((el) => el.setAttribute('heading', 'Workspace access'));
    await expect.poll(() => headerVisible(page)).toBe(true);
    await page.locator('#card').evaluate((el) => {
      el.removeAttribute('heading');
      el.setAttribute('description', 'Members can read shared documents.');
    });
    await expect.poll(() => headerVisible(page)).toBe(true);
    await page.locator('#card').evaluate((el) => el.setAttribute('description', ''));
    await expect.poll(() => headerVisible(page)).toBe(false);
    await page.locator('#card').evaluate((el) => {
      const action = document.createElement('button');
      action.id = 'action';
      action.slot = 'extra';
      action.textContent = 'Manage members';
      el.appendChild(action);
    });
    await expect.poll(() => headerVisible(page)).toBe(true);
    await page.locator('#action').evaluate((el) => el.removeAttribute('slot'));
    await expect.poll(() => headerVisible(page)).toBe(false);
    await page.locator('#action').evaluate((el) => el.setAttribute('slot', 'extra'));
    await expect.poll(() => headerVisible(page)).toBe(true);
    await page.locator('#action').evaluate((el) => el.remove());
    await expect.poll(() => headerVisible(page)).toBe(false);
    await expect(page.locator('#footer')).toBeVisible();
    await page.locator('#card').evaluate((el) => {
      const parent = el.parentElement!;
      el.remove();
      parent.appendChild(el);
    });
    await expect.poll(() => headerVisible(page)).toBe(false);
    await expect(page.locator('#footer')).toBeVisible();
  });

  for (const theme of ['light', 'dark'] as const) {
    test(`reflows long heading and extra action inside a 360px ${theme} pane`, async ({ page }) => {
      await page.setViewportSize({ width: 360, height: 900 });
      await page.emulateMedia({ colorScheme: theme });
      await page.evaluate((value) => document.documentElement.setAttribute('data-ran-theme', value), theme);
      await mount(
        page,
        '<r-card id="card" heading="Workspace access and security controls" description="Members can read and update shared documents."><r-button id="action" slot="extra">Review pending invitations</r-button><p>Choose who can read and update this workspace.</p><a slot="footer" href="#">View notes</a></r-card>',
      );
      const boxes = await insideShadow(page, '#card', (root) => {
        const box = (part: string) => {
          const rect = root.querySelector(`[part="${part}"]`)!.getBoundingClientRect();
          return { left: rect.left, right: rect.right, top: rect.top, bottom: rect.bottom, width: rect.width };
        };
        const extra = root.querySelector('slot[name="extra"]') as HTMLSlotElement;
        const rect = extra.assignedElements()[0].getBoundingClientRect();
        return {
          card: box('card'),
          title: box('title'),
          description: box('description'),
          header: box('header'),
          body: box('body'),
          footer: box('footer'),
          action: { left: rect.left, right: rect.right, top: rect.top, bottom: rect.bottom },
        };
      });
      expect(boxes.title.width).toBeGreaterThan(0);
      for (const box of [boxes.header, boxes.body, boxes.footer, boxes.action]) {
        expect(box.left).toBeGreaterThanOrEqual(boxes.card.left);
        expect(box.right).toBeLessThanOrEqual(boxes.card.right);
      }
      expect(boxes.action.top).toBeGreaterThanOrEqual(boxes.description.bottom);
      expect(boxes.body.top).toBeGreaterThanOrEqual(boxes.action.bottom);
      expect(boxes.footer.top).toBeGreaterThanOrEqual(boxes.body.bottom);
    });
  }
});
