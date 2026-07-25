import type { VNode, VNodeChildElement, VNodeChildren, VNodeData, VNodes } from './vnode';
import { vnode } from './vnode';
// Type guards
import * as is from './is';

export function addNS(
  data: VNodeData,
  children: Array<VNode | string | number> | undefined,
  sel: string | undefined,
): void {
  data.ns = 'http://www.w3.org/2000/svg';
  if (sel !== 'foreignObject' && children !== undefined) {
    for (let i = 0; i < children.length; ++i) {
      const child = children[i];
      if (typeof child === 'string' || typeof child === 'number') continue;
      const childData = child.data;
      if (childData !== undefined) {
        addNS(childData, child.children as VNodes, child.sel);
      }
    }
  }
}

// Overloads of h()
export function h(sel: string): VNode;
export function h(sel: string, data: VNodeData | null): VNode;
export function h(sel: string, children: VNodeChildren): VNode;
export function h(sel: string, data: VNodeData | null, children: VNodeChildren): VNode;
export function h(sel: string, b?: VNodeData | null | VNodeChildren, c?: VNodeChildren): VNode {
  // VNode data
  let data: VNodeData = {};
  // Children
  let children: VNodeChildElement[] | undefined = undefined;
  // Text content
  let text: string | number | undefined;
  // Index while looping over children
  let i: number;

  // Sort the arguments out — this is what implements the overloads
  if (c !== undefined) {
    // Three arguments
    // sel、data、children/text
    if (b != null) {
      data = b as VNodeData;
    }
    if (is.array(c)) {
      children = c;
      // c is a string or number
    } else if (is.primitive(c)) {
      text = c;
      // c is a VNode
    } else if (c && c.sel) {
      children = [c];
    }
  } else if (b !== undefined && b != null) {
    // Two arguments
    // b is an array
    if (is.array(b)) {
      children = b;
      // b is a string or number
    } else if (is.primitive(b)) {
      text = b;
    } else {
      // b is not typed as any, so it has to be narrowed to a VNode explicitly
      if (is.isVnode(b)) {
        children = [b];
      } else {
        data = b;
      }
    }
  }
  // Turn primitive children (string/number) into text vnodes
  if (typeof children !== 'undefined') {
    for (i = 0; i < children.length; ++i) {
      // A string/number child becomes a text node.
      // children is not typed as any, so children[i] has to be narrowed to string | number,
      // which is why the narrowed value is held in `msg` rather than used inline.
      const msg = children[i];
      if (is.primitive(msg)) {
        children[i] = vnode(undefined, undefined, undefined, msg, undefined);
      }
    }
  }
  if (sel[0] === 's' && sel[1] === 'v' && sel[2] === 'g' && (sel.length === 3 || sel[3] === '.' || sel[3] === '#')) {
    addNS(data, children, sel);
  }
  // Now a well-formed VNode
  return vnode(sel, data, children, text, undefined);
}
