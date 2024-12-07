import type { VNode } from '../vnode';

const isFunction = (handler: unknown): handler is Function => {
  return typeof handler === 'function';
};

type Listener<T> = (this: VNode, ev: T, vnode: VNode) => void;

export type On = {
  [N in keyof HTMLElementEventMap]?: Listener<HTMLElementEventMap[N]> | Array<Listener<HTMLElementEventMap[N]>>;
} & Record<string, Listener<any> | Array<Listener<any>>>;

type SomeListener<N extends keyof HTMLElementEventMap> = Listener<HTMLElementEventMap[N]> | Listener<any>;

function invokeHandler<N extends keyof HTMLElementEventMap>(
  handler: SomeListener<N> | Array<SomeListener<N>>,
  vnode: VNode,
  event?: Event,
): void {
  if (isFunction(handler)) {
    // 如果类型是 function，说明只有一个事件监听，将 this 指向 vnode 调用
    (handler as Function).call(vnode, event, vnode);
  } else if (typeof handler === 'object') {
    // 如果类型是对象，说明有多个事件监听，遍历依次调用
    for (let i = 0; i < handler.length; i++) {
      invokeHandler(handler[i], vnode, event);
    }
  }
}

function handleEvent(event: Event, vnode: VNode) {
  const name = event.type;
  const on = vnode.data && vnode.data.on;

  // 如果 on 中存在事件监听，则进行运行
  if (on && on[name]) {
    invokeHandler(on[name], vnode, event);
  }
}

// 创建一个事件监听的闭包，这样可以确保每次创建的都是一个独立的事件监听
function createListener() {
  return function handler(event: Event) {
    handleEvent(event, (handler as any).vnode);
  };
}

function updateEventListeners(oldVnode: VNode, vnode?: VNode): void {
  // 获取旧 VNode 中监听的事件
  const oldOn = oldVnode?.data?.on;
  // 获取旧 VNode 中已经创建的监听事件
  const oldListener = oldVnode?.listener;
  // 获取旧 VNode 的 dom
  const oldElm: Element = oldVnode.elm as Element;
  // 获取新 VNode 中监听的事件
  const on = vnode?.data?.on;
  // 获取新 VNode 中已经创建的监听事件
  const elm: Element = (vnode && vnode.elm) as Element;
  // 缓存遍历中当前事件的名称
  let name: string;

  // 如果新旧 VNode 监听事件完全一样，直接返回
  if (oldOn === on) {
    return;
  }

  // 如果旧 VNode 中有已经创建的事件监听
  if (oldOn && oldListener) {
    // 如果新 VNode 中没有事件监听
    if (!on) {
      for (name in oldOn) {
        // 删除旧 VNode 中的事件监听
        oldElm.removeEventListener(name, oldListener, false);
      }
    } else {
      // 如果新 VNode 中有事件监听，则遍历旧 VNode
      for (name in oldOn) {
        // 如果新 VNode 中没有当前的事件监听，则删除该事件监听
        if (!on[name]) {
          oldElm.removeEventListener(name, oldListener, false);
        }
      }
    }
  }

  // 如果新 VNode 有事件监听
  if (on) {
    // 如果新 VNode 上已经存在事件监听，则直接继承，如果没有则创建一个新事件监听
    const listener = (vnode.listener = oldVnode.listener || createListener());
    // 更新 listener 上的 vnode
    // listener.vnode = vnode

    // 如果旧 VNode 没有事件监听
    if (!oldOn) {
      // 遍历新 VNode 上的事件监听
      for (name in on) {
        // 将其添加到 dom 上
        elm.addEventListener(name, listener, false);
      }
    } else {
      // 如果旧 VNode 有事件监听
      // 遍历新 VNode 上的事件监听
      for (name in on) {
        // 将旧 VNode 上没有的事件监听添加到 dom 上
        if (!oldOn[name]) {
          elm.addEventListener(name, listener, false);
        }
      }
    }
  }
}

export const eventListenersModule = {
  create: updateEventListeners,
  update: updateEventListeners,
  destroy: updateEventListeners,
};
