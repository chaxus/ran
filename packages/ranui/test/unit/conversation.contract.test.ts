import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Conversation } from '@/components/conversation';
import type { ConversationNodeView } from '@/components/conversation';
import '@/components/conversation';

type Event =
  | { type: 'message'; id: string; text: string }
  | { type: 'delta'; id: string; text: string }
  | { type: 'tool'; id: string; name: string }
  | { type: 'noise' };

interface MessageState {
  text: string;
}

/**
 * A message view whose row is a plain element, so assertions read the DOM rather than
 * another component's internals.
 *
 * @returns The registrable view.
 */
function messageView(): ConversationNodeView<Event, MessageState> {
  return {
    kind: 'message',
    match: (event) =>
      event.type === 'message'
        ? { id: event.id, role: 'start' }
        : event.type === 'delta'
          ? { id: event.id, role: 'update' }
          : null,
    start: (event) => ({ text: event.type === 'message' ? event.text : '' }),
    update: (state, event) => (event.type === 'delta' ? { text: state.text + event.text } : state),
    publication: () => 'immediate',
    mount: () => document.createElement('p'),
    patch: (element, node) => {
      element.textContent = node.state.text;
    },
  };
}

/**
 * Mounts a conversation with the message view registered.
 *
 * @returns The element and its shadow root.
 */
function mount(): { chat: Conversation; shadow: ShadowRoot; list: HTMLElement } {
  const chat = document.createElement('r-conversation') as Conversation;
  document.body.appendChild(chat);
  const shadow = (chat as unknown as { _shadowDom: ShadowRoot })._shadowDom;
  return { chat, shadow, list: shadow.querySelector<HTMLElement>('.ran-conversation-list')! };
}

describe('r-conversation contract', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  // ── Shadow DOM structure ────────────────────────────────────────────────

  it('renders a scrollport, a list and a footer slot', () => {
    const { shadow } = mount();
    expect(shadow.querySelector('.ran-conversation')).not.toBeNull();
    expect(shadow.querySelector('.ran-conversation-list')).not.toBeNull();
    expect(shadow.querySelector('slot[name="footer"]')).not.toBeNull();
  });

  it('exports part attributes on the structural elements', () => {
    const { shadow } = mount();
    expect(shadow.querySelector('.ran-conversation')?.getAttribute('part')).toBe('conversation');
    expect(shadow.querySelector('.ran-conversation-list')?.getAttribute('part')).toBe('list');
    expect(shadow.querySelector('.ran-conversation-footer')?.getAttribute('part')).toBe('footer');
  });

  // ── Projection ──────────────────────────────────────────────────────────

  it('renders a row when a registered view claims an event', () => {
    const { chat, list } = mount();
    chat.register(messageView());
    chat.push<Event>({ type: 'message', id: 'm1', text: 'hello' });
    expect(list.querySelectorAll('p')).toHaveLength(1);
    expect(list.querySelector('p')?.textContent).toBe('hello');
  });

  it('patches the existing row rather than rebuilding it', () => {
    const { chat, list } = mount();
    chat.register(messageView());
    chat.push<Event>({ type: 'message', id: 'm1', text: 'he' });
    const first = list.querySelector('p');
    chat.push<Event>({ type: 'delta', id: 'm1', text: 'llo' });
    expect(list.querySelector('p')).toBe(first);
    expect(first?.textContent).toBe('hello');
  });

  it('tags each row with its kind and key', () => {
    const { chat, list } = mount();
    chat.register(messageView());
    chat.push<Event>({ type: 'message', id: 'm1', text: 'x' });
    const row = list.querySelector<HTMLElement>('p')!;
    expect(row.dataset.kind).toBe('message');
    expect(row.dataset.key).toBe('message:m1');
    expect(row.getAttribute('part')).toBe('row');
  });

  it('ignores an event no registered view claims', () => {
    const { chat, list } = mount();
    chat.register(messageView());
    chat.push<Event>({ type: 'noise' });
    expect(list.querySelectorAll('p')).toHaveLength(0);
  });

  it('renders rows in the order their nodes opened', () => {
    const { chat, list } = mount();
    chat.register(messageView());
    chat.register({
      kind: 'tool',
      match: (event: Event) => (event.type === 'tool' ? { id: event.id, role: 'start' as const } : null),
      start: (event: Event) => (event.type === 'tool' ? event.name : ''),
      update: (state: string) => state,
      mount: () => document.createElement('span'),
      patch: (element, node) => {
        element.textContent = node.state;
      },
    });
    chat.push<Event>({ type: 'message', id: 'm1', text: 'first' });
    chat.push<Event>({ type: 'tool', id: 't1', name: 'search' });
    chat.push<Event>({ type: 'delta', id: 'm1', text: '!' });
    expect([...list.children].map((row) => row.tagName)).toEqual(['P', 'SPAN']);
    expect(list.querySelector('p')?.textContent).toBe('first!');
  });

  it('renders nothing for a view that only contributes state', () => {
    const { chat, list } = mount();
    chat.register({
      kind: 'message',
      match: (event: Event) => (event.type === 'message' ? { id: event.id, role: 'start' as const } : null),
      start: () => 1,
      update: (state: number) => state,
    });
    chat.push<Event>({ type: 'message', id: 'm1', text: 'x' });
    expect(list.children).toHaveLength(0);
  });

  it('drops every row on reset', () => {
    const { chat, list } = mount();
    chat.register(messageView());
    chat.push<Event>({ type: 'message', id: 'm1', text: 'x' });
    chat.reset();
    expect(list.querySelectorAll('p')).toHaveLength(0);
  });

  // ── Registration order ──────────────────────────────────────────────────

  it('refuses a view registered after the first event, rather than silently missing it', () => {
    const { chat } = mount();
    chat.register(messageView());
    chat.push<Event>({ type: 'message', id: 'm1', text: 'x' });
    expect(() => chat.register({ ...messageView(), kind: 'late' })).toThrow(/register every view first/);
  });

  // ── Empty state ─────────────────────────────────────────────────────────

  it('shows the empty text only while there are no rows', () => {
    const { chat, shadow, list } = mount();
    chat.register(messageView());
    chat.empty = 'No messages yet';
    expect(shadow.querySelector('.ran-conversation-empty')?.textContent).toBe('No messages yet');

    chat.push<Event>({ type: 'message', id: 'm1', text: 'x' });
    expect(shadow.querySelector('.ran-conversation-empty')).toBeNull();
    expect(list.querySelectorAll('p')).toHaveLength(1);

    chat.reset();
    expect(shadow.querySelector('.ran-conversation-empty')?.textContent).toBe('No messages yet');
  });

  // ── Follow ──────────────────────────────────────────────────────────────

  it('follows new content by default and reflects follow="false"', () => {
    const { chat } = mount();
    expect(chat.follow).toBe(true);
    chat.follow = false;
    expect(chat.getAttribute('follow')).toBe('false');
    expect(chat.follow).toBe(false);
  });

  it('reports itself pinned before the reader has scrolled', () => {
    const { chat } = mount();
    expect(chat.pinned).toBe(true);
  });

  it('emits pinnedchange when bottom-follow is lost', () => {
    const { chat, shadow } = mount();
    const listener = vi.fn();
    chat.addEventListener('pinnedchange', listener);

    // jsdom has no layout, so drive the geometry the follower reads directly.
    const scrollport = shadow.querySelector<HTMLElement>('.ran-conversation')!;
    Object.defineProperty(scrollport, 'scrollHeight', { value: 1000, configurable: true });
    Object.defineProperty(scrollport, 'clientHeight', { value: 200, configurable: true });
    scrollport.scrollTop = 100;
    scrollport.dispatchEvent(new Event('scroll'));

    expect(listener).toHaveBeenCalledTimes(1);
    expect((listener.mock.calls[0][0] as CustomEvent<{ pinned: boolean }>).detail).toEqual({ pinned: false });
    expect(chat.pinned).toBe(false);
  });

  it('resumes following on scrollToBottom', () => {
    const { chat, shadow } = mount();
    const scrollport = shadow.querySelector<HTMLElement>('.ran-conversation')!;
    Object.defineProperty(scrollport, 'scrollHeight', { value: 1000, configurable: true });
    Object.defineProperty(scrollport, 'clientHeight', { value: 200, configurable: true });
    scrollport.scrollTop = 100;
    scrollport.dispatchEvent(new Event('scroll'));
    expect(chat.pinned).toBe(false);

    chat.scrollToBottom();
    expect(chat.pinned).toBe(true);
  });

  // ── Lifecycle ───────────────────────────────────────────────────────────

  it('tears down its follower and engine on disconnect', () => {
    const { chat } = mount();
    chat.register(messageView());
    chat.push<Event>({ type: 'message', id: 'm1', text: 'x' });
    chat.remove();
    expect(chat.pinned).toBe(true);
    expect(() => chat.scrollToBottom()).not.toThrow();
  });

  it('syncs an external stylesheet through the sheet attribute', () => {
    const { chat, shadow } = mount();
    chat.sheet = '.ran-conversation { outline: 1px solid; }';
    expect(chat.getAttribute('sheet')).toBe('.ran-conversation { outline: 1px solid; }');
    expect(shadow).toBeTruthy();
  });
});

describe('r-conversation render economy', () => {
  /** A view that counts how often each row is patched. */
  const counting = (patches: Map<string, number>): ConversationNodeView<{ id: string; text?: string }, string> => ({
    kind: 'note',
    match: (event) => ({ id: event.id, role: event.text === undefined ? 'start' : 'update' }),
    start: () => '',
    update: (state, event) => state + (event.text ?? ''),
    publication: () => 'immediate',
    mount: () => document.createElement('div'),
    patch: (element, node) => {
      patches.set(node.key, (patches.get(node.key) ?? 0) + 1);
      element.textContent = node.state;
    },
  });

  it('patches only the rows whose state changed', () => {
    // On a long transcript nearly every row is unchanged on every frame, and re-writing all
    // of them once per delta is the difference between a transcript that streams and one
    // that stalls.
    const patches = new Map<string, number>();
    const chat = document.createElement('r-conversation') as Conversation;
    document.body.appendChild(chat);
    chat.register(counting(patches));

    chat.batch(() => {
      for (let i = 0; i < 20; i += 1) chat.push({ id: `n${i}` });
    });
    patches.clear();

    chat.push({ id: 'n7', text: 'x' });
    expect([...patches.keys()]).toEqual(['note:n7']);
  });

  it('renders a batched burst once', () => {
    const patches = new Map<string, number>();
    const chat = document.createElement('r-conversation') as Conversation;
    document.body.appendChild(chat);
    chat.register(counting(patches));

    chat.batch(() => {
      for (let i = 0; i < 20; i += 1) chat.push({ id: `n${i}` });
    });
    // One patch each: without batching the first row would be patched twenty times.
    expect([...patches.values()].every((count) => count === 1)).toBe(true);
  });

  it('patches a row it just mounted, even when nothing reports it changed', () => {
    const patches = new Map<string, number>();
    const chat = document.createElement('r-conversation') as Conversation;
    document.body.appendChild(chat);
    chat.register(counting(patches));
    chat.push({ id: 'a' });
    expect(patches.get('note:a')).toBe(1);
  });
});
