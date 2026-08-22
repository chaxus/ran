import { describe, expect, it } from 'vitest';
import { KEEP_RECENT, contextTokens, decideBudget, messageTokens, safeBoundary } from '@/client/budget';
import type { StoredMessage } from '@/client/chat-types';

/**
 * Builds a user message of a given size.
 *
 * @param chars How many Latin characters it carries.
 * @returns The message.
 */
function user(chars: number): StoredMessage {
  return { role: 'user', content: 'a'.repeat(chars) };
}

describe('messageTokens', () => {
  it('charges the envelope as well as the text', () => {
    // A hundred short turns are not free, and counting only the text says they are.
    expect(messageTokens(user(0))).toBeGreaterThan(0);
  });

  it('charges an image a flat figure rather than pretending it is text', () => {
    const withImage: StoredMessage = {
      role: 'user',
      content: [{ type: 'image_url', image_url: { url: 'data:image/png;base64,AAAA' } }],
    };
    // The real cost depends on the model's tiling of the image's dimensions, which a data
    // URL does not reveal without decoding it. High enough that screenshots compact early.
    expect(messageTokens(withImage)).toBeGreaterThan(500);
  });

  it('charges the arguments the model wrote, which travel back on every later request', () => {
    const bare: StoredMessage = { role: 'assistant', content: '' };
    const calling: StoredMessage = {
      role: 'assistant',
      content: '',
      tool_calls: [{ id: 'c', type: 'function', function: { name: 'fetch_url', arguments: 'x'.repeat(400) } }],
    };
    expect(messageTokens(calling) - messageTokens(bare)).toBeGreaterThan(100);
  });
});

describe('safeBoundary', () => {
  const exchange: StoredMessage[] = [
    { role: 'user', content: 'q' },
    {
      role: 'assistant',
      content: '',
      tool_calls: [{ id: 'c1', type: 'function', function: { name: 'f', arguments: '{}' } }],
    },
    { role: 'tool', content: 'r', tool_call_id: 'c1', name: 'f' },
    { role: 'assistant', content: 'a' },
  ];

  it('moves a cut that would orphan a tool result forward, past it', () => {
    // A provider rejects a role:'tool' message whose id names no call in the message before
    // it, so a history starting at index 2 cannot be sent at all.
    expect(safeBoundary(exchange, 2)).toBe(3);
  });

  it('moves forward rather than back, so compaction makes progress', () => {
    // Moving back would keep the assistant message and drop nothing, which is how a
    // compaction loop runs every turn and never shrinks anything.
    expect(safeBoundary(exchange, 2)).toBeGreaterThan(2);
  });

  it('leaves a cut that already lands on a sendable message', () => {
    expect(safeBoundary(exchange, 1)).toBe(1);
    expect(safeBoundary(exchange, 3)).toBe(3);
  });

  it('never runs past the end of the history', () => {
    expect(safeBoundary(exchange, 99)).toBe(exchange.length);
    expect(safeBoundary([], 3)).toBe(0);
  });
});

describe('decideBudget', () => {
  it('compacts nothing when no limit has been reported', () => {
    // Acting on an invented window would drop a conversation nobody needed to lose.
    const messages = Array.from({ length: 40 }, () => user(4000));
    expect(decideBudget(messages, 0)).toMatchObject({ compact: 0, fits: true });
    expect(decideBudget(messages, 0).used).toBeGreaterThan(30_000);
  });

  it('leaves a conversation that fits alone', () => {
    expect(decideBudget([user(40), user(40)], 10_000)).toMatchObject({ compact: 0, fits: true });
  });

  it('compacts a conversation that no longer fits', () => {
    const messages = Array.from({ length: 30 }, () => user(4000));
    const decision = decideBudget(messages, 8000);
    expect(decision.compact).toBeGreaterThan(0);
    expect(decision.projected).toBeLessThan(decision.used);
  });

  it('protects the recent turns whatever the pressure', () => {
    const messages = Array.from({ length: 30 }, () => user(4000));
    // Summarizing the turns the conversation is currently about is how a client starts
    // answering a question nobody asked.
    expect(decideBudget(messages, 100).compact).toBeLessThanOrEqual(messages.length - KEEP_RECENT);
  });

  it('reports that it cannot fit rather than compacting the recent turns anyway', () => {
    const decision = decideBudget([user(400_000)], 1000);
    expect(decision).toMatchObject({ compact: 0, fits: false });
  });

  it('agrees with contextTokens about what the history costs', () => {
    const messages = [user(100), user(200)];
    expect(decideBudget(messages, 10_000).used).toBe(contextTokens(messages));
  });
});
