import type { VNode } from '../vnode';

export type Props = Record<string, any>;

function updateProps(oldVnode: VNode, vnode: VNode): void {
  // 用于缓存 props 的 name
  let key: string;
  // 缓存遍历中当前 props 的值
  let cur: any;
  // 缓存遍历中旧 props 的值
  let old: any;
  // 缓存 VNode 的 dom 元素
  const elm = vnode.elm;
  // 获取旧 VNode 的 props 属性
  let oldProps = oldVnode.data ? oldVnode.data.props : undefined;
  // 获取新 VNode 的 props 属性
  let props = vnode.data ? vnode.data.props : undefined;

  // 如果新旧 VNode 都没有 props 属性，直接返回
  if (!oldProps && !props) return;
  // 如果新旧 VNode 的 props 属性完全一样，直接返回
  if (oldProps === props) return;
  //  如果旧 VNode 没有 props，将其设置为空对象
  oldProps = oldProps || {};
  //  如果新 VNode 没有 props，将其设置为空对象
  props = props || {};

  // 遍历新 VNode 的 props
  for (key in props) {
    // 缓存当前 prop 属性的值
    cur = props[key];
    // 缓存旧 VNode 中同名 prop 的值
    old = oldProps[key];
    // 如果新旧 prop 值不同，同时当 dom 是含有 value 属性的元素（如：input），当前 value 值和当前 prop 值不同时，将值设置为当前 prop 的值
    if (old !== cur && (key !== 'value' || (elm as any)[key] !== cur)) {
      (elm as any)[key] = cur;
    }
  }
}

export const propsModule = { create: updateProps, update: updateProps };
