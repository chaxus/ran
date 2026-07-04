# ranuts/node — mini HTTP framework

A small, dependency-free HTTP toolkit for Node.js: an HTTP server, a router, a
WebSocket server, body/static middleware, plus a handful of CLI and filesystem
helpers.

> ⚠️ **Node only.** This entry point pulls in `node:http`, `node:fs`,
> `node:child_process`, etc. Import it from `ranuts/node`, never from browser code.

## Import

```js
import { Server, Router, staticMiddleware, body } from 'ranuts/node';
```

> The body-parsing middleware is exported as **`body`** (its internal name is
> `bodyMiddleware`). There is no `bodyMiddleware` export.

## Quick start

```js
import { Server, Router, staticMiddleware, body } from 'ranuts/node';

const app = new Server();
const router = new Router();

// Routes are matched by exact path. The handler receives the request Context.
router.get('/hello', (ctx) => {
  ctx.res.setHeader('Content-Type', 'application/json');
  ctx.res.end(JSON.stringify({ message: 'hello world' }));
});

// POST with a JSON body — body() parses it onto ctx.request.body
router.post('/echo', (ctx) => {
  ctx.res.end(JSON.stringify({ youSent: ctx.request.body }));
});

// body() parses the request body AND fills ctx.request (method / path / url / query),
// which the router reads — so register it BEFORE router.routes().
app.use(body());
app.use(router.routes());
app.use(router.allowedMethods());

// Serve static files (falls back to ./public/index.html for `/`)
app.use(staticMiddleware({ pathname: './public' }));

const server = app.listen(3000, () => {
  console.log('Server running at http://localhost:3000');
});
// `server` is the underlying node:http Server instance.
```

Middleware ordering matters: the `Router` reads `ctx.request.path` and
`ctx.request.method`, which are populated by `body()`. Register `body()` first.
The bundled `body()` currently parses `application/json` and `multipart/form-data`
request bodies.

## API

### Server

Default export. A minimal Koa-style server built on `node:http`.

| Member                | Description                                                             | Type                                       |
| --------------------- | ---------------------------------------------------------------------- | ------------------------------------------ |
| `new Server()`        | Create a server. Takes no arguments.                                   | `() => Server`                             |
| `use(middleware)`     | Append a middleware to the chain. Returns `void` (not chainable).      | `(fn: MiddlewareFunction) => void`         |
| `listen(...args)`     | Start listening. Args are forwarded to `http.Server.listen`. Returns the underlying `http.Server`. | `(...args) => http.Server` |
| `middleware`          | The registered middleware array.                                       | `MiddlewareFunction[]`                     |
| `ctx`                 | The shared request `Context` (its `req`/`res` are swapped per request). | `Context`                                 |

**Middleware signature**

```ts
type Next = () => Promise<void> | Promise<never>;
type MiddlewareFunction = (ctx: Context, next: Next) => void | Promise<void>;
```

Call `next()` to pass control to the next middleware. Middleware are dispatched in
registration order; calling `next()` twice throws.

**Context shape**

| Field    | Description                                                              | Type                        |
| -------- | ----------------------------------------------------------------------- | --------------------------- |
| `req`    | The incoming request.                                                    | `http.IncomingMessage`      |
| `res`    | The server response. Write with `res.setHeader` / `res.writeHead` / `res.end`. | `http.ServerResponse` |
| `ipv4()` | Returns the machine's first non-internal IPv4 address (or `undefined`). | `() => string \| undefined` |
| `request`| Added by `body()`: `{ method, path, url, query, body }`. `query` is a `URLSearchParams`. | `object` (dynamic) |
| `[key]`  | `Context` is an open bag — middleware may attach arbitrary fields.       | `any`                       |

### Router

Default export. Registers handlers per HTTP method and exact path, then exposes them
as middleware via `routes()`.

| Method                       | Description                                        | Type                                   |
| ---------------------------- | -------------------------------------------------- | -------------------------------------- |
| `new Router()`               | Create a router.                                   | `() => Router`                         |
| `get(url, handler)`          | Register a `GET` route.                            | `(url: string, h: Handler) => void`    |
| `post(url, handler)`         | Register a `POST` route.                           | `(url: string, h: Handler) => void`    |
| `put(url, handler)`          | Register a `PUT` route.                            | `(url: string, h: Handler) => void`    |
| `patch(url, handler)`        | Register a `PATCH` route.                          | `(url: string, h: Handler) => void`    |
| `del(url, handler)`          | Register a `DELETE` route.                         | `(url: string, h: Handler) => void`    |
| `head(url, handler)`         | Register a `HEAD` route.                           | `(url: string, h: Handler) => void`    |
| `options(url, handler)`      | Register an `OPTIONS` route.                        | `(url: string, h: Handler) => void`    |
| `routes()`                   | Returns a middleware that dispatches to the matched handler. | `() => MiddlewareFunction`   |
| `allowedMethods()`           | Returns a middleware that answers `404`/`405`/`501` for unmatched path/method. | `() => MiddlewareFunction` |

**Handler signature**

```ts
type Handler = (ctx: Context, next: Next) => void;
```

Read request data from `ctx.request` (`method`, `path`, `url`, `query`, `body`) and
send a response through `ctx.res`. Paths are matched exactly — there is no `:param`
segment support; use `ctx.request.query` for query parameters.

### Middleware

| Symbol                   | Description                                                                                          | Type                                        |
| ------------------------ | --------------------------------------------------------------------------------------------------- | ------------------------------------------- |
| `body(options?)`         | Body-parsing middleware. Fills `ctx.request` and parses `application/json` / `multipart/form-data`. Returns a middleware. | `(o?: Partial<ServerBody>) => MiddlewareFunction` |
| `staticMiddleware(opt?)` | Serves static files from `opt.pathname` (default `process.cwd()`); serves `index.html` for `/`.     | `(o?: Partial<Option>) => MiddlewareFunction` |
| `connect(fn)`            | Adapts a Connect/Express-style `(req, res, next)` middleware into this framework's middleware.       | `(fn) => MiddlewareFunction`                |

**`body(options)` options**

| Option       | Description                                                | Type             | Default        |
| ------------ | ---------------------------------------------------------- | ---------------- | -------------- |
| `uploadDir`  | Directory for `multipart/form-data` file uploads.         | `string`         | `'.'`          |
| `encoding`   | Encoding for the incoming request stream.                 | `BufferEncoding` | `'utf-8'`/`'binary'` |
| `json`       | Parse JSON bodies (`false` keeps the raw string).         | `boolean`        | `true`         |
| `urlencoded` | Reserved for urlencoded bodies.                           | `boolean`        | `true`         |

**`staticMiddleware(option)` options**

| Option      | Description                                              | Type                       | Default            |
| ----------- | ------------------------------------------------------- | -------------------------- | ------------------ |
| `pathname`  | Root directory to serve files from.                     | `string`                   | `process.cwd()`    |
| `fileTypes` | Extra `extension → MIME type` mappings to register.     | `Record<string, string>`   | `{}`               |

### WebSocket

| Symbol                 | Description                                                                                     | Type                              |
| ---------------------- | ---------------------------------------------------------------------------------------------- | --------------------------------- |
| `new WSS(httpServer)`  | Attach a WebSocket server to a `node:http` server (handles the `upgrade` handshake and framing). | `(server: http.Server) => WSS` |

```js
import { Server, WSS } from 'ranuts/node';

const app = new Server();
const server = app.listen(3000);
const wss = new WSS(server);

wss.on('connect', (client) => {
  client.on('message', (data) => client.send('echo: ' + data));
});
// wss.broadcast(data) sends to every connected client; wss.clients is the list.
```

Each `client` exposes `send(data, options?)`, `ping()`, `pong()`, `close()`,
`socket`, and the events `message`, `close`, `error`.

### Utilities

| Symbol                    | Description                                                                             | Signature                                                     |
| ------------------------- | -------------------------------------------------------------------------------------- | ------------------------------------------------------------ |
| `connect(fn)`             | Adapt a Connect/Express `(req, res, next)` middleware into a framework middleware.      | `(fn) => MiddlewareFunction`                                 |
| `get({ url })`            | HTTPS GET a JSON endpoint; resolves `{ success, data, message }`.                       | `({ url: string }) => Promise<Response>`                     |
| `getIPAdress()`           | The machine's first non-internal IPv4 address, or `undefined`.                         | `() => string \| undefined`                                  |
| `paresUrl(req)`           | Parse `req.url` into `{ search, query, pathname, path, href }` (note the spelling).    | `(req: IncomingMessage) => ParseUrl \| undefined`            |
| `prompt({ message })`     | Ask a yes/no question on the terminal; resolves `true` for `y`/`yes`.                  | `({ message, stream?, defaultResponse? }) => Promise<boolean>` |
| `runCommand(cmd, args)`   | Spawn a child process (inherits stdio); resolves on exit code `0`.                     | `(cmd: string, args: string[]) => Promise<void>`             |
| `readStream({ path })`    | Create a `fs.ReadStream` for `path`.                                                    | `(o: { path: string, ... }) => ReadStream`                   |
| `writeStream({ path })`   | Create a `fs.WriteStream` for `path`.                                                   | `(o: { path: string, ... }) => WriteStream`                  |
| `startTask()`             | Start a high-resolution timer; returns an opaque `symbol`.                             | `() => symbol`                                               |
| `taskEnd(symbol)`         | Elapsed time since the matching `startTask()` (nanoseconds `bigint` in Node).          | `(s: symbol) => number \| bigint`                            |
| `traverse(dir, cb, pre?)` | Recursively walk `dir`, calling `cb(relPath, absPath, stats)` for each file (async).    | `(dir, cb, pre?) => Promise<any>`                            |
| `traverseSync(dir, cb, pre?)` | Synchronous version of `traverse`.                                                 | `(dir, cb, pre?) => void`                                    |
| `isColorSupported`        | Boolean: whether the current terminal supports ANSI colors.                            | `boolean`                                                    |
| `colors`                  | ANSI color helpers, e.g. `colors.red('text')`, plus `reset` / `bold` / `dim`.          | `Record<string, (s: string) => string>`                      |

## See also

The same `ranuts/node` entry point also ships filesystem helpers, documented separately:

- [writeFile](../file/write_file.md)
- [readFile](../file/read_file.md)
- [appendFile](../file/append_file.md)
- [readDir](../file/read_dir.md)
- [watchFile](../file/watch_file.md)
- [queryFileInfo](../file/file_info.md)
