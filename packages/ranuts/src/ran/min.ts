/*
 * @Author: ran
 * @Date: 2023-04-24 15:47:17
 * @LastEditors: chaxus nouo18@163.com
 * @LastEditTime: 2024-12-07 21:04:15
 * @docs: https://pomb.us/build-your-own-react/
 */

interface Fiber {
  type: string;
  dom?: HTMLElement | Text;
  parent?: Fiber;
  child?: Fiber;
  sibling?: Fiber;
  props: {
    [x: string]: Array<Fiber> | string | undefined;
    children?: Array<Fiber>;
  };
}
/**
 * @description: 创建真正的 dom
 * @param {Fiber} element
 * @return {HTMLElement | Text}
 */
const createElement = (element: Fiber): HTMLElement | Text => {
  if (element.type === 'TEXT_ELEMENT') {
    return document.createTextNode('');
  }
  return document.createElement(element.type);
};
/**
 * @description: 过滤一些 props 上的属性
 * @param {string} key
 * @return {Boolean}
 */
const filterProps = (key: string) => key !== 'children';

/**
 * @description: 过滤文本 dom
 * @param {HTMLElement} dom
 * @return {Boolean}
 */
const filterText = (dom: HTMLElement | Text) => {
  return dom instanceof HTMLElement;
};

/**
 * @description: render 函数
 * @param {RanElement} element
 * @param {HTMLElement} container
 */
const render = (element: Fiber, container: HTMLElement): void => {
  // 创建一个真实的 DOM
  const dom = createElement(element);
  // 将元素上的 props 属性追加到真实的 dom 上面
  Object.keys(element.props)
    .filter(filterProps)
    .forEach((name) => {
      if (filterText(dom)) {
        // https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty
        Object.defineProperty(dom, name, {
          // 该属性对应的值。可以是任何有效的 JavaScript 值（数值，对象，函数等）。默认为 undefined。
          value: element.props[name],
          // 当且仅当该属性的 writable 键值为 true 时，属性的值，也就是上面的 value，才能被赋值运算符 (en-US) 改变。默认为 false。
          //   writable: false,
          // 当且仅当该属性的 configurable 键值为 true 时，该属性的描述符才能够被改变，同时该属性也能从对应的对象上被删除。默认为 false
          //   configurable: false,
          // 当且仅当该属性的 enumerable 键值为 true 时，该属性才会出现在对象的枚举属性中。默认为 false。
          //   enumerable: false,
          // get, set
          // 如果一个描述符不具有 value、writable、get 和 set 中的任意一个键，那么它将被认为是一个数据描述符。
          // 如果一个描述符同时拥有 value 或 writable 和 get 或 set 键，则会产生一个异常。
        });
      }
    });
  // 如果有 children，递归 render
  if (element.props?.children) {
    element.props.children.forEach((child) => {
      if (dom instanceof HTMLElement) {
        render(child, dom);
      }
    });
  }
  // 最终将真实的 dom 添加到指定的 dom 里面
  container.appendChild(dom);
};

export class Concurrent {
  nextUnitOfWork: Fiber | undefined;
  wipRoot: Fiber | undefined;
  constructor(element: Fiber, container: HTMLElement) {
    this.wipRoot = {
      type: 'root',
      dom: container,
      props: {
        children: [element],
      },
    };
    this.nextUnitOfWork = this.wipRoot;
  }
  workLoop(deadline: IdleDeadline): void {
    let shouldYield = false;
    // 我们需要在空闲的时间循环执行任务单元
    while (this.nextUnitOfWork && !shouldYield) {
      this.nextUnitOfWork = this.performUnitOfWork(this.nextUnitOfWork);
      shouldYield = deadline.timeRemaining() < 1;
    }
    if (!this.nextUnitOfWork && this.wipRoot) {
      this.commitRoot();
    }
    // https://developer.mozilla.org/zh-CN/docs/Web/API/Window/requestIdleCallback
    requestIdleCallback(this.workLoop);
  }
  /**
   * @description: 执行一个任务单元，并返回下一个任务单元
   * @return {*}
   */
  performUnitOfWork(fiber: Fiber): Fiber | undefined {
    // 然后对于当前元素的子元素，会对每一个子元素创建一个 fiber
    if (!fiber.dom) {
      fiber.dom = createElement(fiber);
    }
    if (fiber?.parent?.dom) {
      fiber.parent.dom.appendChild(fiber.dom);
    }
    const elements = fiber.props.children || [];
    // 然后将它们添加到 fiber 树中，作为子节点还是兄弟节点。区别在于是否是第一个子节点
    let index = 0;
    let prevSibling;
    while (index < elements.length) {
      const element = elements[index];
      const newFiber: Fiber = {
        type: element.type,
        props: element.props,
        parent: fiber,
      };
      if (index === 0) {
        fiber.child = newFiber;
      } else {
        if (prevSibling) {
          prevSibling.sibling = newFiber;
        }
      }
      prevSibling = newFiber;
      index++;
    }
    // 最后，我们返回下一个工作单元，首先寻找它的子元素，然后是兄弟元素，然后是舅舅元素，直到根节点。
    if (fiber.child) {
      return fiber.child;
    }
    let nextFiber: Fiber | undefined = fiber;
    while (nextFiber) {
      if (nextFiber.sibling) {
        return nextFiber.sibling;
      }
      nextFiber = nextFiber.parent;
    }
  }
  startWork(): void {
    requestIdleCallback(this.workLoop);
  }
  commitRoot(): void {
    this.commitWork(this.wipRoot?.child);
    this.wipRoot = undefined;
  }
  commitWork(fiber: Fiber | undefined): void {
    if (!fiber) {
      return;
    }
    const domParent = fiber?.parent?.dom;
    fiber?.dom && domParent?.appendChild(fiber.dom);
    this.commitWork(fiber.child);
    this.commitWork(fiber.sibling);
  }
}

export { render };
