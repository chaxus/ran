import type { VNode } from '../vnode';

export type Props = Record<string, any>;

function updateProps(oldVnode: VNode, vnode: VNode): void {
  // Property name during the loop
  let key: string;
  // The new value
  let cur: any;
  // The old value
  let old: any;
  // The VNode's DOM element
  const elm = vnode.elm;
  // The old VNode's props
  let oldProps = oldVnode.data ? oldVnode.data.props : undefined;
  // The new VNode's props
  let props = vnode.data ? vnode.data.props : undefined;

  // Nothing to do when neither VNode has props
  if (!oldProps && !props) return;
  // Nothing to do when both point at the same props object
  if (oldProps === props) return;
  // Default the old props to an empty object
  oldProps = oldProps || {};
  // Default the new props to an empty object
  props = props || {};

  // Walk the new VNode's props
  for (key in props) {
    // The new value
    cur = props[key];
    // The old value for the same name
    old = oldProps[key];
    // Write when the values differ — and for elements carrying a live `value` (an input, say), only when the element's current value differs too, so typing is not clobbered
    if (old !== cur && (key !== 'value' || (elm as any)[key] !== cur)) {
      (elm as any)[key] = cur;
    }
  }
}

export const propsModule = { create: updateProps, update: updateProps };
