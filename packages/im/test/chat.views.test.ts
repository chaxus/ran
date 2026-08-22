import { describe, expect, it } from 'vitest';
import { createConversationEngine } from 'ranuts/conversation';
import { createStreamAccumulator } from 'ranuts/stream';
import { eventsFromSnapshot, reasoningView, turnView } from '@/client/chat';
import type { ChatEvent, EmittedSoFar } from '@/client/chat';

/**
 * Runs the two views through the real projection.
 *
 * `mount` and `patch` need a DOM and are not exercised here; everything that decides what
 * exists and in what order is in `match` / `start` / `update`, which do not.
 *
 * @param events The conversation events to project.
 * @returns The resulting nodes, in render order.
 */
function project(events: ChatEvent[]): { key: string; kind: string; state: unknown }[] {
  const engine = createConversationEngine<ChatEvent>({
    definitions: [turnView, reasoningView],
    // Publish synchronously so a test does not have to wait for a frame that never comes.
    scheduler: (run) => {
      run();
      return () => {};
    },
  });
  for (const event of events) engine.push(event);
  return engine.nodes().map((node) => ({ key: node.key, kind: node.kind, state: node.state }));
}

/**
 * Turns a whole response into conversation events, the way the client does.
 *
 * @param id The turn id.
 * @param chunks Stream chunks, in arrival order.
 * @returns Every event the client would have pushed.
 */
function eventsFor(
  id: string,
  chunks: Parameters<ReturnType<typeof createStreamAccumulator>['push']>[0][],
): ChatEvent[] {
  const accumulator = createStreamAccumulator();
  let emitted: EmittedSoFar = { text: 0, reasoning: 0 };
  const events: ChatEvent[] = [];
  for (const chunk of chunks) {
    accumulator.push(chunk);
    const next = eventsFromSnapshot(id, accumulator.snapshot(), emitted);
    emitted = next.emitted;
    events.push(...next.events);
  }
  return events;
}

describe('the conversation the views build', () => {
  it('puts reasoning above the answer it belongs to', () => {
    // Nodes are ordered by the event that opened them and reasoning arrives first, so this
    // holds with no ordering logic anywhere — which is the whole reason the two are
    // separate definitions rather than branches in one.
    const events = eventsFor('t1', [
      { type: 'reasoning-delta', index: 0, text: '想一下' },
      { type: 'reasoning-delta', index: 0, text: '……' },
      { type: 'text-delta', index: 1, text: '9.8 大。' },
    ]);
    const nodes = project([{ type: 'turn/start', id: 't1-user', role: 'user', text: '哪个大' }, ...events]);

    expect(nodes.map((n) => n.key)).toEqual(['turn:t1-user', 'reasoning:t1', 'turn:t1']);
  });

  it('leaves no empty reasoning block for a model that reports none', () => {
    const events = eventsFor('t1', [{ type: 'text-delta', index: 1, text: '你好' }]);
    const nodes = project(events);

    expect(nodes.map((n) => n.kind)).toEqual(['turn']);
    expect(nodes[0].state).toMatchObject({ role: 'assistant', text: '你好' });
  });

  it('accumulates deltas into one row rather than one row per delta', () => {
    const events = eventsFor('t1', [
      { type: 'text-delta', index: 1, text: '春' },
      { type: 'text-delta', index: 1, text: '江' },
      { type: 'text-delta', index: 1, text: '花月夜' },
    ]);
    const nodes = project(events);

    expect(nodes).toHaveLength(1);
    expect(nodes[0].state).toMatchObject({ text: '春江花月夜' });
  });

  it('stops streaming on both rows when the turn ends', () => {
    const events = eventsFor('t1', [
      { type: 'reasoning-delta', index: 0, text: '嗯' },
      { type: 'text-delta', index: 1, text: '好' },
    ]);
    const nodes = project([...events, { type: 'turn/end', id: 't1' }]);

    for (const node of nodes) expect(node.state).toMatchObject({ streaming: false });
  });

  it('carries a failure onto the row so it is not a request that produced nothing', () => {
    const nodes = project([
      { type: 'turn/start', id: 't1', role: 'assistant', text: '' },
      { type: 'turn/error', id: 't1', message: 'invalid api key (401)' },
    ]);

    expect(nodes[0].state).toMatchObject({ streaming: false, error: 'invalid api key (401)' });
  });

  it('emits nothing for a snapshot that has not grown', () => {
    const accumulator = createStreamAccumulator();
    accumulator.push({ type: 'text-delta', index: 1, text: 'x' });
    const first = eventsFromSnapshot('t1', accumulator.snapshot(), { text: 0, reasoning: 0 });
    const second = eventsFromSnapshot('t1', accumulator.snapshot(), first.emitted);

    expect(first.events).toHaveLength(2);
    expect(second.events).toEqual([]);
  });
});
