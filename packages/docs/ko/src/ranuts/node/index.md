# ranuts/node — 작은 HTTP 프레임워크

Node.js를 위한, 의존성 없는 작은 HTTP 도구 모음입니다. HTTP 서버, 라우터, 웹소켓 서버, 본문·정적 파일 미들웨어에 더해 명령줄과 파일 시스템 도우미가 몇 가지 들어 있습니다.

> ⚠️ **Node 전용입니다.** 이 진입점은 `node:http`, `node:fs`, `node:child_process` 따위를 끌어옵니다. `ranuts/node`에서 가져오세요. 브라우저 코드에서는 절대 쓰면 안 됩니다.

## 가져오기

```js
import { Server, Router, staticMiddleware, body } from 'ranuts/node';
```

> 본문을 해석하는 미들웨어는 **`body`**라는 이름으로 내보냅니다(내부 이름은 `bodyMiddleware`입니다). `bodyMiddleware`라는 내보내기는 없습니다.

## 빠른 시작

```js
import { Server, Router, staticMiddleware, body } from 'ranuts/node';

const app = new Server();
const router = new Router();

// 라우트는 경로가 정확히 같아야 맞습니다. 핸들러는 요청의 Context를 받습니다.
router.get('/hello', (ctx) => {
  ctx.res.setHeader('Content-Type', 'application/json');
  ctx.res.end(JSON.stringify({ message: 'hello world' }));
});

// JSON 본문이 실린 POST. body()가 이를 해석해 ctx.request.body에 담습니다
router.post('/echo', (ctx) => {
  ctx.res.end(JSON.stringify({ youSent: ctx.request.body }));
});

// body()는 요청 본문을 해석하는 동시에, 라우터가 읽는 ctx.request(method / path / url / query)도 채웁니다.
// 그러니 router.routes()보다 먼저 등록하세요.
app.use(body());
app.use(router.routes());
app.use(router.allowedMethods());

// 정적 파일 서빙(`/`는 ./public/index.html로 넘어갑니다)
app.use(staticMiddleware({ pathname: './public' }));

const server = app.listen(3000, () => {
  console.log('Server running at http://localhost:3000');
});
// `server`는 밑에 깔린 node:http의 Server 인스턴스입니다.
```

미들웨어 순서가 중요합니다. `Router`는 `ctx.request.path`와 `ctx.request.method`를 읽는데, 그것을 채우는 쪽이 `body()`이기 때문입니다. `body()`를 먼저 등록하세요. 함께 딸려 오는 `body()`가 지금 해석할 수 있는 요청 본문은 `application/json`과 `multipart/form-data`입니다.

## API

### Server

기본 내보내기. `node:http` 위에 얹은 최소한의 Koa 스타일 서버입니다.

| 멤버              | 설명                                                                                                    | 타입                               |
| ----------------- | ------------------------------------------------------------------------------------------------------- | ---------------------------------- |
| `new Server()`    | 서버를 만듭니다. 인자는 받지 않습니다.                                                                  | `() => Server`                     |
| `use(middleware)` | 미들웨어를 사슬 끝에 붙입니다. `void`를 돌려주므로 체이닝은 되지 않습니다.                              | `(fn: MiddlewareFunction) => void` |
| `listen(...args)` | 듣기를 시작합니다. 인자는 그대로 `http.Server.listen`에 넘어가고, 밑에 깔린 `http.Server`가 돌아옵니다. | `(...args) => http.Server`         |
| `middleware`      | 등록된 미들웨어 배열.                                                                                   | `MiddlewareFunction[]`             |
| `ctx`             | 함께 쓰는 요청 `Context`(그 안의 `req`·`res`는 요청마다 갈립니다).                                      | `Context`                          |

**미들웨어 시그니처**

```ts
type Next = () => Promise<void> | Promise<never>;
type MiddlewareFunction = (ctx: Context, next: Next) => void | Promise<void>;
```

`next()`를 부르면 다음 미들웨어로 제어가 넘어갑니다. 미들웨어는 등록한 순서대로 불리며, `next()`를 두 번 부르면 예외가 납니다.

**Context의 생김새**

| 필드      | 설명                                                                                                | 타입                        |
| --------- | --------------------------------------------------------------------------------------------------- | --------------------------- |
| `req`     | 들어온 요청.                                                                                        | `http.IncomingMessage`      |
| `res`     | 서버 응답. `res.setHeader`, `res.writeHead`, `res.end`로 씁니다.                                    | `http.ServerResponse`       |
| `ipv4()`  | 이 기기의, 내부용이 아닌 첫 IPv4 주소를 돌려줍니다(없으면 `undefined`).                             | `() => string \| undefined` |
| `request` | `body()`가 붙여 줍니다. `{ method, path, url, query, body }`이고 `query`는 `URLSearchParams`입니다. | `object` (dynamic)          |
| `[key]`   | `Context`는 열린 자루입니다. 미들웨어가 아무 필드나 달아 둘 수 있습니다.                            | `any`                       |

### Router

기본 내보내기. HTTP 메서드와 정확한 경로마다 핸들러를 등록해 두었다가, `routes()`로 그것들을 미들웨어로 내어 줍니다.

| 메서드                  | 설명                                                                           | 타입                                |
| ----------------------- | ------------------------------------------------------------------------------ | ----------------------------------- |
| `new Router()`          | 라우터를 만듭니다.                                                             | `() => Router`                      |
| `get(url, handler)`     | `GET` 라우트를 등록합니다.                                                     | `(url: string, h: Handler) => void` |
| `post(url, handler)`    | `POST` 라우트를 등록합니다.                                                    | `(url: string, h: Handler) => void` |
| `put(url, handler)`     | `PUT` 라우트를 등록합니다.                                                     | `(url: string, h: Handler) => void` |
| `patch(url, handler)`   | `PATCH` 라우트를 등록합니다.                                                   | `(url: string, h: Handler) => void` |
| `del(url, handler)`     | `DELETE` 라우트를 등록합니다.                                                  | `(url: string, h: Handler) => void` |
| `head(url, handler)`    | `HEAD` 라우트를 등록합니다.                                                    | `(url: string, h: Handler) => void` |
| `options(url, handler)` | `OPTIONS` 라우트를 등록합니다.                                                 | `(url: string, h: Handler) => void` |
| `routes()`              | 맞아떨어진 핸들러로 넘겨주는 미들웨어를 돌려줍니다.                            | `() => MiddlewareFunction`          |
| `allowedMethods()`      | 경로나 메서드가 맞지 않을 때 `404`·`405`·`501`로 답하는 미들웨어를 돌려줍니다. | `() => MiddlewareFunction`          |

**핸들러 시그니처**

```ts
type Handler = (ctx: Context, next: Next) => void;
```

요청 데이터는 `ctx.request`(`method`, `path`, `url`, `query`, `body`)에서 읽고, 응답은 `ctx.res`로 보냅니다. 경로는 정확히 같아야 맞습니다. `:param` 같은 구간은 지원하지 않으니, 질의 매개변수에는 `ctx.request.query`를 쓰세요.

### 미들웨어

| 심벌                     | 설명                                                                                                                             | 타입                                              |
| ------------------------ | -------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------- |
| `body(options?)`         | 본문을 해석하는 미들웨어. `ctx.request`를 채우고 `application/json`과 `multipart/form-data`를 해석합니다. 미들웨어를 돌려줍니다. | `(o?: Partial<ServerBody>) => MiddlewareFunction` |
| `staticMiddleware(opt?)` | `opt.pathname`(기본값 `process.cwd()`)에서 정적 파일을 서빙하고, `/`에는 `index.html`을 내어 줍니다.                             | `(o?: Partial<Option>) => MiddlewareFunction`     |
| `connect(fn)`            | Connect나 Express 식의 `(req, res, next)` 미들웨어를 이 프레임워크의 미들웨어에 맞춥니다.                                        | `(fn) => MiddlewareFunction`                      |

**`body(options)`의 옵션**

| 옵션         | 설명                                                    | 타입             | 기본값               |
| ------------ | ------------------------------------------------------- | ---------------- | -------------------- |
| `uploadDir`  | `multipart/form-data`로 올라온 파일을 둘 디렉터리.      | `string`         | `'.'`                |
| `encoding`   | 들어오는 요청 스트림의 인코딩.                          | `BufferEncoding` | `'utf-8'`/`'binary'` |
| `json`       | JSON 본문을 해석합니다(`false`면 날것의 문자열 그대로). | `boolean`        | `true`               |
| `urlencoded` | urlencoded 본문을 위해 남겨 둔 자리.                    | `boolean`        | `true`               |

**`staticMiddleware(option)`의 옵션**

| 옵션        | 설명                                     | 타입                     | 기본값          |
| ----------- | ---------------------------------------- | ------------------------ | --------------- |
| `pathname`  | 파일을 서빙할 기준 디렉터리.             | `string`                 | `process.cwd()` |
| `fileTypes` | 추가로 등록할 `확장자 → MIME 타입` 대응. | `Record<string, string>` | `{}`            |

### WebSocket

| 심벌                  | 설명                                                                             | 타입                           |
| --------------------- | -------------------------------------------------------------------------------- | ------------------------------ |
| `new WSS(httpServer)` | 웹소켓 서버를 `node:http` 서버에 붙입니다(`upgrade` 악수와 프레이밍을 맡습니다). | `(server: http.Server) => WSS` |

```js
import { Server, WSS } from 'ranuts/node';

const app = new Server();
const server = app.listen(3000);
const wss = new WSS(server);

wss.on('connect', (client) => {
  client.on('message', (data) => client.send('echo: ' + data));
});
// wss.broadcast(data)는 붙어 있는 모든 클라이언트에 보냅니다. wss.clients가 그 목록입니다.
```

`client` 하나하나는 `send(data, options?)`, `ping()`, `pong()`, `close()`, `socket`을 갖추고 `message`·`close`·`error` 이벤트를 냅니다.

### 유틸리티

| 심벌                          | 설명                                                                                   | 시그니처                                                       |
| ----------------------------- | -------------------------------------------------------------------------------------- | -------------------------------------------------------------- |
| `connect(fn)`                 | Connect나 Express의 `(req, res, next)` 미들웨어를 이 프레임워크의 미들웨어로 맞춥니다. | `(fn) => MiddlewareFunction`                                   |
| `get({ url })`                | JSON 엔드포인트를 HTTPS로 GET 하고 `{ success, data, message }`로 이행합니다.          | `({ url: string }) => Promise<Response>`                       |
| `getIPAdress()`               | 이 기기의, 내부용이 아닌 첫 IPv4 주소. 없으면 `undefined`.                             | `() => string \| undefined`                                    |
| `paresUrl(req)`               | `req.url`을 `{ search, query, pathname, path, href }`로 풀어냅니다(철자에 유의).       | `(req: IncomingMessage) => ParseUrl \| undefined`              |
| `prompt({ message })`         | 터미널에서 예·아니오를 묻고, `y`나 `yes`면 `true`로 이행합니다.                        | `({ message, stream?, defaultResponse? }) => Promise<boolean>` |
| `runCommand(cmd, args)`       | 자식 프로세스를 띄우고(stdio는 물려받습니다) 종료 코드 `0`에 이행합니다.               | `(cmd: string, args: string[]) => Promise<void>`               |
| `readStream({ path })`        | `path`에 대한 `fs.ReadStream`을 만듭니다.                                              | `(o: { path: string, ... }) => ReadStream`                     |
| `writeStream({ path })`       | `path`에 대한 `fs.WriteStream`을 만듭니다.                                             | `(o: { path: string, ... }) => WriteStream`                    |
| `startTask()`                 | 고해상도 타이머를 시작하고, 속을 알 수 없는 `symbol`을 돌려줍니다.                     | `() => symbol`                                                 |
| `taskEnd(symbol)`             | 짝이 되는 `startTask()` 이후 흐른 시간(Node에서는 나노초 `bigint`).                    | `(s: symbol) => number \| bigint`                              |
| `traverse(dir, cb, pre?)`     | `dir`를 재귀로 훑으며 파일마다 `cb(relPath, absPath, stats)`를 부릅니다(비동기).       | `(dir, cb, pre?) => Promise<any>`                              |
| `traverseSync(dir, cb, pre?)` | `traverse`의 동기 버전.                                                                | `(dir, cb, pre?) => void`                                      |
| `isColorSupported`            | 불리언. 지금 터미널이 ANSI 색을 지원하는지 여부.                                       | `boolean`                                                      |
| `colors`                      | ANSI 색 도우미. `colors.red('text')`처럼 쓰며 `reset`·`bold`·`dim`도 있습니다.         | `Record<string, (s: string) => string>`                        |

## 함께 보기

같은 `ranuts/node` 진입점에는 따로 문서를 둔 파일 시스템 도우미도 들어 있습니다.

- [writeFile](../file/write_file.md)
- [readFile](../file/read_file.md)
- [appendFile](../file/append_file.md)
- [readDir](../file/read_dir.md)
- [watchFile](../file/watch_file.md)
- [queryFileInfo](../file/file_info.md)
