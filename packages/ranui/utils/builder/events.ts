/**
 * EventManager — lifecycle-scoped event registry backed by AbortController.
 *
 * Usage in Web Components:
 *
 *   private _events = new EventManager();
 *
 *   connectedCallback() {
 *     this._events
 *       .on(this._input, 'input', this.handleInput)
 *       .on(this._slot, 'slotchange', this.handleSlotChange)
 *       .on(this, 'click', this.handleClick, { capture: true });
 *   }
 *
 *   disconnectedCallback() {
 *     this._events.abort(); // removes all listeners, resets for next connect
 *   }
 */
export class EventManager {
  private ac: AbortController;

  constructor() {
    this.ac = new AbortController();
  }

  /** The underlying AbortSignal — pass to addEventListener options directly if needed. */
  get signal(): AbortSignal {
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
    target.addEventListener(type, handler, { ...options, signal: this.ac.signal });
    return this;
  }

  /**
   * Remove all registered listeners and reset internal AbortController.
   * Safe to call multiple times; next on() calls start fresh.
   */
  abort(): void {
    this.ac.abort();
    this.ac = new AbortController();
  }
}
