import componentCss from './index.less?inline';
import { ButtonBuilder, createRef, Div, EventManager, Slot } from '@/utils/builder';
import { RanElement } from '@/utils/index';
import {
  ensureShadowRoot,
  getStringAttribute,
  setStringAttribute,
  shadowPart,
  syncSheetAttribute,
} from '@/utils/component';
import { defineSSR } from '@/utils/ssr-registry';
import { createBottomFollower } from 'ranuts/utils';
import type { BottomFollower } from 'ranuts/utils';
import { createConversationEngine } from 'ranuts/conversation';
import type { ConversationEngine, ConversationNode, ConversationNodeDefinition } from 'ranuts/conversation';

/**
 * Name of the event the paging affordance fires.
 *
 * The element does not fetch anything — it does not know where a conversation lives. It
 * states that the reader asked, having already captured the anchor; the owner prepends its
 * rows and calls {@link Conversation.restoreAnchor}.
 */
export const OLDER_REQUEST = 'olderrequest';

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
  _older!: HTMLElement;
  _olderButton!: HTMLButtonElement;
  _footer!: HTMLElement;

  private _views: ConversationNodeView<never, never>[] = [];
  private _engine: ConversationEngine<unknown> | null = null;
  private _unsubscribe: (() => void) | null = null;
  private _follower: BottomFollower | null = null;
  /** Row element per node key, so a publication patches rather than rebuilds. */
  private _rows = new Map<string, HTMLElement>();
  private _emptyRow: HTMLElement | null = null;

  static get observedAttributes(): string[] {
    return ['follow', 'empty', 'older', 'loading-older', 'sheet'];
  }

  constructor() {
    super();
    this._shadowDom = ensureShadowRoot(this, componentCss);

    const list = createRef<HTMLDivElement>();
    const older = createRef<HTMLDivElement>();
    const olderButton = createRef<HTMLButtonElement>();
    this._scroll = Div()
      .class('ran-conversation')
      .attr('part', 'conversation')
      .children(
        // Above the list, not inside it: the reorder pass walks the list's children and
        // would treat a paging row as a row to be pushed down by the first prepend.
        Div()
          .class('ran-conversation-older')
          .ref(older)
          .attr('part', 'older')
          .children(ButtonBuilder().ref(olderButton).attr('type', 'button').build())
          .build(),
        Div().class('ran-conversation-list').ref(list).attr('part', 'list').build(),
      )
      .build();
    this._shadowDom.appendChild(this._scroll);
    // Outside the scrollport, not inside it: a footer that scrolls with the transcript is a
    // composer that leaves the frame, and one made sticky still floats up under the last
    // message while the transcript is shorter than the frame.
    this._footer = Div()
      .class('ran-conversation-footer')
      .attr('part', 'footer')
      .children(Slot().attr('name', 'footer').build())
      .build();
    this._shadowDom.appendChild(this._footer);
    this._list = shadowPart(list, 'list');
    this._older = shadowPart(older, 'older');
    this._olderButton = shadowPart(olderButton, 'older button');
    this._older.hidden = true;
  }

  // ── Accessors ──────────────────────────────────────────────────────────

  /**
   * Label for the paging affordance above the first row. Empty hides it.
   *
   * A conversation log only grows, so a client that renders all of it eventually renders
   * more than anyone will read. Paging keeps the rendered set bounded without pretending
   * the rest is gone: the button is the statement that there is more, and
   * {@link Conversation.olderrequest} is the request for it.
   */
  get older(): string {
    return getStringAttribute(this, 'older');
  }
  set older(value: string) {
    setStringAttribute(this, 'older', value);
  }

  /** Whether a page is in flight; the affordance stays visible and goes inert. */
  get loadingOlder(): boolean {
    return this.hasAttribute('loading-older');
  }
  set loadingOlder(value: boolean) {
    if (value) this.setAttribute('loading-older', '');
    else this.removeAttribute('loading-older');
  }

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

  /**
   * Drops one row and every row opened after it.
   *
   * Editing a message, regenerating an answer and branching are the same operation: the
   * conversation diverges here, and what follows the divergence is no longer part of it.
   *
   * @param key The `kind:id` of the first row to drop.
   * @returns How many rows were dropped. Zero means no such row is live, which is a
   *   caller's cue that its own idea of the conversation is stale.
   */
  truncate(key: string): number {
    return this._engine?.truncate(key) ?? 0;
  }

  /**
   * Runs a burst of pushes as one render.
   *
   * Replaying a stored conversation without this is quadratic: every event publishes and
   * every publication walks the whole transcript. Use it for any replay, restore, or bulk
   * insert; a live stream does not need it, because one delta changes one row.
   *
   * @param run The pushes to run.
   */
  batch(run: () => void): void {
    this._ensureEngine().batch(run);
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
    this._syncOlder();
    this._events.on(this._olderButton, 'click', this._requestOlder);
    this._follower = createBottomFollower({
      scrollport: this._scroll,
      // The list grows without appending a node whenever a row streams; the footer
      // resizes outside the list when a composer grows.
      observe: [this._list, this._footer],
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
    if (name === 'older' || name === 'loading-older') this._syncOlder();
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
    this._unsubscribe = engine.subscribe((nodes, changed) => {
      this._renderNodes(nodes, changed);
    });
    this._engine = engine;
    return engine;
  }

  private _viewFor(kind: string): ConversationNodeView<never, never> | undefined {
    return this._views.find((view) => view.kind === kind);
  }

  private _renderNodes(nodes: readonly ConversationNode[], changed?: ReadonlySet<string>): void {
    const live = new Set<string>();

    for (const node of nodes) {
      const view = this._viewFor(node.kind);
      if (view?.mount === undefined) continue;
      live.add(node.key);

      let row = this._rows.get(node.key);
      let mounted = false;
      if (row === undefined) {
        const created = view.mount(node as ConversationNode<never>);
        if (created === null) continue;
        created.classList.add('ran-conversation-row');
        created.setAttribute('part', 'row');
        created.dataset.kind = node.kind;
        created.dataset.key = node.key;
        this._rows.set(node.key, created);
        row = created;
        mounted = true;
      }
      // A row whose state did not change is left alone. On a long transcript nearly every
      // row is unchanged on every frame, and re-writing all of them once per delta is the
      // difference between a transcript that streams and one that stalls. A row mounted in
      // this pass is always patched — it has nothing in it yet.
      if (mounted || changed === undefined || changed.has(node.key)) {
        view.patch?.(row, node as ConversationNode<never>);
      }
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

  /**
   * Asks the owner for the page above the first row, holding the reader's position.
   *
   * The anchor is captured before the request rather than after it lands: by then the
   * prepend has already moved everything, and there is no earlier position left to record.
   * The owner restores it with {@link Conversation.restoreAnchor} once its rows are in.
   */
  private _requestOlder = (): void => {
    if (this.loadingOlder) return;
    this.captureAnchor();
    this.dispatchEvent(new CustomEvent(OLDER_REQUEST, { bubbles: true, composed: true }));
  };

  private _syncOlder(): void {
    const label = this.older;
    this._older.hidden = label === '';
    this._olderButton.textContent = label;
    this._olderButton.disabled = this.loadingOlder;
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
