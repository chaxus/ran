/**
  * @description: 判断这个元素上是否有disabled属性
  * @param {Element} element
  * @return {*}
  */
export const isDisabled = (element: Element) => {
    if (element.hasAttribute('disabled') && element.getAttribute('disabled') !== 'false') return true
    return false
}