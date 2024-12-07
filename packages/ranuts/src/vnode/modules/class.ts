import type { VNode } from '../vnode';

export type Classes = Record<string, boolean>;

function updateClass(oldVnode: VNode, vnode: VNode): void {
  // 用于缓存遍历中当前 class 属性的值
  let cur: any;
  // 用于缓存遍历中当前 class 的 name
  let name: string;
  // 获取新 VNode 的 dom 元素
  const elm: Element = vnode.elm as Element;
  // 获取旧 VNode 的 class 数据
  let oldClass = oldVnode.data && oldVnode.data.class;
  // 获取新 VNode 的 class 数据
  let className = vnode.data && vnode.data.class;

  // 如果新旧 VNode 都没有 class，直接返回
  if (!oldClass && !className) return;
  // 如果新旧 VNode 完全相同，直接返回
  if (oldClass === className) return;
  // 如果旧 VNode 没有 class，将其设置为空对象
  oldClass = oldClass || {};
  // 如果新 VNode 没有 class，将其设置为空对象
  className = className || {};

  // 遍历旧 VNode 的 class
  for (name in oldClass) {
    // 如果当前 class 旧 VNode 上有但新 VNode 没有，则删除该 VNode
    if (oldClass[name] && !Object.prototype.hasOwnProperty.call(className, name)) {
      elm.classList.remove(name);
    }
  }
  // 遍历新 Vnodde 的 class
  for (name in className) {
    // 如果新旧 VNode 的 class 值不同，则根据新 VNode 的 class 值是 true or false 来判断是新增还是删除 class
    cur = className[name];
    if (cur !== oldClass[name]) {
      (elm.classList as any)[cur ? 'add' : 'remove'](name);
    }
  }
}

export const classModule = { create: updateClass, update: updateClass };
