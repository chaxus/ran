/**
 * @description: EventManager — 以 AbortController 为底座的作用域事件注册表。
 *
 * 解决的问题是「装上去的监听怎么全部摘下来」：手工 `removeEventListener` 必须持有
 * 与注册时**完全相同**的函数引用和 options，一旦中途包了一层箭头函数就再也摘不掉，
 * 于是组件反复挂载卸载就会漏监听。AbortController 把这件事变成一次 `abort()`。
 *
 * Web Component 里的用法：
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
 *     this._events.abort(); // 摘掉全部监听，并为下一次 connect 重置
 *   }
 *
 * 普通页面里的用法：
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
 *     return () => scope.abort(); // 区块销毁时调用
 *   }
 */
export class EventManager {
  private ac: AbortController;

  constructor() {
    this.ac = new AbortController();
  }

  /** 底层的 AbortSignal —— 需要时可直接透传给 addEventListener 的 options。 */
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
   * @description: 事件委托 —— 只在 `parent` 上挂一个监听，事件来自匹配 `selector`
   * 的后代时才触发 `handler`。
   *
   * handler 拿到原始事件和命中的元素两个参数。
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
   * @description: 摘掉全部已注册的监听，并重置内部 AbortController。
   * 可以重复调用；之后的 on() / delegate() 从一个干净的作用域重新开始。
   */
  abort(): void {
    this.ac.abort();
    this.ac = new AbortController();
  }
}
