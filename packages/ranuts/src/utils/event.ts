/**
 * @description: EventManager — a scoped listener registry built on AbortController.
 *
 * The problem it solves is removing every listener you installed. A manual
 * `removeEventListener` needs the **exact** same function reference and options used to
 * register — wrap the handler in an arrow function anywhere along the way and it can never
 * be removed, so a component that mounts and unmounts repeatedly leaks listeners.
 * AbortController reduces all of that to a single `abort()`.
 *
 * In a Web Component:
 *
 *   private _events = new EventManager();
 *
 *   connectedCallback() {
 *     this._events
 *       .on(this._input, 'input', this.handleInput)
 *       .on(this, 'click', this.handleClick, { capture: true });
 *   }
 *
 *   disconnectedCallback() {
 *     this._events.abort(); // remove every listener and reset for the next connect
 *   }
 *
 * In an ordinary page:
 *
 *   function initSection(container: HTMLElement) {
 *     const scope = new EventManager();
 *
 *     scope
 *       .on(input, 'input', handleSearch)
 *       .delegate(container, '[data-action]', 'click', (ev, target) => {
 *         handleAction(target.getAttribute('data-action'));
 *       });
 *
 *     return () => scope.abort(); // call when the section is torn down
 *   }
 */
export class EventManager {
  private ac: AbortController;

  constructor() {
    this.ac = new AbortController();
  }

  /** The underlying AbortSignal — pass it straight to addEventListener's options when needed. */
  get signal(): AbortSignal {
    return this.ac.signal;
  }

  on<K extends keyof HTMLElementEventMap>(
    target: HTMLElement,
    type: K,
    handler: (this: HTMLElement, ev: HTMLElementEventMap[K]) => unknown,
    options?: Omit<AddEventListenerOptions, 'signal'>,
  ): this;
  on(
    target: EventTarget,
    type: string,
    handler: EventListener,
    options?: Omit<AddEventListenerOptions, 'signal'>,
  ): this;
  on(
    target: EventTarget,
    type: string,
    handler: EventListenerOrEventListenerObject,
    options?: Omit<AddEventListenerOptions, 'signal'>,
  ): this {
    target.addEventListener(type, handler, { ...options, signal: this.ac.signal });
    return this;
  }

  /**
   * @description: Event delegation — one listener on `parent`, invoking `handler` only when
   * the event came from a descendant matching `selector`.
   *
   * The handler receives the original event and the matched element.
   *
   *   scope.delegate(list, '.item', 'click', (ev, item) => {
   *     console.log(item.getAttribute('data-id'));
   *   });
   */
  delegate<K extends keyof HTMLElementEventMap>(
    parent: HTMLElement,
    selector: string,
    type: K,
    handler: (ev: HTMLElementEventMap[K], target: Element) => void,
    options?: Omit<AddEventListenerOptions, 'signal'>,
  ): this {
    parent.addEventListener(
      type,
      (ev) => {
        const target = (ev.target as Element | null)?.closest(selector);
        if (target && parent.contains(target)) handler(ev as HTMLElementEventMap[K], target);
      },
      { ...options, signal: this.ac.signal },
    );
    return this;
  }

  /**
   * @description: Remove every registered listener and reset the internal AbortController.
   * Safe to call repeatedly; later on() / delegate() calls start from a clean scope.
   */
  abort(): void {
    this.ac.abort();
    this.ac = new AbortController();
  }
}

export interface DoubleTapDetectorOptions {
  /** Max gap between the two taps, in ms. Default `300`. */
  windowMs?: number;
  /** Max 2D distance between the two taps, in px. Default `60`. */
  maxDistancePx?: number;
}

export interface DoubleTapDetector {
  /**
   * Record a tap at `(x, y)` and report whether it forms a double-tap with the
   * immediately preceding one. A detected double-tap resets tracking, so a
   * third rapid tap starts a fresh pair rather than counting as part of the
   * same double-tap.
   */
  check: (x: number, y: number, now?: number) => boolean;
  /** Forget the last recorded tap — e.g. when a gesture other than a tap (a drag) starts. */
  reset: () => void;
}

/**
 * @description: Double-tap detection over raw `(x, y, time)` samples — pointer-type-agnostic,
 * so it works the same fed from Pointer/Touch/Mouse events. Built for touch gestures (double-tap
 * to seek, to zoom, to like) where re-deriving the timestamp+distance threshold logic at every
 * call site is easy to get subtly wrong (comparing only one axis, forgetting to reset after a
 * hit so three fast taps count as two overlapping double-taps).
 * @param {DoubleTapDetectorOptions} options `windowMs` (default 300) and `maxDistancePx` (default 60)
 * @return {DoubleTapDetector}
 * @example
 * ```ts
 * const detector = createDoubleTapDetector();
 * el.addEventListener('pointerup', (e) => {
 *   if (detector.check(e.clientX, e.clientY)) seek();
 * });
 * ```
 */
export function createDoubleTapDetector(options: DoubleTapDetectorOptions = {}): DoubleTapDetector {
  const { windowMs = 300, maxDistancePx = 60 } = options;
  // `-Infinity` (not `0`) is the "no previous tap" sentinel — `0` would collide with a real
  // tap recorded at `now === 0` (a fake-timers test, or any clock starting at zero), making
  // that first tap falsely pair with itself.
  let lastTapAt = -Infinity;
  let lastTapX = 0;
  let lastTapY = 0;

  const reset = (): void => {
    lastTapAt = -Infinity;
    lastTapX = 0;
    lastTapY = 0;
  };

  const check = (x: number, y: number, now: number = Date.now()): boolean => {
    const isDouble = now - lastTapAt < windowMs && Math.hypot(x - lastTapX, y - lastTapY) < maxDistancePx;
    if (isDouble) {
      reset();
      return true;
    }
    lastTapAt = now;
    lastTapX = x;
    lastTapY = y;
    return false;
  };

  return { check, reset };
}
