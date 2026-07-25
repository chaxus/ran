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
   * @description: Subscribe to an event
   * @param {EventName} eventName
   * @param {EventItem} eventItem
   * @return {void}
   */
  public tap = (eventName: EventName, eventItem: EventItem | Callback): this => {
    if (this._events.get(eventName) && eventName !== Symbol.for(NEW_LISTENER)) {
      // Emit newListener so new subscriptions can be observed
      this.call(Symbol.for(NEW_LISTENER), eventName);
    }

    // One event may carry several callbacks, so the queue is stored as a collection
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
   * @description: Emit an event
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
   * @description: Emit an event, awaiting each listener in turn
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
   * @description: Subscribe once — the listener is removed after it fires
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
    // The callback has to be unsubscribed right after it runs, so the caller's function is
    // wrapped and the wrapper is what gets registered. That raises a question: can the user
    // still unsubscribe before it fires? Registering changed the callback reference, so
    // `off` would not find the caller's function — hence the wrapper keeps a link back to
    // the original via `initialCallback`.
    this.tap(eventName, one);
    return this;
  };
  /**
   * @description: Remove a subscription
   * @param {EventName} eventName
   * @param {EventItem} eventItem
   * @return {void}
   */
  public off = (eventName: EventName, eventItem: EventItem | Callback): this => {
    // Find the callbacks registered for this event and drop the matching one
    const callbacks = this._events.get(eventName) || new Set<EventItem>();
    const newCallbacks = [...callbacks].filter((item) => {
      if (typeof eventItem === 'function') {
        return item.callback !== eventItem && item.initialCallback !== eventItem;
      } else {
        const { callback } = eventItem;
        /* used to unsubscribe a `once` listener */
        return item.callback !== callback && item.initialCallback !== callback;
      }
    });
    this._events.set(eventName, new Set(newCallbacks));
    return this;
  };
}

// Notes on the other Tapable-style hooks, for reference:

// SyncBailHook — synchronous, bailing: as soon as one listener returns a value, the rest are skipped.

// SyncWaterfallHook — synchronous, waterfall: when a listener's result !== undefined, that
// result becomes the first argument of the next listener.

// SyncLoopHook — synchronous, looping: listeners keep running until every result is
// undefined; anything else restarts the sequence from the beginning.

// Async hooks
// Async listeners are registered with tapAsync and receive an extra `callback` argument;
// calling it tells the hook that listener has finished.
// `call` only exists on sync hooks — async hooks use `callAsync`.

// AsyncParallelHook — asynchronous, parallel, basic. Unlike a sync hook it starts every
// async task at once, listeners are registered with tapAsync (not tap), the hook is fired
// with callAsync (not call), and each listener receives an extra `callback` to signal that
// its own async task is done.

// AsyncParallelBailHook — asynchronous, parallel, bailing: as soon as one listener returns a
// value, the callAsync callback runs.

// AsyncSeriesHook — asynchronous, serial: each listener starts only once the previous one finished.

// AsyncSeriesBailHook — asynchronous, serial, bailing: during the serial run, the first
// listener that returns a value skips the rest.

// AsyncSeriesWaterfallHook — asynchronous, serial, waterfall: when a listener's result
// !== undefined, that result becomes the first argument of the next listener.
