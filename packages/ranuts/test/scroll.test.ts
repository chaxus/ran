import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createBottomFollower } from '@/utils/scroll.ts';

/**
 * A scrollport with real clamping geometry.
 *
 * jsdom cannot host these tests: it has no layout engine, so `scrollHeight` is always 0
 * and every position is simultaneously the floor. The behaviour under test is entirely
 * about geometry — clamping on shrink, the distance to the floor, a row's offset — so the
 * fake models exactly that and fires scroll events on demand, which also removes the
 * async delivery a browser would impose.
 */
class FakeScroller {
  scrollHeight = 1000;
  clientHeight = 400;
  top = 0;
  private position = 0;
  private listeners = new Set<() => void>();

  get scrollTop(): number {
    return this.position;
  }

  /** Clamps like a browser: a write past the floor lands on the floor. */
  set scrollTop(next: number) {
    this.position = Math.max(0, Math.min(next, Math.max(0, this.scrollHeight - this.clientHeight)));
  }

  get floor(): number {
    return Math.max(0, this.scrollHeight - this.clientHeight);
  }

  addEventListener(_type: string, handler: () => void): void {
    this.listeners.add(handler);
  }

  removeEventListener(_type: string, handler: () => void): void {
    this.listeners.delete(handler);
  }

  getBoundingClientRect(): { top: number } {
    return { top: this.top };
  }

  contains(): boolean {
    return true;
  }

  /** Fires the scroll event a browser would deliver after a position change. */
  emitScroll(): void {
    for (const handler of this.listeners) handler();
  }

  /** Reader input: moves the position and delivers the event. */
  readerScrollTo(next: number): void {
    this.scrollTop = next;
    this.emitScroll();
  }

  /** Content growth: extends the flow and delivers the event the browser would. */
  grow(by: number): void {
    this.scrollHeight += by;
    this.emitScroll();
  }

  /** Content shrink: the browser clamps the position, then delivers a scroll event. */
  shrink(by: number): void {
    this.scrollHeight = Math.max(this.clientHeight, this.scrollHeight - by);
    this.scrollTop = this.position;
    this.emitScroll();
  }

  get listenerCount(): number {
    return this.listeners.size;
  }
}

/**
 * A row at a position in the scroller's flow.
 *
 * Its viewport offset is derived the way a browser derives it — flow position minus the
 * current scroll offset — so an assertion about where the row ends up on screen is a real
 * assertion rather than a restatement of the arithmetic under test.
 *
 * @param scroller The scrollport the row lives in.
 * @param flowTop Distance from the top of the scrollable content.
 * @returns A minimal element exposing `getBoundingClientRect`, plus its mutable flow position.
 */
function fakeRow(
  scroller: FakeScroller,
  flowTop: number,
): { getBoundingClientRect: () => { top: number }; flowTop: number } {
  const row = {
    flowTop,
    getBoundingClientRect: (): { top: number } => ({ top: row.flowTop - scroller.scrollTop + scroller.top }),
  };
  return row;
}

/**
 * Builds a follower over a fake scrollport.
 *
 * @param options Threshold and pinned-change spy.
 * @returns The scroller, the follower, and the spy.
 */
function setup(options: { threshold?: number } = {}) {
  const scroller = new FakeScroller();
  const onPinnedChange = vi.fn();
  const follower = createBottomFollower({
    scrollport: scroller as unknown as HTMLElement,
    onPinnedChange,
    ...options,
  });
  return { scroller, follower, onPinnedChange };
}

describe('createBottomFollower', () => {
  it('starts pinned, which is what a reload of an append-only view wants', () => {
    const { follower } = setup();
    expect(follower.pinned).toBe(true);
  });

  it('follows the floor while pinned', () => {
    const { scroller, follower } = setup();
    scroller.scrollHeight = 2000;
    follower.follow();
    expect(scroller.scrollTop).toBe(scroller.floor);
  });

  it('unpins when the reader scrolls up, and reports the flip once', () => {
    const { scroller, follower, onPinnedChange } = setup();
    follower.toBottom();
    onPinnedChange.mockClear();
    scroller.readerScrollTo(100);
    expect(follower.pinned).toBe(false);
    expect(onPinnedChange).toHaveBeenCalledExactlyOnceWith(false);
  });

  it('leaves the reader alone once unpinned, however much content arrives', () => {
    const { scroller, follower } = setup();
    scroller.readerScrollTo(100);
    follower.follow();
    scroller.grow(5000);
    follower.follow();
    expect(scroller.scrollTop).toBe(100);
    expect(follower.pinned).toBe(false);
  });

  it('re-pins when the reader scrolls back within the threshold', () => {
    const { scroller, follower } = setup({ threshold: 24 });
    scroller.readerScrollTo(100);
    scroller.readerScrollTo(scroller.floor - 10);
    expect(follower.pinned).toBe(true);
  });

  it('stays unpinned just outside the threshold', () => {
    const { scroller, follower } = setup({ threshold: 24 });
    scroller.readerScrollTo(100);
    scroller.readerScrollTo(scroller.floor - 25);
    expect(follower.pinned).toBe(false);
  });

  it('catches up to the new floor when growth moves it while pinned', () => {
    const { scroller, follower } = setup();
    follower.toBottom();
    scroller.grow(600);
    expect(scroller.scrollTop).toBe(scroller.floor);
    expect(follower.pinned).toBe(true);
  });

  it('does not read a shrink-clamp as reader input', () => {
    const { scroller, follower, onPinnedChange } = setup();
    follower.toBottom();
    onPinnedChange.mockClear();
    scroller.shrink(400);
    expect(follower.pinned).toBe(true);
    expect(onPinnedChange).not.toHaveBeenCalled();
  });

  it('lets a shrink-clamp leave the reader at the floor without taking control back', () => {
    const { scroller, follower } = setup();
    scroller.readerScrollTo(500);
    expect(follower.pinned).toBe(false);
    // Content shrinks below the reader's position, so the browser clamps them onto the
    // floor. Only reader input transfers ownership, so this does not re-pin.
    scroller.shrink(500);
    expect(scroller.scrollTop).toBe(scroller.floor);
    expect(follower.pinned).toBe(false);
    // Their next scroll settles it from the geometry, as it would anywhere else.
    scroller.readerScrollTo(0);
    scroller.readerScrollTo(scroller.floor);
    expect(follower.pinned).toBe(true);
  });

  it('does not unpin when its own write is delivered late', () => {
    const { scroller, follower, onPinnedChange } = setup();
    follower.toBottom();
    onPinnedChange.mockClear();
    // The browser delivers the event for the write above only now; the position matches
    // the ledger, so ownership must not change.
    scroller.emitScroll();
    expect(follower.pinned).toBe(true);
    expect(onPinnedChange).not.toHaveBeenCalled();
  });

  it('re-pins from anywhere on toBottom', () => {
    const { scroller, follower } = setup();
    scroller.readerScrollTo(50);
    follower.toBottom();
    expect(follower.pinned).toBe(true);
    expect(scroller.scrollTop).toBe(scroller.floor);
  });

  it('keeps an anchored row still across a prepend', () => {
    const { scroller, follower } = setup();
    scroller.readerScrollTo(300);
    const row = fakeRow(scroller, 420);
    expect(row.getBoundingClientRect().top).toBe(120);
    follower.captureAnchor(row as unknown as HTMLElement);

    // A prepend inserts 250px above the row: the flow grows and the row moves down in it.
    scroller.scrollHeight += 250;
    row.flowTop += 250;
    // Without a restore the reader would be looking at different content.
    expect(row.getBoundingClientRect().top).toBe(370);

    expect(follower.restoreAnchor()).toBe(true);
    expect(scroller.scrollTop).toBe(550);
    // The row is back exactly where the reader had it.
    expect(row.getBoundingClientRect().top).toBe(120);
  });

  it('reports no restore when nothing was captured', () => {
    const { follower } = setup();
    expect(follower.restoreAnchor()).toBe(false);
  });

  it('forgets a released anchor', () => {
    const { scroller, follower } = setup();
    follower.captureAnchor(fakeRow(scroller, 10) as unknown as HTMLElement);
    follower.releaseAnchor();
    expect(follower.restoreAnchor()).toBe(false);
  });

  it('drops an anchor whose row the prepend replaced', () => {
    const { scroller, follower } = setup();
    scroller.readerScrollTo(300);
    follower.captureAnchor(fakeRow(scroller, 420) as unknown as HTMLElement);
    // A resolver reporting null means the row is gone — distinct from supplying none.
    expect(follower.restoreAnchor(() => null)).toBe(false);
    expect(scroller.scrollTop).toBe(300);
  });

  it('drops the anchor when toBottom overrides it', () => {
    const { scroller, follower } = setup();
    follower.captureAnchor(fakeRow(scroller, 10) as unknown as HTMLElement);
    follower.toBottom();
    expect(follower.restoreAnchor()).toBe(false);
  });

  it('releases its listener on destroy', () => {
    const { scroller, follower } = setup();
    expect(scroller.listenerCount).toBe(1);
    follower.destroy();
    expect(scroller.listenerCount).toBe(0);
  });
});

describe('createBottomFollower resize observation', () => {
  let observed: Element[] = [];
  let trigger: (() => void) | null = null;

  beforeEach(() => {
    observed = [];
    trigger = null;
    vi.stubGlobal(
      'ResizeObserver',
      class {
        constructor(callback: () => void) {
          trigger = callback;
        }
        observe(element: Element): void {
          observed.push(element);
        }
        disconnect(): void {
          trigger = null;
        }
      },
    );
    return () => vi.unstubAllGlobals();
  });

  it('follows growth that appends no node, such as streaming text', () => {
    const scroller = new FakeScroller();
    const column = {} as HTMLElement;
    const follower = createBottomFollower({ scrollport: scroller as unknown as HTMLElement, observe: [column] });
    expect(observed).toEqual([column]);

    scroller.scrollHeight = 3000;
    trigger?.();
    expect(scroller.scrollTop).toBe(scroller.floor);
    follower.destroy();
  });

  it('does not write while the reader is scrolled up', () => {
    const scroller = new FakeScroller();
    const follower = createBottomFollower({
      scrollport: scroller as unknown as HTMLElement,
      observe: [{} as HTMLElement],
    });
    scroller.readerScrollTo(120);
    scroller.scrollHeight = 3000;
    trigger?.();
    expect(scroller.scrollTop).toBe(120);
    follower.destroy();
  });
});
