/**
 * @description: Type guards — array / string / primitive / VNode
 * @module
 */
import type { VNode } from './vnode';

// Is it an array?
export const array = Array.isArray;

export const isStr = (str: unknown): str is string => {
  return typeof str === 'string';
};
// Is it a string or a number?
export function primitive(s: unknown): s is string | number {
  return typeof s === 'string' || typeof s === 'number';
}
// Is it a vnode?
export function isVnode(s: any): s is VNode {
  return !!s?.sel;
}
