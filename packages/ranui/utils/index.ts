export const falseList = [false, 'false', null, undefined];
/**
 * @description: 判断这个元素上是否有disabled属性
 * @param {Element} element
 * @return {*}
 */
export const isDisabled = (element: Element): boolean => {
  const status = element.hasAttribute('disabled');
  const value = element.getAttribute('disabled');
  if (status && !falseList.includes(value)) return true;
  return false;
};

/**
 * @description: 查询指定元素的子级元素，删除他们的某一个指定class
 * @param {Element} parent
 * @param {string} deleteClass
 */
export const removeClassToElementChild = (
  parent: Element,
  deleteClass: string,
): void => {
  const pre = parent.querySelectorAll(`.${deleteClass}`);
  if (pre.length > 0) {
    pre.forEach((item) => item.classList.remove(deleteClass));
  }
};

/**
 * @description: 创建icon的文档示例
 */
export const createIconList = (): void => {
  setTimeout(() => {
    const list = [
      'add-user',
      'book',
      'check-circle',
      'close-circle',
      'eye-close',
      'eye',
      'info-circle',
      'loading',
      'lock',
      'message',
      'power-off',
      'setting',
      'team',
      'unlock',
      'user',
    ];
    const dom = document.getElementById('icon-list');
    list.forEach((item) => {
      const container = document.createElement('div');
      container.style.setProperty('display', 'flex');
      container.style.setProperty('align-items', 'center');
      container.style.setProperty('margin', '15px');
      container.style.setProperty('justify-content', 'center');
      container.style.setProperty('flex-flow', 'column nowrap');
      const icon = document.createElement('r-icon');
      icon.setAttribute('name', item);
      icon.setAttribute('size', '50');
      container.appendChild(icon);
      const span = document.createElement('span');
      span.innerHTML = item;
      container.appendChild(span);
      console.log(container, dom);
      dom?.appendChild(container);
    });
  }, 0);
};

export const loadScript = (src: string): Promise<{ success: boolean }> => {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = src;
    script.onload = function () {
      resolve({ success: true });
    };
    script.onerror = function (error) {
      reject({ success: false, error });
    };
    document.body.append(script);
  });
};

export interface CustomErrorType {
  new (m: string): void;
}

export function createCustomError(msg: string): CustomErrorType {
  return class CustomError {
    message: string;
    constructor(message: string = msg) {
      this.message = message;
    }
  };
}
