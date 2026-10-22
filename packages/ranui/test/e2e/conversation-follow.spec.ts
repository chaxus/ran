import { expect, test } from '@playwright/test';
import { DEV_SERVER } from '../../build/config';
import { insideShadow, isolatedSetup } from './helpers';

for (const reducedMotion of ['no-preference', 'reduce'] as const) {
  test.describe(`conversation explicit follow intent: ${reducedMotion}`, () => {
    test.use({ contextOptions: { reducedMotion } });

    test('preserves reading position across growth and reconnect until an explicit jump', async ({ page }) => {
      await isolatedSetup(page, DEV_SERVER, 'r-conversation');
      await page.evaluate(() => {
        const chat = document.createElement('r-conversation') as HTMLElement & {
          register: (view: unknown) => void;
          push: (event: unknown) => void;
        };
        chat.id = 'chat';
        chat.setAttribute('follow', 'false');
        chat.style.cssText = 'height:280px;width:min(100%,600px)';
        document.body.append(chat);
        chat.register({
          kind: 'message',
          match: (event: { id: string }) => ({ id: event.id, role: 'start' }),
          start: (event: { text: string }) => event.text,
          update: (state: string) => state,
          mount: () => {
            const row = document.createElement('p');
            // Fixed host-owned row geometry isolates follow intent from lazy-row estimates.
            row.style.cssText = 'block-size:48px;margin:0';
            return row;
          },
          patch: (row: HTMLElement, node: { state: string }) => (row.textContent = node.state),
        });
        for (let i = 0; i < 30; i++) chat.push({ id: `${i}`, text: `Release note ${i}: review the migration.` });
      });
      const position = () =>
        insideShadow(page, '#chat', (root) => {
          const scroll = root.querySelector<HTMLElement>('.ran-conversation')!;
          return { top: scroll.scrollTop, floor: scroll.scrollHeight - scroll.clientHeight };
        });
      await expect.poll(async () => (await position()).floor).toBeGreaterThan(500);
      await page.waitForTimeout(120); // Allow the actual ResizeObserver growth path to settle.
      expect((await position()).top).toBe(0);
      expect(await page.locator('#chat').evaluate((chat) => (chat as HTMLElement & { pinned: boolean }).pinned)).toBe(
        false,
      );
      await page.locator('#chat').evaluate((chat) => {
        chat.remove();
        document.body.append(chat);
      });
      await insideShadow(page, '#chat', (root) => {
        root.querySelector<HTMLElement>('.ran-conversation-list')!.style.paddingBottom = '240px';
        return null;
      });
      await page.waitForTimeout(120);
      expect((await position()).top).toBe(0);
      await page
        .locator('#chat')
        .evaluate((chat) => (chat as HTMLElement & { scrollToBottom(): void }).scrollToBottom());
      await expect
        .poll(async () => {
          const p = await position();
          return Math.abs(p.floor - p.top);
        })
        .toBeLessThan(2);
      await page.locator('#chat').evaluate((chat) => ((chat as HTMLElement & { follow: boolean }).follow = false));
      const stopped = (await position()).top;
      await insideShadow(page, '#chat', (root) => {
        root.querySelector<HTMLElement>('.ran-conversation-list')!.style.paddingBottom = '480px';
        return null;
      });
      await page.waitForTimeout(120);
      expect((await position()).top).toBe(stopped);
      expect((await position()).floor).toBeGreaterThan(stopped + 200);
    });
  });
}
