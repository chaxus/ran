import type { VNode } from '../vnode';

export type Attrs = Record<string, string | number | boolean>;

const xlinkNS = 'http://www.w3.org/1999/xlink';
const xmlNS = 'http://www.w3.org/XML/1998/namespace';
const colonChar = 58;
const xChar = 120;

function updateAttrs(oldVnode: VNode, vnode: VNode): void {
  // 用于缓存 attrs 的 name
  let key: string;
  // 用于缓存 Vnode 的 dom
  const elm: Element = vnode.elm as Element;
  // 用于缓存旧 VNode 的 attrs
  let oldAttrs = oldVnode.data && oldVnode.data.attrs;
  // 用于缓存新 VNode 的 attrs
  let attrs = vnode.data && vnode.data.attrs;

  // 如果新旧 VNode 都没有 attrs 属性，直接返回
  if (!oldAttrs && !attrs) return;
  // 如果新旧 VNode 的 attrs 属性相同，直接返回
  if (oldAttrs === attrs) return;
  //  如果旧 VNode 没有 attrs，将其设置为空对象
  oldAttrs = oldAttrs || {};
  //  如果新 VNode 没有 attrs，将其设置为空对象
  attrs = attrs || {};

  // 遍历新 VNode 的 attrs
  for (key in attrs) {
    // 获取当前 attrs 的值
    const cur = attrs[key];
    // 获取旧 VNode 对应的 attrs 的值
    const old = oldAttrs[key];
    // 如果新旧 VNode 的 attrs 值不相同
    if (old !== cur) {
      // 如果新 VNode 的 attrs 值为 true
      if (cur === true) {
        // 通过 setAttribute 设置为空字符串
        elm.setAttribute(key, '');
      } else if (cur === false) {
        // 如果新 VNode 的 attrs 值为 false，则删除 key
        elm.removeAttribute(key);
      } else {
        // 设置 svg 的属性
        if (key.charCodeAt(0) !== xChar) {
          elm.setAttribute(key, cur as any);
        } else if (key.charCodeAt(3) === colonChar) {
          // Assume xml namespace
          elm.setAttributeNS(xmlNS, key, cur as any);
        } else if (key.charCodeAt(5) === colonChar) {
          // Assume xlink namespace
          elm.setAttributeNS(xlinkNS, key, cur as any);
        } else {
          // 通过 setAttribute 设置值
          elm.setAttribute(key, `${cur}`);
        }
      }
    }
  }
  // 遍历旧 VNode 的 attrs
  for (key in oldAttrs) {
    // 如果新 VNode 的 attrs 中没有相同的 key，则直接删除该 attrs 属性
    if (!(key in attrs)) {
      elm.removeAttribute(key);
    }
  }
}

export const attributesModule = { create: updateAttrs, update: updateAttrs };
