# پل (postMessage)

لایه‌ای کوچک برای پیام‌رسانی میان بافتارها که روی `window.postMessage` سوار شده است. دو بافتار مرورگر — یک صفحهٔ والد و یک `<iframe>`، یک پنجرهٔ بازشو، یا هر `Window` دیگری که ارجاعش را داری — می‌توانند با یک API از جنس درخواست و پاسخ (به سبک RPC) و با همه‌پخشی‌های یک‌سویه با هم گفت‌وگو کنند.

پیام‌ها به شکل **شیءهای ساختارمند** از مرز می‌گذرند (با همان الگوریتم رونوشت ساختاری که در خودِ `postMessage` هست)، پس نوع‌هایی مانند `Date`، `Map`، `Set`، `ArrayBuffer` و `File` بی‌آنکه دستی سریال‌سازی شوند دست‌نخورده می‌رسند. هر پیام نشانی از پروتکل با خود دارد تا بتوان آن را از رفت‌وآمد `postMessage` کتابخانه‌های دیگر (HMR، ابزار توسعه‌دهنده، SDKهای بیرونی) بازشناخت.

سه راه برای به‌کار بردنش هست:

- **`PostMessageBridge`**: پایه‌ای‌ترین قطعه. هر نمونه یک `Window` مقصد را در بر می‌گیرد. با `on` دستگیره ثبت می‌کنی، با `send` می‌فرستی و منتظر می‌مانی، و با `broadcast` می‌فرستی و رهایش می‌کنی.
- **`BridgeManager` / `bridgeManager` / `Client` / `Platform`**: لایه‌ای بالاتر که دفتری از پل‌های نام‌دار نگه می‌دارد (یک تک‌نمونه)، به‌همراه دو نمای نازک: `Client` برای سمت فراخوان و `Platform` برای سمت گیرنده.
- **`openPortBridge` / `acceptPortBridge` / `createPortBridge`**: پلی نقطه‌به‌نقطه که بر `MessageChannel` و `MessagePort` بنا شده است (**برای کد تازه همین را پیشنهاد می‌کنیم**). پس از یک دست‌دادن یک‌باره، هر سو درگاهی خصوصی در دست دارد و همین ساختار جلوی درهم‌گویی میان پنجره‌ها، جعل فرستنده، برخورد کانال‌ها در یک پنجره، و پاسخ دادن به درخواست خود را می‌گیرد؛ بی‌آنکه نیازی به پالایش بر پایهٔ خاستگاه باشد.

> **سازگاری**: قالب انتقال یک شیء ساختارمند است، دیگر رشتهٔ Base64 نیست. سرِهم‌نسخه‌ها مستقیم با هم کار می‌کنند و `Client` (`PostMessageBridge`) با `Platform` یک پروتکل پاکتی مشترک دارد. اگر میان نسخه‌ها صفحهٔ کهنه و صفحهٔ نو را با هم بیامیزی، پروتکل جور درنمی‌آید.

## API

### `PostMessageBridge`

کلاس هسته‌ای. هر نمونه یک `Window` را نشانه می‌گیرد. به‌جای آنکه هر نمونه شنوندهٔ خودش را بیفزاید، همهٔ نمونه‌ها **یک** شنوندهٔ `message` روی `window` را شریک‌اند و یک توزیع‌کنندهٔ درونی پیام‌ها را می‌رساند؛ پس شمار شنونده‌ها با شمار نمونه‌ها بالا نمی‌رود.

```ts
new PostMessageBridge(targetWindow?: Window, targetOrigin?: string, channel?: string)
```

#### پارامترهای سازنده

| پارامتر        | توضیح                                                                                                                       | نوع      | پیش‌فرض     |
| -------------- | --------------------------------------------------------------------------------------------------------------------------- | -------- | ----------- |
| `targetWindow` | `Window`ی که پیام‌ها به آن فرستاده می‌شود (iframe، پنجرهٔ بازشو، `parent` و…)                                               | `Window` | `window`    |
| `targetOrigin` | خاستگاهی که به آن فرستاده و از آن پذیرفته می‌شود. `'*'` وارسی را از کار می‌اندازد                                           | `string` | `'*'`       |
| `channel`      | شناسهٔ کانال. **چند پل روی یک پنجره** را از هم جدا می‌کند؛ برای آنکه گفت‌وگو برقرار شود، هر دو سر باید یک کانال داشته باشند | `string` | `'default'` |

#### Methods

| متد                            | توضیح                                                                                                                         | امضا                                                          |
| ------------------------------ | ----------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------- |
| `on(type, handler)`            | برای یک `type` پیام دستگیره ثبت می‌کند. مقدار بازگشتی آن (یا مقداری که با آن برآورده می‌شود) به‌عنوان پاسخ پس فرستاده می‌شود. | `<T, R>(type: string, handler: MessageHandler<T, R>) => void` |
| `off(type)`                    | دستگیره‌ای را که برای `type` ثبت شده برمی‌دارد.                                                                               | `(type: string) => void`                                      |
| `send(type, payload)`          | پیامی می‌فرستد و چشم‌به‌راه پاسخ می‌ماند. با خطای دستگیرهٔ آن سو، یا پس از مهلت ۱۲۰ ثانیه، رد می‌کند.                         | `<T, R>(type: string, payload: T) => Promise<R>`              |
| `broadcast({ type, payload })` | بفرست و رها کن: پیامی می‌فرستد بی‌آنکه چشم‌به‌راه پاسخ بماند.                                                                 | `<T>(data: { type: string; payload: T }) => void`             |
| `destroy()`                    | از توزیع‌کننده بیرون می‌آید، همهٔ دستگیره‌ها را پاک می‌کند و همهٔ درخواست‌های در انتظار را رد می‌کند.                         | `() => void`                                                  |

> **نگهبانِ پاسخ به خود**: هر نمونه شناسهٔ فرستندهٔ یکتای خود را دارد و درخواستی را که خودش فرستاده **رسیدگی نمی‌کند**. برای انجام درخواست و پاسخ **درون یک پنجره**، دو نمونهٔ پل بردار (یکی دستگیره‌ها را ثبت کند و دیگری بفرستد).

### `BridgeManager`

دفتری تک‌نمونه که چند نمونهٔ نام‌دار `PostMessageBridge` را در اختیار دارد. نمونهٔ مشترک را با `BridgeManager.getInstance()` بگیر یا از صادرات آمادهٔ [`bridgeManager`](#bridgemanager-singleton) استفاده کن. سازنده‌اش خصوصی است.

| متد                            | توضیح                                                              | امضا                                                                           |
| ------------------------------ | ------------------------------------------------------------------ | ------------------------------------------------------------------------------ |
| `BridgeManager.getInstance()`  | همان نمونهٔ تک‌نمونهٔ مشترک را برمی‌گرداند.                        | `() => BridgeManager`                                                          |
| `connectClient(options)`       | پلی تازه می‌سازد و ثبت می‌کند. اگر `id` از پیش باشد خطا می‌اندازد. | `(options: BridgeManagerOptions) => { bridge: PostMessageBridge; id: string }` |
| `getClient(id)`                | پلی ثبت‌شده را با شناسه پیدا می‌کند.                               | `(id: string) => PostMessageBridge \| undefined`                               |
| `removeClient(id)`             | پلِ این شناسه را نابود می‌کند و از دفتر بیرون می‌برد.              | `(id: string) => void`                                                         |
| `removeAllClient()`            | همهٔ پل‌ها را نابود می‌کند و از دفتر بیرون می‌برد.                 | `() => void`                                                                   |
| `broadcast({ type, payload })` | یک پیام را از همهٔ پل‌های ثبت‌شده همه‌پخشی می‌کند.                 | `<T>(payload: { type: string; payload: T }) => void`                           |
| `sendTo(id, type, payload)`    | درخواستی را از پلِ این شناسه می‌فرستد و چشم‌به‌راه پاسخ می‌ماند.   | `<T, R>(id: string, type: string, payload: T) => Promise<R>`                   |

اگر در `connectClient` شناسه ندهی، شناسه‌ای تصادفی با ده نویسه ساخته و برگردانده می‌شود. `options` گزینهٔ `channel` را هم می‌پذیرد که به `PostMessageBridge` زیرین سپرده می‌شود.

### `bridgeManager` (تک‌نمونه)

همان نمونهٔ مشترک `BridgeManager` که از پیش ساخته شده و برابر با `BridgeManager.getInstance()` است. به‌جای ساختن نمونهٔ خودت، این را وارد کن.

```ts
import { bridgeManager } from 'ranuts/utils';
```

### `Client`

نمایی نازک روی `bridgeManager` برای سمتی که **فرا می‌خواند** (بافتاری که درخواست‌ها را آغاز می‌کند). شیئی ساده است، نه یک کلاس.

| متد                           | توضیح                                                                         | امضا                                                                           |
| ----------------------------- | ----------------------------------------------------------------------------- | ------------------------------------------------------------------------------ |
| `connect(options)`            | به پنجرهٔ مقصد وصل می‌شود (کار را به `bridgeManager.connectClient` می‌سپارد). | `(options: BridgeManagerOptions) => { bridge: PostMessageBridge; id: string }` |
| `remove(id)`                  | یک اتصال را با شناسه برمی‌دارد.                                               | `(id: string) => void`                                                         |
| `removeAll()`                 | همهٔ اتصال‌ها را برمی‌دارد.                                                   | `() => void`                                                                   |
| `broadcast(payload)`          | به همهٔ سکوهای متصل همه‌پخشی می‌کند.                                          | `(payload: BroadcastPayload) => void`                                          |
| `call({ id, type, payload })` | درخواستی به سکوی پشت `id` می‌فرستد و چشم‌به‌راه جواب می‌ماند.                 | `<T, R>(payload: CallToPayload<T>) => Promise<R>`                              |
| `broadcastToAll(payload)`     | به پنجرهٔ کنونی با خاستگاه `'*'` می‌فرستد. از نظر امنیتی توصیه نمی‌شود.       | `(payload: BroadcastPayload) => void`                                          |

### `Platform`

نمایی برای سمتی که **دریافت می‌کند** (معمولاً کدی که درون یک iframe اجرا می‌شود). شیئی ساده با تنها یک متد است و همان پروتکل پاکتی `Client` (`PostMessageBridge`) را دارد، پس دو سر مستقیم با هم کار می‌کنند.

| متد                     | توضیح                                                                                                                                                                                                                                                 | امضا                                                                              |
| ----------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------- |
| `Platform.init(events)` | نگاشتی از `type` به دستگیره ثبت می‌کند. با هر پیامی که می‌رسد، دستگیرهٔ جور را اجرا می‌کند و نتیجه را به `event.source` بازمی‌فرستد؛ اگر دستگیره خطا بیندازد همان خطا پس فرستاده می‌شود (فراخوان رد می‌شود). برای برچیدن، یک `destroy()` برمی‌گرداند. | `<T, R>(events: Record<string, MessageHandler<T, R>>) => { destroy: () => void }` |

### PortBridge (بر پایهٔ MessagePort، پیشنهاد ما برای کد تازه)

پلی نقطه‌به‌نقطه که بر `MessageChannel` و `MessagePort` بنا شده است. درگاه، **اختیارِ یک کانال خصوصی** است که مرورگر می‌دهد: تنها همان دو سویی که هنگام دست‌دادن درگاه را گرفته‌اند می‌توانند با هم گفت‌وگو کنند. همین ساختار جلوی درهم‌گویی میان پنجره‌ها، جعل فرستنده، برخورد کانال‌ها در یک پنجره، و پاسخ دادن به درخواست خود را می‌گیرد؛ بی‌نیاز از پالایش خاستگاه و بی‌نیاز از نشان پروتکل. بارِ پیام‌ها هم با رونوشت ساختاری جابه‌جا می‌شود.

| تابع                         | توضیح                                                                                                                | امضا                                                         |
| ---------------------------- | -------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------ |
| `openPortBridge(options)`    | **آغازگر**: یک `MessageChannel` می‌سازد، یک درگاه را به پنجرهٔ مقصد می‌سپارد و سر دیگر را نگه می‌دارد.               | `(options: OpenPortBridgeOptions) => PortBridge`             |
| `acceptPortBridge(options?)` | **گیرنده**: چشم‌به‌راه درگاهی می‌ماند که آغازگر می‌سپارد؛ به‌محض دریافت، با یک پل برآورده می‌شود.                    | `(options?: AcceptPortBridgeOptions) => Promise<PortBridge>` |
| `createPortBridge(port)`     | روی **هر** `MessagePort`ی پل می‌سازد (مثلاً یک Web Worker یا SharedWorker، یا درگاهی که دست‌دادنش پیش‌تر انجام شده). | `(port: MessagePort) => PortBridge`                          |

`PortBridge`ی که برگردانده می‌شود همان `on`، `off`، `send`، `broadcast` و `destroy` را دارد که `PostMessageBridge` دارد.

- **`OpenPortBridgeOptions`**: `{ targetWindow: Window; targetOrigin?: string; name?: string }`. `name` چند اتصال درگاهی مستقل را در یک صفحه از هم بازمی‌شناسد و باید در دو سر یکسان باشد (پیش‌فرض `'default'`).
- **`AcceptPortBridgeOptions`**: `{ targetOrigin?: string; name?: string }`.

### `MessageCodec`

داده را به رشتهٔ Base64 رمز می‌کند و باز می‌گرداند، و همهٔ نویسه‌های یونیکد (چینی، اموجی و مانند آن) را نگه می‌دارد. برای بردن دادهٔ ساختارمند از **کانال‌هایی که فقط رشته می‌پذیرند** (نشانی‌ها، کوکی‌ها، `localStorage` و…) به کار می‌آید.

> نکته: پل **دیگر** برای سریال‌سازی هر پیام از این استفاده نمی‌کند (رونوشت ساختاری به کار می‌برد). این ابزار همچنان مستقل صادر می‌شود، برای وقتی که کانالت فقط رشته می‌پذیرد.

| متد                   | توضیح                                                                                      | امضا                                   |
| --------------------- | ------------------------------------------------------------------------------------------ | -------------------------------------- |
| `encode(data)`        | هر مقداری را که به JSON درآید به رشتهٔ Base64 سریال می‌کند. در صورت شکست `''` برمی‌گرداند. | `(data: any) => string`                |
| `decode(encodedStr)`  | رشتهٔ Base64 را دوباره به یک مقدار می‌خواند. در صورت شکست `null` برمی‌گرداند.              | `<T>(encodedStr: string) => T \| null` |
| `encodeFile(file)`    | یک `File` را با فرادادها و بایت‌هایش به رشتهٔ Base64 رمز می‌کند.                           | `(file: File) => Promise<string>`      |
| `decodeFile(encoded)` | رشته‌ای را که `encodeFile` ساخته دوباره به `File` بازمی‌گرداند.                            | `(encoded: string) => File`            |

### واسط‌ها

#### `MessageHandler<T, R>`

دستگیرهٔ پیام. `payload` را می‌گیرد و پاسخ را برمی‌گرداند (می‌تواند ناهمگام باشد).

```ts
interface MessageHandler<T = unknown, R = unknown> {
  (payload: T): Promise<R> | R;
}
```

#### `MessageData<T>`

شکل پیام در حال انتقال؛ همان پاکت.

| میدان        | توضیح                                                              | نوع        |
| ------------ | ------------------------------------------------------------------ | ---------- |
| `type`       | گونهٔ پیام، یا همان نام کانال.                                     | `string`   |
| `payload`    | تنهٔ پیام.                                                         | `T`        |
| `id`         | شناسه‌ای که درخواست و پاسخ را به هم می‌بندد؛ در چنین جفت‌هایی هست. | `string?`  |
| `isResponse` | وقتی این پیام یک پاسخ باشد `true` است.                             | `boolean?` |
| `isError`    | وقتی پاسخ خطایی با خود داشته باشد `true` است.                      | `boolean?` |
| `channel`    | شناسهٔ کانال؛ چند پل روی یک پنجره را از هم جدا می‌کند.             | `string?`  |
| `senderId`   | شناسهٔ نمونهٔ فرستنده؛ برای آنکه کسی به درخواست خودش پاسخ ندهد.    | `string?`  |

#### `PendingRequest<R>`

یک `send()` در جریان که چشم‌به‌راه پاسخ خود است (دفترداری درونی).

| میدان     | توضیح                              | نوع                        |
| --------- | ---------------------------------- | -------------------------- |
| `resolve` | پیمان در انتظار را برآورده می‌کند. | `(value: R) => void`       |
| `reject`  | پیمان در انتظار را رد می‌کند.      | `(error: unknown) => void` |

#### `BridgeManagerOptions`

گزینه‌های `connectClient` و `Client.connect`.

| میدان          | توضیح                                                                    | نوع       | پیش‌فرض                    |
| -------------- | ------------------------------------------------------------------------ | --------- | -------------------------- |
| `id`           | شناسهٔ صریح پل. اگر نیاید، خودبه‌خود ساخته می‌شود.                       | `string?` | رشته‌ای تصادفی با ۱۰ نویسه |
| `targetOrigin` | خاستگاهی که به `PostMessageBridge` سپرده می‌شود.                         | `string?` | `'*'`                      |
| `targetWindow` | `Window` مقصدی که به پل سپرده می‌شود.                                    | `Window?` | `window`                   |
| `channel`      | شناسهٔ کانال؛ برای جدا کردن اتصال‌های درون یک پنجره آن را صریح تعیین کن. | `string?` | `'default'`                |

#### `BroadcastPayload`

پیام همه‌پخشی یک‌سویه.

| میدان     | توضیح       | نوع       |
| --------- | ----------- | --------- |
| `type`    | گونهٔ پیام. | `string`  |
| `payload` | تنهٔ پیام.  | `unknown` |

#### `CallToPayload<T>`

آرگومانی که به `Client.call` داده می‌شود.

| میدان     | توضیح                   | نوع      |
| --------- | ----------------------- | -------- |
| `id`      | شناسهٔ پل یا سکوی مقصد. | `string` |
| `type`    | گونهٔ پیام.             | `string` |
| `payload` | تنهٔ درخواست.           | `T`      |

## نمونه

### لایهٔ پایین: `PostMessageBridge` میان یک صفحه و یک iframe

**صفحهٔ والد**، در گفت‌وگو با `contentWindow` آن iframe:

```js
import { PostMessageBridge } from 'ranuts/utils';

const iframe = document.querySelector('iframe');

// صبر کن تا iframe بار شود، سپس پلی به سویش بساز.
iframe.addEventListener('load', async () => {
  const bridge = new PostMessageBridge(iframe.contentWindow, '*');

  // درخواست و پاسخ: 'getUser' را بفرست و چشم‌به‌راه جواب باش.
  const user = await bridge.send('getUser', { id: 42 });
  console.log(user); // => { id: 42, name: 'Ada' }

  // همه‌پخشی بدون انتظار پاسخ.
  bridge.broadcast({ type: 'theme:change', payload: { mode: 'dark' } });
});
```

**درون iframe**، جایی که دستگیره‌ها ثبت می‌شوند:

```js
import { PostMessageBridge } from 'ranuts/utils';

// پنجرهٔ والد را نشانه بگیر.
const bridge = new PostMessageBridge(window.parent, '*');

bridge.on('getUser', async ({ id }) => {
  // هرچه اینجا برگردانی، پاسخِ send() فراخوان می‌شود.
  return { id, name: 'Ada' };
});

bridge.on('theme:change', ({ mode }) => {
  document.documentElement.dataset.theme = mode;
});
```

### لایهٔ بالا: `Client` (والد) و `Platform` (درون iframe)

**درون iframe**، جایی که `Platform` دسته‌ای متد را عرضه می‌کند:

```js
import { Platform } from 'ranuts/utils';

const { destroy } = Platform.init({
  add: ({ a, b }) => a + b,
  getTime: async () => Date.now(),
});

// بعدها، برای پایان دادن به شنیدن:
// destroy();
```

**صفحهٔ والد**، که وصل می‌شود و با شناسه فرا می‌خواند:

```js
import { Client } from 'ranuts/utils';

const iframe = document.querySelector('iframe');

iframe.addEventListener('load', async () => {
  // اتصالی نام‌دار به پنجرهٔ iframe ثبت کن.
  const { id } = Client.connect({
    id: 'calculator',
    targetWindow: iframe.contentWindow,
    targetOrigin: '*',
  });

  // متدی را که Platform.init عرضه کرده صدا بزن و چشم‌به‌راه نتیجه‌اش باش.
  const sum = await Client.call({ id, type: 'add', payload: { a: 2, b: 3 } });
  console.log(sum); // => 5

  // به همهٔ سکوهای متصل همه‌پخشی کن.
  Client.broadcast({ type: 'ping', payload: Date.now() });

  // وقتی کارت تمام شد، برچین.
  Client.remove(id);
});
```

### نقطه‌به‌نقطه: `openPortBridge` و `acceptPortBridge` (پیشنهادی)

**صفحهٔ والد** (آغازگر)، که کانالی می‌سازد و یک سرش را به iframe می‌سپارد:

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

**درون iframe** (گیرنده)، که چشم‌به‌راه درگاه سپرده‌شده است:

```js
import { acceptPortBridge } from 'ranuts/utils';

const bridge = await acceptPortBridge({ targetOrigin: 'https://parent.example.com' });

bridge.on('ping', ({ n }) => n + 1);
```

### به‌کار بردن مستقیم تک‌نمونهٔ `bridgeManager`

```js
import { bridgeManager } from 'ranuts/utils';

const { bridge, id } = bridgeManager.connectClient({
  targetWindow: someIframe.contentWindow,
});

const result = await bridgeManager.sendTo(id, 'ping', { at: Date.now() });

bridgeManager.removeClient(id);
```

### رمزگذاری جداگانه با `MessageCodec` (وقتی کانال فقط رشته می‌پذیرد)

```js
import { MessageCodec } from 'ranuts/utils';

const encoded = MessageCodec.encode({ msg: 'héllo 👋', n: 1 });
// -> یک رشتهٔ Base64، امن برای نشانی‌ها، کوکی‌ها و localStorage

const decoded = MessageCodec.decode(encoded);
console.log(decoded); // => { msg: 'héllo 👋', n: 1 }
```

## یادداشت‌ها

1. **سریال‌سازی**: پل با شیءهای ساختارمند (رونوشت ساختاری) گفت‌وگو می‌کند، پس `Date`، `Map`، `Set`، `ArrayBuffer`، `File` و مانند آن بی‌نیاز به `MessageCodec` سالم می‌مانند. اگر `payload` رونوشت‌پذیر نباشد (یک تابع، یک گرهٔ DOM)، `send` بی‌درنگ رد می‌کند.
2. **نشان پروتکل**: تنها پیام‌هایی رسیدگی می‌شوند که نشان پروتکل درونی را دارند؛ رفت‌وآمد `postMessage` کتابخانه‌های دیگر نادیده گرفته می‌شود.
3. **وارسی خاستگاه**: وقتی `targetOrigin` برابر `'*'` باشد (که پیش‌فرض است)، پیام‌های ورودی بر پایهٔ خاستگاه پالایش نمی‌شوند. در محیط واقعی خاستگاهی صریح بده (مثلاً `'https://app.example.com'`) تا تنها همان پذیرفته شود.
4. **گذر خطا**: وقتی دستگیرهٔ آن سو خطا بیندازد، `send`، `sendTo` و `Client.call` با همان خطا رد می‌کنند؛ نه اینکه متن خطا را چنان برآورده کنند که گویی نتیجه‌ای درست است.
5. **مهلت**: اگر تا ۱۲۰ ثانیه پاسخی نرسد، `send` و `sendTo` با `Error('Request timeout')` رد می‌کنند.
6. **جدا کردن کانال‌ها**: برای اجرای چند پل روی یک پنجره، به هر دو سر `channel` یکسان بده تا در هم نروند.
7. **شناسه‌های یکتا**: اگر شناسه‌ای را دوباره به کار ببری، `connectClient` خطای `Bridge <id> already exists` می‌اندازد. `id` را نده تا خودش بسازد.
8. **پاک‌سازی**: همهٔ نمونه‌های `PostMessageBridge` یک شنوندهٔ سراسری `message` را شریک‌اند (که پس از نابودی آخرین پل خودبه‌خود برداشته می‌شود). هرگاه اتصالی دیگر لازم نبود، `destroy()` (یا `Client.remove` و `removeClient`) را صدا بزن تا درخواست‌های در انتظار رد شوند و منابع آزاد گردند.
9. **بیرون از مرورگر**: جایی که `window` نیست (Node یا SSR)، ساختن `PostMessageBridge` خطا نمی‌اندازد؛ `send` با خطایی روشن رد می‌کند و `broadcast` و `destroy` به کارهایی بی‌اثر فرو می‌کاهند.
10. **PortBridge را ترجیح بده**: در کد تازه از `openPortBridge` و `acceptPortBridge` استفاده کن. کانال نقطه‌به‌نقطه از دلِ ساختارش جلوی درهم‌گویی، جعل و پاسخ به خود را می‌گیرد.
11. **`broadcastToAll`**: `Client.broadcastToAll` به پنجرهٔ کنونی با خاستگاه `'*'` می‌فرستد و از نظر امنیتی توصیه نمی‌شود. `call` یا `broadcast` نشانه‌دار را ترجیح بده.
12. **`BRIDGE_MARKER` و `DEFAULT_CHANNEL`**: آن دو مقدار خام که پشت بندهای ۲ و ۶ بالا هستند نیز صادر می‌شوند، برای وقتی که به‌جای گذر از `PostMessageBridge`، خودت مستقیم رفت‌وآمد `postMessage` را وارسی می‌کنی (شنونده‌ای در ابزار توسعه‌دهنده، یا یک آزمون). `BRIDGE_MARKER` همان رشتهٔ نشان پروتکل است که هر پیام پل با خود دارد و `DEFAULT_CHANNEL` همان شناسهٔ کانال `'default'` است که وقتی چیزی داده نشود به کار می‌رود.
