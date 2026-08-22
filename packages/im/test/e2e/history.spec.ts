import { expect, test } from '@playwright/test';
import { freshApp, insideShadow, rows } from './helpers';

/**
 * Writes a conversation straight into the store and opens it.
 *
 * Seeded rather than driven through the UI: the shapes under test here — a log past the page
 * size, a recorded compaction boundary — take a long conversation or a real provider to
 * reach, and neither belongs in a test of how they are *drawn*.
 *
 * @param page The page under test.
 * @param session The record to store.
 */
async function seed(page: import('@playwright/test').Page, session: unknown): Promise<void> {
  await page.evaluate(async (record) => {
    const db = await new Promise<IDBDatabase>((resolve, reject) => {
      const request = indexedDB.open('ran-im');
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction('sessions', 'readwrite');
      tx.objectStore('sessions').put(record);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
    localStorage.setItem('ran-im:current-session', JSON.stringify((record as { id: string }).id));
  }, session);
  await page.reload({ waitUntil: 'load' });
  await page.waitForFunction(() => customElements.get('r-conversation') !== undefined);
}

/**
 * A conversation of `turns` question-and-answer pairs.
 *
 * @param turns How many exchanges.
 * @param extra Fields merged into the record.
 * @returns The stored session.
 */
function conversation(turns: number, extra: Record<string, unknown> = {}): Record<string, unknown> {
  const messages = Array.from({ length: turns }, (_, i) => [
    { role: 'user', content: `第 ${i} 问` },
    { role: 'assistant', content: `第 ${i} 答` },
  ]).flat();
  return { id: 'seeded', title: '种子对话', createdAt: 1, updatedAt: 2, messages, ...extra };
}

test.describe('a log longer than the page', () => {
  test.beforeEach(async ({ page }) => {
    await freshApp(page);
  });

  test('draws the newest page and offers the rest', async ({ page }) => {
    // A log only grows, so a client that renders all of it eventually renders more than
    // anyone will read.
    await seed(page, conversation(60));
    await expect.poll(async () => (await rows(page)).length).toBe(80);

    const label = await page.evaluate(() => (document.querySelector('#chat') as HTMLElement & { older: string }).older);
    expect(label).toContain('40');
    // The newest message is the one on screen, not the oldest.
    expect((await rows(page)).at(-1)?.text).toBe('第 59 答');
  });

  test('loads older on request, and keeps offering what is left', async ({ page }) => {
    await seed(page, conversation(60));
    await expect.poll(async () => (await rows(page)).length).toBe(80);

    await insideShadow(page, '#chat', (root) => {
      (root.querySelector('.ran-conversation-older button') as HTMLButtonElement).click();
      return null;
    });
    await expect.poll(async () => (await rows(page)).length).toBe(120);
    expect((await rows(page))[0]?.text).toBe('第 0 问');
    // Everything is shown, so the affordance retires.
    expect(await page.evaluate(() => (document.querySelector('#chat') as HTMLElement & { older: string }).older)).toBe(
      '',
    );
  });

  test('shows no paging affordance for a conversation that fits', async ({ page }) => {
    await seed(page, conversation(3));
    await expect.poll(async () => (await rows(page)).length).toBe(6);
    const hidden = await insideShadow(
      page,
      '#chat',
      (root) => (root.querySelector('.ran-conversation-older') as HTMLElement).hidden,
    );
    expect(hidden).toBe(true);
  });
});

test.describe('a conversation that has been compacted', () => {
  test.beforeEach(async ({ page }) => {
    await freshApp(page);
  });

  test('keeps every message and marks where the fold falls', async ({ page }) => {
    // Compaction shortens the request, never the history. The marker is there because a
    // history that silently changes size is one the reader cannot trust.
    await seed(page, conversation(4, { compactions: [{ at: 4, summary: '前面聊了两轮\n细节从略' }] }));
    await expect.poll(async () => (await rows(page)).length).toBeGreaterThan(0);

    const drawn = await rows(page);
    // Eight messages plus one marker, and the marker sits before the message it folds up to.
    expect(drawn.filter((row) => row.kind === 'turn')).toHaveLength(9);
    const summary = await insideShadow(page, '#chat', (root) =>
      [...root.querySelectorAll('.turn-system r-disclosure-row')].map((row) => ({
        heading: row.getAttribute('heading'),
        summary: row.getAttribute('summary'),
      })),
    );
    expect(summary).toEqual([{ heading: '早期对话已压缩', summary: '前面聊了两轮' }]);
  });
});
