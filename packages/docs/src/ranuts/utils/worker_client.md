# WorkerClient

Request/response over a Web Worker. A raw worker only has "post a message" and "receive a
message" — send two tasks concurrently and two messages come back with no way to tell which
belongs to which. `WorkerClient` stamps an id on every request and routes each response back
to its own promise.

## API

### new WorkerClient(options)

| Parameter         | Description                                               | Type                | Default                   |
| ----------------- | --------------------------------------------------------- | ------------------- | ------------------------- |
| `create`          | How to construct the worker                               | `() => Worker`      | Required                  |
| `isProgress`      | Is this a progress message? (does not settle the request) | `(res) => boolean`  | `res.type === 'progress'` |
| `getProgress`     | Extract the progress payload                              | `(res) => Progress` | `res.progress`            |
| `isError`         | Is this an error message?                                 | `(res) => boolean`  | `res.type === 'error'`    |
| `getErrorMessage` | Error text                                                | `(res) => string`   | `res.message`             |
| `timeout`         | Per-request timeout (ms); rejects that request only       | `number`            | none                      |

| Member                                  | Description                               |
| --------------------------------------- | ----------------------------------------- |
| `send(request, onProgress?, transfer?)` | Send one request, await its response      |
| `dispose()`                             | Terminate and reject everything in flight |
| `active`                                | Whether the worker has been created       |
| `pendingCount`                          | Number of in-flight requests              |

## Example

```js
import { WorkerClient } from 'ranuts';

const client = new WorkerClient({
  create: () => new Worker(new URL('./nlp.worker.ts', import.meta.url), { type: 'module' }),
});

await client.send({ type: 'load', modelId }, (p) => renderProgress(p.progress));
const { scores } = await client.send({ type: 'classify', lines });
client.dispose();
```

The worker only has to echo the `operationId` back:

```js
self.onmessage = ({ data }) => {
  self.postMessage({ operationId: data.operationId, type: 'result', scores });
};
```

## Notes

1. **The worker is created lazily**, on the first `send` — heavy work should not start at page load.
2. **Progress messages don't settle the request**, so one request can stream many updates and
   still resolve once at the end.
3. **A worker crash rejects every in-flight request.** An uncaught error inside a worker carries
   no `operationId`, so it cannot be attributed to one request.
4. **`dispose()` terminates and rejects**; the next `send` rebuilds the worker.
5. **A timeout rejects only that request** and leaves the worker alive.
6. **Use `transfer` for large buffers** to move ownership instead of structured-cloning a copy.
