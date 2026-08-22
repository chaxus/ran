import { describe, expect, it, vi } from 'vitest';
import { createConversationEngine } from '@/conversation/index.ts';
import type {
  ConversationEngine,
  ConversationNode,
  ConversationNodeDefinition,
  FrameScheduler,
} from '@/conversation/index.ts';

/** A log event shaped like something a chat backend would actually emit. */
type Event =
  | { type: 'message/start'; id: string; role: 'user' | 'assistant' }
  | { type: 'message/delta'; id: string; text: string }
  | { type: 'message/end'; id: string }
  | { type: 'tool/call'; id: string; name: string }
  | { type: 'tool/result'; id: string; output: string }
  | { type: 'noise' };

interface MessageState {
  role: 'user' | 'assistant';
  text: string;
  streaming: boolean;
  /** Set from the reader at start, to prove backward lookup works. */
  previousMessageId: string | undefined;
}

interface ToolState {
  name: string;
  output: string | null;
}

const message: ConversationNodeDefinition<Event, MessageState> = {
  kind: 'message',
  match(event) {
    if (event.type === 'message/start') return { id: event.id, role: 'start' };
    if (event.type === 'message/delta' || event.type === 'message/end') return { id: event.id, role: 'update' };
    return null;
  },
  start(event, reader) {
    const previous = reader.previous<MessageState>('message');
    return {
      role: event.type === 'message/start' ? event.role : 'assistant',
      text: '',
      streaming: true,
      previousMessageId: previous?.id,
    };
  },
  update(state, event) {
    if (event.type === 'message/delta') return { ...state, text: state.text + event.text };
    if (event.type === 'message/end') return { ...state, streaming: false };
    return state;
  },
  publication(event) {
    // Per-token deltas coalesce to a frame; opening and closing are discrete facts.
    return event.type === 'message/delta' ? 'animation-frame' : 'immediate';
  },
};

const tool: ConversationNodeDefinition<Event, ToolState> = {
  kind: 'tool',
  match(event) {
    if (event.type === 'tool/call') return { id: event.id, role: 'start' };
    if (event.type === 'tool/result') return { id: event.id, role: 'update' };
    return null;
  },
  start(event) {
    return { name: event.type === 'tool/call' ? event.name : '', output: null };
  },
  update(state, event) {
    return event.type === 'tool/result' ? { ...state, output: event.output } : state;
  },
};

/** A scheduler whose frames only run when a test says so. */
function manualScheduler(): { scheduler: FrameScheduler; flush: () => void; pending: () => number } {
  let queue: (() => void)[] = [];
  return {
    scheduler: (run) => {
      queue.push(run);
      return () => {
        queue = queue.filter((entry) => entry !== run);
      };
    },
    flush: () => {
      const due = queue;
      queue = [];
      for (const run of due) run();
    },
    pending: () => queue.length,
  };
}

/**
 * Builds an engine with both definitions and a manual scheduler.
 *
 * @returns The engine, the scheduler controls, and a subscriber spy.
 */
function setup() {
  const { scheduler, flush, pending } = manualScheduler();
  const engine = createConversationEngine<Event>({
    definitions: [message, tool],
    scheduler,
  });
  const listener = vi.fn();
  engine.subscribe(listener);
  return { engine, flush, pending, listener };
}

/**
 * Reads one node's state.
 *
 * @param nodes Nodes to search.
 * @param key The node key.
 * @returns Its state, typed by the caller.
 */
function stateOf<State>(nodes: readonly ConversationNode[], key: string): State {
  const node = nodes.find((entry) => entry.key === key);
  if (node === undefined) throw new Error(`no node ${key}`);
  return node.state as State;
}

describe('createConversationEngine', () => {
  it('rejects two definitions claiming the same kind', () => {
    expect(() => createConversationEngine<Event>({ definitions: [message, message] })).toThrow(
      /duplicate definition kind "message"/,
    );
  });

  it('ignores an event no definition claims', () => {
    const { engine, listener } = setup();
    engine.push({ type: 'noise' });
    expect(engine.nodes()).toEqual([]);
    expect(listener).not.toHaveBeenCalled();
  });

  it('opens a node on a start claim and folds updates into it', () => {
    const { engine, flush } = setup();
    engine.push({ type: 'message/start', id: 'm1', role: 'assistant' });
    engine.push({ type: 'message/delta', id: 'm1', text: 'he' });
    engine.push({ type: 'message/delta', id: 'm1', text: 'llo' });
    flush();
    expect(engine.nodes()).toHaveLength(1);
    expect(stateOf<MessageState>(engine.nodes(), 'message:m1').text).toBe('hello');
  });

  it('drops an update whose start it never saw', () => {
    const { engine, listener } = setup();
    engine.push({ type: 'message/delta', id: 'ghost', text: 'x' });
    expect(engine.nodes()).toEqual([]);
    expect(listener).not.toHaveBeenCalled();
  });

  it('keeps a streaming node in the place it opened', () => {
    const { engine, flush } = setup();
    engine.push({ type: 'message/start', id: 'm1', role: 'assistant' });
    engine.push({ type: 'tool/call', id: 't1', name: 'search' });
    engine.push({ type: 'message/delta', id: 'm1', text: 'still first' });
    flush();
    expect(engine.nodes().map((node) => node.key)).toEqual(['message:m1', 'tool:t1']);
  });

  it('namespaces ids by kind, so two definitions may use the same id', () => {
    const { engine } = setup();
    engine.push({ type: 'message/start', id: 'x', role: 'user' });
    engine.push({ type: 'tool/call', id: 'x', name: 'search' });
    expect(engine.nodes().map((node) => node.key)).toEqual(['message:x', 'tool:x']);
  });

  it('gives start a strictly-backward view of open nodes', () => {
    const { engine } = setup();
    engine.push({ type: 'message/start', id: 'm1', role: 'user' });
    engine.push({ type: 'message/start', id: 'm2', role: 'assistant' });
    expect(stateOf<MessageState>(engine.nodes(), 'message:m1').previousMessageId).toBeUndefined();
    expect(stateOf<MessageState>(engine.nodes(), 'message:m2').previousMessageId).toBe('m1');
  });

  it('re-opens a node on a repeated start, keeping its position', () => {
    const { engine, flush } = setup();
    engine.push({ type: 'message/start', id: 'm1', role: 'assistant' });
    engine.push({ type: 'message/delta', id: 'm1', text: 'old' });
    engine.push({ type: 'tool/call', id: 't1', name: 'search' });
    engine.push({ type: 'message/start', id: 'm1', role: 'assistant' });
    flush();
    expect(engine.nodes().map((node) => node.key)).toEqual(['message:m1', 'tool:t1']);
    expect(stateOf<MessageState>(engine.nodes(), 'message:m1').text).toBe('');
  });

  it('offers each event to every definition, not just the first that claims it', () => {
    const also: ConversationNodeDefinition<Event, number> = {
      kind: 'counter',
      match: (event) => (event.type === 'message/start' ? { id: 'all', role: 'start' } : null),
      start: () => 1,
      update: (state) => state + 1,
    };
    const engine = createConversationEngine<Event>({
      definitions: [message, also],
    });
    engine.push({ type: 'message/start', id: 'm1', role: 'user' });
    expect(engine.nodes().map((node) => node.kind)).toEqual(['message', 'counter']);
  });
});

describe('conversation publication cadence', () => {
  it('notifies immediately for a discrete event', () => {
    const { engine, listener, pending } = setup();
    engine.push({ type: 'message/start', id: 'm1', role: 'assistant' });
    expect(listener).toHaveBeenCalledTimes(1);
    expect(pending()).toBe(0);
  });

  it('coalesces a burst of deltas into one notification per frame', () => {
    const { engine, listener, flush, pending } = setup();
    engine.push({ type: 'message/start', id: 'm1', role: 'assistant' });
    listener.mockClear();

    for (const text of ['a', 'b', 'c', 'd']) engine.push({ type: 'message/delta', id: 'm1', text });
    expect(listener).not.toHaveBeenCalled();
    expect(pending()).toBe(1);

    flush();
    expect(listener).toHaveBeenCalledTimes(1);
    expect(stateOf<MessageState>(listener.mock.calls[0][0], 'message:m1').text).toBe('abcd');
  });

  it('lets an immediate publication pre-empt a pending frame instead of firing twice', () => {
    const { engine, listener, flush, pending } = setup();
    engine.push({ type: 'message/start', id: 'm1', role: 'assistant' });
    listener.mockClear();

    engine.push({ type: 'message/delta', id: 'm1', text: 'partial' });
    expect(pending()).toBe(1);
    engine.push({ type: 'message/end', id: 'm1' });

    expect(listener).toHaveBeenCalledTimes(1);
    expect(pending()).toBe(0);
    const state = stateOf<MessageState>(listener.mock.calls[0][0], 'message:m1');
    expect(state).toEqual({ role: 'assistant', text: 'partial', streaming: false, previousMessageId: undefined });

    flush();
    expect(listener).toHaveBeenCalledTimes(1);
  });

  it('records a none-cadence event without waking the view', () => {
    const quiet: ConversationNodeDefinition<Event, string> = {
      kind: 'quiet',
      match: (event) => (event.type === 'tool/call' ? { id: event.id, role: 'start' } : null),
      start: (event) => (event.type === 'tool/call' ? event.name : ''),
      update: (state) => state,
      publication: () => 'none',
    };
    const engine = createConversationEngine<Event>({ definitions: [quiet] });
    const listener = vi.fn();
    engine.subscribe(listener);
    engine.push({ type: 'tool/call', id: 't1', name: 'search' });
    expect(listener).not.toHaveBeenCalled();
    expect(engine.nodes()).toHaveLength(1);
  });
});

describe('conversation engine lifecycle', () => {
  it('returns a stable snapshot until the next accepted event', () => {
    const { engine } = setup();
    engine.push({ type: 'message/start', id: 'm1', role: 'user' });
    const first = engine.nodes();
    expect(engine.nodes()).toBe(first);
    engine.push({ type: 'message/delta', id: 'm1', text: 'x' });
    expect(engine.nodes()).not.toBe(first);
  });

  it('hands out nodes a later event cannot mutate', () => {
    const { engine, flush } = setup();
    engine.push({ type: 'message/start', id: 'm1', role: 'assistant' });
    const before = stateOf<MessageState>(engine.nodes(), 'message:m1');
    engine.push({ type: 'message/delta', id: 'm1', text: 'later' });
    flush();
    expect(before.text).toBe('');
    expect(stateOf<MessageState>(engine.nodes(), 'message:m1').text).toBe('later');
  });

  it('stops delivering to a removed subscriber', () => {
    const { engine } = setup();
    const listener = vi.fn();
    const unsubscribe = engine.subscribe(listener);
    unsubscribe();
    engine.push({ type: 'message/start', id: 'm1', role: 'user' });
    expect(listener).not.toHaveBeenCalled();
  });

  it('survives a subscriber that unsubscribes while being notified', () => {
    const { engine } = setup();
    const second = vi.fn();
    const unsubscribeSecond = engine.subscribe(second);
    const first = vi.fn(() => {
      unsubscribeSecond();
    });
    engine.subscribe(first);

    engine.push({ type: 'message/start', id: 'm1', role: 'user' });
    // The removal takes effect for the next publication, not by skipping a subscriber
    // that was already registered when this one began.
    expect(first).toHaveBeenCalledTimes(1);
    expect(second).toHaveBeenCalledTimes(1);

    engine.push({ type: 'message/start', id: 'm2', role: 'user' });
    expect(first).toHaveBeenCalledTimes(2);
    expect(second).toHaveBeenCalledTimes(1);
  });

  it('clears nodes on reset and notifies once', () => {
    const { engine, listener } = setup();
    engine.push({ type: 'message/start', id: 'm1', role: 'user' });
    listener.mockClear();
    engine.reset();
    expect(engine.nodes()).toEqual([]);
    expect(listener).toHaveBeenCalledExactlyOnceWith([]);
  });

  it('cancels a pending frame on reset', () => {
    const { engine, flush, listener, pending } = setup();
    engine.push({ type: 'message/start', id: 'm1', role: 'assistant' });
    engine.push({ type: 'message/delta', id: 'm1', text: 'x' });
    expect(pending()).toBe(1);
    engine.reset();
    listener.mockClear();
    flush();
    expect(listener).not.toHaveBeenCalled();
  });

  it('cancels a pending frame and drops subscribers on destroy', () => {
    const { engine, flush, listener } = setup();
    engine.push({ type: 'message/start', id: 'm1', role: 'assistant' });
    engine.push({ type: 'message/delta', id: 'm1', text: 'x' });
    listener.mockClear();
    engine.destroy();
    flush();
    expect(listener).not.toHaveBeenCalled();
  });
});

describe('truncate — the operation editing, regenerating and branching are made of', () => {
  /** A definition that opens a node per id and appends text to it. */
  const notes: ConversationNodeDefinition<{ id: string; text?: string }, string> = {
    kind: 'note',
    match: (event) => ({ id: event.id, role: event.text === undefined ? 'start' : 'update' }),
    start: () => '',
    update: (state, event) => state + (event.text ?? ''),
  };

  /**
   * Builds an engine that publishes synchronously.
   *
   * @returns The engine.
   */
  const engine = (): ConversationEngine<{ id: string; text?: string }> =>
    createConversationEngine<{ id: string; text?: string }>({
      definitions: [notes as ConversationNodeDefinition<{ id: string; text?: string }, unknown>],
      scheduler: (run) => {
        run();
        return () => {};
      },
    });

  it('drops the named node and everything opened after it', () => {
    const e = engine();
    e.push({ id: 'a' });
    e.push({ id: 'b' });
    e.push({ id: 'c' });
    expect(e.truncate('note:b')).toBe(2);
    expect(e.nodes().map((node) => node.id)).toEqual(['a']);
  });

  it('keeps a node that opened before the cut even when its last update came after', () => {
    // Cut by `seq`, not by position. A message still streaming when the reader edits an
    // older one is above the cut, and what a reader sees above the cut must be what stays.
    const e = engine();
    e.push({ id: 'a' });
    e.push({ id: 'b' });
    e.push({ id: 'a', text: 'more' });
    expect(e.truncate('note:b')).toBe(1);
    expect(e.nodes().map((node) => [node.id, node.state])).toEqual([['a', 'more']]);
  });

  it('reports zero for a key it does not have, rather than dropping nothing in silence', () => {
    // Zero is the caller's cue that its idea of the conversation is stale. Silently
    // succeeding would leave the old tail on screen under freshly pushed events.
    const e = engine();
    e.push({ id: 'a' });
    expect(e.truncate('note:missing')).toBe(0);
    expect(e.nodes()).toHaveLength(1);
  });

  it('lets the truncated id be used again', () => {
    const e = engine();
    e.push({ id: 'a' });
    e.push({ id: 'b' });
    e.truncate('note:b');
    e.push({ id: 'b' });
    e.push({ id: 'b', text: 'again' });
    expect(e.nodes().map((node) => [node.id, node.state])).toEqual([
      ['a', ''],
      ['b', 'again'],
    ]);
  });

  it('keeps new nodes after the survivors rather than reusing a dropped position', () => {
    const e = engine();
    e.push({ id: 'a' });
    e.push({ id: 'b' });
    e.truncate('note:b');
    e.push({ id: 'c' });
    expect(e.nodes().map((node) => node.id)).toEqual(['a', 'c']);
  });

  it('publishes once, immediately', () => {
    const e = engine();
    e.push({ id: 'a' });
    e.push({ id: 'b' });
    const seen: number[] = [];
    e.subscribe((nodes) => seen.push(nodes.length));
    e.truncate('note:b');
    expect(seen).toEqual([1]);
  });

  it('does not notify when it dropped nothing', () => {
    const e = engine();
    e.push({ id: 'a' });
    const seen: number[] = [];
    e.subscribe((nodes) => seen.push(nodes.length));
    e.truncate('note:nope');
    expect(seen).toEqual([]);
  });
});
