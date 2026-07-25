import type { VNode } from '../vnode';

export type Attrs = Record<string, string | number | boolean>;

const xlinkNS = 'http://www.w3.org/1999/xlink';
const xmlNS = 'http://www.w3.org/XML/1998/namespace';
const colonChar = 58;
const xChar = 120;

function updateAttrs(oldVnode: VNode, vnode: VNode): void {
  // Attribute name during the loop
  let key: string;
  // The VNode's DOM element
  const elm: Element = vnode.elm as Element;
  // The old VNode's attrs
  let oldAttrs = oldVnode.data && oldVnode.data.attrs;
  // The new VNode's attrs
  let attrs = vnode.data && vnode.data.attrs;

  // Nothing to do when neither VNode has attrs
  if (!oldAttrs && !attrs) return;
  // Nothing to do when both point at the same attrs object
  if (oldAttrs === attrs) return;
  // Default the old attrs to an empty object
  oldAttrs = oldAttrs || {};
  // Default the new attrs to an empty object
  attrs = attrs || {};

  // Walk the new VNode's attrs
  for (key in attrs) {
    // The new value
    const cur = attrs[key];
    // The old value for the same name
    const old = oldAttrs[key];
    // Only when the two differ
    if (old !== cur) {
      // A value of true
      if (cur === true) {
        // becomes setAttribute(name, '')
        elm.setAttribute(key, '');
      } else if (cur === false) {
        // A value of false removes the attribute
        elm.removeAttribute(key);
      } else {
        // Namespaced SVG attributes
        if (key.charCodeAt(0) !== xChar) {
          elm.setAttribute(key, cur as any);
        } else if (key.charCodeAt(3) === colonChar) {
          // Assume xml namespace
          elm.setAttributeNS(xmlNS, key, cur as any);
        } else if (key.charCodeAt(5) === colonChar) {
          // Assume xlink namespace
          elm.setAttributeNS(xlinkNS, key, cur as any);
        } else {
          // Plain setAttribute
          elm.setAttribute(key, `${cur}`);
        }
      }
    }
  }
  // Walk the old VNode's attrs
  for (key in oldAttrs) {
    // Remove any attribute the new VNode no longer declares
    if (!(key in attrs)) {
      elm.removeAttribute(key);
    }
  }
}

export const attributesModule = { create: updateAttrs, update: updateAttrs };
