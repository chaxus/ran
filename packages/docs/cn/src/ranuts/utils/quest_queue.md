# QuestQueue

并发受限的异步任务队列。同时最多跑 `simultaneous` 个，其余排队，每完成一个就补位。
用于批量上传、批量请求这类「不能一次全发出去」的场景。

## API

### new QuestQueue({ simultaneous })

| 参数           | 说明                      | 类型     | 默认值 |
| -------------- | ------------------------- | -------- | ------ |
| `simultaneous` | 最大并发数；`<= 0` 视为 1 | `number` | `1`    |

| 成员                                        | 说明                                                  |
| ------------------------------------------- | ----------------------------------------------------- |
| `add(task)`                                 | 入队并返回**它自己的**结果 promise，有空位时立即开跑  |
| `allSettled(tasks)`                         | 批量入队，语义同 `Promise.allSettled`，顺序与入参一致 |
| `onIdle()`                                  | 等队列排空                                            |
| `clear()`                                   | 丢弃所有尚未开始的任务（在执行的不受影响）            |
| `running` / `pending` / `executed` / `idle` | 实时计数                                              |

## 示例

```js
import { QuestQueue } from 'ranuts';

const queue = new QuestQueue({ simultaneous: 3 });
const results = await Promise.all(urls.map((url) => queue.add(() => fetch(url))));

// 或者发完不管，最后等全部结束（含失败）
urls.forEach((url) => queue.add(() => fetch(url)).catch(report));
await queue.onIdle();
```

## 注意

1. **先进先出** —— 按入队顺序执行。
2. **单个失败不会拖垮队列**。每个任务只 reject 它自己的 promise，下一个照常开始。
3. **同步抛错的任务也会被接住**，不会漏出 `add()` 之外、让并发计数卡死。
4. **`allSettled` 保持入参顺序**，逐个上报成功/失败。

::: warning 0.3 重写
此前的实现不可用：`add()` 只入队（必须手动再调 `running()`），用 `pop()` 后进先出，
一个 promise 混装了互不相干任务的结果，`allSettled` 从下标 1 开始写结果且第一个任务完成就 resolve。
构造参数 `total` 已移除 —— 改用 `onIdle()` 或 `allSettled(tasks)`。
:::
