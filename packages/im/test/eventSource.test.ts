import { describe, expect, it } from 'vitest';
import { toStreamChunks } from '@/client/lib/eventSource';

/**
 * Wraps a wire payload the way the server sends it.
 *
 * @param payload The chunk body.
 * @returns A parsed Server-Sent Event carrying it.
 */
function event(payload: unknown): { data: string } {
  return { data: typeof payload === 'string' ? payload : JSON.stringify(payload) };
}

describe('toStreamChunks — the OpenAI-compatible mapping', () => {
  it('maps a content delta onto a text delta', () => {
    expect(toStreamChunks(event({ choices: [{ index: 0, delta: { content: '春' } }] }))).toEqual([
      { type: 'text-delta', index: 0, text: '春' },
    ]);
  });

  it('keeps reasoning separate from the answer', () => {
    expect(toStreamChunks(event({ choices: [{ index: 0, delta: { reasoning_content: 'thinking' } }] }))).toEqual([
      { type: 'reasoning-delta', index: 0, text: 'thinking' },
    ]);
  });

  it('emits both when one event carries reasoning and content', () => {
    const chunks = toStreamChunks(event({ choices: [{ delta: { reasoning_content: 'why', content: 'because' } }] }));
    expect(chunks).toEqual([
      { type: 'reasoning-delta', index: 0, text: 'why' },
      { type: 'text-delta', index: 0, text: 'because' },
    ]);
  });

  it('defaults a missing choice index to 0', () => {
    expect(toStreamChunks(event({ choices: [{ delta: { content: 'x' } }] }))[0]).toMatchObject({ index: 0 });
  });

  it('keeps concurrent choices on their own index', () => {
    const chunks = toStreamChunks(
      event({
        choices: [
          { index: 0, delta: { content: 'a' } },
          { index: 1, delta: { content: 'b' } },
        ],
      }),
    );
    expect(chunks).toEqual([
      { type: 'text-delta', index: 0, text: 'a' },
      { type: 'text-delta', index: 1, text: 'b' },
    ]);
  });

  it('ignores an empty delta, which is what a keep-alive chunk carries', () => {
    expect(toStreamChunks(event({ choices: [{ index: 0, delta: {} }] }))).toEqual([]);
  });

  it('translates every finish reason it knows, and falls back to stop', () => {
    const reasonOf = (finish_reason: string): unknown =>
      toStreamChunks(event({ choices: [{ delta: {}, finish_reason }] }))[0];
    expect(reasonOf('stop')).toEqual({ type: 'finish', reason: 'stop' });
    expect(reasonOf('length')).toEqual({ type: 'finish', reason: 'length' });
    expect(reasonOf('tool_calls')).toEqual({ type: 'finish', reason: 'tool-calls' });
    expect(reasonOf('content_filter')).toEqual({ type: 'finish', reason: 'content-filter' });
    expect(reasonOf('something_new')).toEqual({ type: 'finish', reason: 'stop' });
  });

  it('ignores a null finish_reason, which every non-final chunk carries', () => {
    expect(toStreamChunks(event({ choices: [{ delta: { content: 'x' }, finish_reason: null }] }))).toEqual([
      { type: 'text-delta', index: 0, text: 'x' },
    ]);
  });

  it('renames usage onto the neutral field names', () => {
    expect(toStreamChunks(event({ usage: { prompt_tokens: 7, completion_tokens: 11, total_tokens: 18 } }))).toEqual([
      { type: 'usage', usage: { inputTokens: 7, outputTokens: 11, totalTokens: 18 } },
    ]);
  });

  it('puts usage before finish when one event carries both', () => {
    const chunks = toStreamChunks(
      event({ choices: [{ delta: {}, finish_reason: 'stop' }], usage: { completion_tokens: 3 } }),
    );
    expect(chunks.map((chunk) => chunk.type)).toEqual(['usage', 'finish']);
  });

  it('drops the [DONE] sentinel rather than mapping it', () => {
    expect(toStreamChunks(event('[DONE]'))).toEqual([]);
  });

  it('drops an empty event', () => {
    expect(toStreamChunks({ data: '' })).toEqual([]);
  });

  it('drops an unparseable payload instead of taking the stream down', () => {
    expect(toStreamChunks({ data: '{"choices":' })).toEqual([]);
    expect(toStreamChunks({ data: 'ping' })).toEqual([]);
  });

  it('tolerates a chunk with no choices at all', () => {
    expect(toStreamChunks(event({ id: 'x', object: 'chat.completion.chunk' }))).toEqual([]);
  });
});

describe('toStreamChunks — failures the provider reports mid-stream', () => {
  it('throws with the provider message rather than folding an empty answer', () => {
    expect(() => toStreamChunks(event({ error: { status: 401, message: 'invalid api key' } }))).toThrow(
      'invalid api key (401)',
    );
  });

  it('omits a status it does not have', () => {
    expect(() => toStreamChunks(event({ error: { message: 'upstream unreachable' } }))).toThrow(
      /^upstream unreachable$/,
    );
    expect(() => toStreamChunks(event({ error: { status: 0, message: 'upstream unreachable' } }))).toThrow(
      /^upstream unreachable$/,
    );
  });

  it('still reports something when the error carries no message', () => {
    expect(() => toStreamChunks(event({ error: {} }))).toThrow(/rejected the request/);
  });
});
