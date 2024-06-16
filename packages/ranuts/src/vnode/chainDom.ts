/**
 * @description: 链式调用的 dom 操作
 * @return {HTMLElement}
 */
export class Chain {
  public element: HTMLElement;
  constructor(tagName: string, options?: ElementCreationOptions) {
    this.element = this.create(tagName, options);
  }
  /**
   * @description: 创建元素
   * @param {string} tagName
   * @param {ElementCreationOptions} options
   * @return {Chain}
   */
  public create = (tagName: string, options?: ElementCreationOptions): HTMLElement => {
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
}

export const create = (tagName: string, options?: ElementCreationOptions): Chain => {
  return new Chain(tagName, options);
};
