# withTimeout / deferred

JavaScript 没有内建的两个 Promise 原语：可以从外部结束的 promise，以及带上限的等待。

## API

| 函数                                                     | 说明                                           |
| -------------------------------------------------------- | ---------------------------------------------- |
| `deferred<T>()`                                          | `{ promise, resolve, reject }` —— 从外部结束它 |
| `withTimeout(promise, ms, options?)`                     | `ms` 内未结束则以 `TimeoutError` 拒绝          |
| `withTimeoutFallback(promise, ms, fallback, onTimeout?)` | 超时时返回兜底值，而不是拒绝                   |
| `delay(ms)`                                              | `ms` 毫秒后 resolve                            |
| `TimeoutError`                                           | `withTimeout` 抛出的错误类型                   |

### `withTimeout` 选项

| 选项        | 说明                                          | 默认值                             |
| ----------- | --------------------------------------------- | ---------------------------------- |
| `message`   | 错误信息                                      | `operation timed out after {ms}ms` |
| `onTimeout` | 超时时调用，用于收尾（中断请求、终止 worker） | —                                  |

## 示例

### 给请求设上限，并在超时时中断

```js
import { withTimeout } from 'ranuts';

const controller = new AbortController();
const res = await withTimeout(fetch(url, { signal: controller.signal }), 5000, {
  message: 'fetch timed out',
  onTimeout: () => controller.abort(),
});
```

### 降级而不是失败

```js
import { withTimeoutFallback } from 'ranuts';

// 保存太慢时返回原文件，而不是让整个流程失败。
const file = await withTimeoutFallback(editor.requestSave(), 60_000, originalFile);
```

### 在回调里结束一个 promise

```js
import { deferred } from 'ranuts';

const ready = deferred();
sdk.onReady((editor) => ready.resolve(editor));
sdk.onError((error) => ready.reject(error));

const editor = await ready.promise;
```

### 串行执行并带上限

```js
import { QuestQueue, withTimeout } from 'ranuts';

const queue = new QuestQueue({ simultaneous: 1 });
await queue.add(() => withTimeout(recreateEditor(config), 30_000));
```

## 注意事项

1. **定时器一定会被清理**，包括任务先完成的情况。常见的手写版本
   —— `Promise.race([task, new Promise((_, r) => setTimeout(r, ms))])` —— 在任务先完成时会把
   定时器漏掉：在 Node 里让进程多活满一个超时周期，在测试里则留下一个会打到下一个用例的定时器。

2. **超时不会取消任务**。promise 本身无法取消，中断请求、终止 worker、关闭连接这些事要在
   `onTimeout` 里做。

3. **`withTimeoutFallback` 只吞掉超时**。被包装的 promise 真正 reject 时仍然向外抛
   —— 超时不算错误，但错误依然是错误。

4. **`delay` 用裸 `setTimeout`**，因此在 Node、Web Worker、浏览器里都能用；
   `window.setTimeout` 在没有 document 的环境会抛 ReferenceError。

5. **`deferred` 优于在外层声明 `let`**。把 executor 的参数赋给外层变量是常见替代写法，但
   TypeScript 无法证明它们已被赋值，而且很容易写出微妙的错误。
