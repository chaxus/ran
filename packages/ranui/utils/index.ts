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
