/**
 * Server-Sent Events parsing, to the WHATWG event-stream rules.
 *
 * This is the transport half of `ranuts/stream` and knows nothing about models: it turns
 * bytes into {@link ServerSentEvent} records. Mapping an event's `data` onto
 * {@link StreamChunk} is the caller's job, because that mapping is vendor-specific while
 * the framing is not.
 *
 * The parts worth not re-deriving: a chunk boundary can fall anywhere, including inside a
 * multi-byte character and between the two halves of a `\r\n`; `data:` repeats join with
 * `\n`; exactly one space after the colon is stripped; a line starting with `:` is a
 * comment (which is how servers keep a connection warm); and a trailing block with no
 * terminating blank line is still an event.
 */
import type { StreamChunk } from './types.ts';

/** One parsed `text/event-stream` event. */
export interface ServerSentEvent {
  /** Joined `data:` payload; `\n` between repeats, no trailing newline. */
  data: string;
  /** `event:` field, when the server sent one. */
  event?: string;
  /** `id:` field, when the server sent one. */
  id?: string;
  /** `retry:` field in milliseconds, when the server sent a valid integer. */
  retry?: number;
}

/** Anything `for await` can walk that yields byte chunks — a `fetch` body, or a fake. */
export type ByteSource = AsyncIterable<Uint8Array> | ReadableStream<Uint8Array>;

/**
 * Normalizes a byte source into an async iterable, so a `ReadableStream` without
 * `Symbol.asyncIterator` (Safari, and every browser before 2024) walks the same way.
 *
 * @param source Byte source to read.
 * @returns An async iterable over the same chunks.
 */
async function* iterate(source: ByteSource): AsyncGenerator<Uint8Array> {
  // Tested for callability, not presence: a shim can leave the well-known symbol defined
  // as undefined, and `in` would then send a reader-only stream down the wrong path.
  const asyncIterator = (source as Partial<AsyncIterable<Uint8Array>>)[Symbol.asyncIterator];
  if (typeof asyncIterator === 'function') {
    yield* source as AsyncIterable<Uint8Array>;
    return;
  }
  const reader = (source as ReadableStream<Uint8Array>).getReader();
  try {
    for (;;) {
      const { done, value } = await reader.read();
      if (done) return;
      if (value !== undefined) yield value;
    }
  } finally {
    reader.releaseLock();
  }
}

/**
 * Splits one accumulated event block into a {@link ServerSentEvent}.
 *
 * @param block Raw text of one event, without its terminating blank line.
 * @returns The parsed event, or null when the block held only comments or unknown fields.
 */
function parseBlock(block: string): ServerSentEvent | null {
  const data: string[] = [];
  let event: string | undefined;
  let id: string | undefined;
  let retry: number | undefined;

  for (const line of block.split('\n')) {
    if (line === '' || line.startsWith(':')) continue;
    const colon = line.indexOf(':');
    const field = colon === -1 ? line : line.slice(0, colon);
    // Exactly one leading space after the colon is part of the framing, not the value.
    let value = colon === -1 ? '' : line.slice(colon + 1);
    if (value.startsWith(' ')) value = value.slice(1);

    if (field === 'data') data.push(value);
    else if (field === 'event') event = value;
    // A NUL in an id must be ignored per spec; the whole field is dropped rather than sanitized.
    else if (field === 'id' && !value.includes('\0')) id = value;
    else if (field === 'retry' && /^\d+$/.test(value)) retry = Number(value);
  }

  if (data.length === 0 && event === undefined && id === undefined && retry === undefined) return null;
  const parsed: ServerSentEvent = { data: data.join('\n') };
  if (event !== undefined) parsed.event = event;
  if (id !== undefined) parsed.id = id;
  if (retry !== undefined) parsed.retry = retry;
  return parsed;
}

/**
 * Parses a byte stream as `text/event-stream`.
 *
 * Decoding is streaming, so a multi-byte character split across two network chunks is
 * reassembled rather than replaced. A final block with no terminating blank line is still
 * yielded, which is what a server that closes the connection mid-event produces.
 *
 * @param source Byte source, typically `response.body`.
 * @returns Each event in arrival order.
 */
export async function* parseEventStream(source: ByteSource): AsyncGenerator<ServerSentEvent> {
  const decoder = new TextDecoder();
  let buffer = '';
  let started = false;

  for await (const bytes of iterate(source)) {
    buffer += decoder.decode(bytes, { stream: true });
    // Normalize line endings before splitting so a `\r\n` straddling two chunks cannot
    // leave a stray `\r` at the head of the next line.
    buffer = buffer.replace(/\r\n?/g, '\n');
    if (!started) {
      // A leading BOM belongs to the stream, not to the first field name.
      if (buffer.startsWith('﻿')) buffer = buffer.slice(1);
      started = true;
    }

    let boundary = buffer.indexOf('\n\n');
    while (boundary !== -1) {
      const block = buffer.slice(0, boundary);
      buffer = buffer.slice(boundary + 2);
      const parsed = parseBlock(block);
      if (parsed !== null) yield parsed;
      boundary = buffer.indexOf('\n\n');
    }
  }

  buffer += decoder.decode();
  const tail = parseBlock(buffer.replace(/\r\n?/g, '\n'));
  if (tail !== null) yield tail;
}

/**
 * Maps SSE events onto {@link StreamChunk} values using a caller-supplied vendor mapping.
 *
 * The mapping returns an array because one wire event commonly carries several normalized
 * chunks — a delta plus a usage report, or two concurrent tool calls — and returning an
 * empty array is how a keep-alive or a sentinel such as `[DONE]` is dropped.
 *
 * @param source Byte source, typically `response.body`.
 * @param map Vendor mapping from one event to zero or more chunks.
 * @returns Each normalized chunk in arrival order.
 */
export async function* mapEventStream(
  source: ByteSource,
  map: (event: ServerSentEvent) => readonly StreamChunk[],
): AsyncGenerator<StreamChunk> {
  for await (const event of parseEventStream(source)) {
    yield* map(event);
  }
}
