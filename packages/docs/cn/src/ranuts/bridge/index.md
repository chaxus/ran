# Bridge（postMessage）

一个构建在 `window.postMessage` 之上的轻量级跨上下文通信层。它让两个浏览上下文——父页面与 `<iframe>`、弹窗，或任何你持有引用的 `Window`——通过请求/响应（类 RPC）的 API 以及单向广播互相通信。

每个消息体在跨越边界之前都会被 [`MessageCodec`](#messagecodec) 序列化为 Base64 字符串，因此任意 Unicode 字符（中文、emoji 等）都能完整地传递过去。

有两种使用方式：

- **`PostMessageBridge`** —— 底层原语。一个实例封装一个目标 `Window`。用 `on` 注册处理器，用 `send` 发送并等待响应，用 `broadcast` 发送且不等待响应。
- **`BridgeManager` / `bridgeManager` / `Client` / `Platform`** —— 更上层的封装，维护一个具名 bridge 的注册表（单例），并提供轻量的 `Client`（调用方）和 `Platform`（接收方）门面。

## API

### `PostMessageBridge`

核心类。每个实例指向单个 `Window`，并在创建后立即开始监听 `window` 上的 `message` 事件。

```ts
new PostMessageBridge(targetWindow?: Window, targetOrigin?: string)
```

#### 构造函数参数

| 参数           | 说明                                                   | 类型     | 默认值   |
| -------------- | ------------------------------------------------------ | -------- | -------- |
| `targetWindow` | 要向其发送消息的 `Window`（iframe、弹窗、`parent` 等） | `Window` | `window` |
| `targetOrigin` | 发送到 / 接受自的源。`'*'` 表示不做校验                | `string` | `'*'`    |

#### 方法

| 方法                           | 说明                                                                      | 签名                                                          |
| ------------------------------ | ------------------------------------------------------------------------- | ------------------------------------------------------------- |
| `on(type, handler)`            | 为某个消息 `type` 注册处理器。其返回值（或 resolve 的值）会作为响应回传。 | `<T, R>(type: string, handler: MessageHandler<T, R>) => void` |
| `off(type)`                    | 移除为 `type` 注册的处理器。                                              | `(type: string) => void`                                      |
| `send(type, payload)`          | 发送消息并等待响应。超过 120 秒未响应则 reject。                          | `<T, R>(type: string, payload: T) => Promise<R>`              |
| `broadcast({ type, payload })` | 只发送不等待响应。                                                        | `<T>(data: { type: string; payload: T }) => void`             |
| `destroy()`                    | 移除 `message` 监听器，并清空所有处理器与挂起的请求。                     | `() => void`                                                  |

### `BridgeManager`

一个单例注册表，管理多个具名的 `PostMessageBridge` 实例。通过 `BridgeManager.getInstance()` 获取共享实例，或直接使用现成的 [`bridgeManager`](#bridgemanager-单例) 导出。构造函数为私有。

| 方法                           | 说明                                              | 签名                                                                           |
| ------------------------------ | ------------------------------------------------- | ------------------------------------------------------------------------------ |
| `BridgeManager.getInstance()`  | 返回共享的单例实例。                              | `() => BridgeManager`                                                          |
| `connectClient(options)`       | 创建并注册一个新的 bridge。若 `id` 已存在则抛错。 | `(options: BridgeManagerOptions) => { bridge: PostMessageBridge; id: string }` |
| `getClient(id)`                | 按 id 查找已注册的 bridge。                       | `(id: string) => PostMessageBridge \| undefined`                               |
| `removeClient(id)`             | 销毁并注销指定 id 的 bridge。                     | `(id: string) => void`                                                         |
| `removeAllClient()`            | 销毁并注销所有 bridge。                           | `() => void`                                                                   |
| `broadcast({ type, payload })` | 通过所有已注册的 bridge 广播一条消息。            | `<T>(payload: { type: string; payload: T }) => void`                           |
| `sendTo(id, type, payload)`    | 通过指定 id 的 bridge 发送请求并等待响应。        | `<T, R>(id: string, type: string, payload: T) => Promise<R>`                   |

在 `connectClient` 中省略 `id` 时，会生成并返回一个随机的 10 位字符 id。

### `bridgeManager`（单例）

预先创建好的共享 `BridgeManager` 实例，等价于 `BridgeManager.getInstance()`。请直接导入它，而不是自行构造。

```ts
import { bridgeManager } from 'ranuts/utils';
```

### `Client`

针对**调用方**（发起请求的上下文）的 `bridgeManager` 门面。它是一个普通对象，而非类。

| 方法                          | 说明                                                     | 签名                                                                           |
| ----------------------------- | -------------------------------------------------------- | ------------------------------------------------------------------------------ |
| `connect(options)`            | 连接到目标窗口（委托给 `bridgeManager.connectClient`）。 | `(options: BridgeManagerOptions) => { bridge: PostMessageBridge; id: string }` |
| `remove(id)`                  | 按 id 移除一个连接。                                     | `(id: string) => void`                                                         |
| `removeAll()`                 | 移除所有连接。                                           | `() => void`                                                                   |
| `broadcast(payload)`          | 向所有已连接的 platform 广播。                           | `(payload: BroadcastPayload) => void`                                          |
| `call({ id, type, payload })` | 向 `id` 对应的 platform 发送请求并等待响应。             | `<T, R>(payload: CallToPayload<T>) => Promise<R>`                              |
| `broadcastToAll(payload)`     | 以源 `'*'` 向当前窗口发送。出于安全考虑不推荐使用。      | `(payload: BroadcastPayload) => void`                                          |

### `Platform`

针对**接收方**（通常是运行在 iframe 内的代码）的门面。它是一个只含单个方法的普通对象。

| 方法                    | 说明                                                                                                                              | 签名                                                                              |
| ----------------------- | --------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------- |
| `Platform.init(events)` | 注册一个 `type -> handler` 的映射。每次收到消息时运行匹配的处理器，并将结果回传给 `event.source`。返回一个 `destroy()` 用于卸载。 | `<T, R>(events: Record<string, MessageHandler<T, R>>) => { destroy: () => void }` |

### `MessageCodec`

每个 bridge 底层使用的序列化工具。将数据编码为 Base64 字符串（可安全用于 URL、Cookie 和 `postMessage`）并解码回来，且保留所有 Unicode 字符。

| 方法                  | 说明                                                            | 签名                                   |
| --------------------- | --------------------------------------------------------------- | -------------------------------------- |
| `encode(data)`        | 将任意可 JSON 序列化的值编码为 Base64 字符串。失败时返回 `''`。 | `(data: any) => string`                |
| `decode(encodedStr)`  | 将 Base64 字符串解析回原始值。失败时返回 `null`。               | `<T>(encodedStr: string) => T \| null` |
| `encodeFile(file)`    | 将 `File`（含元数据与字节）编码为 Base64 字符串。               | `(file: File) => Promise<string>`      |
| `decodeFile(encoded)` | 将 `encodeFile` 生成的字符串解码回 `File`。                     | `(encoded: string) => File`            |

### 接口

#### `MessageHandler<T, R>`

消息处理器。接收解码后的 `payload` 并返回响应（可为异步）。

```ts
interface MessageHandler<T = unknown, R = unknown> {
  (payload: T): Promise<R> | R;
}
```

#### `MessageData<T>`

线上传输时解码后的消息结构。

| 字段         | 说明                           | 类型       |
| ------------ | ------------------------------ | ---------- |
| `type`       | 消息类型 / 通道名。            | `string`   |
| `payload`    | 消息体。                       | `T`        |
| `id`         | 关联 id，请求/响应配对时存在。 | `string?`  |
| `isResponse` | 该消息为响应时为 `true`。      | `boolean?` |
| `isError`    | 响应携带错误时为 `true`。      | `boolean?` |

#### `PendingRequest<R>`

正在等待响应的 `send()` 请求（内部记账用）。

| 字段      | 说明                     | 类型                       |
| --------- | ------------------------ | -------------------------- |
| `resolve` | resolve 挂起的 promise。 | `(value: R) => void`       |
| `reject`  | reject 挂起的 promise。  | `(error: unknown) => void` |

#### `BridgeManagerOptions`

`connectClient` / `Client.connect` 的选项。

| 字段           | 说明                               | 类型      | 默认值           |
| -------------- | ---------------------------------- | --------- | ---------------- |
| `id`           | 显式的 bridge id，省略时自动生成。 | `string?` | 随机 10 位字符串 |
| `targetOrigin` | 传给 `PostMessageBridge` 的源。    | `string?` | `'*'`            |
| `targetWindow` | 传给 bridge 的目标 `Window`。      | `Window?` | `window`         |

#### `BroadcastPayload`

单向广播消息。

| 字段      | 说明       | 类型      |
| --------- | ---------- | --------- |
| `type`    | 消息类型。 | `string`  |
| `payload` | 消息体。   | `unknown` |

#### `CallToPayload<T>`

`Client.call` 的参数。

| 字段      | 说明                         | 类型     |
| --------- | ---------------------------- | -------- |
| `id`      | 目标 bridge/platform 的 id。 | `string` |
| `type`    | 消息类型。                   | `string` |
| `payload` | 请求体。                     | `T`      |

## Example

### 底层用法：页面与 iframe 之间的 `PostMessageBridge`

**父页面** —— 与 iframe 的 `contentWindow` 通信：

```js
import { PostMessageBridge } from 'ranuts/utils';

const iframe = document.querySelector('iframe');

// 等 iframe 加载完成，再创建到它的 bridge。
iframe.addEventListener('load', async () => {
  const bridge = new PostMessageBridge(iframe.contentWindow, '*');

  // 请求/响应：发送 'getUser' 并等待回复。
  const user = await bridge.send('getUser', { id: 42 });
  console.log(user); // => { id: 42, name: 'Ada' }

  // 只发送不等待的广播。
  bridge.broadcast({ type: 'theme:change', payload: { mode: 'dark' } });
});
```

**iframe 内部** —— 注册处理器：

```js
import { PostMessageBridge } from 'ranuts/utils';

// 指向父窗口。
const bridge = new PostMessageBridge(window.parent, '*');

bridge.on('getUser', async ({ id }) => {
  // 你返回的内容会作为调用方 send() 的响应。
  return { id, name: 'Ada' };
});

bridge.on('theme:change', ({ mode }) => {
  document.documentElement.dataset.theme = mode;
});
```

### 高层用法：`Client`（父页面）与 `Platform`（iframe）

**iframe 内部** —— 用 `Platform` 暴露一组方法：

```js
import { Platform } from 'ranuts/utils';

const { destroy } = Platform.init({
  add: ({ a, b }) => a + b,
  getTime: async () => Date.now(),
});

// 之后要停止监听：
// destroy();
```

**父页面** —— 连接并按 id 调用：

```js
import { Client } from 'ranuts/utils';

const iframe = document.querySelector('iframe');

iframe.addEventListener('load', async () => {
  // 向 iframe 窗口注册一个具名连接。
  const { id } = Client.connect({
    id: 'calculator',
    targetWindow: iframe.contentWindow,
    targetOrigin: '*',
  });

  // 调用 Platform.init 暴露的方法并等待结果。
  const sum = await Client.call({ id, type: 'add', payload: { a: 2, b: 3 } });
  console.log(sum); // => 5

  // 向所有已连接的 platform 广播。
  Client.broadcast({ type: 'ping', payload: Date.now() });

  // 用完后拆除连接。
  Client.remove(id);
});
```

### 直接使用 `bridgeManager` 单例

```js
import { bridgeManager } from 'ranuts/utils';

const { bridge, id } = bridgeManager.connectClient({
  targetWindow: someIframe.contentWindow,
});

const result = await bridgeManager.sendTo(id, 'ping', { at: Date.now() });

bridgeManager.removeClient(id);
```

### 单独使用 `MessageCodec` 进行编解码

```js
import { MessageCodec } from 'ranuts/utils';

const encoded = MessageCodec.encode({ msg: '你好 👋', n: 1 });
// -> 一个 Base64 字符串，可安全用于 URL / Cookie / postMessage

const decoded = MessageCodec.decode(encoded);
console.log(decoded); // => { msg: '你好 👋', n: 1 }
```

## Notes

1. **源校验**：当 `targetOrigin` 为 `'*'`（默认值）时，收到的消息不会按源过滤。生产环境请传入明确的源（例如 `'https://app.example.com'`），只接受该源的消息。
2. **超时**：若 120 秒内没有收到响应，`send` / `sendTo` 会以 `Error('Request timeout')` reject。
3. **唯一 id**：若复用已存在的 id，`connectClient` 会抛出 `Bridge <id> already exists`。省略 `id` 可获得自动生成的 id。
4. **清理**：每个 `PostMessageBridge` 都会添加一个全局 `message` 监听器——不再需要连接时请调用 `destroy()`（或 `Client.remove` / `removeClient`）以避免内存泄漏。
5. **`broadcastToAll`**：`Client.broadcastToAll` 以源 `'*'` 向当前窗口发送，出于安全考虑不推荐使用——优先使用定向的 `call` / `broadcast`。
