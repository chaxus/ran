import { createServer } from 'node:http';
import type { AddressInfo } from 'node:net';
import { expect, test as base } from '@playwright/test';
import type { Page } from '@playwright/test';
import { freshApp, send } from './helpers';

type DialogRequest = { messages: { role: string; content: string }[] };
type Dialog = { requests: DialogRequest[]; summary: 'empty' | 'partial' | 'complete' };
const sse = (content: string) => `data: ${JSON.stringify({ choices: [{ index: 0, delta: { content } }] })}\n\n`;
const previous = [{ at: 4, summary: 'previous complete summary' }];
const test = base.extend<{ dialog: Dialog }>({
  dialog: async ({ page }, use, testInfo) => {
    const dialog: Dialog = { requests: [], summary: 'partial' };
    const serverEvents: { phase: string; at: number; bytes?: number }[] = [];
    const server = createServer((request, response) => {
      response.setHeader('Access-Control-Allow-Origin', 'http://localhost:30102');
      response.setHeader('Access-Control-Allow-Credentials', 'true');
      response.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
      response.setHeader('Access-Control-Allow-Headers', 'content-type, accept');
      response.setHeader('Access-Control-Expose-Headers', 'x-im-mode, x-im-context-limit');
      if (request.method !== 'POST') {
        response.writeHead(request.method === 'OPTIONS' ? 204 : 405);
        response.end();
        return;
      }
      let body = '';
      request.on('data', (chunk) => {
        body += chunk;
      });
      request.on('end', () => {
        const data = JSON.parse(body) as DialogRequest;
        dialog.requests.push(data);
        response.writeHead(200, {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-store',
          'x-im-mode': 'live',
          'x-im-context-limit': '6000',
        });
        const summary = data.messages[0].content.startsWith('下面是一段对话的早期部分');
        serverEvents.push({ phase: summary ? 'summary-request' : 'answer-request', at: Date.now() });
        if (!summary) response.end(sse('complete answer') + 'data: [DONE]\n\n');
        else if (dialog.summary === 'complete') response.end(sse('complete replacement summary') + 'data: [DONE]\n\n');
        else {
          response.flushHeaders();
          serverEvents.push({ phase: 'headers-flushed', at: Date.now() });
          if (dialog.summary === 'partial') {
            const payload =
              sse('INCOMPLETE SUMMARY') +
              'data: {"usage":{"prompt_tokens":42,"completion_tokens":3,"total_tokens":45}}\n\n';
            response.write(payload, () => {
              serverEvents.push({ phase: 'payload-written', at: Date.now(), bytes: Buffer.byteLength(payload) });
            });
          }
        }
      });
    });
    await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', resolve));
    const target = `http://127.0.0.1:${(server.address() as AddressInfo).port}/api/im/dialog`;
    await page.route('**/api/im/dialog', (route) => route.continue({ url: target }));
    // Observe real stream consumption without replacing the framing/accumulator.
    await page.addInitScript(() => {
      let received = '';
      const reads: { path: string; type: string; bytes?: number; at: number }[] = [];
      Reflect.set(window, '__compactionStreamProbe', () => ({ received, reads }));
      const observe = (value: unknown, path: string): void => {
        reads.push({
          path,
          type: Object.prototype.toString.call(value),
          bytes: ArrayBuffer.isView(value) ? value.byteLength : undefined,
          at: performance.now(),
        });
        if (value instanceof Uint8Array) {
          received += new TextDecoder().decode(value);
          if (received.includes('"total_tokens":45'))
            document.documentElement.setAttribute('data-summary-consumed', '');
        }
      };
      const read = ReadableStreamDefaultReader.prototype.read;
      ReadableStreamDefaultReader.prototype.read = function () {
        return read.call(this).then((chunk) => {
          observe(chunk.value, 'reader');
          return chunk;
        });
      };
      const streams = ReadableStream.prototype as unknown as {
        [Symbol.asyncIterator]?: () => AsyncIterableIterator<Uint8Array>;
      };
      const iterate = streams[Symbol.asyncIterator];
      if (iterate)
        streams[Symbol.asyncIterator] = async function* () {
          for await (const chunk of iterate.call(this)) {
            observe(chunk, 'iterator');
            yield chunk;
          }
        };
    });
    try {
      await use(dialog);
    } finally {
      if (testInfo.status !== testInfo.expectedStatus) {
        const browser = await page.evaluate(() => Reflect.get(window, '__compactionStreamProbe')()).catch(String);
        await testInfo.attach('compaction-stream.json', {
          body: JSON.stringify({ serverEvents, browser }),
          contentType: 'application/json',
        });
      }
      server.closeAllConnections();
      await new Promise<void>((resolve) => server.close(() => resolve()));
    }
  },
});
// This regression must fail visibly rather than turn green on a later attempt.
test.describe.configure({ retries: 0 });

async function seed(page: Page, compactions: typeof previous = []): Promise<void> {
  await freshApp(page);
  await page.evaluate(async (compactions) => {
    const db = await new Promise<IDBDatabase>((resolve) => {
      const open = indexedDB.open('ran-im');
      open.onsuccess = () => resolve(open.result);
    });
    const messages = Array.from({ length: 20 }, (_, i) => [
      { role: 'user', content: `original user ${i} ${'x'.repeat(1200)}` },
      { role: 'assistant', content: `original answer ${i} ${'y'.repeat(1200)}` },
    ]).flat();
    await new Promise<void>((resolve) => {
      const transaction = db.transaction('sessions', 'readwrite');
      transaction.objectStore('sessions').put({
        id: 'compaction-regression',
        title: 'long conversation',
        createdAt: 1,
        updatedAt: 2,
        messages,
        compactions,
        usage: { totalTokens: 100 },
      });
      transaction.oncomplete = () => resolve();
    });
    db.close();
    localStorage.setItem('ran-im:current-session', JSON.stringify('compaction-regression'));
  }, compactions);
  await page.reload({ waitUntil: 'load' });
}
const stored = (page: Page) =>
  page.evaluate(async () => {
    const db = await new Promise<IDBDatabase>((resolve) => {
      const open = indexedDB.open('ran-im');
      open.onsuccess = () => resolve(open.result);
    });
    const session = await new Promise<{
      compactions: typeof previous;
      messages: unknown[];
      usage: { totalTokens: number };
    }>((resolve) => {
      const read = db.transaction('sessions').objectStore('sessions').get('compaction-regression');
      read.onsuccess = () => resolve(read.result);
    });
    db.close();
    return session;
  });

for (const mode of ['empty', 'partial', 'previous'] as const) {
  test(`stopping ${mode} compaction preserves history through reload`, async ({ page, dialog }) => {
    const original = mode === 'previous' ? previous : [];
    dialog.summary = mode === 'empty' ? 'empty' : 'partial';
    await seed(page, original);
    await send(page, 'prime context limit');
    await page.evaluate(() => {
      (document.querySelector('#question') as HTMLElement & { value: string }).value = 'trigger summary';
      (document.querySelector('#composer') as HTMLFormElement).requestSubmit();
    });
    await expect.poll(() => dialog.requests.length).toBe(2);
    if (mode !== 'empty') await expect(page.locator('html')).toHaveAttribute('data-summary-consumed', '');
    await page.locator('#stop').click();
    await expect(page.locator('#send')).not.toHaveAttribute('disabled');
    const saved = await stored(page);
    expect(saved.compactions).toEqual(original);
    expect(saved.messages).toHaveLength(43);
    expect(saved.usage.totalTokens).toBe(mode === 'empty' ? 100 : 145);
    await expect(page.locator('#notice')).toBeHidden();
    expect(dialog.requests).toHaveLength(2);
    await page.reload({ waitUntil: 'load' });
    await send(page, 'after reload');
    const next = dialog.requests.at(-1)!;
    expect(
      next.messages.some((entry) =>
        entry.content.startsWith(mode === 'previous' ? 'original user 2 ' : 'original user 0 '),
      ),
    ).toBe(true);
    expect(next.messages.some((entry) => entry.content.includes('INCOMPLETE SUMMARY'))).toBe(false);
    expect((await stored(page)).compactions).toEqual(original);
  });
}

test('completed compaction still replaces the prefix with its full summary', async ({ page, dialog }) => {
  dialog.summary = 'complete';
  await seed(page);
  await send(page, 'prime context limit');
  await send(page, 'trigger complete summary');
  const saved = await stored(page);
  expect(saved.compactions).toHaveLength(1);
  expect(saved.compactions[0].summary).toBe('complete replacement summary');
  expect(saved.compactions[0].at).toBeGreaterThan(0);
  expect(dialog.requests.at(-1)!.messages[0]).toEqual({ role: 'system', content: 'complete replacement summary' });
});
