# ranuts/node — چارچوب کوچک HTTP

جعبه‌ابزار کوچک و بی‌وابستگی HTTP برای Node.js: یک کارساز HTTP، یک مسیریاب، یک کارساز وب‌سوکت، میان‌افزار بدنه و فایل‌های ایستا، به‌همراه مشتی یاری‌رسان خط فرمان و سامانهٔ فایل.

> ⚠️ **فقط Node.** این نقطهٔ ورود `node:http`، `node:fs`، `node:child_process` و مانند آن را می‌آورد. آن را از `ranuts/node` وارد کن، هرگز از کد مرورگر.

## وارد کردن

```js
import { Server, Router, staticMiddleware, body } from 'ranuts/node';
```

> میان‌افزاری که بدنه را می‌خواند با نام **`body`** صادر می‌شود (نام درونی‌اش `bodyMiddleware` است). صادراتی به نام `bodyMiddleware` وجود ندارد.

## آغاز سریع

```js
import { Server, Router, staticMiddleware, body } from 'ranuts/node';

const app = new Server();
const router = new Router();

// مسیرها با تطابق دقیق مسیر جور می‌شوند. دستگیره، Context درخواست را می‌گیرد.
router.get('/hello', (ctx) => {
  ctx.res.setHeader('Content-Type', 'application/json');
  ctx.res.end(JSON.stringify({ message: 'hello world' }));
});

// POST با بدنهٔ JSON؛ body() آن را می‌خواند و در ctx.request.body می‌گذارد
router.post('/echo', (ctx) => {
  ctx.res.end(JSON.stringify({ youSent: ctx.request.body }));
});

// body() هم بدنهٔ درخواست را می‌خواند و هم ctx.request را پر می‌کند (method / path / url / query)
// که مسیریاب از آن می‌خواند؛ پس آن را پیش از router.routes() ثبت کن.
app.use(body());
app.use(router.routes());
app.use(router.allowedMethods());

// سرو کردن فایل‌های ایستا (برای `/` به ./public/index.html برمی‌گردد)
app.use(staticMiddleware({ pathname: './public' }));

const server = app.listen(3000, () => {
  console.log('Server running at http://localhost:3000');
});
// `server` همان نمونهٔ Server از node:http است که زیر کار نشسته.
```

ترتیب میان‌افزارها مهم است: `Router` از `ctx.request.path` و `ctx.request.method` می‌خواند و پرکنندهٔ آن‌ها `body()` است. نخست `body()` را ثبت کن. `body()` همراه‌شده در حال حاضر بدنه‌های `application/json` و `multipart/form-data` را می‌خواند.

## API

### Server

صادرات پیش‌فرض. کارسازی کمینه به سبک Koa که روی `node:http` سوار شده است.

| عضو               | توضیح                                                                                                                   | نوع                                |
| ----------------- | ----------------------------------------------------------------------------------------------------------------------- | ---------------------------------- |
| `new Server()`    | یک کارساز می‌سازد. هیچ آرگومانی نمی‌گیرد.                                                                               | `() => Server`                     |
| `use(middleware)` | میان‌افزاری را به انتهای زنجیره می‌افزاید. `void` برمی‌گرداند، پس زنجیره‌پذیر نیست.                                     | `(fn: MiddlewareFunction) => void` |
| `listen(...args)` | شنیدن را آغاز می‌کند. آرگومان‌ها همان‌طور به `http.Server.listen` سپرده می‌شوند و `http.Server` زیرین برگردانده می‌شود. | `(...args) => http.Server`         |
| `middleware`      | آرایهٔ میان‌افزارهای ثبت‌شده.                                                                                           | `MiddlewareFunction[]`             |
| `ctx`             | `Context` مشترکِ درخواست (که `req` و `res` آن در هر درخواست عوض می‌شود).                                                | `Context`                          |

**امضای میان‌افزار**

```ts
type Next = () => Promise<void> | Promise<never>;
type MiddlewareFunction = (ctx: Context, next: Next) => void | Promise<void>;
```

برای سپردن کنترل به میان‌افزار بعدی `next()` را صدا بزن. میان‌افزارها به ترتیب ثبت اجرا می‌شوند؛ صدا زدن دوبارهٔ `next()` خطا می‌اندازد.

**شکل Context**

| میدان     | توضیح                                                                                            | نوع                         |
| --------- | ------------------------------------------------------------------------------------------------ | --------------------------- |
| `req`     | درخواستی که می‌رسد.                                                                              | `http.IncomingMessage`      |
| `res`     | پاسخ کارساز. با `res.setHeader`، `res.writeHead` و `res.end` روی آن می‌نویسی.                    | `http.ServerResponse`       |
| `ipv4()`  | نخستین نشانی IPv4 غیرداخلی این ماشین را برمی‌گرداند (وگرنه `undefined`).                         | `() => string \| undefined` |
| `request` | که `body()` می‌افزاید: `{ method, path, url, query, body }`؛ و `query` یک `URLSearchParams` است. | `object` (dynamic)          |
| `[key]`   | `Context` کیسه‌ای باز است: هر میان‌افزاری می‌تواند فیلد دلخواه به آن بچسباند.                    | `any`                       |

### Router

صادرات پیش‌فرض. برای هر روش HTTP و هر مسیر دقیق، دستگیره ثبت می‌کند و سپس آن‌ها را با `routes()` به شکل میان‌افزار عرضه می‌کند.

| متد                     | توضیح                                                                                      | نوع                                 |
| ----------------------- | ------------------------------------------------------------------------------------------ | ----------------------------------- |
| `new Router()`          | یک مسیریاب می‌سازد.                                                                        | `() => Router`                      |
| `get(url, handler)`     | مسیری از نوع `GET` ثبت می‌کند.                                                             | `(url: string, h: Handler) => void` |
| `post(url, handler)`    | مسیری از نوع `POST` ثبت می‌کند.                                                            | `(url: string, h: Handler) => void` |
| `put(url, handler)`     | مسیری از نوع `PUT` ثبت می‌کند.                                                             | `(url: string, h: Handler) => void` |
| `patch(url, handler)`   | مسیری از نوع `PATCH` ثبت می‌کند.                                                           | `(url: string, h: Handler) => void` |
| `del(url, handler)`     | مسیری از نوع `DELETE` ثبت می‌کند.                                                          | `(url: string, h: Handler) => void` |
| `head(url, handler)`    | مسیری از نوع `HEAD` ثبت می‌کند.                                                            | `(url: string, h: Handler) => void` |
| `options(url, handler)` | مسیری از نوع `OPTIONS` ثبت می‌کند.                                                         | `(url: string, h: Handler) => void` |
| `routes()`              | میان‌افزاری برمی‌گرداند که کار را به دستگیرهٔ جورشده می‌سپارد.                             | `() => MiddlewareFunction`          |
| `allowedMethods()`      | میان‌افزاری برمی‌گرداند که وقتی مسیر یا روش جور نشود با `404`، `405` یا `501` پاسخ می‌دهد. | `() => MiddlewareFunction`          |

**امضای دستگیره**

```ts
type Handler = (ctx: Context, next: Next) => void;
```

دادهٔ درخواست را از `ctx.request` بخوان (`method`، `path`، `url`، `query`، `body`) و پاسخ را از راه `ctx.res` بفرست. مسیرها دقیقاً جور می‌شوند: از پاره‌های `:param` پشتیبانی نمی‌شود؛ برای پارامترهای پرس‌وجو از `ctx.request.query` استفاده کن.

### میان‌افزار

| نماد                     | توضیح                                                                                                                                   | نوع                                               |
| ------------------------ | --------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------- |
| `body(options?)`         | میان‌افزار خواندن بدنه. `ctx.request` را پر می‌کند و `application/json` و `multipart/form-data` را می‌خواند. یک میان‌افزار برمی‌گرداند. | `(o?: Partial<ServerBody>) => MiddlewareFunction` |
| `staticMiddleware(opt?)` | فایل‌های ایستا را از `opt.pathname` (پیش‌فرض `process.cwd()`) سرو می‌کند و برای `/` همان `index.html` را می‌دهد.                        | `(o?: Partial<Option>) => MiddlewareFunction`     |
| `connect(fn)`            | میان‌افزار به سبک Connect یا Express، یعنی `(req, res, next)`، را با میان‌افزار این چارچوب سازگار می‌کند.                               | `(fn) => MiddlewareFunction`                      |

**گزینه‌های `body(options)`**

| گزینه        | توضیح                                                             | نوع              | پیش‌فرض              |
| ------------ | ----------------------------------------------------------------- | ---------------- | -------------------- |
| `uploadDir`  | پوشه‌ای برای فایل‌های بارگذاری‌شده با `multipart/form-data`.      | `string`         | `'.'`                |
| `encoding`   | رمزگذاری جریان درخواستی که می‌رسد.                                | `BufferEncoding` | `'utf-8'`/`'binary'` |
| `json`       | بدنه‌های JSON را می‌خواند (با `false` رشتهٔ خام سر جایش می‌ماند). | `boolean`        | `true`               |
| `urlencoded` | برای بدنه‌های urlencoded کنار گذاشته شده است.                     | `boolean`        | `true`               |

**گزینه‌های `staticMiddleware(option)`**

| گزینه       | توضیح                                                 | نوع                      | پیش‌فرض         |
| ----------- | ----------------------------------------------------- | ------------------------ | --------------- |
| `pathname`  | پوشهٔ ریشه که فایل‌ها از آن سرو می‌شوند.              | `string`                 | `process.cwd()` |
| `fileTypes` | نگاشت‌های افزوده از پسوند به نوع MIME که ثبت می‌شوند. | `Record<string, string>` | `{}`            |

### WebSocket

| نماد                  | توضیح                                                                                                      | نوع                            |
| --------------------- | ---------------------------------------------------------------------------------------------------------- | ------------------------------ |
| `new WSS(httpServer)` | یک کارساز وب‌سوکت را به کارساز `node:http` می‌چسباند (دست‌دادن `upgrade` و قاب‌بندی را خودش انجام می‌دهد). | `(server: http.Server) => WSS` |

```js
import { Server, WSS } from 'ranuts/node';

const app = new Server();
const server = app.listen(3000);
const wss = new WSS(server);

wss.on('connect', (client) => {
  client.on('message', (data) => client.send('echo: ' + data));
});
// wss.broadcast(data) به همهٔ کارخواه‌های متصل می‌فرستد؛ wss.clients همان فهرست است.
```

هر `client` این‌ها را در اختیار می‌گذارد: `send(data, options?)`، `ping()`، `pong()`، `close()` و `socket`، و رویدادهای `message`، `close` و `error`.

### ابزارهای کمکی

| نماد                          | توضیح                                                                                              | امضا                                                           |
| ----------------------------- | -------------------------------------------------------------------------------------------------- | -------------------------------------------------------------- |
| `connect(fn)`                 | میان‌افزار `(req, res, next)` از Connect یا Express را با میان‌افزار این چارچوب سازگار می‌کند.     | `(fn) => MiddlewareFunction`                                   |
| `get({ url })`                | یک نقطهٔ پایانی JSON را با GET روی HTTPS می‌گیرد و با `{ success, data, message }` برآورده می‌شود. | `({ url: string }) => Promise<Response>`                       |
| `getIPAdress()`               | نخستین نشانی IPv4 غیرداخلی این ماشین، یا `undefined`.                                              | `() => string \| undefined`                                    |
| `paresUrl(req)`               | `req.url` را به `{ search, query, pathname, path, href }` می‌شکند (به املای نام دقت کن).           | `(req: IncomingMessage) => ParseUrl \| undefined`              |
| `prompt({ message })`         | در پایانه پرسشی بله/خیر می‌پرسد؛ در برابر `y` یا `yes` با `true` برآورده می‌شود.                   | `({ message, stream?, defaultResponse? }) => Promise<boolean>` |
| `runCommand(cmd, args)`       | فرایندی فرزند به راه می‌اندازد (stdio را به ارث می‌برد) و با کد خروج `0` برآورده می‌شود.           | `(cmd: string, args: string[]) => Promise<void>`               |
| `readStream({ path })`        | برای `path` یک `fs.ReadStream` می‌سازد.                                                            | `(o: { path: string, ... }) => ReadStream`                     |
| `writeStream({ path })`       | برای `path` یک `fs.WriteStream` می‌سازد.                                                           | `(o: { path: string, ... }) => WriteStream`                    |
| `startTask()`                 | زمان‌سنجی با دقت بالا آغاز می‌کند و یک `symbol` مبهم برمی‌گرداند.                                  | `() => symbol`                                                 |
| `taskEnd(symbol)`             | زمان سپری‌شده از `startTask()` متناظر (در Node، نانوثانیه به شکل `bigint`).                        | `(s: symbol) => number \| bigint`                              |
| `traverse(dir, cb, pre?)`     | `dir` را بازگشتی می‌پیماید و برای هر فایل `cb(relPath, absPath, stats)` را صدا می‌زند (ناهمگام).   | `(dir, cb, pre?) => Promise<any>`                              |
| `traverseSync(dir, cb, pre?)` | گونهٔ همگام `traverse`.                                                                            | `(dir, cb, pre?) => void`                                      |
| `isColorSupported`            | مقدار بولی: اینکه پایانهٔ کنونی رنگ‌های ANSI را پشتیبانی می‌کند یا نه.                             | `boolean`                                                      |
| `colors`                      | یاری‌رسان‌های رنگ ANSI، مثلاً `colors.red('text')`، به‌همراه `reset`، `bold` و `dim`.              | `Record<string, (s: string) => string>`                        |

## بیشتر ببینید

همین نقطهٔ ورود `ranuts/node` یاری‌رسان‌های سامانهٔ فایل را هم دارد که جداگانه مستند شده‌اند:

- [writeFile](../file/write_file.md)
- [readFile](../file/read_file.md)
- [appendFile](../file/append_file.md)
- [readDir](../file/read_dir.md)
- [watchFile](../file/watch_file.md)
- [queryFileInfo](../file/file_info.md)
