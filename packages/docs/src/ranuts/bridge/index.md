# Bridge (postMessage)

A small cross-context messaging layer built on top of `window.postMessage`. It lets two browsing contexts — a parent page and an `<iframe>`, a popup, or any other `Window` you hold a reference to — talk to each other with a request/response (RPC-style) API and one-way broadcasts.

Messages cross the boundary as **structured objects** (using `postMessage`'s native structured clone algorithm), so types like `Date`, `Map`, `Set`, `ArrayBuffer`, and `File` survive intact with no manual serialization. Each message carries a protocol marker so it can be told apart from other libraries' `postMessage` traffic (HMR, DevTools, third-party SDKs).

There are three ways to use it:

- **`PostMessageBridge`** — the low-level primitive. One instance wraps one target `Window`. Register handlers with `on`, send-and-await with `send`, fire-and-forget with `broadcast`.
- **`BridgeManager` / `bridgeManager` / `Client` / `Platform`** — a higher-level layer that keeps a registry of named bridges (a singleton), plus thin `Client` (caller side) and `Platform` (receiver side) facades.
- **`openPortBridge` / `acceptPortBridge` / `createPortBridge`** — a point-to-point bridge built on `MessageChannel` / `MessagePort` (**recommended for new code**). After a one-time handshake each side holds a private port, structurally avoiding cross-window cross-talk, source spoofing, same-window channel collisions, and self-answering — with no origin filtering needed.

> **Compatibility**: the wire format is a structured object (no longer a Base64 string). Same-version endpoints interoperate directly, and `Client` (`PostMessageBridge`) shares one envelope protocol with `Platform`. An old-page ↔ new-page mix across versions will not agree on the protocol.

## API

### `PostMessageBridge`

The core class. Each instance targets a single `Window`. All instances share **one** `message` listener on `window` (routed by an internal dispatcher) rather than each adding its own, so the listener count does not grow with the number of instances.

```ts
new PostMessageBridge(targetWindow?: Window, targetOrigin?: string, channel?: string)
```

#### Constructor parameters

| Parameter      | Description                                                                                               | Type     | Default     |
| -------------- | --------------------------------------------------------------------------------------------------------- | -------- | ----------- |
| `targetWindow` | The `Window` to post messages to (iframe, popup, `parent`, …)                                             | `Window` | `window`    |
| `targetOrigin` | Origin to post to / accept from. `'*'` disables the check                                                 | `string` | `'*'`       |
| `channel`      | Channel id. Isolates **multiple bridges on the same window**: both ends must use the same channel to talk | `string` | `'default'` |

#### Methods

| Method                         | Description                                                                                              | Signature                                                     |
| ------------------------------ | -------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------- |
| `on(type, handler)`            | Register a handler for a message `type`. Its return value (or resolved value) is sent back as reply.     | `<T, R>(type: string, handler: MessageHandler<T, R>) => void` |
| `off(type)`                    | Remove the handler registered for `type`.                                                                | `(type: string) => void`                                      |
| `send(type, payload)`          | Send a message and await the response. Rejects with the remote handler's error, or after a 120s timeout. | `<T, R>(type: string, payload: T) => Promise<R>`              |
| `broadcast({ type, payload })` | Fire-and-forget: post a message without expecting a response.                                            | `<T>(data: { type: string; payload: T }) => void`             |
| `destroy()`                    | Unregister from the dispatcher, clear all handlers, and reject all pending requests.                     | `() => void`                                                  |

> **Self-answer guard**: each instance carries a unique sender id and will **not** handle a request it sent itself. To do request/response **within a single window**, use two bridge instances (one registers handlers, one sends).

### `BridgeManager`

A singleton registry that owns multiple named `PostMessageBridge` instances. Get the shared instance with `BridgeManager.getInstance()` or use the ready-made [`bridgeManager`](#bridgemanager-singleton) export. The constructor is private.

| Method                         | Description                                                            | Signature                                                                      |
| ------------------------------ | ---------------------------------------------------------------------- | ------------------------------------------------------------------------------ |
| `BridgeManager.getInstance()`  | Return the shared singleton instance.                                  | `() => BridgeManager`                                                          |
| `connectClient(options)`       | Create and register a new bridge. Throws if `id` already exists.       | `(options: BridgeManagerOptions) => { bridge: PostMessageBridge; id: string }` |
| `getClient(id)`                | Look up a registered bridge by id.                                     | `(id: string) => PostMessageBridge \| undefined`                               |
| `removeClient(id)`             | Destroy and unregister the bridge with this id.                        | `(id: string) => void`                                                         |
| `removeAllClient()`            | Destroy and unregister every bridge.                                   | `() => void`                                                                   |
| `broadcast({ type, payload })` | Broadcast one message through every registered bridge.                 | `<T>(payload: { type: string; payload: T }) => void`                           |
| `sendTo(id, type, payload)`    | Send a request through the bridge with this id and await the response. | `<T, R>(id: string, type: string, payload: T) => Promise<R>`                   |

When `id` is omitted in `connectClient`, a random 10-character id is generated and returned. `options` also accepts `channel` (forwarded to the underlying `PostMessageBridge`).

### `bridgeManager` (singleton)

The pre-created shared `BridgeManager` instance, equivalent to `BridgeManager.getInstance()`. Import this instead of constructing your own.

```ts
import { bridgeManager } from 'ranuts/utils';
```

### `Client`

A thin facade over `bridgeManager` for the **calling** side (the context that initiates requests). It is a plain object, not a class.

| Method                        | Description                                                                         | Signature                                                                      |
| ----------------------------- | ----------------------------------------------------------------------------------- | ------------------------------------------------------------------------------ |
| `connect(options)`            | Connect to a target window (delegates to `bridgeManager.connectClient`).            | `(options: BridgeManagerOptions) => { bridge: PostMessageBridge; id: string }` |
| `remove(id)`                  | Remove one connection by id.                                                        | `(id: string) => void`                                                         |
| `removeAll()`                 | Remove all connections.                                                             | `() => void`                                                                   |
| `broadcast(payload)`          | Broadcast to all connected platforms.                                               | `(payload: BroadcastPayload) => void`                                          |
| `call({ id, type, payload })` | Send a request to the platform behind `id` and await the reply.                     | `<T, R>(payload: CallToPayload<T>) => Promise<R>`                              |
| `broadcastToAll(payload)`     | Post to the current window with origin `'*'`. Not recommended for security reasons. | `(payload: BroadcastPayload) => void`                                          |

### `Platform`

A facade for the **receiving** side (typically the code running inside an iframe). It is a plain object with a single method, and shares the same envelope protocol as `Client` (`PostMessageBridge`) so the two ends interoperate directly.

| Method                  | Description                                                                                                                                                                                                                                 | Signature                                                                         |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------- |
| `Platform.init(events)` | Register a map of `type -> handler`. On each incoming message it runs the matching handler and posts the result back to `event.source`; if the handler throws, the error is sent back (caller rejects). Returns a `destroy()` to tear down. | `<T, R>(events: Record<string, MessageHandler<T, R>>) => { destroy: () => void }` |

### PortBridge (MessagePort-based, recommended for new code)

A point-to-point bridge built on `MessageChannel` / `MessagePort`. A port is a **private-channel capability** the browser provides: only the two sides that obtained the port during the handshake can communicate. That structurally avoids cross-window cross-talk, source spoofing, same-window channel collisions, and self-answering — with no origin filtering and no protocol marker needed. Payloads use structured clone too.

| Function                     | Description                                                                                                  | Signature                                                    |
| ---------------------------- | ------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------ |
| `openPortBridge(options)`    | **Initiator**: create a `MessageChannel`, hand one port to the target window, keep the other end.            | `(options: OpenPortBridgeOptions) => PortBridge`             |
| `acceptPortBridge(options?)` | **Receiver**: wait for the port handed over by the initiator; resolves to a bridge once received.            | `(options?: AcceptPortBridgeOptions) => Promise<PortBridge>` |
| `createPortBridge(port)`     | Build a bridge over **any** `MessagePort` (e.g. a Web Worker / SharedWorker, or an already-handshaked port). | `(port: MessagePort) => PortBridge`                          |

The returned `PortBridge` exposes the same `on` / `off` / `send` / `broadcast` / `destroy` as `PostMessageBridge`.

- **`OpenPortBridgeOptions`**: `{ targetWindow: Window; targetOrigin?: string; name?: string }` — `name` distinguishes multiple independent port connections in one page and must match on both ends (default `'default'`).
- **`AcceptPortBridgeOptions`**: `{ targetOrigin?: string; name?: string }`.

### `MessageCodec`

Encodes data to a Base64 string and decodes it back, preserving all Unicode characters (Chinese, emoji, etc.). Useful for carrying structured data through **string-only channels** (URLs, cookies, `localStorage`, …).

> Note: the bridge **no longer** uses this to serialize each message (it uses structured clone). It is still exported as a standalone tool for string-channel scenarios.

| Method                | Description                                                                        | Signature                              |
| --------------------- | ---------------------------------------------------------------------------------- | -------------------------------------- |
| `encode(data)`        | Serialize any JSON-serializable value to a Base64 string. Returns `''` on failure. | `(data: any) => string`                |
| `decode(encodedStr)`  | Parse a Base64 string back to a value. Returns `null` on failure.                  | `<T>(encodedStr: string) => T \| null` |
| `encodeFile(file)`    | Encode a `File` (with metadata + bytes) to a Base64 string.                        | `(file: File) => Promise<string>`      |
| `decodeFile(encoded)` | Decode a string produced by `encodeFile` back into a `File`.                       | `(encoded: string) => File`            |

### Interfaces

#### `MessageHandler<T, R>`

A message handler. Receives the `payload` and returns the response (may be async).

```ts
interface MessageHandler<T = unknown, R = unknown> {
  (payload: T): Promise<R> | R;
}
```

#### `MessageData<T>`

The shape of a message on the wire (the envelope).

| Field        | Description                                          | Type       |
| ------------ | ---------------------------------------------------- | ---------- |
| `type`       | Message type / channel name.                         | `string`   |
| `payload`    | The message body.                                    | `T`        |
| `id`         | Correlation id, present for request/response pairs.  | `string?`  |
| `isResponse` | `true` when this message is a reply.                 | `boolean?` |
| `isError`    | `true` when the reply carries an error.              | `boolean?` |
| `channel`    | Channel id, isolates multiple bridges on one window. | `string?`  |
| `senderId`   | Sender instance id, used to avoid self-answering.    | `string?`  |

#### `PendingRequest<R>`

An in-flight `send()` awaiting its response (internal bookkeeping).

| Field     | Description                  | Type                       |
| --------- | ---------------------------- | -------------------------- |
| `resolve` | Resolve the pending promise. | `(value: R) => void`       |
| `reject`  | Reject the pending promise.  | `(error: unknown) => void` |

#### `BridgeManagerOptions`

Options for `connectClient` / `Client.connect`.

| Field          | Description                                                    | Type      | Default               |
| -------------- | -------------------------------------------------------------- | --------- | --------------------- |
| `id`           | Explicit bridge id. Auto-generated if omitted.                 | `string?` | random 10-char string |
| `targetOrigin` | Origin passed to `PostMessageBridge`.                          | `string?` | `'*'`                 |
| `targetWindow` | Target `Window` passed to the bridge.                          | `Window?` | `window`              |
| `channel`      | Channel id; set explicitly to isolate same-window connections. | `string?` | `'default'`           |

#### `BroadcastPayload`

A one-way broadcast message.

| Field     | Description       | Type      |
| --------- | ----------------- | --------- |
| `type`    | Message type.     | `string`  |
| `payload` | The message body. | `unknown` |

#### `CallToPayload<T>`

The argument to `Client.call`.

| Field     | Description                       | Type     |
| --------- | --------------------------------- | -------- |
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

### Point-to-point: `openPortBridge` / `acceptPortBridge` (recommended)

**Parent page** (initiator) — create a channel and hand one end to the iframe:

```js
import { openPortBridge } from 'ranuts/utils';

const iframe = document.querySelector('iframe');

iframe.addEventListener('load', async () => {
  const bridge = openPortBridge({
    targetWindow: iframe.contentWindow,
    targetOrigin: 'https://app.example.com',
  });

  const pong = await bridge.send('ping', { n: 1 });
  console.log(pong); // => 2
});
```

**Inside the iframe** (receiver) — wait for the handed-over port:

```js
import { acceptPortBridge } from 'ranuts/utils';

const bridge = await acceptPortBridge({ targetOrigin: 'https://parent.example.com' });

bridge.on('ping', ({ n }) => n + 1);
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

### Encoding on its own with `MessageCodec` (string-channel scenarios)

```js
import { MessageCodec } from 'ranuts/utils';

const encoded = MessageCodec.encode({ msg: '你好 👋', n: 1 });
// -> a Base64 string, safe for URLs / cookies / localStorage

const decoded = MessageCodec.decode(encoded);
console.log(decoded); // => { msg: '你好 👋', n: 1 }
```

## Notes

1. **Serialization**: the bridge communicates with structured objects (structured clone), so `Date`, `Map`, `Set`, `ArrayBuffer`, `File`, etc. are preserved without `MessageCodec`. If a `payload` is not cloneable (a function, a DOM node), `send` rejects immediately.
2. **Protocol marker**: only messages carrying the internal protocol marker are processed; other libraries' `postMessage` traffic is ignored.
3. **Origin check**: when `targetOrigin` is `'*'` (the default), incoming messages are not filtered by origin. Pass an explicit origin (e.g. `'https://app.example.com'`) in production so only that origin is accepted.
4. **Error propagation**: when a remote handler throws, `send` / `sendTo` / `Client.call` reject with that error (instead of resolving with the error text as if it were a valid result).
5. **Timeout**: `send` / `sendTo` reject with `Error('Request timeout')` if no response arrives within 120 seconds.
6. **Channel isolation**: to run multiple bridges on the same window, pass the same `channel` to both ends so they don't cross-talk.
7. **Unique ids**: `connectClient` throws `Bridge <id> already exists` if you reuse an id. Omit `id` to get an auto-generated one.
8. **Cleanup**: all `PostMessageBridge` instances share one global `message` listener (removed automatically after the last bridge is destroyed). Call `destroy()` (or `Client.remove` / `removeClient`) when a connection is no longer needed to reject pending requests and free resources.
9. **Non-browser environments**: without `window` (Node / SSR), constructing a `PostMessageBridge` does not throw; `send` rejects with a clear error, and `broadcast` / `destroy` degrade to no-ops.
10. **Prefer PortBridge**: for new code, use `openPortBridge` / `acceptPortBridge` — a point-to-point channel structurally avoids cross-talk, spoofing, and self-answering.
11. **`broadcastToAll`**: `Client.broadcastToAll` posts to the current window with origin `'*'` and is discouraged for security reasons — prefer targeted `call` / `broadcast`.
