import type { VNode } from './vnode'

// 判断是否为数组
export const array = Array.isArray

export const isStr = (str: unknown): str is string => {
  return typeof str === 'string'
}
// 判断是否为字符串或数字
export function primitive(s: unknown): s is string | number {
  return typeof s === 'string' || typeof s === 'number'
}
// 判断是否为vnode
export function isVnode(s: any): s is VNode {
  return !!s?.sel
}

