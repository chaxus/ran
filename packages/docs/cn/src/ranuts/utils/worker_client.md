# WorkerClient

Web Worker 的请求/响应封装。原生 worker 只有「发消息」和「收消息」，并发发两个任务回来两条消息，
分不清哪条对应哪个。`WorkerClient` 给每条请求编号，并把响应路由回它自己的 promise。

## API

### new WorkerClient(options)

| 参数              | 说明                                          | 类型                | 默认值                    |
| ----------------- | --------------------------------------------- | ------------------- | ------------------------- |
| `create`          | 如何创建 worker                               | `() => Worker`      | 必填                      |
| `isProgress`      | 是否为进度消息（不结束请求）                  | `(res) => boolean`  | `res.type === 'progress'` |
| `getProgress`     | 取出进度负载                                  | `(res) => Progress` | `res.progress`            |
| `isError`         | 是否为错误消息                                | `(res) => boolean`  | `res.type === 'error'`    |
| `getErrorMessage` | 错误文案                                      | `(res) => string`   | `res.message`             |
| `timeout`         | 单请求超时（毫秒），只拒绝该请求              | `number`            | 无                        |

| 成员                                     | 说明                       |
| ---------------------------------------- | -------------------------- |
| `send(request, onProgress?, transfer?)`  | 发一条请求并等它的响应     |
| `dispose()`                              | 终止 worker 并拒绝全部在途 |
| `active`                                 | worker 是否已创建          |
| `pendingCount`                           | 在途请求数                 |

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

worker 侧只需把 `operationId` 原样带回：

```js
self.onmessage = ({ data }) => {
  self.postMessage({ operationId: data.operationId, type: 'result', scores });
};
```

## 注意

1. **worker 懒创建**，首次 `send` 才创建 —— 重活不该在页面加载时就起。
2. **进度消息不结束请求**，一条请求可以持续上报进度，最后只 resolve 一次。
3. **worker 崩溃会拒绝全部在途请求**。worker 内的未捕获错误不带 `operationId`，无法归属到某条请求。
4. **`dispose()` 终止并拒绝**，下次 `send` 会重建 worker。
5. **超时只拒绝该请求**，worker 继续存活。
6. **大 buffer 用 `transfer`** 转移所有权，避免结构化克隆的拷贝开销。
