# ranuts/node — 迷你 HTTP 框架

一个面向 Node.js 的轻量、零依赖 HTTP 工具集：HTTP 服务器、路由、WebSocket
服务器、body/静态资源中间件，以及一批命令行与文件系统辅助函数。

> ⚠️ **仅限 Node 环境。** 该入口会引入 `node:http`、`node:fs`、
> `node:child_process` 等模块。请从 `ranuts/node` 导入，切勿在浏览器代码中使用。

## 导入

```js
import { Server, Router, staticMiddleware, body } from 'ranuts/node';
```

> body 解析中间件的导出名是 **`body`**（其内部名称为 `bodyMiddleware`）。
> 不存在名为 `bodyMiddleware` 的导出。

## 快速开始

```js
import { Server, Router, staticMiddleware, body } from 'ranuts/node';

const app = new Server();
const router = new Router();

// 路由按精确路径匹配，处理函数接收请求 Context。
router.get('/hello', (ctx) => {
  ctx.res.setHeader('Content-Type', 'application/json');
  ctx.res.end(JSON.stringify({ message: 'hello world' }));
});

// 带 JSON body 的 POST —— body() 会将其解析到 ctx.request.body 上
router.post('/echo', (ctx) => {
  ctx.res.end(JSON.stringify({ youSent: ctx.request.body }));
});

// body() 既解析请求体，也会填充 ctx.request（method / path / url / query），
// 路由会读取这些字段 —— 因此必须在 router.routes() 之前注册。
app.use(body());
app.use(router.routes());
app.use(router.allowedMethods());

// 提供静态文件（访问 `/` 时回退到 ./public/index.html）
app.use(staticMiddleware({ pathname: './public' }));

const server = app.listen(3000, () => {
  console.log('Server running at http://localhost:3000');
});
// `server` 即底层的 node:http Server 实例。
```

中间件顺序很重要：`Router` 会读取 `ctx.request.path` 和 `ctx.request.method`，
而这两个字段由 `body()` 填充，所以请先注册 `body()`。内置的 `body()` 目前解析
`application/json` 与 `multipart/form-data` 类型的请求体。

## API

### Server

默认导出。基于 `node:http` 的极简 Koa 风格服务器。

| 成员              | 说明                                                                    | 类型                               |
| ----------------- | ----------------------------------------------------------------------- | ---------------------------------- |
| `new Server()`    | 创建服务器，无参数。                                                    | `() => Server`                     |
| `use(middleware)` | 向中间件链追加一个中间件。返回 `void`（不可链式调用）。                 | `(fn: MiddlewareFunction) => void` |
| `listen(...args)` | 开始监听。参数原样转发给 `http.Server.listen`，返回底层 `http.Server`。 | `(...args) => http.Server`         |
| `middleware`      | 已注册的中间件数组。                                                    | `MiddlewareFunction[]`             |
| `ctx`             | 共享的请求 `Context`（其 `req`/`res` 每次请求都会被替换）。             | `Context`                          |

**中间件签名**

```ts
type Next = () => Promise<void> | Promise<never>;
type MiddlewareFunction = (ctx: Context, next: Next) => void | Promise<void>;
```

调用 `next()` 将控制权交给下一个中间件。中间件按注册顺序依次执行；重复调用
`next()` 会抛出异常。

**Context 结构**

| 字段      | 说明                                                                                        | 类型                        |
| --------- | ------------------------------------------------------------------------------------------- | --------------------------- |
| `req`     | 传入的请求。                                                                                | `http.IncomingMessage`      |
| `res`     | 服务器响应。使用 `res.setHeader` / `res.writeHead` / `res.end` 写出。                       | `http.ServerResponse`       |
| `ipv4()`  | 返回本机第一个非内网 IPv4 地址（否则 `undefined`）。                                        | `() => string \| undefined` |
| `request` | 由 `body()` 添加：`{ method, path, url, query, body }`，其中 `query` 为 `URLSearchParams`。 | `object`（动态）            |
| `[key]`   | `Context` 是开放对象，中间件可挂载任意字段。                                                | `any`                       |

### Router

默认导出。按 HTTP 方法与精确路径注册处理函数，再通过 `routes()` 暴露为中间件。

| 方法                    | 说明                                                        | 类型                                |
| ----------------------- | ----------------------------------------------------------- | ----------------------------------- |
| `new Router()`          | 创建路由实例。                                              | `() => Router`                      |
| `get(url, handler)`     | 注册一个 `GET` 路由。                                       | `(url: string, h: Handler) => void` |
| `post(url, handler)`    | 注册一个 `POST` 路由。                                      | `(url: string, h: Handler) => void` |
| `put(url, handler)`     | 注册一个 `PUT` 路由。                                       | `(url: string, h: Handler) => void` |
| `patch(url, handler)`   | 注册一个 `PATCH` 路由。                                     | `(url: string, h: Handler) => void` |
| `del(url, handler)`     | 注册一个 `DELETE` 路由。                                    | `(url: string, h: Handler) => void` |
| `head(url, handler)`    | 注册一个 `HEAD` 路由。                                      | `(url: string, h: Handler) => void` |
| `options(url, handler)` | 注册一个 `OPTIONS` 路由。                                   | `(url: string, h: Handler) => void` |
| `routes()`              | 返回一个将请求派发到匹配处理函数的中间件。                  | `() => MiddlewareFunction`          |
| `allowedMethods()`      | 返回一个中间件，对未匹配的路径/方法回应 `404`/`405`/`501`。 | `() => MiddlewareFunction`          |

**处理函数签名**

```ts
type Handler = (ctx: Context, next: Next) => void;
```

从 `ctx.request` 读取请求数据（`method`、`path`、`url`、`query`、`body`），
通过 `ctx.res` 发送响应。路径为精确匹配 —— 不支持 `:param` 动态段；查询参数
请使用 `ctx.request.query`。

### 中间件

| 符号                     | 说明                                                                                                     | 类型                                              |
| ------------------------ | -------------------------------------------------------------------------------------------------------- | ------------------------------------------------- |
| `body(options?)`         | body 解析中间件。填充 `ctx.request`，并解析 `application/json` / `multipart/form-data`。返回一个中间件。 | `(o?: Partial<ServerBody>) => MiddlewareFunction` |
| `staticMiddleware(opt?)` | 从 `opt.pathname`（默认 `process.cwd()`）提供静态文件；访问 `/` 时返回 `index.html`。                    | `(o?: Partial<Option>) => MiddlewareFunction`     |
| `connect(fn)`            | 将 Connect/Express 风格的 `(req, res, next)` 中间件适配为本框架的中间件。                                | `(fn) => MiddlewareFunction`                      |

**`body(options)` 选项**

| 选项         | 说明                                           | 类型             | 默认值               |
| ------------ | ---------------------------------------------- | ---------------- | -------------------- |
| `uploadDir`  | `multipart/form-data` 文件上传的存放目录。     | `string`         | `'.'`                |
| `encoding`   | 传入请求流的编码。                             | `BufferEncoding` | `'utf-8'`/`'binary'` |
| `json`       | 是否解析 JSON body（`false` 保留原始字符串）。 | `boolean`        | `true`               |
| `urlencoded` | 预留：用于 urlencoded body。                   | `boolean`        | `true`               |

**`staticMiddleware(option)` 选项**

| 选项        | 说明                               | 类型                     | 默认值          |
| ----------- | ---------------------------------- | ------------------------ | --------------- |
| `pathname`  | 提供文件的根目录。                 | `string`                 | `process.cwd()` |
| `fileTypes` | 额外的 `扩展名 → MIME 类型` 映射。 | `Record<string, string>` | `{}`            |

### WebSocket

| 符号                  | 说明                                                                          | 类型                           |
| --------------------- | ----------------------------------------------------------------------------- | ------------------------------ |
| `new WSS(httpServer)` | 将 WebSocket 服务器附加到 `node:http` 服务器（处理 `upgrade` 握手与帧解析）。 | `(server: http.Server) => WSS` |

```js
import { Server, WSS } from 'ranuts/node';

const app = new Server();
const server = app.listen(3000);
const wss = new WSS(server);

wss.on('connect', (client) => {
  client.on('message', (data) => client.send('echo: ' + data));
});
// wss.broadcast(data) 向所有已连接客户端发送；wss.clients 为客户端列表。
```

每个 `client` 提供 `send(data, options?)`、`ping()`、`pong()`、`close()`、
`socket`，以及 `message`、`close`、`error` 事件。

### 工具函数

| 符号                          | 说明                                                                        | 签名                                                           |
| ----------------------------- | --------------------------------------------------------------------------- | -------------------------------------------------------------- |
| `connect(fn)`                 | 将 Connect/Express 的 `(req, res, next)` 中间件适配为框架中间件。           | `(fn) => MiddlewareFunction`                                   |
| `get({ url })`                | HTTPS GET 一个 JSON 接口；resolve `{ success, data, message }`。            | `({ url: string }) => Promise<Response>`                       |
| `getIPAdress()`               | 本机第一个非内网 IPv4 地址，否则 `undefined`。                              | `() => string \| undefined`                                    |
| `paresUrl(req)`               | 将 `req.url` 解析为 `{ search, query, pathname, path, href }`（注意拼写）。 | `(req: IncomingMessage) => ParseUrl \| undefined`              |
| `prompt({ message })`         | 在终端询问 yes/no 问题；输入 `y`/`yes` 时 resolve `true`。                  | `({ message, stream?, defaultResponse? }) => Promise<boolean>` |
| `runCommand(cmd, args)`       | 派生子进程（继承 stdio）；退出码为 `0` 时 resolve。                         | `(cmd: string, args: string[]) => Promise<void>`               |
| `readStream({ path })`        | 为 `path` 创建 `fs.ReadStream`。                                            | `(o: { path: string, ... }) => ReadStream`                     |
| `writeStream({ path })`       | 为 `path` 创建 `fs.WriteStream`。                                           | `(o: { path: string, ... }) => WriteStream`                    |
| `startTask()`                 | 启动高精度计时器；返回一个不透明的 `symbol`。                               | `() => symbol`                                                 |
| `taskEnd(symbol)`             | 自对应 `startTask()` 起经过的时间（Node 中为纳秒 `bigint`）。               | `(s: symbol) => number \| bigint`                              |
| `traverse(dir, cb, pre?)`     | 递归遍历 `dir`，对每个文件调用 `cb(relPath, absPath, stats)`（异步）。      | `(dir, cb, pre?) => Promise<any>`                              |
| `traverseSync(dir, cb, pre?)` | `traverse` 的同步版本。                                                     | `(dir, cb, pre?) => void`                                      |
| `isColorSupported`            | 布尔值：当前终端是否支持 ANSI 颜色。                                        | `boolean`                                                      |
| `colors`                      | ANSI 颜色辅助函数，如 `colors.red('text')`，另有 `reset` / `bold` / `dim`。 | `Record<string, (s: string) => string>`                        |

## 相关链接

同一个 `ranuts/node` 入口还提供文件系统辅助函数，另行单独记录：

- [writeFile](../file/write_file.md)
- [readFile](../file/read_file.md)
- [appendFile](../file/append_file.md)
- [readDir](../file/read_dir.md)
- [watchFile](../file/watch_file.md)
- [queryFileInfo](../file/file_info.md)
