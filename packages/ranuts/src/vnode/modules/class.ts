import type { VNode } from '../vnode';

export type Classes = Record<string, boolean>;

function updateClass(oldVnode: VNode, vnode: VNode): void {
  // The class flag during the loop
  let cur: any;
  // The class name during the loop
  let name: string;
  // The new VNode's DOM element
  const elm: Element = vnode.elm as Element;
  // The old VNode's class map
  let oldClass = oldVnode.data && oldVnode.data.class;
  // The new VNode's class map
  let className = vnode.data && vnode.data.class;

  // Nothing to do when neither VNode has classes
  if (!oldClass && !className) return;
  // Nothing to do when both point at the same object
  if (oldClass === className) return;
  // Default the old classes to an empty object
  oldClass = oldClass || {};
  // Default the new classes to an empty object
  className = className || {};

  // Walk the old VNode's classes
  for (name in oldClass) {
    // Remove any class the new VNode no longer declares
    if (oldClass[name] && !Object.prototype.hasOwnProperty.call(className, name)) {
      elm.classList.remove(name);
    }
  }
  // Walk the new VNode's classes
  for (name in className) {
    // When the flag changed, add it for true and remove it for false
    cur = className[name];
    if (cur !== oldClass[name]) {
      (elm.classList as any)[cur ? 'add' : 'remove'](name);
    }
  }
}

export const classModule = { create: updateClass, update: updateClass };
