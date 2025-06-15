import { DEVICE, currentDevice } from '@/utils/device';
/**
 * @description: 给指定的元素添加指定的 class
 * @param {Element} element
 * @param {string} addClass
 */
export const addClassToElement = (element: Element, addClass: string): void => {
  if (typeof document === 'undefined') return undefined;
  const classList = element.classList;
  if (!classList.contains(addClass)) {
    classList.add(addClass);
  }
};
/**
 * @description: 给指定的元素移除指定的 class
 * @param {Element} element
 * @param {string} removeClass
 */
export const removeClassToElement = (element: Element, removeClass: string): void => {
  if (typeof document === 'undefined') return undefined;
  const classList = element.classList;
  if (classList.contains(removeClass)) {
    classList.remove(removeClass);
  }
};

/**
 * @description: 创建一个 Fragment
 * @param {Element} list
 * @return {*}
 */
export const createDocumentFragment = (list: Element[]): DocumentFragment | undefined => {
  if (typeof document === 'undefined') return undefined;
  const Fragment = document.createDocumentFragment();
  list.forEach((item) => Fragment.appendChild(item));
  return Fragment;
};

const matchHtmlRegExp = /["'&<>]/;

export function escapeHtml(string?: string | number | null): string {
  const str = '' + string;
  const match = matchHtmlRegExp.exec(str);

  if (!match) {
    return str;
  }

  let escape;
  let html = '';
  let index = 0;
  let lastIndex = 0;

  for (index = match.index; index < str.length; index++) {
    switch (str.charCodeAt(index)) {
      case 34: // "
        escape = '&quot;';
        break;
      case 38: // &
        escape = '&amp;';
        break;
      case 39: // '
        escape = '&#39;';
        break;
      case 60: // <
        escape = '&lt;';
        break;
      case 62: // >
        escape = '&gt;';
        break;
      default:
        continue;
    }

    if (lastIndex !== index) {
      html += str.substring(lastIndex, index);
    }

    lastIndex = index + 1;
    html += escape;
  }

  return lastIndex !== index ? html + str.substring(lastIndex, index) : html;
}
/**
 * @description: 根据 UI 稿宽度设置 rem
 * @param {*} void
 * @return {*}
 */
export const setFontSize2html = (designWidth: number = 375): void => {
  let base = designWidth;
  const { documentElement } = document;
  const mediaQuery = window.matchMedia('(orientation: portrait)'); // 检测是否为竖屏
  let timer: string | number | NodeJS.Timeout | undefined;
  let standardRatio = 667 / 375; // 设计稿宽高比
  if (currentDevice() === DEVICE.IPAD) {
    standardRatio = 1024 / 768; // iPad设计稿宽高比
    base = 768;
  }
  function setFontSize() {
    const isLandscape = !mediaQuery.matches;
    let screenWidth = window.screen.width;
    let screenHeight = window.screen.height;

    if (screenWidth < screenHeight) {
      [screenWidth, screenHeight] = [screenHeight, screenWidth];
    }

    let width = documentElement.clientWidth;
    let height = screenHeight;

    const realRatio = width / height;

    // 根据相对设计稿更小的宽或者高来计算fontSize
    if (realRatio >= standardRatio) {
      width = height * standardRatio;
      documentElement.classList.remove('adjustHeight');
      documentElement.classList.add('adjustWidth');
    } else {
      height = width / standardRatio;
      documentElement.classList.remove('adjustWidth');
      documentElement.classList.add('adjustHeight');
    }

    // window.adjustWidth = width;
    // window.adjustHeight = height;
    // fontSize = 自适应宽与原来宽度比 * 初始 fontSize
    let target = (width / base) * 16;
    if (isLandscape) {
      target /= standardRatio;
    }
    documentElement.style.fontSize = `${target}px`;
    const currentSize = window.getComputedStyle(documentElement).fontSize.replace('px', '') || 0;
    if (target !== currentSize) {
      documentElement.style.fontSize = `${(target / Number(currentSize)) * target}px`;
    }
  }
  window.addEventListener(
    'resize',
    function () {
      clearTimeout(timer);
      timer = setTimeout(setFontSize, 300);
    },
    !1,
  );
  window.addEventListener(
    'pageshow',
    function (e) {
      if (e.persisted) {
        clearTimeout(timer);
        timer = setTimeout(setFontSize, 300);
      }
    },
    !1,
  );

  window.addEventListener(
    'orientationchange',
    function () {
      console.log('改变了手机方向');
      setFontSize();
    },
    false,
  );
  setFontSize();
};
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
