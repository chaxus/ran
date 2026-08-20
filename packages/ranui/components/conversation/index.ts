import componentCss from './index.less?inline';
import { Div, EventManager, Slot } from '@/utils/builder';
import { RanElement } from '@/utils/index';
import {
  ensureShadowElement,
  ensureShadowRoot,
  getStringAttribute,
  setStringAttribute,
  syncSheetAttribute,
} from '@/utils/component';
import { defineSSR } from '@/utils/ssr-registry';
import { createBottomFollower } from 'ranuts/utils';
import type { BottomFollower } from 'ranuts/utils';
import { createConversationEngine } from 'ranuts/conversation';
import type { ConversationEngine, ConversationNode, ConversationNodeDefinition } from 'ranuts/conversation';

/**
 * One kind of conversation content: the state machine that owns its events, plus how to
 * put its state on screen.
 *
 * The two halves are declared together because a kind that renders nothing and a kind that
 * renders are the same thing to the projection — only `mount` differs. Omit `mount` for a
 * definition that exists so other definitions can read it through `reader.previous`.
 */
export interface ConversationNodeView<Event = unknown, State = unknown> extends ConversationNodeDefinition<
  Event,
  State
> {
  /**
   * Builds the row for a newly opened node.
   *
   * @param node The node, with its initial state.
   * @returns The element to insert, or null to render nothing for this node.
   */
  mount?(node: ConversationNode<State>): HTMLElement | null;
  /**
   * Applies a node's latest state to the row `mount` returned.
   *
   * Named apart from the definition's `update`, which folds state, because this folds
   * nothing: it is the one-way write of already-folded state onto an existing element.
   * Called on every publication that touched the node, so it should be cheap — this is
   * the path a streaming message takes once per frame. Omitting it means the row never
   * changes after it is created.
   *
   * @param element The row previously returned by `mount`.
   * @param node The node, with its current state.
   */
  patch?(element: HTMLElement, node: ConversationNode<State>): void;
}

/**
 * `<r-conversation>` — renders an append-only event log as a conversation.
 *
 * The element owns three things that are tedious and easy to get wrong, and nothing else:
 * projecting events into nodes (`ranuts/conversation`), keeping the view pinned to its
 * floor without fighting the reader (`createBottomFollower`), and reconciling rows against
 * the node list. What a message, a tool call, or a status line *looks like* is not its
 * business — that is a registered view.
 *
 * ```ts
 * const chat = document.querySelector('r-conversation');
 * chat.register({
 *   kind: 'message',
 *   match: (e) => (e.type === 'start' ? { id: e.id, role: 'start' } : e.type === 'delta' ? { id: e.id, role: 'update' } : null),
 *   start: () => ({ text: '' }),
 *   update: (state, e) => ({ text: state.text + e.text }),
 *   publication: (e) => (e.type === 'delta' ? 'animation-frame' : 'immediate'),
 *   mount: () => document.createElement('r-markdown'),
 *   patch: (el, node) => { (el as HTMLElement & { content: string }).content = node.state.text; },
 * });
 * chat.push({ type: 'start', id: 'm1' });
 * ```
 *
 * Attributes: `follow` (`true` by default — set `follow="false"` to leave the reader in
 * control from the start), `empty` (text shown while there are no rows), `sheet`.
 * Fires `pinnedchange` with `detail.pinned` whenever bottom-follow is gained or lost, so a
 * "jump to latest" affordance can track it.
 */
export class Conversation extends RanElement {
  _events = new EventManager();
  _shadowDom!: ShadowRoot;
  _scroll!: HTMLElement;
  _list!: HTMLElement;

  private _views: ConversationNodeView<never, never>[] = [];
  private _engine: ConversationEngine<unknown> | null = null;
  private _unsubscribe: (() => void) | null = null;
  private _follower: BottomFollower | null = null;
  /** Row element per node key, so a publication patches rather than rebuilds. */
  private _rows = new Map<string, HTMLElement>();
  private _emptyRow: HTMLElement | null = null;

  static get observedAttributes(): string[] {
    return ['follow', 'empty', 'sheet'];
  }

  constructor() {
    super();
    this._shadowDom = ensureShadowRoot(this, componentCss);

    this._scroll = ensureShadowElement(this._shadowDom, '.ran-conversation', () =>
      Div()
        .class('ran-conversation')
        .attr('part', 'conversation')
        .children(
          Div().class('ran-conversation-list').attr('part', 'list').build(),
          Div()
            .class('ran-conversation-footer')
            .attr('part', 'footer')
            .children(Slot().attr('name', 'footer').build())
            .build(),
        )
        .build(),
    );
    this._list = this._scroll.querySelector<HTMLElement>('.ran-conversation-list')!;
  }

  // ── Accessors ──────────────────────────────────────────────────────────

  /** Whether new content is followed until the reader scrolls away from the floor. */
  get follow(): boolean {
    return getStringAttribute(this, 'follow', 'true') !== 'false';
  }
  set follow(value: boolean) {
    setStringAttribute(this, 'follow', value ? 'true' : 'false');
  }

  /** Text shown while the projection has produced no rows. */
  get empty(): string {
    return getStringAttribute(this, 'empty');
  }
  set empty(value: string) {
    setStringAttribute(this, 'empty', value);
  }

  get sheet(): string {
    return getStringAttribute(this, 'sheet');
  }
  set sheet(value: string) {
    setStringAttribute(this, 'sheet', value);
  }

  /** Whether the view is currently following new content. */
  get pinned(): boolean {
    return this._follower?.pinned ?? true;
  }

  // ── Public API ─────────────────────────────────────────────────────────

  /**
   * Registers one kind of conversation content.
   *
   * Every registration must land before the first {@link push}: the projection is built
   * once from the registered set, and a definition added afterwards would silently miss
   * every event already folded in.
   *
   * @param view The definition and its renderer.
   * @throws When events have already been pushed, or the kind is already registered.
   */
  register<Event, State>(view: ConversationNodeView<Event, State>): void {
    if (this._engine !== null) {
      throw new Error(`r-conversation: register("${view.kind}") after the first push — register every view first`);
    }
    this._views.push(view as unknown as ConversationNodeView<never, never>);
  }

  /**
   * Projects one event and renders whatever it changed.
   *
   * @param event The log event, in the shape the registered views match on.
   */
  push<Event>(event: Event): void {
    this._ensureEngine().push(event);
  }

  /** Drops every node and row, keeping the registered views. */
  reset(): void {
    this._engine?.reset();
  }

  /** Scrolls to the floor and resumes following, whatever the reader did. */
  scrollToBottom(): void {
    this._follower?.toBottom();
  }

  /**
   * Remembers a row's position before older content is prepended, so the reader keeps
   * looking at what they were looking at.
   *
   * @param key The node key to hold still; defaults to the topmost rendered row.
   * @returns Whether a row was captured.
   */
  captureAnchor(key?: string): boolean {
    const row = key === undefined ? this._list.firstElementChild : this._rows.get(key);
    if (!(row instanceof HTMLElement) || this._follower === null) return false;
    this._follower.captureAnchor(row);
    return true;
  }

  /**
   * Restores the row captured by {@link captureAnchor}.
   *
   * @returns Whether an anchor was restored.
   */
  restoreAnchor(): boolean {
    return this._follower?.restoreAnchor() ?? false;
  }

  // ── Lifecycle ──────────────────────────────────────────────────────────

  connectedCallback(): void {
    this.handlerExternalCss();
    this._syncEmpty();
    this._follower = createBottomFollower({
      scrollport: this._scroll,
      // The list grows without appending a node whenever a row streams; the footer
      // resizes outside the list when a composer grows.
      observe: [this._list, this._scroll.querySelector<HTMLElement>('.ran-conversation-footer')!],
      onPinnedChange: (pinned) => {
        this.dispatchEvent(new CustomEvent('pinnedchange', { detail: { pinned }, bubbles: true, composed: true }));
      },
    });
    if (!this.follow) this._follower.releaseAnchor();
  }

  disconnectedCallback(): void {
    this._events.abort();
    this._unsubscribe?.();
    this._unsubscribe = null;
    this._follower?.destroy();
    this._follower = null;
    this._engine?.destroy();
    this._engine = null;
  }

  attributeChangedCallback(name: string, old: string, next: string): void {
    if (old === next) return;
    if (name === 'sheet') this.handlerExternalCss();
    if (name === 'empty') this._syncEmpty();
  }

  handlerExternalCss = (): void => {
    syncSheetAttribute(this, this._shadowDom, 'sheet', null, this.sheet);
  };

  // ── Internals ──────────────────────────────────────────────────────────

  private _ensureEngine(): ConversationEngine<unknown> {
    if (this._engine !== null) return this._engine;
    const engine = createConversationEngine<unknown>({
      definitions: this._views as unknown as ConversationNodeDefinition<unknown, unknown>[],
    });
    this._unsubscribe = engine.subscribe((nodes) => {
      this._renderNodes(nodes);
    });
    this._engine = engine;
    return engine;
  }

  private _viewFor(kind: string): ConversationNodeView<never, never> | undefined {
    return this._views.find((view) => view.kind === kind);
  }

  private _renderNodes(nodes: readonly ConversationNode[]): void {
    const live = new Set<string>();

    for (const node of nodes) {
      const view = this._viewFor(node.kind);
      if (view?.mount === undefined) continue;
      live.add(node.key);

      let row = this._rows.get(node.key);
      if (row === undefined) {
        const created = view.mount(node as ConversationNode<never>);
        if (created === null) continue;
        created.classList.add('ran-conversation-row');
        created.setAttribute('part', 'row');
        created.dataset.kind = node.kind;
        created.dataset.key = node.key;
        this._rows.set(node.key, created);
        row = created;
      }
      view.patch?.(row, node as ConversationNode<never>);
    }

    for (const [key, row] of this._rows) {
      if (live.has(key)) continue;
      row.remove();
      this._rows.delete(key);
    }

    // Reorder by walking the node list once: a row already in place costs nothing, and
    // `insertBefore` on a connected node moves it rather than cloning.
    let cursor: ChildNode | null = null;
    for (const node of nodes) {
      const row = this._rows.get(node.key);
      if (row === undefined) continue;
      const next: ChildNode | null = cursor === null ? this._list.firstChild : cursor.nextSibling;
      if (next !== row) this._list.insertBefore(row, next);
      cursor = row;
    }

    this._syncEmpty();
    if (this.follow) this._follower?.follow();
  }

  private _syncEmpty(): void {
    const text = this.empty;
    const wanted = this._rows.size === 0 && text !== '';
    if (!wanted) {
      this._emptyRow?.remove();
      this._emptyRow = null;
      return;
    }
    this._emptyRow ??= Div().class('ran-conversation-empty').attr('part', 'empty').build();
    this._emptyRow.textContent = text;
    if (this._emptyRow.parentNode === null) this._list.appendChild(this._emptyRow);
  }
}

defineSSR('r-conversation', Conversation as unknown as new () => HTMLElement);
export default Conversation;
