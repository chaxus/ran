import { writeFile } from 'node:fs/promises';
import { createServer } from 'node:http';
import type { AddressInfo } from 'node:net';
import { expect, test as base } from '@playwright/test';
import type { Page } from '@playwright/test';
import { freshApp, send } from './helpers';
import { observeSummary } from './observe-summary';

type DialogRequest = { messages: { role: string; content: string }[] };
type Dialog = {
  requests: DialogRequest[];
  summary: 'empty' | 'partial' | 'complete';
  deliveryDelay: number;
  unicode: boolean;
  consumed: Promise<void>;
};
const sse = (content: string) => `data: ${JSON.stringify({ choices: [{ index: 0, delta: { content } }] })}\n\n`;
const previous = [{ at: 4, summary: 'previous complete summary' }];
const test = base.extend<{ dialog: Dialog }>({
  dialog: async ({ page }, use, testInfo) => {
    let consumed!: () => void;
    const dialog: Dialog = {
      requests: [],
      summary: 'partial',
      deliveryDelay: 0,
      unicode: false,
      consumed: new Promise<void>((resolve) => {
        consumed = resolve;
      }),
    };
    const serverEvents: { phase: string; at: number; bytes?: number }[] = [];
    await page.exposeBinding('__summaryConsumed', (_source, progress: { complete: boolean }) => {
      if (progress.complete) {
        serverEvents.push({ phase: 'consumer-accepted-usage', at: Date.now() });
        consumed();
      }
    });
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
        else if (dialog.summary === 'complete')
          response.end(
            sse(dialog.unicode ? 'complete replacement summary 中文' : 'complete replacement summary') +
              'data: [DONE]\n\n',
          );
        else {
          response.flushHeaders();
          serverEvents.push({ phase: 'headers-flushed', at: Date.now() });
          if (dialog.summary === 'partial') {
            const payload =
              sse(dialog.unicode ? 'INCOMPLETE SUMMARY 中文' : 'INCOMPLETE SUMMARY') +
              'data: {"usage":{"prompt_tokens":42,"completion_tokens":3,"total_tokens":45}}\n\n';
            const write = () => {
              // WebKit can retain the tail of a small write on a held-open HTTP
              // response. Later SSE comments keep transport delivery progressing
              // without completing the summary or changing its text/usage.
              const heartbeat = setInterval(() => response.write(': heartbeat\n\n'), 50);
              response.on('close', () => clearInterval(heartbeat));
              response.write(payload, () => {
                serverEvents.push({ phase: 'payload-written', at: Date.now(), bytes: Buffer.byteLength(payload) });
              });
            };
            if (dialog.deliveryDelay) {
              const timer = setTimeout(write, dialog.deliveryDelay);
              response.on('close', () => clearTimeout(timer));
            } else write();
          }
        }
      });
    });
    await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', resolve));
    const target = `http://127.0.0.1:${(server.address() as AddressInfo).port}/api/im/dialog`;
    await page.route('**/api/im/dialog', (route) => route.continue({ url: target }));
    try {
      await use(dialog);
    } finally {
      if (testInfo.status !== testInfo.expectedStatus) {
        const browser = await page.evaluate(() => Reflect.get(window, '__compactionStreamProbe')()).catch(String);
        const diagnostics = testInfo.outputPath('compaction-stream.json');
        await writeFile(diagnostics, JSON.stringify({ serverEvents, browser }));
        await testInfo.attach('compaction-stream.json', { path: diagnostics, contentType: 'application/json' });
      }
      server.closeAllConnections();
      await new Promise<void>((resolve) => server.close(() => resolve()));
    }
  },
});
// This regression must fail visibly rather than turn green on a later attempt.
test.describe.configure({ retries: 0 });

async function seed(
  page: Page,
  compactions: typeof previous = [],
  options: Parameters<typeof observeSummary>[0] = {},
): Promise<void> {
  await page.addInitScript(observeSummary, options);
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

for (const mode of ['empty', 'partial', 'previous', 'delayed', 'fragmented', 'reader-only'] as const) {
  test(`stopping ${mode} compaction preserves history through reload`, async ({ page, dialog }) => {
    const original = mode === 'previous' ? previous : [];
    dialog.summary = mode === 'empty' ? 'empty' : 'partial';
    // Deliberate transport latency beyond the default DOM assertion budget.
    // This is fault injection, not a sleep used to guess when the UI is ready.
    dialog.deliveryDelay = mode === 'delayed' ? 5500 : 0;
    const fragmented = mode === 'fragmented' || mode === 'reader-only';
    dialog.unicode = fragmented;
    await seed(page, original, { fragmentBytes: fragmented ? 1 : undefined, readerOnly: mode === 'reader-only' });
    await send(page, 'prime context limit');
    await page.evaluate(() => {
      (document.querySelector('#question') as HTMLElement & { value: string }).value = 'trigger summary';
      (document.querySelector('#composer') as HTMLFormElement).requestSubmit();
    });
    await expect.poll(() => dialog.requests.length).toBe(2);
    // Network progress uses an explicit consumption signal and the enclosing test
    // deadline, rather than the unrelated five-second DOM assertion timeout.
    if (mode !== 'empty') await test.step('wait for accepted summary usage', () => dialog.consumed);
    if (fragmented) {
      const probe = await page.evaluate(() => Reflect.get(window, '__compactionStreamProbe')());
      expect(probe.received).toContain('INCOMPLETE SUMMARY 中文');
      expect(probe.reads.length).toBeGreaterThan(150);
      expect(probe.reads.every((read: { bytes: number }) => read.bytes === 1)).toBe(true);
    }
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

for (const fragmented of [false, true]) {
  test(`completed ${fragmented ? 'fragmented ' : ''}compaction still replaces the prefix with its full summary`, async ({
    page,
    dialog,
  }) => {
    dialog.summary = 'complete';
    dialog.unicode = fragmented;
    await seed(page, [], { fragmentBytes: fragmented ? 1 : undefined });
    await send(page, 'prime context limit');
    await send(page, 'trigger complete summary');
    const summary = fragmented ? 'complete replacement summary 中文' : 'complete replacement summary';
    const saved = await stored(page);
    expect(saved.compactions).toHaveLength(1);
    expect(saved.compactions[0].summary).toBe(summary);
    expect(saved.compactions[0].at).toBeGreaterThan(0);
    expect(dialog.requests.at(-1)!.messages[0]).toEqual({ role: 'system', content: summary });
  });
}
