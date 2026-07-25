import type { VNode, VNodeData } from '../vnode';

export type VNodeStyle = Record<string, any>;

/**
 * snabbdom's style module has three extra lifecycles — delayed, remove and destroy — mainly
 * to support CSS animation. This implementation exists to learn how a virtual DOM works, so
 * they are left out to keep the source readable.
 * */

let reflowForced = false;

function updateStyle(oldVnode: VNode, vnode: VNode): void {
  // The new style value during the loop
  let cur: any;
  // The style name during the loop
  let name: string;
  // The DOM element
  const elm = vnode.elm;
  // The old VNode's style
  let oldStyle = (oldVnode.data as VNodeData).style;
  // The new VNode's style
  let style = (vnode.data as VNodeData).style;

  // Nothing to do when neither VNode sets a style
  if (!oldStyle && !style) return;
  // Nothing to do when both point at the same style object
  if (oldStyle === style) return;
  // Default the old style to an empty object
  oldStyle = oldStyle || {};
  // Default the new style to an empty object
  style = style || {};

  // Walk the old VNode's styles
  for (name in oldStyle) {
    // Not present on the new VNode any more
    if (!style[name]) {
      if (name[0] === '-' && name[1] === '-') {
        // A leading '--' marks a CSS custom property — drop it with removeProperty
        (elm as any).style.removeProperty(name);
      } else {
        // otherwise clear it
        (elm as any).style[name] = '';
      }
    }
  }

  // Walk the new VNode's styles
  for (name in style) {
    // The value to apply
    cur = style[name];
    if (cur !== oldStyle[name]) {
      if (name[0] === '-' && name[1] === '-') {
        // A leading '--' marks a CSS custom property — set it with setProperty
        (elm as any).style.setProperty(name, cur);
      } else {
        // otherwise assign it directly
        (elm as any).style[name] = cur;
      }
    }
  }
}

function forceReflow(): void {
  reflowForced = false;
}

function applyDestroyStyle(vnode: VNode): void {
  let style: any;
  let name: string;
  const elm = vnode.elm;
  const s = (vnode.data as VNodeData).style;
  if (!s || !(style = s.destroy)) return;
  for (name in style) {
    (elm as any).style[name] = style[name];
  }
}

function applyRemoveStyle(vnode: VNode, rm: () => void): void {
  const s = (vnode.data as VNodeData).style;
  if (!s || !s.remove) {
    rm();
    return;
  }
  if (!reflowForced) {
    // (vnode.elm as any).offsetLeft;
    reflowForced = true;
  }
  let name: string;
  const elm = vnode.elm;
  let i = 0;
  const style = s.remove;
  let amount = 0;
  const applied: string[] = [];
  for (name in style) {
    applied.push(name);
    (elm as any).style[name] = style[name];
  }
  const compStyle = getComputedStyle(elm as Element);
  const props = (compStyle as any)['transition-property'].split(', ');
  for (; i < props.length; ++i) {
    if (applied.indexOf(props[i]) !== -1) amount++;
  }
  (elm as any).addEventListener('transitionend', function (ev: TransitionEvent) {
    if (ev.target === elm) --amount;
    if (amount === 0) rm();
  });
}

export const styleModule = {
  pre: forceReflow,
  create: updateStyle,
  update: updateStyle,
  destroy: applyDestroyStyle,
  remove: applyRemoveStyle,
};
