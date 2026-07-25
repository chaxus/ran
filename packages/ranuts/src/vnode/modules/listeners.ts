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
    // A function means a single handler — invoke it with `this` bound to the vnode
    (handler as Function).call(vnode, event, vnode);
  } else if (typeof handler === 'object') {
    // An object means several handlers — invoke each in turn
    for (let i = 0; i < handler.length; i++) {
      invokeHandler(handler[i], vnode, event);
    }
  }
}

function handleEvent(event: Event, vnode: VNode) {
  const name = event.type;
  const on = vnode.data && vnode.data.on;

  // Dispatch only when a handler is registered for this event
  if (on && on[name]) {
    invokeHandler(on[name], vnode, event);
  }
}

// Each call builds its own closure, so every element gets an independent listener
function createListener() {
  return function handler(event: Event) {
    handleEvent(event, (handler as any).vnode);
  };
}

function updateEventListeners(oldVnode: VNode, vnode?: VNode): void {
  // Handlers declared on the old VNode
  const oldOn = oldVnode?.data?.on;
  // Listener already installed for the old VNode
  const oldListener = oldVnode?.listener;
  // The old VNode's DOM element
  const oldElm: Element = oldVnode.elm as Element;
  // Handlers declared on the new VNode
  const on = vnode?.data?.on;
  // Listener already installed for the new VNode
  const elm: Element = (vnode && vnode.elm) as Element;
  // Event name during the loop
  let name: string;

  // Nothing to do when both point at the same handler object
  if (oldOn === on) {
    return;
  }

  // The old VNode had a listener installed
  if (oldOn && oldListener) {
    // The new VNode declares none
    if (!on) {
      for (name in oldOn) {
        // so remove every old one
        oldElm.removeEventListener(name, oldListener, false);
      }
    } else {
      // Otherwise walk the old handlers
      for (name in oldOn) {
        // and remove the ones the new VNode dropped
        if (!on[name]) {
          oldElm.removeEventListener(name, oldListener, false);
        }
      }
    }
  }

  // The new VNode declares handlers
  if (on) {
    // Reuse the existing listener when there is one, otherwise create it
    const listener = (vnode.listener = oldVnode.listener || createListener());
    // Point the listener at the current vnode
    // listener.vnode = vnode

    // The old VNode had no handlers
    if (!oldOn) {
      // walk the new ones
      for (name in on) {
        // and attach each to the element
        elm.addEventListener(name, listener, false);
      }
    } else {
      // The old VNode had handlers:
      // walk the new ones
      for (name in on) {
        // and attach only those the old VNode did not already have
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
