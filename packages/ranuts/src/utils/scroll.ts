/**
 * Bottom-follow for append-only scrollers — a streaming chat transcript, a log tail, a
 * terminal pane.
 *
 * The requirement sounds trivial and is not: stay pinned to the floor as content arrives,
 * but the instant the reader scrolls up to read something, stop — and re-pin only when
 * they come back down themselves. Naive implementations fight the reader, because they
 * cannot tell their own scroll writes apart from the reader's.
 *
 * The mechanism here is an **observed-top ledger**. Every programmatic write records the
 * `scrollTop` it produced. When a scroll event arrives, a position that matches the ledger
 * is this module's own write echoing back; a position that deviates is the reader. That
 * covers wheel, touch, scrollbar drag, keyboard, and `scrollIntoView` from unrelated code
 * uniformly, without listening for any input device — which matters because no set of
 * device listeners is ever complete.
 *
 * Two cases the ledger has to survive:
 *
 * - **Shrink-clamp.** When content shrinks, the browser clamps `scrollTop` to the new
 *   floor without any reader involvement. Comparing against `min(ledger, floor)` treats
 *   that clamp as the ledger's own value rather than as a reader scroll, so a clamp
 *   never changes who owns the scroll position — a reader who had scrolled up stays
 *   unpinned even when the clamp happens to leave them at the floor, and re-pins on
 *   their next scroll. Re-pinning on a clamp would take control back without input.
 * - **Growth while pinned.** Appended content moves the floor away. A scroll event that
 *   the reader did not cause, while pinned, re-snaps to the new floor.
 *
 * Scrolling is always instant. Smooth scrolling animates over a moving target, so during
 * streaming it visibly lags the content and, worse, its own intermediate positions read as
 * reader input on the next event.
 */

/** Distance from the floor still treated as pinned, in CSS pixels. */
const DEFAULT_THRESHOLD = 24;

/** A row remembered across a prepend, with its offset from the scrollport top. */
interface CapturedAnchor {
  row: HTMLElement;
  top: number;
}

/** How to construct a follower. */
export interface BottomFollowerOptions {
  /** The element that scrolls. */
  scrollport: HTMLElement;
  /**
   * Elements whose size changes should re-follow the floor while pinned — the content
   * column, and any sticky footer that resizes outside it. Streaming text grows an
   * existing node rather than appending one, so growth is observed rather than announced.
   */
  observe?: readonly HTMLElement[];
  /** Distance from the floor still counted as pinned. Defaults to 24. */
  threshold?: number;
  /**
   * Called when the pinned state flips, so a caller can show or hide a "jump to latest"
   * affordance. Never called for a change the caller itself just made synchronously.
   */
  onPinnedChange?: (pinned: boolean) => void;
}

/** Imperative bottom-follow controller. */
export interface BottomFollower {
  /** Whether new content is currently being followed. */
  readonly pinned: boolean;
  /** Scrolls to the floor and pins, regardless of the current state. */
  toBottom(): void;
  /**
   * Follows the floor only if currently pinned. Safe to call on every content change —
   * a reader who has scrolled up is left alone.
   */
  follow(): void;
  /**
   * Remembers a row's current offset from the scrollport top, before content is prepended
   * above it. Capture a row that is actually on screen, so the restore keeps what the
   * reader is looking at exactly where it was.
   *
   * @param row The row to keep still.
   */
  captureAnchor(row: HTMLElement): void;
  /**
   * Restores the captured row to its captured offset, then forgets it.
   *
   * @param resolve Re-resolves the row after the prepend, for callers that replace nodes
   *   rather than reuse them. Omit when the captured element is still in the document.
   * @returns Whether an anchor was restored.
   */
  restoreAnchor(resolve?: () => HTMLElement | null): boolean;
  /** Discards any captured anchor without restoring it. */
  releaseAnchor(): void;
  /** Removes the scroll listener and disconnects the resize observer. */
  destroy(): void;
}

/**
 * Greatest scrollable offset — the position at which the scroller is at its floor.
 *
 * @param el The scrollport.
 * @returns The floor offset, never negative.
 */
function floorOf(el: HTMLElement): number {
  return Math.max(0, el.scrollHeight - el.clientHeight);
}

/**
 * Offset of a row from the top of the scrollport, in scrollport coordinates.
 *
 * Measured through `getBoundingClientRect` on both, so the result is independent of page
 * scroll, transforms on ancestors, and whichever element actually owns the overflow.
 *
 * @param row The row to measure.
 * @param scrollport The scrolling element.
 * @returns Pixels between the scrollport's top edge and the row's top edge.
 */
function offsetWithin(row: HTMLElement, scrollport: HTMLElement): number {
  return row.getBoundingClientRect().top - scrollport.getBoundingClientRect().top;
}

/**
 * Creates a bottom-follow controller for one scrollport.
 *
 * The controller starts pinned, which is what an append-only view wants on first paint and
 * after a reload. To restore a remembered position instead, set `scrollTop` before or
 * after construction and the first scroll event will settle the pinned state from the
 * geometry.
 *
 * @param options Scrollport, elements to observe, and threshold.
 * @returns The controller; call `destroy` to release its listeners.
 */
export function createBottomFollower(options: BottomFollowerOptions): BottomFollower {
  const { scrollport, observe = [], threshold = DEFAULT_THRESHOLD, onPinnedChange } = options;

  let pinned = true;
  /** Last position this module wrote, or was told about, on the main thread. */
  let observedTop = scrollport.scrollTop;
  let anchor: CapturedAnchor | null = null;
  let destroyed = false;

  const setPinned = (next: boolean): void => {
    if (next === pinned) return;
    pinned = next;
    onPinnedChange?.(next);
  };

  const writeTop = (top: number): void => {
    scrollport.scrollTop = top;
    // Read back rather than trusting the assignment: the browser clamps to the current
    // floor, and a ledger holding an unreachable value would read as a reader scroll.
    observedTop = scrollport.scrollTop;
  };

  const toBottom = (): void => {
    anchor = null;
    writeTop(scrollport.scrollHeight);
    setPinned(true);
  };

  const onScroll = (): void => {
    const floor = floorOf(scrollport);
    // A shrink-clamp lands exactly on the floor, and a delayed delivery of this module's
    // own write lands on the ledger; both must keep the current ownership.
    const movedByReader = Math.abs(scrollport.scrollTop - Math.min(observedTop, floor)) > 0.5;
    if (!movedByReader) {
      // Not the reader: if we are following, the floor moved under us — catch up.
      if (pinned) toBottom();
      else observedTop = scrollport.scrollTop;
      return;
    }
    observedTop = scrollport.scrollTop;
    setPinned(floor - scrollport.scrollTop <= threshold);
  };

  scrollport.addEventListener('scroll', onScroll, { passive: true });

  let observer: ResizeObserver | null = null;
  if (observe.length > 0 && typeof ResizeObserver !== 'undefined') {
    observer = new ResizeObserver(() => {
      if (pinned && !destroyed) writeTop(scrollport.scrollHeight);
    });
    for (const element of observe) observer.observe(element);
  }

  return {
    get pinned() {
      return pinned;
    },

    toBottom,

    follow() {
      if (pinned) writeTop(scrollport.scrollHeight);
    },

    captureAnchor(row) {
      anchor = { row, top: offsetWithin(row, scrollport) };
    },

    restoreAnchor(resolve) {
      if (anchor === null) return false;
      // `resolve` returning null means the row did not survive the prepend, which is
      // not the same as no resolver being supplied — `??` would conflate the two.
      const row = resolve === undefined ? anchor.row : resolve();
      const { top } = anchor;
      anchor = null;
      if (row === null || !scrollport.contains(row)) return false;
      writeTop(scrollport.scrollTop + offsetWithin(row, scrollport) - top);
      return true;
    },

    releaseAnchor() {
      anchor = null;
    },

    destroy() {
      destroyed = true;
      scrollport.removeEventListener('scroll', onScroll);
      observer?.disconnect();
    },
  };
}
