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
