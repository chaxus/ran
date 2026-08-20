import { describe, expect, it } from 'vitest';
import { createStreamAccumulator, mapEventStream, parseEventStream } from '@/stream/index.ts';
import type { ServerSentEvent, StreamChunk } from '@/stream/index.ts';

/**
 * Feeds text as bytes in caller-chosen slices, so a test can put a chunk boundary
 * anywhere — including inside a multi-byte character or between `\r` and `\n`.
 *
 * @param parts Byte-level slices delivered in order.
 * @returns An async iterable over those slices.
 */
async function* bytes(...parts: (string | Uint8Array)[]): AsyncGenerator<Uint8Array> {
  const encoder = new TextEncoder();
  for (const part of parts) yield typeof part === 'string' ? encoder.encode(part) : part;
}

/**
 * A `ReadableStream` with no `Symbol.asyncIterator`, matching browsers that never shipped it.
 *
 * @param parts Chunks to emit.
 * @returns A reader-only stream over those chunks.
 */
function readableWithoutAsyncIterator(...parts: string[]): ReadableStream<Uint8Array> {
  const encoder = new TextEncoder();
  const stream = new ReadableStream<Uint8Array>({
    start(controller) {
      for (const part of parts) controller.enqueue(encoder.encode(part));
      controller.close();
    },
  });
  Object.defineProperty(stream, Symbol.asyncIterator, { value: undefined });
  return stream;
}

/**
 * Drains an async iterable.
 *
 * @param source Iterable to drain.
 * @returns Everything it yielded.
 */
async function collect<T>(source: AsyncIterable<T>): Promise<T[]> {
  const out: T[] = [];
  for await (const item of source) out.push(item);
  return out;
}

describe('parseEventStream', () => {
  it('yields one event per blank-line-terminated block', async () => {
    const events = await collect(parseEventStream(bytes('data: a\n\ndata: b\n\n')));
    expect(events).toEqual([{ data: 'a' }, { data: 'b' }]);
  });

  it('joins repeated data fields with a newline', async () => {
    const events = await collect(parseEventStream(bytes('data: first\ndata: second\n\n')));
    expect(events).toEqual([{ data: 'first\nsecond' }]);
  });

  it('strips exactly one space after the colon', async () => {
    const events = await collect(parseEventStream(bytes('data:  two spaces\n\n')));
    expect(events[0].data).toBe(' two spaces');
  });

  it('reads a field with no colon as an empty value', async () => {
    const events = await collect(parseEventStream(bytes('data\n\n')));
    expect(events).toEqual([{ data: '' }]);
  });

  it('ignores comment lines, which is how servers keep a connection warm', async () => {
    const events = await collect(parseEventStream(bytes(': keep-alive\n\ndata: real\n\n')));
    expect(events).toEqual([{ data: 'real' }]);
  });

  it('carries event, id and retry fields', async () => {
    const events = await collect(parseEventStream(bytes('event: ping\nid: 7\nretry: 3000\ndata: x\n\n')));
    expect(events).toEqual([{ data: 'x', event: 'ping', id: '7', retry: 3000 }]);
  });

  it('drops a non-integer retry and an id containing NUL', async () => {
    const events = await collect(parseEventStream(bytes('retry: soon\nid: a\0b\ndata: x\n\n')));
    expect(events).toEqual([{ data: 'x' }]);
  });

  it('reassembles an event split across chunk boundaries', async () => {
    const events = await collect(parseEventStream(bytes('da', 'ta: sp', 'lit\n', '\n')));
    expect(events).toEqual([{ data: 'split' }]);
  });

  it('reassembles a multi-byte character split across chunks', async () => {
    const encoded = new TextEncoder().encode('data: 中文\n\n');
    const events = await collect(parseEventStream(bytes(encoded.slice(0, 8), encoded.slice(8))));
    expect(events).toEqual([{ data: '中文' }]);
  });

  it('handles CRLF, including a pair split across chunks', async () => {
    const events = await collect(parseEventStream(bytes('data: a\r', '\n\r\ndata: b\r\n\r\n')));
    expect(events).toEqual([{ data: 'a' }, { data: 'b' }]);
  });

  it('strips a leading BOM rather than corrupting the first field name', async () => {
    const events = await collect(parseEventStream(bytes('﻿data: a\n\n')));
    expect(events).toEqual([{ data: 'a' }]);
  });

  it('yields a trailing block that the server never terminated', async () => {
    const events = await collect(parseEventStream(bytes('data: a\n\ndata: cut')));
    expect(events).toEqual([{ data: 'a' }, { data: 'cut' }]);
  });

  it('yields nothing for a stream of only comments and blank lines', async () => {
    expect(await collect(parseEventStream(bytes(': a\n\n: b\n\n')))).toEqual([]);
  });

  it('reads a ReadableStream that has no async iterator', async () => {
    const events = await collect(parseEventStream(readableWithoutAsyncIterator('data: a\n\n', 'data: b\n\n')));
    expect(events).toEqual([{ data: 'a' }, { data: 'b' }]);
  });
});

describe('mapEventStream', () => {
  it('drops events the mapping rejects and flattens the ones it expands', async () => {
    const map = (event: ServerSentEvent): StreamChunk[] => {
      if (event.data === '[DONE]') return [];
      return [
        { type: 'text-delta', index: 0, text: event.data },
        { type: 'usage', usage: { outputTokens: event.data.length } },
      ];
    };
    const chunks = await collect(mapEventStream(bytes('data: hi\n\ndata: [DONE]\n\n'), map));
    expect(chunks).toEqual([
      { type: 'text-delta', index: 0, text: 'hi' },
      { type: 'usage', usage: { outputTokens: 2 } },
    ]);
  });
});

describe('createStreamAccumulator', () => {
  it('opens a block from its first delta when the provider sends no block-start', () => {
    const acc = createStreamAccumulator();
    acc.push({ type: 'text-delta', index: 0, text: 'he' });
    acc.push({ type: 'text-delta', index: 0, text: 'llo' });
    expect(acc.text()).toBe('hello');
  });

  it('keeps interleaved reasoning and text apart, ordered by index', () => {
    const acc = createStreamAccumulator();
    acc.push({ type: 'block-start', index: 0, blockType: 'reasoning' });
    acc.push({ type: 'block-start', index: 1, blockType: 'text' });
    acc.push({ type: 'reasoning-delta', index: 0, text: 'think ' });
    acc.push({ type: 'text-delta', index: 1, text: 'answer ' });
    acc.push({ type: 'reasoning-delta', index: 0, text: 'more' });
    acc.push({ type: 'text-delta', index: 1, text: 'here' });
    expect(acc.reasoning()).toBe('think more');
    expect(acc.text()).toBe('answer here');
    expect(acc.snapshot().blocks.map((b) => b.type)).toEqual(['reasoning', 'text']);
  });

  it('sorts blocks numerically, not lexically', () => {
    const acc = createStreamAccumulator();
    acc.push({ type: 'text-delta', index: 10, text: 'ten' });
    acc.push({ type: 'text-delta', index: 2, text: 'two ' });
    expect(acc.text()).toBe('two ten');
  });

  it('lets block-end replace what the deltas accumulated', () => {
    const acc = createStreamAccumulator();
    acc.push({ type: 'text-delta', index: 0, text: 'partial' });
    acc.push({ type: 'block-end', index: 0, block: { type: 'text', text: 'authoritative' } });
    expect(acc.text()).toBe('authoritative');
  });

  it('keeps a tool call id and name that later deltas omit', () => {
    const acc = createStreamAccumulator();
    acc.push({ type: 'tool-call-delta', index: 0, id: 'call_1', name: 'search', argumentsDelta: '{"q"' });
    acc.push({ type: 'tool-call-delta', index: 0, id: '', argumentsDelta: ':"ran"}' });
    expect(acc.toolCalls()).toEqual([{ type: 'tool-call', id: 'call_1', name: 'search', arguments: '{"q":"ran"}' }]);
  });

  it('accumulates concurrent tool calls independently', () => {
    const acc = createStreamAccumulator();
    acc.push({ type: 'tool-call-delta', index: 0, id: 'a', name: 'one', argumentsDelta: '{"x"' });
    acc.push({ type: 'tool-call-delta', index: 1, id: 'b', name: 'two', argumentsDelta: '{"y"' });
    acc.push({ type: 'tool-call-delta', index: 0, id: 'a', argumentsDelta: ':1}' });
    acc.push({ type: 'tool-call-delta', index: 1, id: 'b', argumentsDelta: ':2}' });
    expect(acc.toolCalls().map((c) => c.arguments)).toEqual(['{"x":1}', '{"y":2}']);
  });

  it('never parses tool arguments, so half a JSON document stays text', () => {
    const acc = createStreamAccumulator();
    acc.push({ type: 'tool-call-delta', index: 0, id: 'a', name: 'f', argumentsDelta: '{"a": [1,' });
    expect(acc.toolCalls()[0].arguments).toBe('{"a": [1,');
  });

  it('replaces a block when the provider reuses an index for another type', () => {
    const acc = createStreamAccumulator();
    acc.push({ type: 'text-delta', index: 0, text: 'text' });
    acc.push({ type: 'reasoning-delta', index: 0, text: 'reasoning' });
    expect(acc.text()).toBe('');
    expect(acc.reasoning()).toBe('reasoning');
  });

  it('records usage and finish, and reports done only after finish', () => {
    const acc = createStreamAccumulator();
    expect(acc.snapshot().done).toBe(false);
    acc.push({ type: 'usage', usage: { inputTokens: 10, outputTokens: 4 } });
    expect(acc.snapshot().done).toBe(false);
    acc.push({ type: 'finish', reason: 'tool-calls' });
    const snapshot = acc.snapshot();
    expect(snapshot.usage).toEqual({ inputTokens: 10, outputTokens: 4 });
    expect(snapshot.finishReason).toBe('tool-calls');
    expect(snapshot.done).toBe(true);
  });

  it('returns a snapshot that later pushes cannot mutate', () => {
    const acc = createStreamAccumulator();
    acc.push({ type: 'text-delta', index: 0, text: 'first' });
    const snapshot = acc.snapshot();
    acc.push({ type: 'text-delta', index: 0, text: ' second' });
    expect(snapshot.blocks[0]).toEqual({ type: 'text', text: 'first' });
    expect(acc.text()).toBe('first second');
  });

  it('clears every field on reset', () => {
    const acc = createStreamAccumulator();
    acc.push({ type: 'text-delta', index: 0, text: 'x' });
    acc.push({ type: 'usage', usage: { outputTokens: 1 } });
    acc.push({ type: 'finish', reason: 'stop' });
    acc.reset();
    expect(acc.snapshot()).toEqual({ blocks: [], usage: undefined, finishReason: undefined, done: false });
  });
});
