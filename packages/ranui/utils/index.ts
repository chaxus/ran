export const falseList = [false, "false", null, undefined];
/**
  * @description: 判断这个元素上是否有disabled属性
  * @param {Element} element
  * @return {*}
  */
export const isDisabled = (element: Element) => {
  const status = element.hasAttribute('disabled')
  const value = element.getAttribute('disabled')
  if (status && !falseList.includes(value)) return true
  return false
}