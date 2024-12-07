import type { VNode, VNodeData } from '../vnode';

export type VNodeStyle = Record<string, any>;

/**
 *  在 snabbdom 中 style 有三个额外的生命周期 delayed, remove 和 destroy，主要是方便我们 css 动画的使用，而我们 terdom 是为了学习虚拟 dom
 * 的原理，所以这里我删除这两个生命周期，方便源码的阅读。
 * */

let reflowForced = false;

function updateStyle(oldVnode: VNode, vnode: VNode): void {
  // 缓存遍历中当前新 VNode 中的 style
  let cur: any;
  // 缓存遍历中当前 style 的 name
  let name: string;
  // 获取 dom 节点
  const elm = vnode.elm;
  // 获取旧 VNode 的 style
  let oldStyle = (oldVnode.data as VNodeData).style;
  // 获取新 VNode 的 style
  let style = (vnode.data as VNodeData).style;

  // 如果新旧 VNode 都没有设置 style，直接返回
  if (!oldStyle && !style) return;
  // 如果新旧 VNode 的 style 完全相同，直接返回
  if (oldStyle === style) return;
  // 如果没有旧 VNode 的 style，设置为空对象
  oldStyle = oldStyle || {};
  // 如果没有新 VNode 的 style，设置为空对象
  style = style || {};

  // 遍历旧 VNode 的 style
  for (name in oldStyle) {
    // 如果新 VNode 中没有相同 name 的 style
    if (!style[name]) {
      if (name[0] === '-' && name[1] === '-') {
        // 如果是以 -- 开头，代表是 css 变量，使用 removeProperty 删除
        (elm as any).style.removeProperty(name);
      } else {
        // 否则直接设为空
        (elm as any).style[name] = '';
      }
    }
  }

  // 遍历新 VNode 中的 style
  for (name in style) {
    // 缓存当前 style 的值
    cur = style[name];
    if (cur !== oldStyle[name]) {
      if (name[0] === '-' && name[1] === '-') {
        // 如果是以 -- 开头，代表是 css 变量，使用 setProperty 设置
        (elm as any).style.setProperty(name, cur);
      } else {
        // 否则直接设置
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
