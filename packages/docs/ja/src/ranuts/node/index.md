# ranuts/node — 小さな HTTP フレームワーク

Node.js 向けの、依存なしの小さな HTTP ツール一式です。HTTP サーバー、ルーター、WebSocket サーバー、ボディと静的ファイルのミドルウェア、それに CLI とファイルシステムのヘルパーがいくつか入っています。

> ⚠️ **Node 専用です。** このエントリーポイントは `node:http`、`node:fs`、`node:child_process` などを読み込みます。`ranuts/node` から import してください。ブラウザー側のコードから読み込んではいけません。

## 読み込み

```js
import { Server, Router, staticMiddleware, body } from 'ranuts/node';
```

> ボディを解析するミドルウェアは **`body`** という名前で export されています（内部の名前は `bodyMiddleware` です）。`bodyMiddleware` という export はありません。

## はじめの一歩

```js
import { Server, Router, staticMiddleware, body } from 'ranuts/node';

const app = new Server();
const router = new Router();

// ルートはパスの完全一致で照合されます。ハンドラーはリクエストの Context を受け取ります。
router.get('/hello', (ctx) => {
  ctx.res.setHeader('Content-Type', 'application/json');
  ctx.res.end(JSON.stringify({ message: 'hello world' }));
});

// JSON ボディの POST。body() がそれを解析して ctx.request.body に載せます
router.post('/echo', (ctx) => {
  ctx.res.end(JSON.stringify({ youSent: ctx.request.body }));
});

// body() はリクエストボディを解析すると同時に、ルーターが読む ctx.request
// （method / path / url / query）も埋めます。だから router.routes() より前に登録します。
app.use(body());
app.use(router.routes());
app.use(router.allowedMethods());

// 静的ファイルの配信（`/` は ./public/index.html に振り分けられます）
app.use(staticMiddleware({ pathname: './public' }));

const server = app.listen(3000, () => {
  console.log('Server running at http://localhost:3000');
});
// `server` は土台になっている node:http の Server インスタンスです。
```

ミドルウェアの順番が効いてきます。`Router` は `ctx.request.path` と `ctx.request.method` を読みますが、それを埋めるのは `body()` だからです。まず `body()` を登録してください。付属の `body()` が今のところ解析できるリクエストボディは `application/json` と `multipart/form-data` です。

## API

### Server

デフォルト export。`node:http` の上に載せた、最小限の Koa 風サーバーです。

| メンバー          | 説明                                                                                                | 型                                 |
| ----------------- | --------------------------------------------------------------------------------------------------- | ---------------------------------- |
| `new Server()`    | サーバーを作ります。引数は取りません。                                                              | `() => Server`                     |
| `use(middleware)` | ミドルウェアを連なりの末尾に足します。返り値は `void` で、チェーンはできません。                    | `(fn: MiddlewareFunction) => void` |
| `listen(...args)` | 待ち受けを始めます。引数はそのまま `http.Server.listen` へ渡され、土台の `http.Server` が返ります。 | `(...args) => http.Server`         |
| `middleware`      | 登録済みのミドルウェアの配列。                                                                      | `MiddlewareFunction[]`             |
| `ctx`             | 共有されるリクエストの `Context`（`req`/`res` はリクエストごとに差し替わります）。                  | `Context`                          |

**ミドルウェアのシグネチャ**

```ts
type Next = () => Promise<void> | Promise<never>;
type MiddlewareFunction = (ctx: Context, next: Next) => void | Promise<void>;
```

`next()` を呼ぶと次のミドルウェアへ制御が渡ります。ミドルウェアは登録した順に呼ばれ、`next()` を二度呼ぶと例外になります。

**Context の中身**

| フィールド | 説明                                                                                              | 型                          |
| ---------- | ------------------------------------------------------------------------------------------------- | --------------------------- |
| `req`      | 届いたリクエスト。                                                                                | `http.IncomingMessage`      |
| `res`      | サーバーの応答。`res.setHeader` / `res.writeHead` / `res.end` で書き込みます。                    | `http.ServerResponse`       |
| `ipv4()`   | このマシンの、内部向けでない最初の IPv4 アドレスを返します（なければ `undefined`）。              | `() => string \| undefined` |
| `request`  | `body()` が足すもの。`{ method, path, url, query, body }` で、`query` は `URLSearchParams` です。 | `object` (dynamic)          |
| `[key]`    | `Context` は開いた入れ物です。ミドルウェアは好きなフィールドを足せます。                          | `any`                       |

### Router

デフォルト export。HTTP メソッドとパスの完全一致ごとにハンドラーを登録し、`routes()` でそれらをミドルウェアとして差し出します。

| メソッド                | 説明                                                                                    | 型                                  |
| ----------------------- | --------------------------------------------------------------------------------------- | ----------------------------------- |
| `new Router()`          | ルーターを作ります。                                                                    | `() => Router`                      |
| `get(url, handler)`     | `GET` のルートを登録します。                                                            | `(url: string, h: Handler) => void` |
| `post(url, handler)`    | `POST` のルートを登録します。                                                           | `(url: string, h: Handler) => void` |
| `put(url, handler)`     | `PUT` のルートを登録します。                                                            | `(url: string, h: Handler) => void` |
| `patch(url, handler)`   | `PATCH` のルートを登録します。                                                          | `(url: string, h: Handler) => void` |
| `del(url, handler)`     | `DELETE` のルートを登録します。                                                         | `(url: string, h: Handler) => void` |
| `head(url, handler)`    | `HEAD` のルートを登録します。                                                           | `(url: string, h: Handler) => void` |
| `options(url, handler)` | `OPTIONS` のルートを登録します。                                                        | `(url: string, h: Handler) => void` |
| `routes()`              | 一致したハンドラーへ振り分けるミドルウェアを返します。                                  | `() => MiddlewareFunction`          |
| `allowedMethods()`      | パスやメソッドが一致しなかったときに `404`・`405`・`501` を返すミドルウェアを返します。 | `() => MiddlewareFunction`          |

**ハンドラーのシグネチャ**

```ts
type Handler = (ctx: Context, next: Next) => void;
```

リクエストのデータは `ctx.request`（`method`、`path`、`url`、`query`、`body`）から読み、応答は `ctx.res` を通して返します。パスは完全一致で照合されます。`:param` のようなセグメントには対応していないので、クエリパラメーターには `ctx.request.query` を使ってください。

### ミドルウェア

| シンボル                 | 説明                                                                                                                                     | 型                                                |
| ------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------- |
| `body(options?)`         | ボディを解析するミドルウェア。`ctx.request` を埋め、`application/json` と `multipart/form-data` を解析します。返り値はミドルウェアです。 | `(o?: Partial<ServerBody>) => MiddlewareFunction` |
| `staticMiddleware(opt?)` | `opt.pathname`（既定は `process.cwd()`）から静的ファイルを配信し、`/` には `index.html` を返します。                                     | `(o?: Partial<Option>) => MiddlewareFunction`     |
| `connect(fn)`            | Connect や Express 流の `(req, res, next)` ミドルウェアを、このフレームワークのミドルウェアに合わせます。                                | `(fn) => MiddlewareFunction`                      |

**`body(options)` のオプション**

| オプション   | 説明                                                         | 型               | 既定値               |
| ------------ | ------------------------------------------------------------ | ---------------- | -------------------- |
| `uploadDir`  | `multipart/form-data` でアップロードされたファイルの置き場。 | `string`         | `'.'`                |
| `encoding`   | 届くリクエストストリームのエンコーディング。                 | `BufferEncoding` | `'utf-8'`/`'binary'` |
| `json`       | JSON のボディを解析します（`false` なら生の文字列のまま）。  | `boolean`        | `true`               |
| `urlencoded` | urlencoded のボディ用に予約されています。                    | `boolean`        | `true`               |

**`staticMiddleware(option)` のオプション**

| オプション  | 説明                                           | 型                       | 既定値          |
| ----------- | ---------------------------------------------- | ------------------------ | --------------- |
| `pathname`  | ファイルを配信する起点のディレクトリ。         | `string`                 | `process.cwd()` |
| `fileTypes` | 追加で登録する `拡張子 → MIME タイプ` の対応。 | `Record<string, string>` | `{}`            |

### WebSocket

| シンボル              | 説明                                                                                                                  | 型                             |
| --------------------- | --------------------------------------------------------------------------------------------------------------------- | ------------------------------ |
| `new WSS(httpServer)` | WebSocket サーバーを `node:http` のサーバーに取り付けます（`upgrade` のハンドシェイクとフレーム処理を引き受けます）。 | `(server: http.Server) => WSS` |

```js
import { Server, WSS } from 'ranuts/node';

const app = new Server();
const server = app.listen(3000);
const wss = new WSS(server);

wss.on('connect', (client) => {
  client.on('message', (data) => client.send('echo: ' + data));
});
// wss.broadcast(data) は接続中の全クライアントに送ります。wss.clients がその一覧です。
```

個々の `client` は `send(data, options?)`、`ping()`、`pong()`、`close()`、`socket` を備え、`message`・`close`・`error` のイベントを発行します。

### ユーティリティ

| シンボル                      | 説明                                                                                                    | シグネチャ                                                     |
| ----------------------------- | ------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------- |
| `connect(fn)`                 | Connect や Express の `(req, res, next)` ミドルウェアを、このフレームワークのミドルウェアに合わせます。 | `(fn) => MiddlewareFunction`                                   |
| `get({ url })`                | JSON のエンドポイントを HTTPS で GET し、`{ success, data, message }` で解決します。                    | `({ url: string }) => Promise<Response>`                       |
| `getIPAdress()`               | このマシンの、内部向けでない最初の IPv4 アドレス。なければ `undefined`。                                | `() => string \| undefined`                                    |
| `paresUrl(req)`               | `req.url` を `{ search, query, pathname, path, href }` に分解します（綴りにご注意を）。                 | `(req: IncomingMessage) => ParseUrl \| undefined`              |
| `prompt({ message })`         | ターミナルで yes/no を尋ね、`y` か `yes` なら `true` で解決します。                                     | `({ message, stream?, defaultResponse? }) => Promise<boolean>` |
| `runCommand(cmd, args)`       | 子プロセスを起動し（stdio は引き継ぎます）、終了コード `0` で解決します。                               | `(cmd: string, args: string[]) => Promise<void>`               |
| `readStream({ path })`        | `path` の `fs.ReadStream` を作ります。                                                                  | `(o: { path: string, ... }) => ReadStream`                     |
| `writeStream({ path })`       | `path` の `fs.WriteStream` を作ります。                                                                 | `(o: { path: string, ... }) => WriteStream`                    |
| `startTask()`                 | 高分解能のタイマーを始め、中身の見えない `symbol` を返します。                                          | `() => symbol`                                                 |
| `taskEnd(symbol)`             | 対応する `startTask()` からの経過時間（Node ではナノ秒の `bigint`）。                                   | `(s: symbol) => number \| bigint`                              |
| `traverse(dir, cb, pre?)`     | `dir` を再帰的にたどり、ファイルごとに `cb(relPath, absPath, stats)` を呼びます（非同期）。             | `(dir, cb, pre?) => Promise<any>`                              |
| `traverseSync(dir, cb, pre?)` | `traverse` の同期版。                                                                                   | `(dir, cb, pre?) => void`                                      |
| `isColorSupported`            | 真偽値。今のターミナルが ANSI カラーに対応しているかどうか。                                            | `boolean`                                                      |
| `colors`                      | ANSI カラーのヘルパー。`colors.red('text')` のように使え、`reset` / `bold` / `dim` も揃っています。     | `Record<string, (s: string) => string>`                        |

## 関連ページ

同じ `ranuts/node` エントリーポイントには、別ページで説明しているファイルシステムのヘルパーも入っています。

- [writeFile](../file/write_file.md)
- [readFile](../file/read_file.md)
- [appendFile](../file/append_file.md)
- [readDir](../file/read_dir.md)
- [watchFile](../file/watch_file.md)
- [queryFileInfo](../file/file_info.md)
