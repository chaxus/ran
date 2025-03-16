import { cloneDeep, isEqual } from './obj';
import { SyncHook } from './subscribe';

export const subscribers = new SyncHook();

export const createSignal = <T = unknown>(
  value: T,
  options?: { subscriber?: string; equals?: boolean | ((prev: T | undefined, next: T) => boolean) },
): [() => T, (newValue: T) => void] => {
  const signal = {
    value,
    compare: cloneDeep(value),
    // 订阅者
    subscribers,
    comparator: options?.equals,
  };
  const { subscriber } = options || {};

  const getter = () => {
    return signal.value;
  };
  const updateSignal = (newValue: T) => {
    if (!isEqual(signal.compare, newValue)) {
      signal.value = newValue;
      signal.compare = cloneDeep(newValue);
      // 通知订阅者
      if (subscriber) {
        signal.subscribers.call(subscriber);
      }
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
      !comparator && updateSignal(newValue);
    }
  };
  return [getter, setter];
};
