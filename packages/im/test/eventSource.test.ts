import { describe, expect, it } from 'vitest';
import { createChunkMapper } from '@/client/lib/eventSource';

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
    // A block index is allocated on first sight, so the first block a response opens is 0
    // whatever it holds. What the number must never do is collide with another block.
    expect(createChunkMapper()(event({ choices: [{ index: 0, delta: { content: '春' } }] }))).toEqual([
      { type: 'text-delta', index: 0, text: '春' },
    ]);
  });

  it('keeps reasoning separate from the answer', () => {
    expect(createChunkMapper()(event({ choices: [{ index: 0, delta: { reasoning_content: 'thinking' } }] }))).toEqual([
      { type: 'reasoning-delta', index: 0, text: 'thinking' },
    ]);
  });

  it('emits both when one event carries reasoning and content', () => {
    const chunks = createChunkMapper()(
      event({ choices: [{ delta: { reasoning_content: 'why', content: 'because' } }] }),
    );
    expect(chunks).toEqual([
      { type: 'reasoning-delta', index: 0, text: 'why' },
      { type: 'text-delta', index: 1, text: 'because' },
    ]);
  });

  it('defaults a missing choice index to 0', () => {
    const mapper = createChunkMapper();
    mapper(event({ choices: [{ index: 0, delta: { content: 'a' } }] }));
    // The same choice named implicitly must reach the block already open for it, not a new one.
    expect(mapper(event({ choices: [{ delta: { content: 'b' } }] }))[0]).toMatchObject({ index: 0 });
  });

  it('keeps concurrent choices on their own index', () => {
    const chunks = createChunkMapper()(
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
    expect(createChunkMapper()(event({ choices: [{ index: 0, delta: {} }] }))).toEqual([]);
  });

  it('separates reasoning and answer into different block indices', () => {
    // `choices[].index` numbers the choice, not the block. Sharing one index makes the
    // accumulator read the first content delta as the choice changing type and throw the
    // reasoning away — which is what a real reasoning model produced before this.
    const mapper = createChunkMapper();
    expect(mapper(event({ choices: [{ index: 0, delta: { reasoning_content: 'think' } }] }))).toEqual([
      { type: 'reasoning-delta', index: 0, text: 'think' },
    ]);
    expect(mapper(event({ choices: [{ index: 0, delta: { content: 'said' } }] }))).toEqual([
      { type: 'text-delta', index: 1, text: 'said' },
    ]);
  });

  it("keeps a second choice out of the first choice's blocks", () => {
    const chunks = createChunkMapper()(
      event({
        choices: [
          { index: 0, delta: { content: 'a' } },
          { index: 1, delta: { reasoning_content: 'b' } },
        ],
      }),
    );
    expect(chunks).toEqual([
      { type: 'text-delta', index: 0, text: 'a' },
      { type: 'reasoning-delta', index: 1, text: 'b' },
    ]);
  });

  it('ignores a null content, which a reasoning model sends on every thinking delta', () => {
    // Null is not absent. Treating it as a value concatenated the string "null" into the
    // answer, once per reasoning delta, ahead of the real text.
    expect(createChunkMapper()(event({ choices: [{ delta: { content: null, reasoning_content: 'why' } }] }))).toEqual([
      { type: 'reasoning-delta', index: 0, text: 'why' },
    ]);
    expect(createChunkMapper()(event({ choices: [{ delta: { content: 'x', reasoning_content: null } }] }))).toEqual([
      { type: 'text-delta', index: 0, text: 'x' },
    ]);
  });

  it('maps a tool call onto tool-call deltas', () => {
    const mapper = createChunkMapper();
    expect(
      mapper(
        event({
          choices: [
            {
              index: 0,
              delta: { tool_calls: [{ index: 0, id: 'call_1', function: { name: 'get_time', arguments: '' } }] },
            },
          ],
        }),
      ),
    ).toEqual([{ type: 'tool-call-delta', index: 0, id: 'call_1', name: 'get_time', argumentsDelta: '' }]);
    // Later deltas carry only argument text. An empty id and an absent name are how the
    // accumulator is told to keep the identity it already has.
    expect(
      mapper(
        event({ choices: [{ index: 0, delta: { tool_calls: [{ index: 0, function: { arguments: '{"tz":' } }] } }] }),
      ),
    ).toEqual([{ type: 'tool-call-delta', index: 0, id: '', name: undefined, argumentsDelta: '{"tz":' }]);
  });

  it('keeps two concurrent tool calls in separate blocks', () => {
    const chunks = createChunkMapper()(
      event({
        choices: [
          {
            index: 0,
            delta: {
              tool_calls: [
                { index: 0, id: 'a', function: { name: 'one', arguments: '{}' } },
                { index: 1, id: 'b', function: { name: 'two', arguments: '{}' } },
              ],
            },
          },
        ],
      }),
    );
    expect(chunks.map((chunk) => (chunk as { index: number }).index)).toEqual([0, 1]);
  });

  it('keeps a tool call out of the text block of the same choice', () => {
    // The accumulator keys blocks by index and reads a second kind on one index as the block
    // changing type, discarding what it held. A model that narrates before calling a tool
    // sends exactly this sequence.
    const mapper = createChunkMapper();
    mapper(event({ choices: [{ index: 0, delta: { content: 'let me check' } }] }));
    const call = mapper(
      event({ choices: [{ index: 0, delta: { tool_calls: [{ index: 0, id: 'c', function: { name: 'f' } }] } }] }),
    );
    expect(call[0]).toMatchObject({ type: 'tool-call-delta', index: 1 });
  });

  it('translates every finish reason it knows, and falls back to stop', () => {
    const reasonOf = (finish_reason: string): unknown =>
      createChunkMapper()(event({ choices: [{ delta: {}, finish_reason }] }))[0];
    expect(reasonOf('stop')).toEqual({ type: 'finish', reason: 'stop' });
    expect(reasonOf('length')).toEqual({ type: 'finish', reason: 'length' });
    expect(reasonOf('tool_calls')).toEqual({ type: 'finish', reason: 'tool-calls' });
    expect(reasonOf('content_filter')).toEqual({ type: 'finish', reason: 'content-filter' });
    expect(reasonOf('something_new')).toEqual({ type: 'finish', reason: 'stop' });
  });

  it('ignores a null finish_reason, which every non-final chunk carries', () => {
    expect(createChunkMapper()(event({ choices: [{ delta: { content: 'x' }, finish_reason: null }] }))).toEqual([
      { type: 'text-delta', index: 0, text: 'x' },
    ]);
  });

  it('renames usage onto the neutral field names', () => {
    expect(
      createChunkMapper()(event({ usage: { prompt_tokens: 7, completion_tokens: 11, total_tokens: 18 } })),
    ).toEqual([{ type: 'usage', usage: { inputTokens: 7, outputTokens: 11, totalTokens: 18 } }]);
  });

  it('ignores a null usage, which every chunk but the last carries', () => {
    // DeepSeek and OpenAI report "no counts yet" as `null`, not by omitting the field.
    // Testing only the omitted case is how this reached a real provider and threw.
    expect(createChunkMapper()(event({ choices: [{ delta: { content: 'x' } }], usage: null }))).toEqual([
      { type: 'text-delta', index: 0, text: 'x' },
    ]);
  });

  it('puts usage before finish when one event carries both', () => {
    const chunks = createChunkMapper()(
      event({ choices: [{ delta: {}, finish_reason: 'stop' }], usage: { completion_tokens: 3 } }),
    );
    expect(chunks.map((chunk) => chunk.type)).toEqual(['usage', 'finish']);
  });

  it('drops the [DONE] sentinel rather than mapping it', () => {
    expect(createChunkMapper()(event('[DONE]'))).toEqual([]);
  });

  it('drops an empty event', () => {
    expect(createChunkMapper()({ data: '' })).toEqual([]);
  });

  it('drops an unparseable payload instead of taking the stream down', () => {
    expect(createChunkMapper()({ data: '{"choices":' })).toEqual([]);
    expect(createChunkMapper()({ data: 'ping' })).toEqual([]);
  });

  it('tolerates a chunk with no choices at all', () => {
    expect(createChunkMapper()(event({ id: 'x', object: 'chat.completion.chunk' }))).toEqual([]);
  });
});

describe('toStreamChunks — failures the provider reports mid-stream', () => {
  it('throws with the provider message rather than folding an empty answer', () => {
    expect(() => createChunkMapper()(event({ error: { status: 401, message: 'invalid api key' } }))).toThrow(
      'invalid api key (401)',
    );
  });

  it('omits a status it does not have', () => {
    expect(() => createChunkMapper()(event({ error: { message: 'upstream unreachable' } }))).toThrow(
      /^upstream unreachable$/,
    );
    expect(() => createChunkMapper()(event({ error: { status: 0, message: 'upstream unreachable' } }))).toThrow(
      /^upstream unreachable$/,
    );
  });

  it('still reports something when the error carries no message', () => {
    expect(() => createChunkMapper()(event({ error: {} }))).toThrow(/rejected the request/);
  });
});
