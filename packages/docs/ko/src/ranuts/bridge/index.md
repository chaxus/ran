# 브리지 (postMessage)

`window.postMessage` 위에 얹은 작은 맥락 간 메시지 계층입니다. 두 브라우징 맥락, 곧 부모 페이지와 `<iframe>`, 팝업, 또는 참조를 쥐고 있는 어떤 `Window`든 서로 이야기할 수 있게 해 줍니다. 요청과 응답(RPC 식) API와 한 방향 방송을 씁니다.

메시지는 **구조를 지닌 객체** 그대로 경계를 넘습니다(`postMessage`가 본래 갖춘 구조적 복제 알고리즘을 씁니다). 그래서 `Date`, `Map`, `Set`, `ArrayBuffer`, `File` 같은 타입이 손으로 직렬화하지 않아도 온전히 건너갑니다. 각 메시지에는 프로토콜 표식이 붙어 있어, 다른 라이브러리의 `postMessage` 왕래(HMR, 개발자 도구, 남의 SDK)와 가려낼 수 있습니다.

쓰는 길은 세 가지입니다.

- **`PostMessageBridge`**: 가장 아래층의 부품입니다. 인스턴스 하나가 상대 `Window` 하나를 감쌉니다. `on`으로 핸들러를 등록하고, `send`로 보내고 기다리고, `broadcast`로 던져 놓고 잊습니다.
- **`BridgeManager` / `bridgeManager` / `Client` / `Platform`**: 한 층 위입니다. 이름 붙은 브리지들을 등록부(싱글턴)로 쥐고 있고, 그 위에 부르는 쪽인 `Client`와 받는 쪽인 `Platform`이라는 얇은 겉면을 씌웁니다.
- **`openPortBridge` / `acceptPortBridge` / `createPortBridge`**: `MessageChannel`과 `MessagePort` 위에 지은 일대일 브리지입니다(**새로 쓰는 코드에는 이쪽을 권합니다**). 한 번의 악수가 끝나면 양쪽이 저마다 사적인 포트를 쥡니다. 그 생김새 자체가 창을 넘나드는 혼선, 보낸 이 사칭, 같은 창 안에서의 채널 충돌, 자기 요청에 자기가 답하는 일을 막아 주므로 출처로 걸러 낼 필요가 없습니다.

> **호환성**: 오가는 형식은 구조를 지닌 객체입니다. 더는 Base64 문자열이 아닙니다. 같은 판끼리는 곧바로 통하고, `Client`(`PostMessageBridge`)와 `Platform`은 같은 봉투 프로토콜을 함께 씁니다. 판을 건너 옛 페이지와 새 페이지를 섞으면 프로토콜이 맞지 않습니다.

## API

### `PostMessageBridge`

중심이 되는 클래스입니다. 인스턴스마다 `Window` 하나를 겨눕니다. 저마다 리스너를 붙이는 대신, 모든 인스턴스가 `window` 위의 `message` 리스너 **하나**를 함께 쓰고 안쪽의 배분기가 갈라 줍니다. 그래서 리스너 수가 인스턴스 수를 따라 늘지 않습니다.

```ts
new PostMessageBridge(targetWindow?: Window, targetOrigin?: string, channel?: string)
```

#### 생성자 매개변수

| 매개변수       | 설명                                                                                                      | 타입     | 기본값      |
| -------------- | --------------------------------------------------------------------------------------------------------- | -------- | ----------- |
| `targetWindow` | 메시지를 보낼 상대 `Window`(iframe, 팝업, `parent` 등)                                                    | `Window` | `window`    |
| `targetOrigin` | 보낼 곳이자 받아들일 출처. `'*'`이면 확인을 끕니다                                                        | `string` | `'*'`       |
| `channel`      | 채널 아이디. **같은 창 위의 브리지 여럿**을 갈라 놓습니다. 말이 통하려면 양쪽 끝이 같은 채널이어야 합니다 | `string` | `'default'` |

#### Methods

| 메서드                         | 설명                                                                                        | 시그니처                                                      |
| ------------------------------ | ------------------------------------------------------------------------------------------- | ------------------------------------------------------------- |
| `on(type, handler)`            | 메시지 `type`에 핸들러를 등록합니다. 그 반환값(또는 이행된 값)이 답으로 되돌아갑니다.       | `<T, R>(type: string, handler: MessageHandler<T, R>) => void` |
| `off(type)`                    | `type`에 등록해 둔 핸들러를 뗍니다.                                                         | `(type: string) => void`                                      |
| `send(type, payload)`          | 메시지를 보내고 응답을 기다립니다. 저쪽 핸들러의 오류로, 또는 120초가 지나면 reject 합니다. | `<T, R>(type: string, payload: T) => Promise<R>`              |
| `broadcast({ type, payload })` | 던져 놓고 잊기. 응답을 바라지 않고 메시지를 보냅니다.                                       | `<T>(data: { type: string; payload: T }) => void`             |
| `destroy()`                    | 배분기에서 빠지고, 핸들러를 모두 지우고, 기다리던 요청을 모두 reject 합니다.                | `() => void`                                                  |

> **자기 요청에 자기가 답하지 않게 하는 장치**: 인스턴스마다 고유한 보낸 이 아이디를 지니고 있어, 자기가 보낸 요청은 **처리하지 않습니다**. **한 창 안에서** 요청과 응답을 하려면 브리지 인스턴스를 둘 쓰세요(하나는 핸들러를 등록하고, 하나는 보냅니다).

### `BridgeManager`

이름 붙은 `PostMessageBridge` 여럿을 거느리는 싱글턴 등록부입니다. 함께 쓰는 인스턴스는 `BridgeManager.getInstance()`로 얻거나, 이미 마련된 [`bridgeManager`](#bridgemanager-singleton) 내보내기를 쓰세요. 생성자는 비공개입니다.

| 메서드                         | 설명                                                               | 시그니처                                                                       |
| ------------------------------ | ------------------------------------------------------------------ | ------------------------------------------------------------------------------ |
| `BridgeManager.getInstance()`  | 함께 쓰는 싱글턴 인스턴스를 돌려줍니다.                            | `() => BridgeManager`                                                          |
| `connectClient(options)`       | 새 브리지를 만들어 등록합니다. `id`가 이미 있으면 예외를 던집니다. | `(options: BridgeManagerOptions) => { bridge: PostMessageBridge; id: string }` |
| `getClient(id)`                | 등록된 브리지를 아이디로 찾습니다.                                 | `(id: string) => PostMessageBridge \| undefined`                               |
| `removeClient(id)`             | 이 아이디의 브리지를 없애고 등록에서 뺍니다.                       | `(id: string) => void`                                                         |
| `removeAllClient()`            | 모든 브리지를 없애고 등록에서 뺍니다.                              | `() => void`                                                                   |
| `broadcast({ type, payload })` | 등록된 모든 브리지로 메시지 하나를 방송합니다.                     | `<T>(payload: { type: string; payload: T }) => void`                           |
| `sendTo(id, type, payload)`    | 이 아이디의 브리지로 요청을 보내고 응답을 기다립니다.              | `<T, R>(id: string, type: string, payload: T) => Promise<R>`                   |

`connectClient`에서 `id`를 빼면 열 글자짜리 무작위 아이디가 만들어져 돌아옵니다. `options`는 `channel`도 받으며, 그 값은 밑에 깔린 `PostMessageBridge`로 넘어갑니다.

### `bridgeManager` (싱글턴)

미리 만들어 둔, 함께 쓰는 `BridgeManager` 인스턴스입니다. `BridgeManager.getInstance()`와 같은 것입니다. 직접 만들지 말고 이것을 가져다 쓰세요.

```ts
import { bridgeManager } from 'ranuts/utils';
```

### `Client`

**부르는 쪽**(요청을 시작하는 맥락)을 위해 `bridgeManager` 위에 씌운 얇은 겉면입니다. 클래스가 아니라 평범한 객체입니다.

| 메서드                        | 설명                                                            | 시그니처                                                                       |
| ----------------------------- | --------------------------------------------------------------- | ------------------------------------------------------------------------------ |
| `connect(options)`            | 상대 창에 연결합니다(`bridgeManager.connectClient`에 맡깁니다). | `(options: BridgeManagerOptions) => { bridge: PostMessageBridge; id: string }` |
| `remove(id)`                  | 아이디로 연결 하나를 뗍니다.                                    | `(id: string) => void`                                                         |
| `removeAll()`                 | 모든 연결을 뗍니다.                                             | `() => void`                                                                   |
| `broadcast(payload)`          | 붙어 있는 모든 플랫폼에 방송합니다.                             | `(payload: BroadcastPayload) => void`                                          |
| `call({ id, type, payload })` | `id` 뒤에 있는 플랫폼에 요청을 보내고 답을 기다립니다.          | `<T, R>(payload: CallToPayload<T>) => Promise<R>`                              |
| `broadcastToAll(payload)`     | 지금 창으로 출처 `'*'`로 보냅니다. 보안상 권하지 않습니다.      | `(payload: BroadcastPayload) => void`                                          |

### `Platform`

**받는 쪽**(대개 iframe 안에서 도는 코드)을 위한 겉면입니다. 메서드가 하나뿐인 평범한 객체이고, `Client`(`PostMessageBridge`)와 같은 봉투 프로토콜을 함께 쓰므로 양쪽 끝이 곧바로 통합니다.

| 메서드                  | 설명                                                                                                                                                                                                                                    | 시그니처                                                                          |
| ----------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------- |
| `Platform.init(events)` | `type`과 핸들러의 대응표를 등록합니다. 메시지가 들어올 때마다 맞는 핸들러를 돌려 그 결과를 `event.source`로 돌려보내고, 핸들러가 예외를 던지면 그 오류를 돌려보냅니다(부른 쪽은 reject 됩니다). 걷어 낼 때 쓸 `destroy()`를 돌려줍니다. | `<T, R>(events: Record<string, MessageHandler<T, R>>) => { destroy: () => void }` |

### PortBridge (MessagePort 기반, 새 코드에 권장)

`MessageChannel`과 `MessagePort` 위에 지은 일대일 브리지입니다. 포트란 브라우저가 내어 주는 **사적 통로의 권한**입니다. 악수 때 그 포트를 쥔 두 쪽만이 이야기할 수 있습니다. 그 생김새 자체가 창을 넘나드는 혼선, 보낸 이 사칭, 같은 창 안에서의 채널 충돌, 자기 요청에 자기가 답하는 일을 막아 주므로 출처로 걸러 낼 일도, 프로토콜 표식도 필요 없습니다. 실어 보내는 값도 구조적 복제로 건너갑니다.

| 함수                         | 설명                                                                                                      | 시그니처                                                     |
| ---------------------------- | --------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------ |
| `openPortBridge(options)`    | **먼저 나서는 쪽**. `MessageChannel`을 만들어 한쪽 포트를 상대 창에 건네고 다른 끝을 쥡니다.              | `(options: OpenPortBridgeOptions) => PortBridge`             |
| `acceptPortBridge(options?)` | **받는 쪽**. 먼저 나선 쪽이 건네는 포트를 기다렸다가, 받으면 브리지로 이행합니다.                         | `(options?: AcceptPortBridgeOptions) => Promise<PortBridge>` |
| `createPortBridge(port)`     | **어떤** `MessagePort` 위에서든 브리지를 짓습니다(웹 워커나 SharedWorker, 또는 이미 악수를 마친 포트 등). | `(port: MessagePort) => PortBridge`                          |

돌아오는 `PortBridge`는 `PostMessageBridge`와 똑같은 `on`, `off`, `send`, `broadcast`, `destroy`를 갖추고 있습니다.

- **`OpenPortBridgeOptions`**: `{ targetWindow: Window; targetOrigin?: string; name?: string }`. `name`은 한 페이지 안의 서로 독립된 포트 연결 여럿을 가려내며, 양쪽 끝에서 같아야 합니다(기본값 `'default'`).
- **`AcceptPortBridgeOptions`**: `{ targetOrigin?: string; name?: string }`.

### `MessageCodec`

데이터를 Base64 문자열로 바꾸고 다시 되돌립니다. 유니코드 글자(한자, 이모지 등)는 모두 그대로 남습니다. **문자열만 지나갈 수 있는 통로**(URL, 쿠키, `localStorage` 등)로 구조를 지닌 데이터를 나르고 싶을 때 쓸모가 있습니다.

> 참고: 브리지가 메시지를 직렬화하는 데 이것을 쓰는 일은 **이제 없습니다**(구조적 복제를 씁니다). 문자열 통로를 쓰는 경우를 위해 홀로 쓰는 도구로 여전히 내보낼 뿐입니다.

| 메서드                | 설명                                                                                        | 시그니처                               |
| --------------------- | ------------------------------------------------------------------------------------------- | -------------------------------------- |
| `encode(data)`        | JSON으로 만들 수 있는 값이면 무엇이든 Base64 문자열로 바꿉니다. 실패하면 `''`를 돌려줍니다. | `(data: any) => string`                |
| `decode(encodedStr)`  | Base64 문자열을 값으로 되돌립니다. 실패하면 `null`을 돌려줍니다.                            | `<T>(encodedStr: string) => T \| null` |
| `encodeFile(file)`    | `File`을 메타데이터와 바이트까지 담아 Base64 문자열로 바꿉니다.                             | `(file: File) => Promise<string>`      |
| `decodeFile(encoded)` | `encodeFile`이 만든 문자열을 다시 `File`로 되돌립니다.                                      | `(encoded: string) => File`            |

### 인터페이스

#### `MessageHandler<T, R>`

메시지 핸들러입니다. `payload`를 받아 응답을 돌려줍니다(비동기여도 됩니다).

```ts
interface MessageHandler<T = unknown, R = unknown> {
  (payload: T): Promise<R> | R;
}
```

#### `MessageData<T>`

오가는 메시지의 생김새, 곧 봉투입니다.

| 필드         | 설명                                                               | 타입       |
| ------------ | ------------------------------------------------------------------ | ---------- |
| `type`       | 메시지의 종류, 곧 채널 이름.                                       | `string`   |
| `payload`    | 메시지의 알맹이.                                                   | `T`        |
| `id`         | 요청과 응답을 짝지어 주는 아이디. 그런 짝에만 붙습니다.            | `string?`  |
| `isResponse` | 이 메시지가 답일 때 `true`.                                        | `boolean?` |
| `isError`    | 답이 오류를 싣고 있을 때 `true`.                                   | `boolean?` |
| `channel`    | 채널 아이디. 한 창 위의 브리지 여럿을 갈라 놓습니다.               | `string?`  |
| `senderId`   | 보낸 인스턴스의 아이디. 자기 요청에 자기가 답하지 않으려고 씁니다. | `string?`  |

#### `PendingRequest<R>`

응답을 기다리고 있는 진행 중인 `send()`입니다(안쪽 장부 정리용).

| 필드      | 설명                               | 타입                       |
| --------- | ---------------------------------- | -------------------------- |
| `resolve` | 기다리던 프라미스를 이행시킵니다.  | `(value: R) => void`       |
| `reject`  | 기다리던 프라미스를 reject 합니다. | `(error: unknown) => void` |

#### `BridgeManagerOptions`

`connectClient`와 `Client.connect`의 옵션입니다.

| 필드           | 설명                                                                 | 타입      | 기본값                    |
| -------------- | -------------------------------------------------------------------- | --------- | ------------------------- |
| `id`           | 브리지 아이디를 또렷이 지정합니다. 빼면 알아서 만들어집니다.         | `string?` | 열 글자짜리 무작위 문자열 |
| `targetOrigin` | `PostMessageBridge`로 넘기는 출처.                                   | `string?` | `'*'`                     |
| `targetWindow` | 브리지로 넘기는 상대 `Window`.                                       | `Window?` | `window`                  |
| `channel`      | 채널 아이디. 같은 창 안의 연결을 갈라 놓고 싶으면 또렷이 지정하세요. | `string?` | `'default'`               |

#### `BroadcastPayload`

한 방향으로 뿌리는 방송 메시지입니다.

| 필드      | 설명             | 타입      |
| --------- | ---------------- | --------- |
| `type`    | 메시지의 종류.   | `string`  |
| `payload` | 메시지의 알맹이. | `unknown` |

#### `CallToPayload<T>`

`Client.call`에 넘기는 인자입니다.

| 필드      | 설명                           | 타입     |
| --------- | ------------------------------ | -------- |
| `id`      | 상대 브리지나 플랫폼의 아이디. | `string` |
| `type`    | 메시지의 종류.                 | `string` |
| `payload` | 요청의 알맹이.                 | `T`      |

## 예시

### 낮은 층: 페이지와 iframe 사이의 `PostMessageBridge`

**부모 페이지**에서 iframe의 `contentWindow`에 말을 겁니다.

```js
import { PostMessageBridge } from 'ranuts/utils';

const iframe = document.querySelector('iframe');

// iframe이 다 실릴 때까지 기다렸다가 그리로 브리지를 만듭니다.
iframe.addEventListener('load', async () => {
  const bridge = new PostMessageBridge(iframe.contentWindow, '*');

  // 요청과 응답. 'getUser'를 보내고 답을 기다립니다.
  const user = await bridge.send('getUser', { id: 42 });
  console.log(user); // => { id: 42, name: 'Ada' }

  // 답을 기다리지 않는 방송.
  bridge.broadcast({ type: 'theme:change', payload: { mode: 'dark' } });
});
```

**iframe 안에서** 핸들러를 등록합니다.

```js
import { PostMessageBridge } from 'ranuts/utils';

// 부모 창을 겨눕니다.
const bridge = new PostMessageBridge(window.parent, '*');

bridge.on('getUser', async ({ id }) => {
  // 여기서 돌려주는 것이 부른 쪽 send()의 응답이 됩니다.
  return { id, name: 'Ada' };
});

bridge.on('theme:change', ({ mode }) => {
  document.documentElement.dataset.theme = mode;
});
```

### 높은 층: `Client`(부모)와 `Platform`(iframe)

**iframe 안에서** `Platform`으로 메서드 묶음을 내어 줍니다.

```js
import { Platform } from 'ranuts/utils';

const { destroy } = Platform.init({
  add: ({ a, b }) => a + b,
  getTime: async () => Date.now(),
});

// 나중에 듣기를 멈추려면:
// destroy();
```

**부모 페이지**에서 연결한 뒤 아이디로 부릅니다.

```js
import { Client } from 'ranuts/utils';

const iframe = document.querySelector('iframe');

iframe.addEventListener('load', async () => {
  // iframe 창으로 가는, 이름 붙은 연결을 등록합니다.
  const { id } = Client.connect({
    id: 'calculator',
    targetWindow: iframe.contentWindow,
    targetOrigin: '*',
  });

  // Platform.init이 내어 준 메서드를 부르고 결과를 기다립니다.
  const sum = await Client.call({ id, type: 'add', payload: { a: 2, b: 3 } });
  console.log(sum); // => 5

  // 붙어 있는 모든 플랫폼에 방송합니다.
  Client.broadcast({ type: 'ping', payload: Date.now() });

  // 다 썼으면 걷어 냅니다.
  Client.remove(id);
});
```

### 일대일: `openPortBridge`와 `acceptPortBridge` (권장)

**부모 페이지**(먼저 나서는 쪽)가 통로를 만들어 한쪽 끝을 iframe에 건넵니다.

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

**iframe 안**(받는 쪽)에서 건네받을 포트를 기다립니다.

```js
import { acceptPortBridge } from 'ranuts/utils';

const bridge = await acceptPortBridge({ targetOrigin: 'https://parent.example.com' });

bridge.on('ping', ({ n }) => n + 1);
```

### `bridgeManager` 싱글턴을 곧바로 쓰기

```js
import { bridgeManager } from 'ranuts/utils';

const { bridge, id } = bridgeManager.connectClient({
  targetWindow: someIframe.contentWindow,
});

const result = await bridgeManager.sendTo(id, 'ping', { at: Date.now() });

bridgeManager.removeClient(id);
```

### `MessageCodec`만 따로 쓰기(문자열 통로인 경우)

```js
import { MessageCodec } from 'ranuts/utils';

const encoded = MessageCodec.encode({ msg: 'héllo 👋', n: 1 });
// -> Base64 문자열. URL·쿠키·localStorage에 실어도 안전합니다

const decoded = MessageCodec.decode(encoded);
console.log(decoded); // => { msg: 'héllo 👋', n: 1 }
```

## 참고

1. **직렬화**: 브리지는 구조를 지닌 객체(구조적 복제)로 오갑니다. 그래서 `Date`, `Map`, `Set`, `ArrayBuffer`, `File` 따위가 `MessageCodec` 없이도 그대로 남습니다. `payload`가 복제될 수 없는 것(함수, DOM 노드)이면 `send`는 그 자리에서 reject 합니다.
2. **프로토콜 표식**: 안쪽 프로토콜 표식을 지닌 메시지만 처리됩니다. 다른 라이브러리의 `postMessage` 왕래는 그냥 지나칩니다.
3. **출처 확인**: `targetOrigin`이 `'*'`(기본값)이면 들어오는 메시지를 출처로 거르지 않습니다. 실서비스에서는 출처를 또렷이 넘겨(`'https://app.example.com'` 따위) 그 출처만 받도록 하세요.
4. **오류가 건너오는 방식**: 저쪽 핸들러가 예외를 던지면 `send`, `sendTo`, `Client.call`은 그 오류로 reject 합니다. 오류 문구를 멀쩡한 결과인 양 resolve 하지 않습니다.
5. **시간 제한**: 120초 안에 응답이 오지 않으면 `send`와 `sendTo`는 `Error('Request timeout')`로 reject 합니다.
6. **채널 가르기**: 같은 창에서 브리지를 여럿 돌리려면 양쪽 끝에 같은 `channel`을 넘겨 서로 엉키지 않게 하세요.
7. **아이디는 겹칠 수 없습니다**: 아이디를 다시 쓰면 `connectClient`는 `Bridge <id> already exists`를 던집니다. `id`를 빼면 알아서 만들어 줍니다.
8. **뒷정리**: `PostMessageBridge` 인스턴스는 모두 전역 `message` 리스너 하나를 함께 씁니다(마지막 브리지가 사라지면 알아서 떼어집니다). 연결이 더 필요 없어지면 `destroy()`(또는 `Client.remove`나 `removeClient`)를 불러, 기다리던 요청을 reject 하고 자원을 놓아 주세요.
9. **브라우저가 아닌 곳에서**: `window`가 없는 곳(Node나 SSR)에서도 `PostMessageBridge`를 만드는 일 자체는 예외를 내지 않습니다. `send`는 뜻이 또렷한 오류로 reject 하고, `broadcast`와 `destroy`는 아무 일도 하지 않는 것으로 물러납니다.
10. **PortBridge를 고르세요**: 새로 쓰는 코드에서는 `openPortBridge`와 `acceptPortBridge`를 쓰세요. 일대일 통로라는 생김새가 혼선과 사칭, 자기 요청에 자기가 답하는 일을 막아 줍니다.
11. **`broadcastToAll`에 대해**: `Client.broadcastToAll`은 지금 창으로 출처 `'*'`로 보내는 것이라 보안상 권하지 않습니다. 상대를 정한 `call`이나 `broadcast`를 쓰세요.
12. **`BRIDGE_MARKER`와 `DEFAULT_CHANNEL`**: 위 2번과 6번 뒤에 있는 날것의 두 값도 내보냅니다. `PostMessageBridge`를 거치지 않고 `postMessage` 왕래를 곧바로 들여다볼 때(개발자 도구의 리스너, 테스트 따위)를 위해서입니다. `BRIDGE_MARKER`는 브리지의 모든 메시지가 지니는 프로토콜 표식 문자열이고, `DEFAULT_CHANNEL`은 아무것도 넘기지 않았을 때 쓰이는 `'default'`라는 채널 아이디 그 자체입니다.
