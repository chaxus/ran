# WorkerClient

Web Worker 的请求/响应封装。原生 worker 只有「发消息」和「收消息」，并发发两个任务回来两条消息，
分不清哪条对应哪个。`WorkerClient` 给每条请求编号，并把响应路由回它自己的 promise。

## API

### new WorkerClient(options)

| 参数              | 说明                             | 类型                | 默认值                    |
| ----------------- | -------------------------------- | ------------------- | ------------------------- |
| `create`          | 如何创建 worker                  | `() => Worker`      | 必填                      |
| `isProgress`      | 是否为进度消息（不结束请求）     | `(res) => boolean`  | `res.type === 'progress'` |
| `getProgress`     | 取出进度负载                     | `(res) => Progress` | `res.progress`            |
| `isError`         | 是否为错误消息                   | `(res) => boolean`  | `res.type === 'error'`    |
| `getErrorMessage` | 错误文案                         | `(res) => string`   | `res.message`             |
| `timeout`         | 单请求超时（毫秒），只拒绝该请求 | `number`            | 无                        |

| 成员                                    | 说明                       |
| --------------------------------------- | -------------------------- |
| `send(request, onProgress?, transfer?)` | 发一条请求并等它的响应     |
| `dispose()`                             | 终止 worker 并拒绝全部在途 |
| `active`                                | worker 是否已创建          |
| `pendingCount`                          | 在途请求数                 |

### serveWorker(handler, options?) —— worker 侧

跑在 worker **内部**的对侧件。读回每条请求的 `operationId`，await 你的 handler，
再带着同一个 id 把结果投回去。

| 参数                 | 说明                                                       | 类型       |
| -------------------- | ---------------------------------------------------------- | ---------- |
| `handler`            | `(request, { progress }) => Response \| Promise<Response>` | `Function` |
| `options.scope`      | 监听目标，默认 `self`；接 MessagePort 或测试替身时覆盖     | object     |
| `options.resultType` | handler 返回非对象时用的响应 `type`，默认 `'result'`       | `string`   |

返回 `stop` 函数，用于移除监听。

## 示例

```js
import { WorkerClient } from 'ranuts';

const client = new WorkerClient({
  create: () => new Worker(new URL('./nlp.worker.ts', import.meta.url), { type: 'module' }),
});

await client.send({ type: 'load', modelId }, (p) => renderProgress(p.progress));
const { scores } = await client.send({ type: 'classify', lines });
client.dispose();
```

worker 侧：

```js
// nlp.worker.ts
import { serveWorker } from 'ranuts';

serveWorker(async (request, { progress }) => {
  if (request.type === 'load') {
    const device = await loadModel(request.modelId, (p) => progress(p));
    return { type: 'loaded', device };
  }
  return { type: 'result', scores: await classify(request.lines) };
});
```

## 注意

1. **worker 懒创建**，只有第一次 `send` 时才会创建：重活本来就不该在页面加载时就启动。
2. **进度消息不结束请求**，一条请求可以持续上报进度，最后只 resolve 一次。
3. **worker 崩溃会拒绝全部在途请求**。worker 内的未捕获错误不带 `operationId`，无法归属到某条请求。
4. **`dispose()` 终止并拒绝**，下次 `send` 会重建 worker。
5. **超时只拒绝该请求**，worker 继续存活。
6. **大 buffer 用 `transfer`** 转移所有权，避免结构化克隆的拷贝开销。
7. **`serveWorker` 连同步抛出的错误也会接住**。同步 throw 会逃到 worker 的 error handler，
   而这条路径不带 `operationId`，客户端只能让**所有**在途请求一起失败，没法只失败真正出问题的那一个。
8. **两端配套提供是刻意的设计**。手写 worker 端的实现，正是 id 回传和错误信封的写法最容易在不同项目之间跑偏走样的地方。
