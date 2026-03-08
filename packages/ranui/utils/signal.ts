export const createSignal = <T = unknown>(
  value: T,
  options?: { subscriber?: Function[]; equals?: boolean | ((prev: T | undefined, next: T) => boolean) },
): [() => T, (newValue: T) => void] => {
  const signal = {
    value,
    // 订阅者
    subscribers: new Set<Function>(),
    comparator: options?.equals,
  };
  const { subscriber } = options || {};
  // 订阅
  if (subscriber && Array.isArray(subscriber)) {
    subscriber.forEach((item) => {
      if (typeof item === 'function' && !signal.subscribers.has(item)) {
        signal.subscribers.add(item);
      }
    });
  }
  const getter = () => {
    return signal.value;
  };
  const updateSignal = (newValue: T) => {
    if (signal.value !== newValue) {
      signal.value = newValue;
      // 通知订阅者
      signal.subscribers.forEach((subscriber) => subscriber(newValue));
    }
  };
  const setter = (newValue: T) => {
    const { comparator } = signal;
    if (comparator instanceof Function) {
      return !comparator(signal.value, newValue) && updateSignal(newValue);
    }
    if (comparator === undefined) {
      if (signal.value !== newValue) {
        updateSignal(newValue);
      }
    } else {
      if (!comparator) {
        updateSignal(newValue);
      }
    }
  };
  return [getter, setter];
};
