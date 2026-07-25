import { SyncHook } from './subscribe';

/** 全局事件总线：带 `subscriber` 的 signal 在变更时通过它广播 */
export const subscribers = new SyncHook();

export interface SignalOptions<T> {
  /** 事件名；给了才会在变更时通过 `subscribers` 广播，供跨模块订阅 */
  subscriber?: string;
  /**
   * 相等判定，决定「这次写入算不算变化」：
   * - 省略 / `true` —— 用 `Object.is`（引用/值相等），标准 signal 语义
   * - `false` —— 永远算变化，每次写入都通知
   * - 函数 —— 返回 true 表示相等、跳过通知。想要深比较就传 `isEqual`
   */
  equals?: boolean | ((prev: T, next: T) => boolean);
}

/**
 * @description: 创建一个带可选事件广播的最小 signal，返回 `[读, 写]`。
 *
 * 默认用 `Object.is` 判等——**不做深比较**。旧实现每次写入都 `cloneDeep` 一份快照再
 * `isEqual` 比对：一是 O(数据规模) 的拷贝落在每次写入的热路径上，二是这层深比较盖过了
 * `equals` 选项，让 `equals: false`（「永远通知」）失效。需要深比较请显式传
 * `{ equals: isEqual }`，代价就明明白白写在调用处。
 *
 * @param {T} value 初始值
 * @param {SignalOptions} options
 * @return {[() => T, (next: T) => void]}
 * @example
 * ```ts
 * const [count, setCount] = createSignal(0, { subscriber: 'count-changed' });
 * subscribers.tap('count-changed', () => render(count()));
 * setCount(1); // 触发
 * setCount(1); // 值相同，不触发
 *
 * const [tree, setTree] = createSignal(initial, { equals: isEqual }); // 需要深比较时显式声明
 * ```
 */
export const createSignal = <T = unknown>(
  value: T,
  options: SignalOptions<T> = {},
): [() => T, (newValue: T) => void] => {
  const { subscriber, equals } = options;
  let current = value;

  const changed = (prev: T, next: T): boolean => {
    if (equals === false) return true;
    // `true` 与省略同义：都走默认的 Object.is。旧实现把 `true` 当成「永远相等」，
    // 于是 `{ equals: true }` 的 signal 一次也不会更新。
    if (typeof equals === 'function') return !equals(prev, next);
    return !Object.is(prev, next);
  };

  const getter = (): T => current;

  const setter = (newValue: T): void => {
    if (!changed(current, newValue)) return;
    current = newValue;
    if (subscriber) subscribers.call(subscriber);
  };

  return [getter, setter];
};
