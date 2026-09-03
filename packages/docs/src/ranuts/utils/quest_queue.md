# QuestQueue

A concurrency-limited async task queue. At most `simultaneous` tasks run at once; the rest
wait, and a slot is refilled as each one finishes. Use it for batch uploads or batch requests:
anything you cannot fire all at once.

## API

### new QuestQueue({ simultaneous })

| Parameter      | Description                     | Type     | Default |
| -------------- | ------------------------------- | -------- | ------- |
| `simultaneous` | Max concurrency; `<= 0` means 1 | `number` | `1`     |

| Member                                      | Description                                                                |
| ------------------------------------------- | -------------------------------------------------------------------------- |
| `add(task)`                                 | Enqueue a task, get **its own** result promise. Starts when a slot is free |
| `allSettled(tasks)`                         | Enqueue a batch; resolves like `Promise.allSettled`, in input order        |
| `onIdle()`                                  | Wait for the queue to drain                                                |
| `clear()`                                   | Drop everything not yet started (running tasks are untouched)              |
| `running` / `pending` / `executed` / `idle` | Live counters                                                              |

## Example

```js
import { QuestQueue } from 'ranuts';

const queue = new QuestQueue({ simultaneous: 3 });
const results = await Promise.all(urls.map((url) => queue.add(() => fetch(url))));

// Or fire and forget, then wait for everything including failures
urls.forEach((url) => queue.add(() => fetch(url)).catch(report));
await queue.onIdle();
```

## Notes

1. **FIFO**: tasks run in the order they were added.
2. **One failure does not stall the queue.** Each task rejects its own promise; the next task
   starts regardless.
3. **A task that throws synchronously is caught too**, so it cannot leak out of `add()` and
   leave the concurrency counter stuck.
4. **`allSettled` keeps input order** and reports each outcome separately.

::: warning Rewritten in 0.3
The previous implementation was unusable. `add()` only enqueued (you had to call `running()`
by hand); it popped LIFO; one promise carried the results of unrelated tasks; and
`allSettled` wrote results starting at index 1 and resolved on the first task. The
constructor's `total` option is gone: use `onIdle()` or `allSettled(tasks)` instead.
:::
