import { describe, expect, it } from 'vitest';
import { createConversationEngine } from 'ranuts/conversation';
import { createStreamAccumulator } from 'ranuts/stream';
import { NOTHING_EMITTED, eventsFromSnapshot, reasoningView, toolView, turnView } from '@/client/chat';
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
    definitions: [turnView, reasoningView, toolView],
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
  let emitted: EmittedSoFar = NOTHING_EMITTED;
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

  it('opens a tool card on the name, not on the first byte of arguments', () => {
    // The name arrives with the first delta and the arguments take as long as the model
    // takes to write JSON. Opening on the block would put a card titled with an empty string
    // on screen for that whole time.
    const events = eventsFor('t1', [
      { type: 'tool-call-delta', index: 0, id: 'c1', name: 'get_current_time', argumentsDelta: '' },
      { type: 'tool-call-delta', index: 0, id: '', argumentsDelta: '{"tz"' },
      { type: 'tool-call-delta', index: 0, id: '', argumentsDelta: ':"UTC"}' },
    ]);
    expect(events).toEqual([
      { type: 'tool/start', id: 't1-tool-0', name: 'get_current_time' },
      { type: 'tool/args', id: 't1-tool-0', args: '{"tz"' },
      { type: 'tool/args', id: 't1-tool-0', args: '{"tz":"UTC"}' },
    ]);
  });

  it('emits nothing for a call whose name has not arrived', () => {
    expect(eventsFor('t1', [{ type: 'tool-call-delta', index: 0, id: 'c1', argumentsDelta: '{' }])).toEqual([]);
  });

  it("gives each of a turn's calls its own node", () => {
    const events = eventsFor('t1', [
      { type: 'tool-call-delta', index: 0, id: 'a', name: 'one', argumentsDelta: '{}' },
      { type: 'tool-call-delta', index: 1, id: 'b', name: 'two', argumentsDelta: '{}' },
    ]);
    expect(events.filter((event) => event.type === 'tool/start')).toEqual([
      { type: 'tool/start', id: 't1-tool-0', name: 'one' },
      { type: 'tool/start', id: 't1-tool-1', name: 'two' },
    ]);
  });

  it('puts a tool card after the text the model wrote before calling it', () => {
    const nodes = project([
      ...eventsFor('t1', [
        { type: 'text-delta', index: 0, text: '我来查一下' },
        { type: 'tool-call-delta', index: 1, id: 'a', name: 'get_current_time', argumentsDelta: '{}' },
      ]),
      { type: 'tool/result', id: 't1-tool-0', output: '16:20', failed: false },
    ]);
    expect(nodes.map((node) => node.kind)).toEqual(['turn', 'tool']);
    expect(nodes[1].state).toMatchObject({ name: 'get_current_time', output: '16:20', failed: false });
  });

  it('keeps a call running until its result arrives', () => {
    const [card] = project(
      eventsFor('t1', [{ type: 'tool-call-delta', index: 0, id: 'a', name: 'x', argumentsDelta: '' }]),
    );
    // A card with no result is a call still in flight — which is also what a conversation cut
    // off mid-run comes back as, because that is what happened.
    expect(card.state).toMatchObject({ output: null });
  });

  it('emits nothing for a snapshot that has not grown', () => {
    const accumulator = createStreamAccumulator();
    accumulator.push({ type: 'text-delta', index: 1, text: 'x' });
    const first = eventsFromSnapshot('t1', accumulator.snapshot(), NOTHING_EMITTED);
    const second = eventsFromSnapshot('t1', accumulator.snapshot(), first.emitted);

    expect(first.events).toHaveLength(2);
    expect(second.events).toEqual([]);
  });
});
