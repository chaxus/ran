import { createStreamAccumulator, mapEventStream } from 'ranuts/stream';
import type { ServerSentEvent, StreamChunk, StreamSnapshot } from 'ranuts/stream';

/**
 * One chunk of an OpenAI-compatible chat completion stream.
 *
 * Only the fields this client reads are declared. A provider sends more, and a field it
 * adds later must not stop this from compiling.
 */
interface WireChunk {
  /**
   * Set by this app's own route when the provider call fails, and by some providers when a
   * request is rejected mid-stream.
   */
  error?: { status?: number; message?: string };
  choices?: {
    index?: number;
    delta?: { content?: string; reasoning_content?: string };
    finish_reason?: string | null;
  }[];
  usage?: { prompt_tokens?: number; completion_tokens?: number; total_tokens?: number };
}

/** Terminal sentinel the OpenAI wire format sends instead of closing cleanly. */
const DONE = '[DONE]';

/**
 * Maps `finish_reason` onto the neutral vocabulary.
 *
 * @param reason The provider's reason, if it sent one.
 * @returns The neutral reason.
 */
function finishReason(reason: string): StreamChunk & { type: 'finish' } {
  if (reason === 'length') return { type: 'finish', reason: 'length' };
  if (reason === 'tool_calls') return { type: 'finish', reason: 'tool-calls' };
  if (reason === 'content_filter') return { type: 'finish', reason: 'content-filter' };
  return { type: 'finish', reason: 'stop' };
}

/**
 * Maps one wire event onto zero or more {@link StreamChunk}s.
 *
 * This is the only vendor-specific code in the pipeline, and `ranuts/stream` deliberately
 * ships no such mapping: the framing and the fold are the same everywhere, the wire shape
 * is not. Point this at a different provider by rewriting this function alone.
 *
 * @param event One parsed Server-Sent Event.
 * @returns The chunks it carries, empty for a sentinel or an unparseable payload.
 */
export function toStreamChunks(event: ServerSentEvent): StreamChunk[] {
  if (event.data === '' || event.data === DONE) return [];

  let wire: WireChunk;
  try {
    wire = JSON.parse(event.data) as WireChunk;
  } catch {
    // A provider that emits a keep-alive comment as data, or a truncated final event on an
    // aborted connection, must not take the stream down.
    return [];
  }

  // An error event carries no content to fold, and returning nothing would let the stream
  // end looking like a complete empty answer. Throwing lands it in the same failure path a
  // dropped connection takes, with the provider's own message intact.
  if (wire.error !== undefined) {
    const status = wire.error.status === undefined || wire.error.status === 0 ? '' : ` (${wire.error.status})`;
    throw new Error(`${wire.error.message ?? 'the provider rejected the request'}${status}`);
  }

  const chunks: StreamChunk[] = [];
  for (const choice of wire.choices ?? []) {
    const index = choice.index ?? 0;
    const { content, reasoning_content: reasoning } = choice.delta ?? {};
    if (reasoning !== undefined && reasoning !== '') chunks.push({ type: 'reasoning-delta', index, text: reasoning });
    if (content !== undefined && content !== '') chunks.push({ type: 'text-delta', index, text: content });
    if (typeof choice.finish_reason === 'string') chunks.push(finishReason(choice.finish_reason));
  }
  if (wire.usage !== undefined) {
    chunks.push({
      type: 'usage',
      usage: {
        inputTokens: wire.usage.prompt_tokens,
        outputTokens: wire.usage.completion_tokens,
        totalTokens: wire.usage.total_tokens,
      },
    });
  }
  // Usage must precede the terminal finish, and a provider that attaches both to one event
  // leaves the order to us.
  return chunks.sort((a, b) => Number(a.type === 'finish') - Number(b.type === 'finish'));
}

/** Whether the answer came from a configured provider or the built-in sample. */
export type DialogMode = 'live' | 'demo';

/** How to run one streamed request. */
export interface DialogOptions {
  /**
   * Called once the response headers arrive, before any content.
   *
   * The server reports this in a header rather than in the stream: the answer's content is
   * the model's, and a note about how the server is configured is not.
   */
  onMode?: (mode: DialogMode) => void;
  /** Called after every accepted chunk, with the folded state so far. */
  onUpdate: (snapshot: StreamSnapshot) => void;
  /** Called once the stream ends, cleanly or not. */
  onEnd?: (snapshot: StreamSnapshot, error?: Error) => void;
}

/** A request in flight. */
export interface DialogStream {
  /** Aborts the request; `onEnd` still runs. */
  close: () => void;
}

/**
 * Streams one dialog turn.
 *
 * The SSE framing and the fold come from `ranuts/stream`, so what is left here is the
 * request, the mapping, and cancellation.
 *
 * @param url Endpoint to POST to.
 * @param body Request body, serialised as JSON.
 * @param options Update and completion callbacks.
 * @returns A handle that can abort the request.
 */
export function streamDialog(url: string, body: Record<string, unknown>, options: DialogOptions): DialogStream {
  const controller = new AbortController();
  const accumulator = createStreamAccumulator();

  const run = async (): Promise<void> => {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'content-type': 'application/json', accept: 'text/event-stream' },
      body: JSON.stringify(body),
      signal: controller.signal,
    });
    // A non-2xx response body is an error page, not a stream; reading it as one would
    // silently render nothing, which is what the previous implementation did.
    if (!response.ok) throw new Error(`dialog failed: ${response.status} ${response.statusText}`);
    if (response.body === null) throw new Error('dialog failed: response carried no body');
    options.onMode?.(response.headers.get('x-im-mode') === 'live' ? 'live' : 'demo');

    for await (const chunk of mapEventStream(response.body, toStreamChunks)) {
      accumulator.push(chunk);
      options.onUpdate(accumulator.snapshot());
    }
  };

  run().then(
    () => options.onEnd?.(accumulator.snapshot()),
    (error: unknown) => {
      // An abort is this client's own doing, not a failure to report.
      if (controller.signal.aborted) options.onEnd?.(accumulator.snapshot());
      else options.onEnd?.(accumulator.snapshot(), error instanceof Error ? error : new Error(String(error)));
    },
  );

  return {
    close: () => {
      controller.abort();
    },
  };
}
