/**
 * The engine that runs {@link ConversationNodeDefinition}s over an event log.
 */
import type {
  ConversationNode,
  ConversationNodeDefinition,
  ConversationPublication,
  ConversationReader,
} from './types.ts';

/** Defers work to the next paint, or to a microtask where there is no paint. */
export type FrameScheduler = (run: () => void) => () => void;

/**
 * Default scheduler: one animation frame in a browser, a microtask elsewhere.
 *
 * The fallback matters for tests and server rendering, where coalescing still has to
 * happen — just without a frame to hang it on.
 *
 * @param run The callback to defer.
 * @returns A function that cancels the deferred callback.
 */
const defaultScheduler: FrameScheduler = (run) => {
  if (typeof requestAnimationFrame === 'function') {
    const handle = requestAnimationFrame(run);
    return () => cancelAnimationFrame(handle);
  }
  let cancelled = false;
  queueMicrotask(() => {
    if (!cancelled) run();
  });
  return () => {
    cancelled = true;
  };
};

/** How to construct an engine. */
export interface ConversationEngineOptions<Event> {
  /**
   * The registered definitions. Every event is offered to all of them, so two definitions
   * may both claim one event — that is how a single log event can drive, say, both a
   * message node and a separate status node.
   *
   * Declared over `unknown` state so definitions with different state types register side
   * by side; a concrete `ConversationNodeDefinition<Event, MyState>` assigns here without
   * a cast, and its own methods stay fully typed at the definition site.
   */
  definitions: readonly ConversationNodeDefinition<Event, unknown>[];
  /** Overrides frame scheduling; supply a manual one to make cadence deterministic in tests. */
  scheduler?: FrameScheduler;
}

/** A running conversation projection. */
export interface ConversationEngine<Event> {
  /**
   * Offers one event to every definition and notifies subscribers per the resulting
   * cadence.
   *
   * @param event The event to project.
   */
  push(event: Event): void;
  /**
   * Runs a burst of pushes as one publication.
   *
   * Without it, replaying a stored conversation is quadratic: every event publishes, every
   * publication hands subscribers the whole node list, and a DOM subscriber walks all of it
   * — so restoring n messages costs O(n²) row visits, each re-writing content that has not
   * changed. Measured on a 600-message transcript that was 5.4 seconds of blocked main
   * thread; the same replay batched is one pass.
   *
   * The cadence of the single publication is the highest any event in the burst asked for,
   * which is the same escalation rule that applies within one event. A burst that accepted
   * nothing publishes nothing.
   *
   * Nesting is flat: an inner batch joins the outer one rather than publishing early.
   *
   * @param run The pushes to run.
   */
  batch(run: () => void): void;
  /** @returns The current nodes, ordered by the event that started each one. */
  nodes(): readonly ConversationNode[];
  /**
   * Registers a subscriber.
   *
   * @param listener Called with the current nodes whenever a publication lands, and with
   *   the keys whose state changed since the previous publication. A subscriber that writes
   *   to the DOM should touch only those: on a long transcript the node list is mostly
   *   unchanged every frame, and rewriting all of it once per delta is the difference
   *   between a transcript that streams and one that stalls. `undefined` means every node
   *   changed, which is what a reset reports.
   * @returns A function that removes the subscriber.
   */
  subscribe(
    listener: (nodes: readonly ConversationNode[], changed: ReadonlySet<string> | undefined) => void,
  ): () => void;
  /**
   * Drops one node and every node started after it.
   *
   * This is what editing, regenerating, and branching are made of: all three mean "the
   * conversation diverges here", and what follows the divergence is no longer part of it.
   * Without this the only way back is {@link ConversationEngine.reset} and a full replay,
   * which throws away every node that did not change and makes the view flash.
   *
   * Ordering is by `seq` — when a node opened — not by position, so a node that has been
   * updating since before the cut survives even though its latest update came after it.
   * That is the same rule the node order itself follows.
   *
   * @param key The `kind:id` of the first node to drop.
   * @returns How many nodes were dropped. Zero means the key names no live node, which is
   *   a caller's cue that its own idea of the conversation is stale — silently dropping
   *   nothing would leave the old tail on screen under freshly pushed events.
   */
  truncate(key: string): number;
  /** Drops every node and pending publication, keeping the definitions. */
  reset(): void;
  /** Cancels any pending publication and drops subscribers. */
  destroy(): void;
}

/** Node record with the mutable fields the engine owns. */
interface LiveNode {
  key: string;
  kind: string;
  id: string;
  seq: number;
  state: unknown;
}

/**
 * Creates an engine over a set of definitions.
 *
 * Semantics worth knowing before writing a definition:
 *
 * - **Every definition sees every event.** Claims are independent; the engine never stops
 *   at the first match.
 * - **An `update` claim for an id with no open node is dropped.** That is the honest
 *   outcome when the start event was never seen — trimmed from a paged window, or emitted
 *   before the definition was registered — and inventing a node from a partial update
 *   would render something that never existed.
 * - **Order is fixed at `start`.** A node that keeps updating stays where it opened, so a
 *   streaming message does not jump to the end of the list on every delta.
 * - **Cadence escalates, never relaxes.** An `immediate` publication while a frame is
 *   pending fires now and cancels the frame; an `animation-frame` publication while one is
 *   already pending joins it.
 * - **`truncate` cuts by `seq`, not by position.** A node that opened before the cut
 *   survives even if its most recent update came after it — the same rule node order
 *   follows, so what a reader sees above the cut is exactly what stays.
 *
 * @param options Definitions and optional scheduler.
 * @returns The engine.
 */
export function createConversationEngine<Event>(options: ConversationEngineOptions<Event>): ConversationEngine<Event> {
  const { definitions, scheduler = defaultScheduler } = options;

  const seen = new Set<string>();
  for (const definition of definitions) {
    if (seen.has(definition.kind)) {
      throw new Error(`conversation: duplicate definition kind "${definition.kind}"`);
    }
    seen.add(definition.kind);
  }

  let nodes: LiveNode[] = [];
  const byKey = new Map<string, LiveNode>();
  const listeners = new Set<(nodes: readonly ConversationNode[], changed: ReadonlySet<string> | undefined) => void>();
  /** Keys touched since the last publication; null once every node must be treated as new. */
  let changed: Set<string> | null = new Set();
  let sequence = 0;
  let cancelPending: (() => void) | null = null;
  /** Depth of open batches, and the cadence they have accumulated. */
  let batching = 0;
  let batched: ConversationPublication = 'none';
  /** Snapshot cache, invalidated on every accepted event. */
  let snapshot: readonly ConversationNode[] | null = null;

  const currentNodes = (): readonly ConversationNode[] => {
    snapshot ??= nodes.map((node) => Object.freeze({ ...node }));
    return snapshot;
  };

  const notify = (): void => {
    const value = currentNodes();
    const touched = changed === null ? undefined : new Set(changed);
    changed = new Set();
    // A listener may unsubscribe, or subscribe, while being notified. Mutating the Set
    // mid-iteration would skip or repeat a subscriber, so the copy is the point.
    // oxlint-disable-next-line unicorn/no-useless-spread -- deliberate, see above
    for (const listener of [...listeners]) listener(value, touched);
  };

  const publish = (cadence: ConversationPublication): void => {
    if (cadence === 'none') return;
    if (batching > 0) {
      if (cadence === 'immediate') batched = 'immediate';
      else if (batched === 'none') batched = 'animation-frame';
      return;
    }
    if (cadence === 'immediate') {
      cancelPending?.();
      cancelPending = null;
      notify();
      return;
    }
    if (cancelPending !== null) return;
    cancelPending = scheduler(() => {
      cancelPending = null;
      notify();
    });
  };

  const reader: ConversationReader = {
    previous<State>(kind: string): ConversationNode<State> | undefined {
      for (let i = nodes.length - 1; i >= 0; i -= 1) {
        if (nodes[i].kind === kind) return Object.freeze({ ...nodes[i] }) as ConversationNode<State>;
      }
      return undefined;
    },
  };

  return {
    push(event) {
      let cadence: ConversationPublication = 'none';

      for (const definition of definitions) {
        const claim = definition.match(event);
        if (claim === null) continue;

        const key = `${definition.kind}:${claim.id}`;
        const existing = byKey.get(key);

        if (claim.role === 'start') {
          // A repeated start for a live key is a re-open: the definition decided this is a
          // new node, so its old state is discarded rather than merged into.
          const node: LiveNode = {
            key,
            kind: definition.kind,
            id: claim.id,
            seq: existing?.seq ?? (sequence += 1),
            state: definition.start(event, reader),
          };
          if (existing === undefined) nodes.push(node);
          else nodes[nodes.indexOf(existing)] = node;
          byKey.set(key, node);
        } else if (existing !== undefined) {
          existing.state = definition.update(existing.state, event);
        } else {
          // Dropped: see the note on update-without-start above.
          continue;
        }

        snapshot = null;
        changed?.add(key);
        const requested = definition.publication?.(event) ?? 'immediate';
        if (requested === 'immediate') cadence = 'immediate';
        else if (requested === 'animation-frame' && cadence === 'none') cadence = 'animation-frame';
      }

      publish(cadence);
    },

    truncate(key) {
      const from = byKey.get(key);
      if (from === undefined) return 0;
      const kept = nodes.filter((node) => node.seq < from.seq);
      const dropped = nodes.length - kept.length;
      for (const node of nodes) {
        if (node.seq >= from.seq) byKey.delete(node.key);
      }
      nodes = kept;
      snapshot = null;
      // Immediate, and cancelling any pending frame: a truncation is one discrete decision,
      // and a frame scheduled by the deltas it just discarded would repaint the old tail.
      publish('immediate');
      return dropped;
    },

    batch(run) {
      batching += 1;
      try {
        run();
      } finally {
        batching -= 1;
        if (batching === 0) {
          const cadence = batched;
          batched = 'none';
          // Published after the counter is clear, so `publish` takes the normal path. A
          // throw still publishes what the burst managed to fold in, because the nodes are
          // already changed and leaving subscribers looking at the previous set would be a
          // view that disagrees with the engine.
          publish(cadence);
        }
      }
    },

    nodes: currentNodes,

    subscribe(listener) {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },

    reset() {
      nodes = [];
      byKey.clear();
      sequence = 0;
      snapshot = null;
      // Every node is gone, so no set of keys describes what a subscriber has to redo.
      changed = null;
      publish('immediate');
    },

    destroy() {
      cancelPending?.();
      cancelPending = null;
      listeners.clear();
    },
  };
}
