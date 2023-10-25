type Callback = (...args: any) => unknown;

type EventName = string | symbol;

type EventItem = {
  name?: string | symbol;
  callback: Callback;
  initialCallback?: Callback;
};

class Subscribe {
  private _events: Record<EventName, Array<EventItem>>;
  constructor() {
    this._events = {};
  }

  on = (eventName: EventName, eventItem: EventItem | Callback): void => {
    
    if (this._events[eventName] && eventName !== Symbol.for('new-listener')) {
      // 注册一个 newListener 用于监听新的事件订阅
      this.emit(Symbol.for('new-listener'), eventName);
    }

    // 由于一个事件可能注册多个回调函数，所以使用数组来存储事件队列
    const callbacks = this._events[eventName] || [];
    if (typeof eventItem === 'function') {
      callbacks.push({
        name: eventName,
        callback: eventItem,
      });
    } else {
      callbacks.push(eventItem);
    }

    this._events[eventName] = callbacks;
  };

  emit = (eventName: EventName, ...args: Array<unknown>): void => {
    const callbacks = this._events[eventName] || [];
    callbacks.forEach((item) => {
      const { callback } = item;
      callback(...args);
    });
  };

  once = (eventName: EventName, eventItem: EventItem | Callback): void => {
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
    // 由于需要在回调函数执行后，取消订阅当前事件，所以需要对传入的回调函数做一层包装,然后绑定包装后的函数

    // 考虑：如果当前事件在未执行，被用户取消订阅，能否取消？
    // 由于：我们订阅事件的时候，修改了原回调函数的引用，所以，用户触发 off 的时候不能找到对应的回调函数
    // 所以，我们需要在当前函数与用户传入的回调函数做一个绑定，我们通过自定义属性来实现
    this.on(eventName, one);
  };

  off = (eventName: EventName, eventItem: EventItem | Callback): void => {
    // 找到事件对应的回调函数，删除对应的回调函数
    const callbacks = this._events[eventName] || [];
    const newCallbacks = callbacks.filter((item) => {
      if (typeof eventItem === 'function') {
        return (
          item.callback !== eventItem && item.initialCallback !== eventItem
        );
      } else {
        const { callback } = eventItem;
        /* 用于once的取消订阅 */
        return item.callback !== callback && item.initialCallback !== callback;
      }
    });
    this._events[eventName] = newCallbacks;
  };
}

export default Subscribe;
