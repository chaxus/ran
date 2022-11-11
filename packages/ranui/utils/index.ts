import { readDir } from "ranuts";
// import { resolve } from "path";

export const falseList = [false, "false", null, undefined];
/**
 * @description: 判断这个元素上是否有disabled属性
 * @param {Element} element
 * @return {*}
 */
export const isDisabled = (element: Element) => {
  const status = element.hasAttribute("disabled");
  const value = element.getAttribute("disabled");
  if (status && !falseList.includes(value)) return true;
  return false;
};
/**
 * @description: 给指定的元素添加指定的class
 * @param {Element} element
 * @param {string} addClass
 */
export const setElementClass = (element: Element, addClass: string) => {
  const classList = element.classList;
  if (!classList.contains(addClass)) {
    classList.add(addClass);
  }
};
/**
 * @description: 查询指定元素的子级元素，删除他们的某一个指定class
 * @param {Element} parent
 * @param {string} deleteClass
 */
export const deleteElementChildClass = (
  parent: Element,
  deleteClass: string
) => {
  const pre = parent.querySelectorAll(`.${deleteClass}`);
  if (pre.length > 0) {
    pre.forEach((item) => item.classList.remove(deleteClass));
  }
};

/**
 * @description: 创建icon的文档示例
 */
export const createIconList = () => {
  setTimeout(() => {
    const list = ['add-user', 'book',
    'check-circle', 'close-circle',
    'eye-close', 'eye',
    'info-circle', 'loading',
    'lock', 'message',
    'power-off', 'setting',
    'team', 'unlock',
    'user']
    const dom = document.getElementById('icon-list')
    list.forEach(item => {
      const container = document.createElement('div')
      container.style.setProperty('display', 'flex')
      container.style.setProperty('align-items', 'center')
      container.style.setProperty('margin', '15px')
      container.style.setProperty('justify-content', 'center')
      container.style.setProperty('flex-flow', 'column nowrap')
      const icon = document.createElement('r-icon')
      icon.setAttribute('name', item)
      icon.setAttribute('size', "50")
      container.appendChild(icon)
      const span = document.createElement('span')
      span.innerHTML = item
      container.appendChild(span)
      console.log(container, dom)
      dom?.appendChild(container)
    })
  }, 0)
}

