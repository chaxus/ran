/**
 * EventManager — lifecycle-scoped event registry backed by AbortController.
 *
 * Web Component usage:
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
 *     this._events.abort(); // removes all listeners, resets for next connect
 *   }
 *
 * Page development usage:
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
 *     return () => scope.abort(); // call on section teardown
 *   }
 */
export class EventManager {
  /**
   * Created on first use, and dropped again by {@link abort}.
   *
   * No component registers a listener in its constructor — they all wait for
   * `connectedCallback` — and some managers, like the drag-scoped one in `r-progress`,
   * only ever register during an interaction that may not happen. Allocating eagerly
   * charged every construction, and every `abort()`, for a controller that might go unused:
   * about 30% of a mount/unmount cycle for `r-progress`.
   */
  private ac: AbortController | null = null;

  /** The underlying AbortSignal — pass to addEventListener options directly if needed. */
  get signal(): AbortSignal {
    this.ac ??= new AbortController();
    return this.ac.signal;
  }

  on<K extends keyof HTMLElementEventMap>(
    target: HTMLElement,
    type: K,
    handler: (this: HTMLElement, ev: HTMLElementEventMap[K]) => any,
    options?: Omit<AddEventListenerOptions, 'signal'>,
  ): this;
  on(
    target: EventTarget,
    type: string,
    handler: EventListener,
    options?: Omit<AddEventListenerOptions, 'signal'>,
  ): this;
  on(target: EventTarget, type: string, handler: any, options?: Omit<AddEventListenerOptions, 'signal'>): this {
    target.addEventListener(type, handler, { ...options, signal: this.signal });
    return this;
  }

  /**
   * Event delegation — attach one listener to `parent`, fire `handler` only when
   * the event originates from a descendant matching `selector`.
   *
   * The handler receives the original event and the matched element as arguments.
   *
   *   scope.delegate(list, '.item', 'click', (ev, item) => {
   *     console.log(item.dataset.id);
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
      { ...options, signal: this.signal },
    );
    return this;
  }

  /**
   * Remove all registered listeners and drop the controller.
   * Safe to call multiple times; the next on() / delegate() starts a fresh one.
   */
  abort(): void {
    this.ac?.abort();
    this.ac = null;
  }
}
