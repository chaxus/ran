export interface Debounced<T extends (...args: any[]) => any> {
  (this: unknown, ...args: Parameters<T>): void;
  /** 取消尚未触发的那次调用 */
  cancel: () => void;
  /** 立即触发挂起的那次调用（表单提交前强制落盘等） */
  flush: () => void;
  /** 是否有调用正在等待触发 */
  pending: () => boolean;
}

/**
 * @description: 防抖——连续触发时只在**停止触发 ms 毫秒后**执行最后一次。
 * 用于输入联想、窗口 resize、自动保存这类「只关心最终状态」的场景。
 *
 * 保留调用时的 `this` 与最后一次的参数。返回的函数带 `cancel` / `flush`：
 * 组件卸载时应 `cancel()`，否则挂起的定时器会在已销毁的上下文里执行。
 *
 * @param {Function} fn 要防抖的函数
 * @param {number} ms 静默时长，默认 500
 * @return {Debounced} 带 cancel / flush / pending 的包装函数
 * @example
 * ```ts
 * const save = debounce((draft: string) => api.save(draft), 800);
 * input.addEventListener('input', (e) => save(e.target.value));
 * onUnmount(() => save.cancel());
 * ```
 */
export const debounce = <T extends (...args: any[]) => any>(fn: T, ms = 500): Debounced<T> => {
  let timer: ReturnType<typeof setTimeout> | null = null;
  let lastThis: unknown;
  let lastArgs: Parameters<T> | null = null;

  const invoke = (): void => {
    timer = null;
    if (!lastArgs) return;
    const args = lastArgs;
    const context = lastThis;
    lastArgs = null;
    lastThis = undefined;
    fn.apply(context, args);
  };

  // 必须是 function 而不是箭头函数：箭头函数的 this 在定义处就绑死了模块作用域，
  // 挂在对象上调用（`obj.handler()`）时拿不到 obj。
  const debounced = function (this: unknown, ...args: Parameters<T>): void {
    lastThis = this;
    lastArgs = args;
    if (timer !== null) clearTimeout(timer);
    timer = setTimeout(invoke, ms);
  } as Debounced<T>;

  debounced.cancel = (): void => {
    if (timer !== null) clearTimeout(timer);
    timer = null;
    lastArgs = null;
    lastThis = undefined;
  };
  debounced.flush = (): void => {
    if (timer === null) return;
    clearTimeout(timer);
    invoke();
  };
  debounced.pending = (): boolean => timer !== null;

  return debounced;
};
