/**
 * Vocabulary for turning an append-only event log into the nodes a conversation view
 * renders.
 *
 * The alternative — a view that switches on event type and mutates a component tree — puts
 * ordering, identity, and partial-update reconciliation in the view, where every new kind
 * of content has to be threaded through by hand. Here each kind of content is an
 * independently registered state machine: it says which events are its own, folds them
 * into its own state, and never learns that the others exist. Adding a kind is adding a
 * definition, not editing a renderer.
 *
 * @module ranuts/conversation
 */

/** A definition's claim on one event. */
export interface ConversationMatch {
  /**
   * Identity of the node this event belongs to, unique within the definition's `kind`.
   * The same id across events is what makes an update an update.
   */
  id: string;
  /** `start` opens a node; `update` folds into the one already open under `id`. */
  role: 'start' | 'update';
}

/**
 * When subscribers should see the result of one accepted event.
 *
 * This is the throttle for streaming. A text delta arriving per token wants
 * `animation-frame`, which coalesces every delta between two paints into one
 * notification; a discrete fact — a tool result, an approval — wants `immediate`, because
 * it is one event and waiting a frame only adds latency. `none` records the event without
 * waking the view at all, for state a later publication will carry anyway.
 */
export type ConversationPublication = 'none' | 'animation-frame' | 'immediate';

/** One live node, as a view sees it. */
export interface ConversationNode<State = unknown> {
  /** `kind:id` — stable for the node's whole life, and unique across definitions. */
  readonly key: string;
  readonly kind: string;
  readonly id: string;
  /**
   * Ordinal of the event that started this node. Nodes are ordered by it, so a node that
   * updates for a long time — a streaming message — keeps its place instead of jumping to
   * the end on every delta.
   */
  readonly seq: number;
  readonly state: State;
}

/** Strictly-backward lookup offered to a definition while it starts a node. */
export interface ConversationReader {
  /**
   * Finds the most recently started node of `kind` that already exists.
   *
   * Backward only, and deliberately: a definition that could see nodes started after it
   * would produce a different result depending on when it ran, and replaying the same log
   * would not reproduce the same view.
   *
   * @param kind The definition kind to look for.
   * @returns The nearest preceding node, or undefined when none is open.
   */
  previous<State>(kind: string): ConversationNode<State> | undefined;
}

/** One independently registered event-to-node state machine. */
export interface ConversationNodeDefinition<Event, State> {
  /** Namespace for this definition's node ids. Must be unique in one engine. */
  readonly kind: string;
  /**
   * Decides whether this event is this definition's business.
   *
   * Runs against the raw event with no access to engine state, so it stays a pure
   * classification and cannot depend on what has been rendered so far.
   *
   * @param event The event being offered.
   * @returns The claim, or null to ignore the event.
   */
  match(event: Event): ConversationMatch | null;
  /**
   * Builds the initial state for a newly opened node.
   *
   * @param event The event that started it.
   * @param reader Backward lookup over nodes already open.
   * @returns The node's initial state.
   */
  start(event: Event, reader: ConversationReader): State;
  /**
   * Folds one further event into an open node.
   *
   * @param state The node's current state.
   * @param event The event being folded in.
   * @returns The node's next state.
   */
  update(state: State, event: Event): State;
  /**
   * Chooses when subscribers see this event's result. Defaults to `immediate`.
   *
   * @param event The accepted event.
   * @returns The requested cadence.
   */
  publication?(event: Event): ConversationPublication;
}
