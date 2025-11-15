# SyncHook

Synchronous event hook class for implementing publish-subscribe pattern.

## API

### SyncHook

#### Main Methods

| Method     | Description                                            | Return Value    |
| ---------- | ------------------------------------------------------ | --------------- |
| `tap`      | Subscribe to event                                     | `this`          |
| `call`     | Trigger event                                          | `this`          |
| `callSync` | Synchronously trigger event (supports async callbacks) | `Promise<this>` |
| `once`     | Subscribe to event only once                           | `this`          |
| `off`      | Unsubscribe from event                                 | `this`          |

## Example

### Basic Usage

```js
import { SyncHook } from 'ranuts';

const hook = new SyncHook();

// Subscribe to event
hook.tap('event1', () => {
  console.log('Event 1 triggered');
});

// Trigger event
hook.call('event1'); // 'Event 1 triggered'
```

### Pass Parameters

```js
import { SyncHook } from 'ranuts';

const hook = new SyncHook();

hook.tap('greet', (name) => {
  console.log(`Hello, ${name}!`);
});

hook.call('greet', 'World'); // 'Hello, World!'
```

### Subscribe Once

```js
import { SyncHook } from 'ranuts';

const hook = new SyncHook();

hook.once('onceEvent', () => {
  console.log('This will only fire once');
});

hook.call('onceEvent'); // 'This will only fire once'
hook.call('onceEvent'); // Won't trigger
```

### Unsubscribe

```js
import { SyncHook } from 'ranuts';

const hook = new SyncHook();

const callback = () => {
  console.log('Callback');
};

hook.tap('event', callback);
hook.call('event'); // 'Callback'

hook.off('event', callback);
hook.call('event'); // Won't trigger
```

### Async Callbacks

```js
import { SyncHook } from 'ranuts';

const hook = new SyncHook();

hook.tap('asyncEvent', async () => {
  await new Promise((resolve) => setTimeout(resolve, 100));
  console.log('Async callback');
});

await hook.callSync('asyncEvent'); // 'Async callback'
```

## Notes

1. **Synchronous execution**: `call` method synchronously executes all callback functions.
2. **Async support**: `callSync` method supports async callbacks, waits for all callbacks to complete.
3. **Event management**: Uses Map and Set internally to manage events and callbacks.
4. **Use case**: Commonly used for event systems, plugin systems, middleware, etc.
