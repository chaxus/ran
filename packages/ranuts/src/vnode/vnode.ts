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

// key 属性类型
export type Key = string | number;

// VNode 接口
export interface VNode {
  // dom 节点的选择器，
  // 虚拟节点的 .sel 属性通过对 h() 传入一个 CSS 选择器生成，
  // 比如：h('div#container', {}, [...]) 将会创建一个虚拟节点并以 div#container 作为其 .sel 属性的值。
  sel: string | undefined;
  // 节点数据
  data: VNodeData | undefined;
  // 子节点，和 text 互斥
  children: Array<VNode | string | number> | undefined;
  // 存储 VNode 转化成的真实 dom
  elm: Node | undefined;
  // 节点的文本内容，和 children 互斥
  text: string | number | undefined;
  // key，用于优化 diff 算法
  key: Key | undefined;
  listener?: EventListenerOrEventListenerObject | undefined;
}

export interface VNodeData {
  // 设置 VNode 对应的 DOM 元素的属性，通过 对象。属性 的方式来设置，它内部不会去处理布尔类型的属性
  props?: Props;
  // 设置 VNode 对应的 DOM 元素的属性，通过 setAttributes 来设置，它内部不会去处理布尔类型的属性
  attrs?: Attrs;
  // 设置 VNode 对应的 DOM 元素的 class
  class?: Classes;
  // 设置 VNode 对应的 DOM 元素的 css style
  style?: VNodeStyle;
  // 设置 VNode 对应的 DOM 元素的监听事件
  on?: On;
  // 设置 VNode 对应的 key
  key?: Key;
  // svg 元素
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
