
/**
 * @description: 链式调用的 dom 操作
 * @return {HTMLElement}
 */
export class ChainElement {
  public static element: HTMLElement;
  /**
   * @description: 创建元素
   * @param {string} tagName
   * @param {ElementCreationOptions} options
   * @return {ChainElement}
   */
  public static createElement = (tagName: string, options?: ElementCreationOptions): ChainElement => {
    this.element = document.createElement(tagName, options);
    return this
  }
  /**
   * @description: 设置当前元素的属性
   * @param {string} name
   * @param {string} value
   * @return {ChainElement}
   */
  public static setAttribute = (name: string, value: string): ChainElement => {
    this.element.setAttribute(name, value);
    return this;
  }
  /**
   * @description: 移除当前元素的属性
   * @param {string} name
   * @return {ChainElement}
   */
  public static removeAttribute = (name: string): ChainElement => {
    this.element.removeAttribute(name);
    return this;
  }
  /**
   * @description: 当前元素添加子元素
   * @param {HTMLElement} child
   * @return {ChainElement}
   */
  public static appendChild = (child: HTMLElement): ChainElement => {
    this.element.appendChild(child);
    return this;
  }
  /**
   * @description: 当前元素移除子元素
   * @param {HTMLElement} child
   * @return {ChainElement}
   */
  public static removeChild = (child: HTMLElement): ChainElement => {
    this.element.removeChild(child);
    return this;
  }
  /**
   * @description: 给当前元素设置文本内容
   * @param {string} text
   * @return {ChainElement}
   */
  public static setTextContent = (text: string): ChainElement => {
    this.element.textContent = text;
    return this;
  }
}
