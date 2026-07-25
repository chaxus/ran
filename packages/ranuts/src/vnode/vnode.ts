import type { On } from './modules/listeners';
import type { Attrs } from './modules/attributes';
import type { Classes } from './modules/class';
import type { Props } from './modules/props';
import type { VNodeStyle } from './modules/style';
import type { Hooks } from './hooks';

export type VNodes = VNode[];
export type VNodeChildElement = VNode | string | number;
export type ArrayOrElement<T> = T | T[];
export type VNodeChildren = ArrayOrElement<VNodeChildElement>;

// Type of the key attribute
export type Key = string | number;

// The VNode interface
export interface VNode {
  // Selector for the DOM node.
  // A vnode's .sel comes from the CSS selector passed to h(); for example
  // h('div#container', {}, [...]) creates a vnode whose .sel is 'div#container'.
  sel: string | undefined;
  // Node data
  data: VNodeData | undefined;
  // Child nodes; mutually exclusive with text
  children: Array<VNode | string | number> | undefined;
  // The real DOM node this VNode was turned into
  elm: Node | undefined;
  // Text content; mutually exclusive with children
  text: string | number | undefined;
  // key — lets the diff match nodes across updates
  key: Key | undefined;
  listener?: EventListenerOrEventListenerObject | undefined;
}

export interface VNodeData {
  // Properties set on the element as `element.prop = value`; boolean attributes get no special handling
  props?: Props;
  // Attributes set via setAttribute; boolean attributes get no special handling
  attrs?: Attrs;
  // Classes on the element
  class?: Classes;
  // Inline CSS style on the element
  style?: VNodeStyle;
  // Event listeners on the element
  on?: On;
  // The VNode's key
  key?: Key;
  // SVG element
  ns?: string;
  hook?: Hooks;
}

export function vnode(
  sel: string | undefined,
  data: any | undefined,
  children: Array<VNode | string | number> | undefined,
  text: string | number | undefined,
  elm: Element | Text | undefined,
): VNode {
  const key = data === undefined ? undefined : data.key;
  return { sel, data, children, text, elm, key };
}
