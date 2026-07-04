# Bridge (postMessage)

A small cross-context messaging layer built on top of `window.postMessage`. It lets two browsing contexts — a parent page and an `<iframe>`, a popup, or any other `Window` you hold a reference to — talk to each other with a request/response (RPC-style) API and one-way broadcasts.

Every payload is serialized with [`MessageCodec`](#messagecodec) into a Base64 string before it crosses the boundary, so arbitrary Unicode (Chinese, emoji, etc.) survives the trip intact.

There are two ways to use it:

- **`PostMessageBridge`** — the low-level primitive. One instance wraps one target `Window`. Register handlers with `on`, send-and-await with `send`, fire-and-forget with `broadcast`.
- **`BridgeManager` / `bridgeManager` / `Client` / `Platform`** — a higher-level layer that keeps a registry of named bridges (a singleton), plus thin `Client` (caller side) and `Platform` (receiver side) facades.

## API

### `PostMessageBridge`

The core class. Each instance targets a single `Window` and starts listening on `window`'s `message` event immediately.

```ts
new PostMessageBridge(targetWindow?: Window, targetOrigin?: string)
```

#### Constructor parameters

| Parameter      | Description                                                    | Type     | Default    |
| -------------- | ------------------------------------------------------------- | -------- | ---------- |
| `targetWindow` | The `Window` to post messages to (iframe, popup, `parent`, …) | `Window` | `window`   |
| `targetOrigin` | Origin to post to / accept from. `'*'` disables the check     | `string` | `'*'`      |

#### Methods

| Method                          | Description                                                                                          | Signature                                                        |
| ------------------------------- | --------------------------------------------------------------------------------------------------- | --------------------------------------------------------------- |
| `on(type, handler)`             | Register a handler for a message `type`. Its return value (or resolved value) is sent back as reply. | `<T, R>(type: string, handler: MessageHandler<T, R>) => void`   |
| `off(type)`                     | Remove the handler registered for `type`.                                                           | `(type: string) => void`                                        |
| `send(type, payload)`           | Send a message and await the response. Rejects after a 120s timeout.                                | `<T, R>(type: string, payload: T) => Promise<R>`                |
| `broadcast({ type, payload })`  | Fire-and-forget: post a message without expecting a response.                                       | `<T>(data: { type: string; payload: T }) => void`               |
| `destroy()`                     | Remove the `message` listener and clear all handlers and pending requests.                          | `() => void`                                                     |

### `BridgeManager`

A singleton registry that owns multiple named `PostMessageBridge` instances. Get the shared instance with `BridgeManager.getInstance()` or use the ready-made [`bridgeManager`](#bridgemanager-singleton) export. The constructor is private.

| Method                             | Description                                                                       | Signature                                                                                  |
| ---------------------------------- | --------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| `BridgeManager.getInstance()`      | Return the shared singleton instance.                                             | `() => BridgeManager`                                                                       |
| `connectClient(options)`           | Create and register a new bridge. Throws if `id` already exists.                  | `(options: BridgeManagerOptions) => { bridge: PostMessageBridge; id: string }`             |
| `getClient(id)`                    | Look up a registered bridge by id.                                                | `(id: string) => PostMessageBridge \| undefined`                                           |
| `removeClient(id)`                 | Destroy and unregister the bridge with this id.                                   | `(id: string) => void`                                                                      |
| `removeAllClient()`                | Destroy and unregister every bridge.                                              | `() => void`                                                                                |
| `broadcast({ type, payload })`     | Broadcast one message through every registered bridge.                            | `<T>(payload: { type: string; payload: T }) => void`                                       |
| `sendTo(id, type, payload)`        | Send a request through the bridge with this id and await the response.            | `<T, R>(id: string, type: string, payload: T) => Promise<R>`                               |

When `id` is omitted in `connectClient`, a random 10-character id is generated and returned.

### `bridgeManager` (singleton)

The pre-created shared `BridgeManager` instance, equivalent to `BridgeManager.getInstance()`. Import this instead of constructing your own.

```ts
import { bridgeManager } from 'ranuts/utils';
```

### `Client`

A thin facade over `bridgeManager` for the **calling** side (the context that initiates requests). It is a plain object, not a class.

| Method                     | Description                                          | Signature                                                                          |
| -------------------------- | --------------------------------------------------- | ---------------------------------------------------------------------------------- |
| `connect(options)`         | Connect to a target window (delegates to `bridgeManager.connectClient`). | `(options: BridgeManagerOptions) => { bridge: PostMessageBridge; id: string }`     |
| `remove(id)`               | Remove one connection by id.                        | `(id: string) => void`                                                             |
| `removeAll()`              | Remove all connections.                             | `() => void`                                                                       |
| `broadcast(payload)`       | Broadcast to all connected platforms.               | `(payload: BroadcastPayload) => void`                                             |
| `call({ id, type, payload })` | Send a request to the platform behind `id` and await the reply.        | `<T, R>(payload: CallToPayload<T>) => Promise<R>`                                 |
| `broadcastToAll(payload)`  | Post to the current window with origin `'*'`. Not recommended for security reasons. | `(payload: BroadcastPayload) => void`                             |

### `Platform`

A facade for the **receiving** side (typically the code running inside an iframe). It is a plain object with a single method.

| Method          | Description                                                                                                       | Signature                                                                       |
| --------------- | ---------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| `Platform.init(events)` | Register a map of `type -> handler`. On each incoming message it runs the matching handler and posts the result back to `event.source`. Returns a `destroy()` to tear down. | `<T, R>(events: Record<string, MessageHandler<T, R>>) => { destroy: () => void }` |

### `MessageCodec`

The serializer used under the hood by every bridge. Encodes data to a Base64 string (safe for URLs, cookies, and `postMessage`) and decodes it back, preserving all Unicode characters.

| Method                | Description                                                          | Signature                             |
| --------------------- | ------------------------------------------------------------------- | ------------------------------------- |
| `encode(data)`        | Serialize any JSON-serializable value to a Base64 string. Returns `''` on failure. | `(data: any) => string`  |
| `decode(encodedStr)`  | Parse a Base64 string back to a value. Returns `null` on failure.   | `<T>(encodedStr: string) => T \| null`|
| `encodeFile(file)`    | Encode a `File` (with metadata + bytes) to a Base64 string.         | `(file: File) => Promise<string>`     |
| `decodeFile(encoded)` | Decode a string produced by `encodeFile` back into a `File`.        | `(encoded: string) => File`           |

### Interfaces

#### `MessageHandler<T, R>`

A message handler. Receives the decoded `payload` and returns the response (may be async).

```ts
interface MessageHandler<T = unknown, R = unknown> {
  (payload: T): Promise<R> | R;
}
```

#### `MessageData<T>`

The shape of a decoded message on the wire.

| Field        | Description                                          | Type      |
| ------------ | --------------------------------------------------- | --------- |
| `type`       | Message type / channel name.                        | `string`  |
| `payload`    | The message body.                                   | `T`       |
| `id`         | Correlation id, present for request/response pairs. | `string?` |
| `isResponse` | `true` when this message is a reply.                | `boolean?`|
| `isError`    | `true` when the reply carries an error.             | `boolean?`|

#### `PendingRequest<R>`

An in-flight `send()` awaiting its response (internal bookkeeping).

| Field     | Description                        | Type                        |
| --------- | ---------------------------------- | --------------------------- |
| `resolve` | Resolve the pending promise.       | `(value: R) => void`        |
| `reject`  | Reject the pending promise.        | `(error: unknown) => void`  |

#### `BridgeManagerOptions`

Options for `connectClient` / `Client.connect`.

| Field          | Description                              | Type      | Default              |
| -------------- | ---------------------------------------- | --------- | -------------------- |
| `id`           | Explicit bridge id. Auto-generated if omitted. | `string?` | random 10-char string |
| `targetOrigin` | Origin passed to `PostMessageBridge`.    | `string?` | `'*'`                |
| `targetWindow` | Target `Window` passed to the bridge.    | `Window?` | `window`             |

#### `BroadcastPayload`

A one-way broadcast message.

| Field     | Description        | Type      |
| --------- | ------------------ | --------- |
| `type`    | Message type.      | `string`  |
| `payload` | The message body.  | `unknown` |

#### `CallToPayload<T>`

The argument to `Client.call`.

| Field     | Description                       | Type     |
| --------- | -------------------------------- | -------- |
| `id`      | Id of the target bridge/platform. | `string` |
| `type`    | Message type.                     | `string` |
| `payload` | The request body.                 | `T`      |

## Example

### Low-level: `PostMessageBridge` between a page and an iframe

**Parent page** — talk to the iframe's `contentWindow`:

```js
import { PostMessageBridge } from 'ranuts/utils';

const iframe = document.querySelector('iframe');

// Wait until the iframe is loaded, then create a bridge to it.
iframe.addEventListener('load', async () => {
  const bridge = new PostMessageBridge(iframe.contentWindow, '*');

  // Request/response: send 'getUser' and await the reply.
  const user = await bridge.send('getUser', { id: 42 });
  console.log(user); // => { id: 42, name: 'Ada' }

  // Fire-and-forget broadcast.
  bridge.broadcast({ type: 'theme:change', payload: { mode: 'dark' } });
});
```

**Inside the iframe** — register handlers:

```js
import { PostMessageBridge } from 'ranuts/utils';

// Target the parent window.
const bridge = new PostMessageBridge(window.parent, '*');

bridge.on('getUser', async ({ id }) => {
  // Whatever you return becomes the response to the caller's send().
  return { id, name: 'Ada' };
});

bridge.on('theme:change', ({ mode }) => {
  document.documentElement.dataset.theme = mode;
});
```

### High-level: `Client` (parent) and `Platform` (iframe)

**Inside the iframe** — expose a set of methods with `Platform`:

```js
import { Platform } from 'ranuts/utils';

const { destroy } = Platform.init({
  add: ({ a, b }) => a + b,
  getTime: async () => Date.now(),
});

// Later, to stop listening:
// destroy();
```

**Parent page** — connect and call by id:

```js
import { Client } from 'ranuts/utils';

const iframe = document.querySelector('iframe');

iframe.addEventListener('load', async () => {
  // Register a named connection to the iframe window.
  const { id } = Client.connect({
    id: 'calculator',
    targetWindow: iframe.contentWindow,
    targetOrigin: '*',
  });

  // Call a method exposed by Platform.init and await its result.
  const sum = await Client.call({ id, type: 'add', payload: { a: 2, b: 3 } });
  console.log(sum); // => 5

  // Broadcast to every connected platform.
  Client.broadcast({ type: 'ping', payload: Date.now() });

  // Tear down when done.
  Client.remove(id);
});
```

### Using the `bridgeManager` singleton directly

```js
import { bridgeManager } from 'ranuts/utils';

const { bridge, id } = bridgeManager.connectClient({
  targetWindow: someIframe.contentWindow,
});

const result = await bridgeManager.sendTo(id, 'ping', { at: Date.now() });

bridgeManager.removeClient(id);
```

### Encoding on its own with `MessageCodec`

```js
import { MessageCodec } from 'ranuts/utils';

const encoded = MessageCodec.encode({ msg: '你好 👋', n: 1 });
// -> a Base64 string, safe for URLs / cookies / postMessage

const decoded = MessageCodec.decode(encoded);
console.log(decoded); // => { msg: '你好 👋', n: 1 }
```

## Notes

1. **Origin check**: when `targetOrigin` is `'*'` (the default), incoming messages are not filtered by origin. Pass an explicit origin (e.g. `'https://app.example.com'`) in production so only that origin is accepted.
2. **Timeout**: `send` / `sendTo` reject with `Error('Request timeout')` if no response arrives within 120 seconds.
3. **Unique ids**: `connectClient` throws `Bridge <id> already exists` if you reuse an id. Omit `id` to get an auto-generated one.
4. **Cleanup**: each `PostMessageBridge` adds a global `message` listener — call `destroy()` (or `Client.remove` / `removeClient`) when a connection is no longer needed to avoid leaks.
5. **`broadcastToAll`**: `Client.broadcastToAll` posts to the current window with origin `'*'` and is discouraged for security reasons — prefer targeted `call` / `broadcast`.
