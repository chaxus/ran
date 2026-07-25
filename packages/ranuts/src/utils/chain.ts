/**
 * @description: 链式调用的 DOM 构建 API。
 *
 * 独立成文件，让 `vnode` 入口可以复用同一份实现而不必牵入 `utils/dom.ts`
 * 的其余部分（`setFontSize2html` 会连带引入 `utils/device`）。
 */
const SVG_NS = 'http://www.w3.org/2000/svg';
const SVG_TAG_NAMES = [
  'svg',
  'path',
  'g',
  'circle',
  'rect',
  'line',
  'polyline',
  'polygon',
  'ellipse',
  'text',
  'tspan',
  'textPath',
  'defs',
  'marker',
  'radialGradient',
  'stop',
  'linearGradient',
  'clipPath',
  'mask',
  'pattern',
  'image',
  'use',
  'symbol',
  'foreignObject',
  'feGaussianBlur',
  'feColorMatrix',
];
/**
 * @description: 链式调用的 dom 操作
 * (tag) (key value) (children)
 * @return {HTMLElement}
 */
export class Chain {
  public listener: Map<string, Map<string, EventListener>>;
  public element: HTMLElement;
  constructor(tagName: string, options?: ElementCreationOptions) {
    this.element = this.create(tagName, options);
    this.listener = new Map();
  }
  /**
   * @description: 创建元素
   * @param {string} tagName
   * @param {ElementCreationOptions} options
   * @return {Chain}
   */
  public create = (tagName: string, options?: ElementCreationOptions): HTMLElement => {
    if (SVG_TAG_NAMES.includes(tagName)) {
      return document.createElementNS(SVG_NS, tagName, options) as HTMLElement;
    }
    return document.createElement(tagName, options);
  };
  /**
   * @description: 设置当前元素的属性
   * @param {string} name
   * @param {string} value
   * @return {Chain}
   */
  public setAttribute = (name: string, value: string): Chain => {
    this.element.setAttribute(name, value);
    return this;
  };
  /**
   * @description: 移除当前元素的属性
   * @param {string} name
   * @return {Chain}
   */
  public removeAttribute = (name: string): Chain => {
    this.element.removeAttribute(name);
    return this;
  };
  /**
   * @description: 当前元素添加子元素
   * @param {HTMLElement} child
   * @return {ChainElement}
   */
  public append = (child: HTMLElement): Chain => {
    this.element.appendChild(child);
    return this;
  };
  /**
   * @description: 当前元素移除子元素
   * @param {HTMLElement} child
   * @return {Chain}
   */
  public remove = (child: HTMLElement): Chain => {
    this.element.removeChild(child);
    return this;
  };
  /**
   * @description: 给当前元素设置文本内容
   * @param {string} text
   * @return {Chain}
   */
  public setTextContent = (text: string): Chain => {
    this.element.textContent = text;
    return this;
  };
  /**
   * @description: 给当前元素设置样式
   * @param {string} name
   * @param {string} value
   * @return {Chain}
   */
  public setStyle = (name: string, value: string): Chain => {
    this.element.style.setProperty(name, value);
    return this;
  };
  // 根据不同的子元素类型，添加元素
  private addElementByType = (item: Chain | HTMLElement, parent: Element | DocumentFragment): void => {
    if (item instanceof Chain) {
      parent.appendChild(item.element);
    }
    if (item instanceof HTMLElement) {
      parent.appendChild(item);
    }
  };
  /**
   * @description: 给当前元素添加子元素
   * @return {Chain}
   */
  public addChild = (child: Chain | Chain[] | HTMLElement | HTMLElement[]): Chain => {
    if (Array.isArray(child)) {
      const Fragment = document.createDocumentFragment();
      child.forEach((item) => {
        this.addElementByType(item, Fragment);
      });
      this.element.appendChild(Fragment);
    } else {
      this.addElementByType(child, this.element);
    }
    return this;
  };
  /**
   * @description: 给当前元素添加事件监听
   * @param {string} type
   * @param {EventListener} listener
   * @return {Chain}
   */
  public listen = <K extends keyof HTMLElementEventMap>(
    type: K,
    listener: EventListener,
    options?: boolean | AddEventListenerOptions,
  ): Chain => {
    let event = this.listener.get(type);
    if (!event) {
      event = new Map();
      this.listener.set(type, event);
    }
    const value = event.get(listener.name);
    if (value === listener) {
      console.warn(`${value.name} listener has been added to ${type} event, please remove it first.`);
    }
    this.element.addEventListener(type, listener, options);
    event.set(listener.name, listener);
    return this;
  };
  /**
   * @description: 移除当前元素的事件监听
   * @param {string} type
   * @return {Chain}
   */
  public clearListener = <K extends keyof HTMLElementEventMap>(
    type: K,
    listener: (this: HTMLElement, ev: HTMLElementEventMap[K]) => unknown,
    options?: boolean | AddEventListenerOptions,
  ): Chain => {
    this.element.removeEventListener(type, listener, options);
    const event = this.listener.get(type);
    if (event) {
      event.delete(listener.name);
    } else {
      console.warn(`No ${type} event listener has been added.`);
    }
    return this;
  };
  /**
   * @description: 移除当前元素的所有事件监听
   * @return {Chain}
   */
  public clearAllListener = (): Chain => {
    for (const [key, value] of this.listener) {
      for (const [k, v] of value) {
        this.element.removeEventListener(key, v);
        value.delete(k);
      }
      this.listener.delete(key);
    }
    return this;
  };
}

export const create = (tagName: string, options?: ElementCreationOptions): Chain => {
  return new Chain(tagName, options);
};
