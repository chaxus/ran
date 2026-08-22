import { expect, test } from '@playwright/test';
import { freshApp, insideShadow, rows, send } from './helpers';

/**
 * The agent loop, end to end, with no API key.
 *
 * The demo provider answers the first round with a `get_current_time` call and the second
 * with prose, so the whole loop runs: the call is projected into a row, the tool executes in
 * the browser, the result is fed back, and the answer arrives. It is also what a clone with
 * no key sees, which is the reason the demo does it at all — otherwise the one feature that
 * separates this from a chat box is invisible until someone has a key.
 */
test.describe('a tool call, end to end', () => {
  test.beforeEach(async ({ page }) => {
    await freshApp(page);
  });

  test('runs the loop: says what it will do, calls, then answers', async ({ page }) => {
    await send(page, '现在几点');
    const drawn = await rows(page);
    expect(drawn.map((row) => row.kind)).toEqual(['turn', 'turn', 'tool', 'turn']);
    expect(drawn[0].text).toContain('现在几点');
    expect(drawn[1].text).toContain('我先看一下现在几点');
    // The final answer came from a second round trip, after the result was fed back.
    expect(drawn[3].text.length).toBeGreaterThan(20);
  });

  test('renders the call as a one-line row, not a card', async ({ page }) => {
    // A run of tool calls is a list. This is the shape that makes it one.
    await send(page, '现在几点');
    const card = await insideShadow(page, '#chat', (root) => {
      const row = root.querySelector('r-tool-card') as (HTMLElement & { status: string }) | null;
      const inner = row?.shadowRoot ?? null;
      return {
        present: row !== null,
        height: Math.round(row?.getBoundingClientRect().height ?? 0),
        status: row?.status ?? '',
        // The card's own root is closed too — its absence here is the point.
        reachable: inner !== null,
      };
    });
    expect(card.present).toBe(true);
    expect(card.status).toBe('success');
    expect(card.height).toBeGreaterThan(0);
    expect(card.height).toBeLessThanOrEqual(28);
    expect(card.reachable).toBe(false);
  });

  test('opens the call onto what went in and what came back', async ({ page }) => {
    await send(page, '现在几点');
    const before = await insideShadow(page, '#chat', (root) =>
      Math.round((root.querySelector('r-tool-card') as HTMLElement).getBoundingClientRect().height),
    );

    // A real click at the row's coordinates, not `element.click()`: the control is a button
    // inside the card's own closed shadow root, and a synthetic click on the host never
    // reaches it. Pointing at the pixels is also what a reader does.
    const box = await insideShadow(page, '#chat', (root) => {
      const rect = (root.querySelector('r-tool-card') as HTMLElement).getBoundingClientRect();
      return { x: rect.x + rect.width / 2, y: rect.y + rect.height / 2 };
    });
    await page.mouse.click(box.x, box.y);

    const after = await insideShadow(page, '#chat', (root) => {
      const card = root.querySelector('r-tool-card') as HTMLElement;
      return { height: Math.round(card.getBoundingClientRect().height), open: card.hasAttribute('open') };
    });
    expect(after.open).toBe(true);
    expect(after.height).toBeGreaterThan(before);
  });

  test('stores the call and its result so the conversation can resume', async ({ page }) => {
    // A provider rejects a role:'tool' message whose id names no call before it, so a
    // reloaded conversation that dropped either half could not be continued at all.
    await send(page, '现在几点');
    const stored = await page.evaluate(async () => {
      const db = await new Promise<IDBDatabase>((resolve, reject) => {
        const request = indexedDB.open('ran-im');
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
      });
      const id = JSON.parse(localStorage.getItem('ran-im:current-session') ?? '""') as string;
      const session = await new Promise<{
        messages: { role: string; tool_calls?: unknown[]; tool_call_id?: string }[];
      }>((resolve, reject) => {
        const query = db.transaction('sessions').objectStore('sessions').get(id);
        query.onsuccess = () => resolve(query.result);
        query.onerror = () => reject(query.error);
      });
      return session.messages.map((message) => ({
        role: message.role,
        calls: (message.tool_calls ?? []).length,
        answers: message.tool_call_id ?? null,
      }));
    });
    expect(stored.map((entry) => entry.role)).toEqual(['user', 'assistant', 'tool', 'assistant']);
    expect(stored[1].calls).toBe(1);
    expect(stored[2].answers).not.toBeNull();
  });

  test('brings the call back on reload, still showing its result', async ({ page }) => {
    await send(page, '现在几点');
    await page.reload({ waitUntil: 'load' });
    await page.waitForFunction(() => customElements.get('r-conversation') !== undefined);
    await expect.poll(async () => (await rows(page)).length, { timeout: 10_000 }).toBe(4);

    const replayed = await insideShadow(page, '#chat', (root) => {
      const card = root.querySelector('r-tool-card') as (HTMLElement & { status: string }) | null;
      return card?.status ?? '';
    });
    // A replayed call shows as finished, because it is.
    expect(replayed).toBe('success');
  });
});
