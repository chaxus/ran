# ブリッジ（postMessage）

`window.postMessage` の上に載せた、小さなコンテキスト間メッセージング層です。二つの閲覧コンテキスト（親ページと `<iframe>`、ポップアップ、あるいは参照を持っているほかの `Window`）が、要求と応答の（RPC 風の）API と、一方向のブロードキャストでやり取りできるようになります。

メッセージは**構造化されたオブジェクト**のまま境界を越えます（`postMessage` 本来の構造化クローンのしくみを使います）。ですから `Date`、`Map`、`Set`、`ArrayBuffer`、`File` といった型は、手作業のシリアライズなしにそのまま届きます。各メッセージにはプロトコルの目印が付いているので、ほかのライブラリーの `postMessage` の行き来（HMR、DevTools、外部の SDK）と区別できます。

使い方は三通りあります。

- **`PostMessageBridge`**: いちばん低い層の部品です。インスタンスひとつが、相手の `Window` ひとつを包みます。`on` でハンドラーを登録し、`send` で送って待ち、`broadcast` で投げっぱなしにします。
- **`BridgeManager` / `bridgeManager` / `Client` / `Platform`**: もう一段上の層です。名前つきのブリッジを台帳（シングルトン）で持ち、それに呼び出す側の `Client` と受ける側の `Platform` という薄い顔をかぶせます。
- **`openPortBridge` / `acceptPortBridge` / `createPortBridge`**: `MessageChannel` / `MessagePort` の上に作った一対一のブリッジです（**新しく書くコードにはこちらをお勧めします**）。一度きりのハンドシェイクのあと、両側が私有のポートを持ちます。この形そのものが、ウィンドウをまたいだ混線、送信元のなりすまし、同じウィンドウでのチャンネル衝突、自分の要求に自分で答えてしまうことを防ぐので、オリジンによる絞り込みが要りません。

> **互換性について**：やり取りの形式は構造化オブジェクトです（もう Base64 の文字列ではありません）。同じ版どうしの端点はそのまま通じ合い、`Client`（`PostMessageBridge`）と `Platform` は同じ封筒のプロトコルを共有しています。版をまたいで古いページと新しいページを混ぜると、プロトコルが噛み合いません。

## API

### `PostMessageBridge`

中心となるクラスです。インスタンスはそれぞれ `Window` ひとつを相手にします。インスタンスごとにリスナーを足すのではなく、すべてのインスタンスが `window` 上の**ひとつ**の `message` リスナーを共有し、内部の振り分け役が仕分けます。ですからリスナーの数はインスタンスの数につれて増えません。

```ts
new PostMessageBridge(targetWindow?: Window, targetOrigin?: string, channel?: string)
```

#### コンストラクターのパラメーター

| パラメーター   | 説明                                                                                                                        | 型       | 既定値      |
| -------------- | --------------------------------------------------------------------------------------------------------------------------- | -------- | ----------- |
| `targetWindow` | メッセージを送る相手の `Window`（iframe、ポップアップ、`parent` など）                                                      | `Window` | `window`    |
| `targetOrigin` | 送り先として、また受け入れ元として使うオリジン。`'*'` にすると確認をやめます                                                | `string` | `'*'`       |
| `channel`      | チャンネルの ID。**同じウィンドウ上の複数のブリッジ**を切り分けます。話が通じるには両端が同じチャンネルである必要があります | `string` | `'default'` |

#### Methods

| メソッド                       | 説明                                                                                                          | シグネチャ                                                    |
| ------------------------------ | ------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------- |
| `on(type, handler)`            | メッセージの `type` にハンドラーを登録します。その返り値（あるいは解決された値）が返事として送り返されます。  | `<T, R>(type: string, handler: MessageHandler<T, R>) => void` |
| `off(type)`                    | `type` に登録したハンドラーを外します。                                                                       | `(type: string) => void`                                      |
| `send(type, payload)`          | メッセージを送って応答を待ちます。相手側のハンドラーのエラー、あるいは 120 秒のタイムアウトで reject します。 | `<T, R>(type: string, payload: T) => Promise<R>`              |
| `broadcast({ type, payload })` | 投げっぱなし。応答を待たずにメッセージを送ります。                                                            | `<T>(data: { type: string; payload: T }) => void`             |
| `destroy()`                    | 振り分け役から登録を外し、ハンドラーをすべて消し、待機中の要求をすべて reject します。                        | `() => void`                                                  |

> **自分の要求に自分で答えない仕掛け**：インスタンスはそれぞれ固有の送信元 ID を持っていて、自分が送った要求は**処理しません**。**ひとつのウィンドウの中で**要求と応答をやりたいときは、ブリッジのインスタンスを二つ使ってください（片方がハンドラーを登録し、もう片方が送ります）。

### `BridgeManager`

名前つきの `PostMessageBridge` を複数まとめて持つ、シングルトンの台帳です。共有インスタンスは `BridgeManager.getInstance()` で取るか、できあいの [`bridgeManager`](#bridgemanager-singleton) の export を使ってください。コンストラクターは非公開です。

| メソッド                       | 説明                                                                         | シグネチャ                                                                     |
| ------------------------------ | ---------------------------------------------------------------------------- | ------------------------------------------------------------------------------ |
| `BridgeManager.getInstance()`  | 共有のシングルトンインスタンスを返します。                                   | `() => BridgeManager`                                                          |
| `connectClient(options)`       | 新しいブリッジを作って登録します。`id` がすでにあれば例外を投げます。        | `(options: BridgeManagerOptions) => { bridge: PostMessageBridge; id: string }` |
| `getClient(id)`                | 登録済みのブリッジを ID で引きます。                                         | `(id: string) => PostMessageBridge \| undefined`                               |
| `removeClient(id)`             | この ID のブリッジを破棄し、登録を外します。                                 | `(id: string) => void`                                                         |
| `removeAllClient()`            | すべてのブリッジを破棄し、登録を外します。                                   | `() => void`                                                                   |
| `broadcast({ type, payload })` | 登録されているすべてのブリッジへ、メッセージをひとつブロードキャストします。 | `<T>(payload: { type: string; payload: T }) => void`                           |
| `sendTo(id, type, payload)`    | この ID のブリッジを通して要求を送り、応答を待ちます。                       | `<T, R>(id: string, type: string, payload: T) => Promise<R>`                   |

`connectClient` で `id` を省くと、10 文字のランダムな ID が作られて返ります。`options` は `channel` も受けつけ、その値は土台の `PostMessageBridge` へ渡されます。

### `bridgeManager`（シングルトン）

あらかじめ作られている共有の `BridgeManager` インスタンスで、`BridgeManager.getInstance()` と同じものです。自分で作らずに、これを import してください。

```ts
import { bridgeManager } from 'ranuts/utils';
```

### `Client`

**呼び出す側**（要求を始めるコンテキスト）のために、`bridgeManager` にかぶせた薄い顔です。クラスではなく、ただのオブジェクトです。

| メソッド                      | 説明                                                                       | シグネチャ                                                                     |
| ----------------------------- | -------------------------------------------------------------------------- | ------------------------------------------------------------------------------ |
| `connect(options)`            | 相手のウィンドウにつなぎます（`bridgeManager.connectClient` に委ねます）。 | `(options: BridgeManagerOptions) => { bridge: PostMessageBridge; id: string }` |
| `remove(id)`                  | ID を指して接続をひとつ外します。                                          | `(id: string) => void`                                                         |
| `removeAll()`                 | すべての接続を外します。                                                   | `() => void`                                                                   |
| `broadcast(payload)`          | つながっているすべてのプラットフォームへブロードキャストします。           | `(payload: BroadcastPayload) => void`                                          |
| `call({ id, type, payload })` | `id` の先にいるプラットフォームへ要求を送り、返事を待ちます。              | `<T, R>(payload: CallToPayload<T>) => Promise<R>`                              |
| `broadcastToAll(payload)`     | 今のウィンドウへ、オリジン `'*'` で送ります。安全の面からお勧めしません。  | `(payload: BroadcastPayload) => void`                                          |

### `Platform`

**受ける側**（多くは iframe の中で動くコード）のための顔です。メソッドをひとつだけ持つただのオブジェクトで、`Client`（`PostMessageBridge`）と同じ封筒のプロトコルを共有しているので、両端はそのまま通じ合います。

| メソッド                | 説明                                                                                                                                                                                                                                                               | シグネチャ                                                                        |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------- |
| `Platform.init(events)` | `type` からハンドラーへの対応表を登録します。メッセージが届くたびに合致するハンドラーを走らせ、その結果を `event.source` へ送り返します。ハンドラーが例外を投げたときはそのエラーを送り返します（呼び出し側は reject します）。片づけ用の `destroy()` を返します。 | `<T, R>(events: Record<string, MessageHandler<T, R>>) => { destroy: () => void }` |

### PortBridge（MessagePort ベース。新しく書くコードにはこちら）

`MessageChannel` / `MessagePort` の上に作った一対一のブリッジです。ポートとは、ブラウザーが与えてくれる**私有チャンネルの権能**です。ハンドシェイクでそのポートを手にした二者だけがやり取りできます。この形そのものが、ウィンドウをまたいだ混線、送信元のなりすまし、同じウィンドウでのチャンネル衝突、自分の要求に自分で答えてしまうことを防ぐので、オリジンによる絞り込みもプロトコルの目印も要りません。中身のデータはこちらも構造化クローンで運ばれます。

| 関数                         | 説明                                                                                                                                    | シグネチャ                                                   |
| ---------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------ |
| `openPortBridge(options)`    | **口火を切る側**。`MessageChannel` を作り、片方のポートを相手のウィンドウへ手渡し、もう片方を手元に残します。                           | `(options: OpenPortBridgeOptions) => PortBridge`             |
| `acceptPortBridge(options?)` | **受ける側**。口火を切った側から渡されるポートを待ち、受け取った時点でブリッジとして解決します。                                        | `(options?: AcceptPortBridgeOptions) => Promise<PortBridge>` |
| `createPortBridge(port)`     | **どんな** `MessagePort` の上にもブリッジを組み立てます（Web Worker や SharedWorker、あるいはすでにハンドシェイクの済んだポートなど）。 | `(port: MessagePort) => PortBridge`                          |

返ってくる `PortBridge` は、`PostMessageBridge` と同じ `on` / `off` / `send` / `broadcast` / `destroy` を備えています。

- **`OpenPortBridgeOptions`**: `{ targetWindow: Window; targetOrigin?: string; name?: string }`。`name` は、ひとつのページの中で独立した複数のポート接続を見分けるためのもので、両端で同じ値にする必要があります（既定は `'default'`）。
- **`AcceptPortBridgeOptions`**: `{ targetOrigin?: string; name?: string }`。

### `MessageCodec`

データを Base64 の文字列に符号化し、また戻します。Unicode の文字（漢字、絵文字など）はすべてそのまま保たれます。**文字列しか通せない経路**（URL、Cookie、`localStorage` など）で構造のあるデータを運びたいときに役立ちます。

> 注意：ブリッジがメッセージのシリアライズにこれを使うことは**もうありません**（構造化クローンを使います）。文字列経路のために、単独の道具として export され続けているだけです。

| メソッド              | 説明                                                                                | シグネチャ                             |
| --------------------- | ----------------------------------------------------------------------------------- | -------------------------------------- |
| `encode(data)`        | JSON にできる値なら何でも Base64 の文字列にします。失敗したときは `''` を返します。 | `(data: any) => string`                |
| `decode(encodedStr)`  | Base64 の文字列を値へ戻します。失敗したときは `null` を返します。                   | `<T>(encodedStr: string) => T \| null` |
| `encodeFile(file)`    | `File` を（メタデータとバイト列ごと）Base64 の文字列にします。                      | `(file: File) => Promise<string>`      |
| `decodeFile(encoded)` | `encodeFile` が作った文字列を `File` に戻します。                                   | `(encoded: string) => File`            |

### インターフェース

#### `MessageHandler<T, R>`

メッセージのハンドラーです。`payload` を受け取り、応答を返します（非同期でもかまいません）。

```ts
interface MessageHandler<T = unknown, R = unknown> {
  (payload: T): Promise<R> | R;
}
```

#### `MessageData<T>`

やり取りされるメッセージの形、つまり封筒の中身です。

| フィールド   | 説明                                                                  | 型         |
| ------------ | --------------------------------------------------------------------- | ---------- |
| `type`       | メッセージの種別、あるいはチャンネル名。                              | `string`   |
| `payload`    | メッセージの本体。                                                    | `T`        |
| `id`         | 要求と応答を結びつける ID。対になっているときに付きます。             | `string?`  |
| `isResponse` | このメッセージが返事のときに `true`。                                 | `boolean?` |
| `isError`    | 返事がエラーを運んでいるときに `true`。                               | `boolean?` |
| `channel`    | チャンネルの ID。ひとつのウィンドウ上の複数のブリッジを切り分けます。 | `string?`  |
| `senderId`   | 送信元インスタンスの ID。自分の要求に自分で答えないために使います。   | `string?`  |

#### `PendingRequest<R>`

応答を待っている進行中の `send()` です（内部での帳簿づけに使います）。

| フィールド | 説明                                | 型                         |
| ---------- | ----------------------------------- | -------------------------- |
| `resolve`  | 待機中の promise を解決します。     | `(value: R) => void`       |
| `reject`   | 待機中の promise を reject します。 | `(error: unknown) => void` |

#### `BridgeManagerOptions`

`connectClient` と `Client.connect` のオプションです。

| フィールド     | 説明                                                                          | 型        | 既定値                    |
| -------------- | ----------------------------------------------------------------------------- | --------- | ------------------------- |
| `id`           | ブリッジの ID を明示します。省くと自動で作られます。                          | `string?` | 10 文字のランダムな文字列 |
| `targetOrigin` | `PostMessageBridge` へ渡すオリジン。                                          | `string?` | `'*'`                     |
| `targetWindow` | ブリッジへ渡す相手の `Window`。                                               | `Window?` | `window`                  |
| `channel`      | チャンネルの ID。同じウィンドウ上の接続を切り分けたいときは明示してください。 | `string?` | `'default'`               |

#### `BroadcastPayload`

一方向のブロードキャストのメッセージです。

| フィールド | 説明               | 型        |
| ---------- | ------------------ | --------- |
| `type`     | メッセージの種別。 | `string`  |
| `payload`  | メッセージの本体。 | `unknown` |

#### `CallToPayload<T>`

`Client.call` に渡す引数です。

| フィールド | 説明                                            | 型       |
| ---------- | ----------------------------------------------- | -------- |
| `id`       | 相手のブリッジ、あるいはプラットフォームの ID。 | `string` |
| `type`     | メッセージの種別。                              | `string` |
| `payload`  | 要求の本体。                                    | `T`      |

## 使用例

### 低い層：ページと iframe のあいだの `PostMessageBridge`

**親ページ**から、iframe の `contentWindow` へ話しかけます。

```js
import { PostMessageBridge } from 'ranuts/utils';

const iframe = document.querySelector('iframe');

// iframe の読み込みを待ってから、そこへのブリッジを作ります。
iframe.addEventListener('load', async () => {
  const bridge = new PostMessageBridge(iframe.contentWindow, '*');

  // 要求と応答。'getUser' を送って返事を待ちます。
  const user = await bridge.send('getUser', { id: 42 });
  console.log(user); // => { id: 42, name: 'Ada' }

  // 投げっぱなしのブロードキャスト。
  bridge.broadcast({ type: 'theme:change', payload: { mode: 'dark' } });
});
```

**iframe の中**でハンドラーを登録します。

```js
import { PostMessageBridge } from 'ranuts/utils';

// 親ウィンドウを相手にします。
const bridge = new PostMessageBridge(window.parent, '*');

bridge.on('getUser', async ({ id }) => {
  // ここで返したものが、呼び出し側の send() への応答になります。
  return { id, name: 'Ada' };
});

bridge.on('theme:change', ({ mode }) => {
  document.documentElement.dataset.theme = mode;
});
```

### 高い層：`Client`（親）と `Platform`（iframe）

**iframe の中**で、`Platform` を使ってメソッドの一式を差し出します。

```js
import { Platform } from 'ranuts/utils';

const { destroy } = Platform.init({
  add: ({ a, b }) => a + b,
  getTime: async () => Date.now(),
});

// あとで待ち受けをやめるときは:
// destroy();
```

**親ページ**から、つないで ID を指して呼びます。

```js
import { Client } from 'ranuts/utils';

const iframe = document.querySelector('iframe');

iframe.addEventListener('load', async () => {
  // iframe のウィンドウへの、名前つきの接続を登録します。
  const { id } = Client.connect({
    id: 'calculator',
    targetWindow: iframe.contentWindow,
    targetOrigin: '*',
  });

  // Platform.init が差し出したメソッドを呼び、その結果を待ちます。
  const sum = await Client.call({ id, type: 'add', payload: { a: 2, b: 3 } });
  console.log(sum); // => 5

  // つながっているすべてのプラットフォームへブロードキャストします。
  Client.broadcast({ type: 'ping', payload: Date.now() });

  // 用が済んだら片づけます。
  Client.remove(id);
});
```

### 一対一：`openPortBridge` と `acceptPortBridge`（お勧め）

**親ページ**（口火を切る側）が、チャンネルを作って片方の端を iframe に手渡します。

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

**iframe の中**（受ける側）で、手渡されるポートを待ちます。

```js
import { acceptPortBridge } from 'ranuts/utils';

const bridge = await acceptPortBridge({ targetOrigin: 'https://parent.example.com' });

bridge.on('ping', ({ n }) => n + 1);
```

### `bridgeManager` シングルトンを直に使う

```js
import { bridgeManager } from 'ranuts/utils';

const { bridge, id } = bridgeManager.connectClient({
  targetWindow: someIframe.contentWindow,
});

const result = await bridgeManager.sendTo(id, 'ping', { at: Date.now() });

bridgeManager.removeClient(id);
```

### `MessageCodec` を単体で使う（文字列経路の場合）

```js
import { MessageCodec } from 'ranuts/utils';

const encoded = MessageCodec.encode({ msg: 'héllo 👋', n: 1 });
// -> Base64 の文字列。URL・Cookie・localStorage でも安全に運べます

const decoded = MessageCodec.decode(encoded);
console.log(decoded); // => { msg: 'héllo 👋', n: 1 }
```

## 補足

1. **シリアライズについて**: ブリッジは構造化オブジェクト（構造化クローン）でやり取りするので、`Date`、`Map`、`Set`、`ArrayBuffer`、`File` などは `MessageCodec` なしでそのまま保たれます。`payload` が複製できないもの（関数や DOM ノード）だと、`send` はその場で reject します。
2. **プロトコルの目印**: 内部のプロトコルの目印が付いたメッセージだけが処理されます。ほかのライブラリーの `postMessage` の行き来は無視されます。
3. **オリジンの確認**: `targetOrigin` が `'*'`（既定）のとき、届くメッセージはオリジンで絞り込まれません。本番では明示的なオリジン（`'https://app.example.com'` など）を渡して、そのオリジンだけを受け入れるようにしてください。
4. **エラーの伝わり方**: 相手側のハンドラーが例外を投げたとき、`send` / `sendTo` / `Client.call` はそのエラーで reject します（エラーの文言を正しい結果のように resolve したりはしません）。
5. **タイムアウト**: 120 秒のあいだ応答が来ないと、`send` と `sendTo` は `Error('Request timeout')` で reject します。
6. **チャンネルの切り分け**: 同じウィンドウで複数のブリッジを動かすときは、両端に同じ `channel` を渡して混線を防いでください。
7. **ID は重複できません**: 同じ ID を使い回すと、`connectClient` は `Bridge <id> already exists` を投げます。`id` を省けば自動で作られます。
8. **後片づけ**: `PostMessageBridge` のインスタンスはグローバルな `message` リスナーひとつを共有します（最後のブリッジが破棄されると自動で外れます）。接続が要らなくなったら `destroy()`（あるいは `Client.remove` / `removeClient`）を呼んで、待機中の要求を reject し、資源を返してください。
9. **ブラウザーでない環境では**: `window` のない場所（Node や SSR）でも、`PostMessageBridge` の生成は例外を投げません。`send` は分かりやすいエラーで reject し、`broadcast` と `destroy` は何もしない関数に落ちます。
10. **PortBridge を選んでください**: 新しく書くコードでは `openPortBridge` と `acceptPortBridge` を使ってください。一対一のチャンネルという形そのものが、混線・なりすまし・自分で自分に答えることを防ぎます。
11. **`broadcastToAll` について**: `Client.broadcastToAll` は今のウィンドウへオリジン `'*'` で送るもので、安全の面からお勧めしません。相手を定めた `call` や `broadcast` を使ってください。
12. **`BRIDGE_MARKER` と `DEFAULT_CHANNEL`**: 上の 2 と 6 の裏にある生の値も export されています。`PostMessageBridge` を通さずに `postMessage` の行き来を直に覗く場合（devtools のリスナーやテストなど）のためです。`BRIDGE_MARKER` はブリッジのメッセージすべてが帯びるプロトコルの目印の文字列で、`DEFAULT_CHANNEL` は何も渡されなかったときに使われる `'default'` というチャンネル ID そのものです。
