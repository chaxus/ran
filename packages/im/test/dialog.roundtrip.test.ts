import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createStreamAccumulator, mapEventStream } from 'ranuts/stream';
import IMController from '@/app/controllers/im';
import { toStreamChunks } from '@/client/lib/eventSource';
import type { Context } from '@/app/types/index';

/**
 * Runs the real controller against a fake response and returns exactly the bytes it wrote.
 *
 * The point is that neither half is stubbed: if the server's framing and the client's
 * parsing ever disagree, this fails. A test that re-declared the wire format would agree
 * with itself forever.
 *
 * @param question The question to send.
 * @returns Everything written to the response, and the headers it set.
 */
function runServer(question: string): { body: string; status: number; headers: Record<string, string> } {
  let body = '';
  let status = 0;
  let headers: Record<string, string> = {};

  const ctx = {
    request: { body: { chat_id: '1', question } },
    res: {
      writeHead(code: number, sent: Record<string, string>) {
        status = code;
        headers = sent;
      },
      write(chunk: string) {
        body += chunk;
      },
      end() {},
    },
    req: { on() {} },
  } as unknown as Context;

  new IMController().dialog(ctx);
  // The controller emits on an interval and clears it on the last chunk; run the clock
  // until it stops scheduling rather than guessing how many ticks that takes.
  vi.advanceTimersByTime(60_000);
  return { body, status, headers };
}

/**
 * Feeds text to the client pipeline in slices of the given size.
 *
 * @param text Bytes the server wrote.
 * @param size Slice length, so a test can put a boundary mid-event.
 * @returns The folded snapshot.
 */
async function runClient(
  text: string,
  size: number,
): Promise<ReturnType<ReturnType<typeof createStreamAccumulator>['snapshot']>> {
  const encoder = new TextEncoder();
  const source = (async function* () {
    for (let i = 0; i < text.length; i += size) yield encoder.encode(text.slice(i, i + size));
  })();

  const accumulator = createStreamAccumulator();
  for await (const chunk of mapEventStream(source, toStreamChunks)) accumulator.push(chunk);
  return accumulator.snapshot();
}

describe('dialog round trip — the real controller through the real client', () => {
  let previousKey: string | undefined;

  beforeEach(() => {
    vi.useFakeTimers();
    // Force the demo path. Without this the test reads whatever key the machine happens to
    // have — from the environment or a repository `.env` — and a unit test starts making
    // paid network calls. An empty `IM_API_KEY` wins over every other source, so this is
    // deterministic rather than a hope that none is configured.
    previousKey = process.env.IM_API_KEY;
    process.env.IM_API_KEY = '';
  });
  afterEach(() => {
    vi.useRealTimers();
    if (previousKey === undefined) delete process.env.IM_API_KEY;
    else process.env.IM_API_KEY = previousKey;
  });

  it('declares an event stream and frames every event as SSE', () => {
    const { status, headers, body } = runServer('hello');
    expect(status).toBe(200);
    expect(headers['Content-Type']).toBe('text/event-stream');
    // Which path answered is a header, not a stream event: the content is the model's, and
    // a note about configuration is not.
    expect(headers['X-IM-Mode']).toBe('demo');
    // Every write is one `data:` line terminated by a blank line. The previous
    // implementation set this header and then wrote bare JSON.
    expect(body.startsWith('data: ')).toBe(true);
    expect(body.endsWith('\n\n')).toBe(true);
    for (const block of body.split('\n\n').filter((part) => part !== '')) {
      expect(block.startsWith('data: ')).toBe(true);
    }
    expect(body.trimEnd().endsWith('data: [DONE]')).toBe(true);
  });

  it('reconstructs the whole answer, finish reason and usage', async () => {
    const { body } = runServer('春江花月夜');
    const snapshot = await runClient(body, 4096);

    expect(snapshot.done).toBe(true);
    expect(snapshot.finishReason).toBe('stop');

    const text = snapshot.blocks.reduce((out, block) => (block.type === 'text' ? out + block.text : out), '');
    expect(text.startsWith('春江花月夜\n春江潮水连海平')).toBe(true);
    expect(text.endsWith('但见长江送流水。\n')).toBe(true);
    expect(snapshot.usage?.outputTokens).toBe(text.length);
    // No invented prompt count: a canned answer was not prompted by anything, and reporting
    // the question's length as a token count would be a number that means nothing.
    expect(snapshot.usage?.inputTokens).toBeUndefined();
  });

  it('reconstructs the same answer however the bytes are sliced', async () => {
    const { body } = runServer('x');
    const whole = await runClient(body, 4096);
    const expected = whole.blocks.reduce((out, block) => (block.type === 'text' ? out + block.text : out), '');

    // 1 byte splits multi-byte characters and every `\n\n`; 7 and 64 put boundaries at
    // arbitrary points inside events. The old client JSON.parsed whatever chunk arrived,
    // so any of these broke it.
    for (const size of [1, 7, 64]) {
      const snapshot = await runClient(body, size);
      const text = snapshot.blocks.reduce((out, block) => (block.type === 'text' ? out + block.text : out), '');
      expect(text, `slice size ${size}`).toBe(expected);
      expect(snapshot.done, `slice size ${size}`).toBe(true);
    }
  });

  it('puts every character on the wire exactly once', async () => {
    const { body } = runServer('x');
    const snapshot = await runClient(body, 4096);
    const text = snapshot.blocks.reduce((out, block) => (block.type === 'text' ? out + block.text : out), '');

    // The exact statement of "deltas, not accumulation": summing the content of every
    // event must equal the answer, not some multiple of it. The previous controller sent
    // `answer.slice(0, i)` on tick i, so this sum was O(n²) — 10,153 characters to deliver
    // 142.
    const sent = body
      .split('\n\n')
      .filter((block) => block.startsWith('data: ') && !block.endsWith('[DONE]'))
      .reduce((total, block) => {
        const wire = JSON.parse(block.slice('data: '.length)) as {
          choices?: { delta?: { content?: string } }[];
        };
        return total + (wire.choices?.[0]?.delta?.content?.length ?? 0);
      }, 0);

    expect(sent).toBe(text.length);
  });
});
