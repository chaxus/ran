export type Callback = Function;

export type EventName = string | symbol;

export type EventItem = {
  name?: string | symbol;
  callback: Callback;
  initialCallback?: Callback;
};

export const NEW_LISTENER = 'NEW_LISTENER';

export class SyncHook {
  public readonly _events = new Map<EventName, Set<EventItem>>();
  /**
   * @description: 订阅事件
   * @param {EventName} eventName
   * @param {EventItem} eventItem
   * @return {void}
   */
  public tap = (eventName: EventName, eventItem: EventItem | Callback): this => {
    if (this._events.get(eventName) && eventName !== Symbol.for(NEW_LISTENER)) {
      // 注册一个 newListener 用于监听新的事件订阅
      this.call(Symbol.for(NEW_LISTENER), eventName);
    }

    // 由于一个事件可能注册多个回调函数，所以使用数组来存储事件队列
    const callbacks = this._events.get(eventName) || new Set<EventItem>();
    if (typeof eventItem === 'function') {
      callbacks.add({
        name: eventName,
        callback: eventItem,
      });
    } else {
      callbacks.add(eventItem);
    }

    this._events.set(eventName, callbacks);
    return this;
  };
  /**
   * @description: 触发事件
   * @param {EventName} eventName
   * @param {array} args
   * @return {void}
   */
  public call = (eventName: EventName, ...args: Array<unknown>): this => {
    const callbacks = this._events.get(eventName) || new Set<EventItem>();
    callbacks.forEach((item) => {
      const { callback } = item;
      callback(...args);
    });
    return this;
  };
  /**
   * @description: 同步触发事件
   * @param {EventName} eventName
   * @param {array} args
   * @return {Promise<void>}
   */
  public callSync = async (eventName: EventName, ...args: Array<unknown>): Promise<this> => {
    const callbacks = this._events.get(eventName) || new Set<EventItem>();
    for (const item of callbacks) {
      const { callback } = item;
      await callback(...args);
    }
    return this;
  };
  /**
   * @description: 只订阅一次事件，触发后就移除事件
   * @param {EventName} eventName
   * @param {EventItem} eventItem
   * @return {void}
   */
  public once = (eventName: EventName, eventItem: EventItem | Callback): this => {
    let one: EventItem;
    if (typeof eventItem === 'function') {
      one = {
        name: eventName,
        callback: (...args: Array<unknown>) => {
          eventItem(...args);
          this.off(eventName, one);
        },
        initialCallback: eventItem,
      };
    } else {
      const { callback } = eventItem;
      one = {
        name: eventName,
        callback: (...args: Array<unknown>) => {
          callback(...args);
          this.off(eventName, one);
        },
        initialCallback: callback,
      };
    }
    // 由于需要在回调函数执行后，取消订阅当前事件，所以需要对传入的回调函数做一层包装，然后绑定包装后的函数
    // 考虑：如果当前事件在未执行，被用户取消订阅，能否取消？
    // 由于：我们订阅事件的时候，修改了原回调函数的引用，所以，用户触发 off 的时候不能找到对应的回调函数
    // 所以，我们需要在当前函数与用户传入的回调函数做一个绑定，我们通过自定义属性来实现
    this.tap(eventName, one);
    return this;
  };
  /**
   * @description: 移除订阅的事件
   * @param {EventName} eventName
   * @param {EventItem} eventItem
   * @return {void}
   */
  public off = (eventName: EventName, eventItem: EventItem | Callback): this => {
    // 找到事件对应的回调函数，删除对应的回调函数
    const callbacks = this._events.get(eventName) || new Set<EventItem>();
    const newCallbacks = [...callbacks].filter((item) => {
      if (typeof eventItem === 'function') {
        return item.callback !== eventItem && item.initialCallback !== eventItem;
      } else {
        const { callback } = eventItem;
        /* 用于 once 的取消订阅 */
        return item.callback !== callback && item.initialCallback !== callback;
      }
    });
    this._events.set(eventName, new Set(newCallbacks));
    return this;
  };
}

// SyncBailHook 是一个同步的、保险类型的 Hook，意思是只要其中一个有返回了，后面的就不执行了。

// SyncWaterfallHook 是一个同步的、瀑布式类型的 Hook。瀑布类型的钩子就是如果前一个事件函数的结果 result !== undefined，则 result 会作为后一个事件函数的第一个参数（也就是上一个函数的执行结果会成为下一个函数的参数）

// SyncLoopHook 是一个同步、循环类型的 Hook。循环类型的含义是不停的循环执行事件函数，直到所有函数结果 result === undefined，不符合条件就调头重新开始执行。

// 异步的 hook
// 异步钩子需要通过 tapAsync 函数注册事件，同时也会多一个 callback 参数，执行 callback 告诉 hook 该注册事件已经执行完成
// call 方法只有同步钩子才有，异步钩子得使用 callAsync

// AsyncParallelHook 是一个异步并行、基本类型的 Hook，它与同步 Hook 不同的地方在于：
// 它会同时开启多个异步任务，而且需要通过 tapAsync 方法来注册事件（同步 Hook 是通过 tap 方法）
// 在执行注册事件时需要使用 callAsync 方法来触发（同步 Hook 使用的是 call 方法）
// 同时，在每个注册函数的回调中，会多一个 callback 参数，它是一个函数。执行 callback 函数相当于告诉 Hook 它这一个异步任务执行完成了。

// AsyncParallelBailHook 是一个异步并行、保险类型的 Hook，只要其中一个有返回值，就会执行 callAsync 中的回调函数。

// AsyncSeriesHook 是一个异步、串行类型的 Hook，只有前面的执行完成了，后面的才会一个接一个的执行。

// AsyncSeriesBailHook 是一个异步串行、保险类型的 Hook。在串行的执行过程中，只要其中一个有返回值，后面的就不会执行了。

// AsyncSeriesWaterfallHook 是一个异步串行、瀑布类型的 Hook。如果前一个事件函数的结果 result !== undefined，则 result 会作为后一个事件函数的第一个参数（也就是上一个函数的执行结果会成为下一个函数的参数）。
