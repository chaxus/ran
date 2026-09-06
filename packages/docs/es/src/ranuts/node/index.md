# ranuts/node — mini framework HTTP

Un pequeño juego de herramientas HTTP para Node.js, sin dependencias: un servidor HTTP, un enrutador, un servidor WebSocket, middleware de cuerpo y de archivos estáticos, y un puñado de ayudas para la terminal y el sistema de archivos.

> ⚠️ **Solo Node.** Este punto de entrada carga `node:http`, `node:fs`, `node:child_process` y compañía. Impórtalo desde `ranuts/node`, nunca desde código de navegador.

## Importar

```js
import { Server, Router, staticMiddleware, body } from 'ranuts/node';
```

> El middleware que interpreta el cuerpo se exporta como **`body`** (su nombre interno es `bodyMiddleware`). No existe ninguna exportación llamada `bodyMiddleware`.

## Primeros pasos

```js
import { Server, Router, staticMiddleware, body } from 'ranuts/node';

const app = new Server();
const router = new Router();

// Las rutas se emparejan por ruta exacta. El manejador recibe el Context de la petición.
router.get('/hello', (ctx) => {
  ctx.res.setHeader('Content-Type', 'application/json');
  ctx.res.end(JSON.stringify({ message: 'hello world' }));
});

// POST con cuerpo JSON: body() lo interpreta y lo deja en ctx.request.body
router.post('/echo', (ctx) => {
  ctx.res.end(JSON.stringify({ youSent: ctx.request.body }));
});

// body() interpreta el cuerpo de la petición Y rellena ctx.request (method / path / url / query),
// que es lo que lee el enrutador, así que regístralo ANTES de router.routes().
app.use(body());
app.use(router.routes());
app.use(router.allowedMethods());

// Sirve archivos estáticos (para `/` recurre a ./public/index.html)
app.use(staticMiddleware({ pathname: './public' }));

const server = app.listen(3000, () => {
  console.log('Server running at http://localhost:3000');
});
// `server` es la instancia de Server de node:http que hay debajo.
```

El orden del middleware importa: el `Router` lee `ctx.request.path` y `ctx.request.method`, y quien los rellena es `body()`. Registra `body()` primero. El `body()` que viene incluido interpreta hoy por hoy cuerpos `application/json` y `multipart/form-data`.

## API

### Server

Exportación por defecto. Un servidor mínimo al estilo de Koa, montado sobre `node:http`.

| Miembro           | Descripción                                                                                                       | Tipo                               |
| ----------------- | ----------------------------------------------------------------------------------------------------------------- | ---------------------------------- |
| `new Server()`    | Crea un servidor. No recibe argumentos.                                                                           | `() => Server`                     |
| `use(middleware)` | Añade un middleware al final de la cadena. Devuelve `void`, o sea que no se encadena.                             | `(fn: MiddlewareFunction) => void` |
| `listen(...args)` | Se pone a escuchar. Los argumentos se pasan tal cual a `http.Server.listen`. Devuelve el `http.Server` de debajo. | `(...args) => http.Server`         |
| `middleware`      | El array de middleware registrados.                                                                               | `MiddlewareFunction[]`             |
| `ctx`             | El `Context` de petición compartido (su `req` y su `res` se cambian en cada petición).                            | `Context`                          |

**Firma del middleware**

```ts
type Next = () => Promise<void> | Promise<never>;
type MiddlewareFunction = (ctx: Context, next: Next) => void | Promise<void>;
```

Llama a `next()` para pasar el control al siguiente middleware. Los middleware se despachan en el orden en que se registraron; llamar a `next()` dos veces lanza un error.

**Forma del Context**

| Campo     | Descripción                                                                               | Tipo                        |
| --------- | ----------------------------------------------------------------------------------------- | --------------------------- |
| `req`     | La petición entrante.                                                                     | `http.IncomingMessage`      |
| `res`     | La respuesta del servidor. Se escribe con `res.setHeader`, `res.writeHead` y `res.end`.   | `http.ServerResponse`       |
| `ipv4()`  | Devuelve la primera dirección IPv4 no interna de la máquina (o `undefined`).              | `() => string \| undefined` |
| `request` | Lo añade `body()`: `{ method, path, url, query, body }`. `query` es un `URLSearchParams`. | `object` (dynamic)          |
| `[key]`   | `Context` es un saco abierto: cualquier middleware puede colgarle campos.                 | `any`                       |

### Router

Exportación por defecto. Registra manejadores por método HTTP y ruta exacta, y luego los ofrece como middleware mediante `routes()`.

| Método                  | Descripción                                                                                     | Tipo                                |
| ----------------------- | ----------------------------------------------------------------------------------------------- | ----------------------------------- |
| `new Router()`          | Crea un enrutador.                                                                              | `() => Router`                      |
| `get(url, handler)`     | Registra una ruta `GET`.                                                                        | `(url: string, h: Handler) => void` |
| `post(url, handler)`    | Registra una ruta `POST`.                                                                       | `(url: string, h: Handler) => void` |
| `put(url, handler)`     | Registra una ruta `PUT`.                                                                        | `(url: string, h: Handler) => void` |
| `patch(url, handler)`   | Registra una ruta `PATCH`.                                                                      | `(url: string, h: Handler) => void` |
| `del(url, handler)`     | Registra una ruta `DELETE`.                                                                     | `(url: string, h: Handler) => void` |
| `head(url, handler)`    | Registra una ruta `HEAD`.                                                                       | `(url: string, h: Handler) => void` |
| `options(url, handler)` | Registra una ruta `OPTIONS`.                                                                    | `(url: string, h: Handler) => void` |
| `routes()`              | Devuelve un middleware que deriva al manejador que haya encajado.                               | `() => MiddlewareFunction`          |
| `allowedMethods()`      | Devuelve un middleware que responde `404`, `405` o `501` cuando la ruta o el método no encajan. | `() => MiddlewareFunction`          |

**Firma del manejador**

```ts
type Handler = (ctx: Context, next: Next) => void;
```

Lee los datos de la petición en `ctx.request` (`method`, `path`, `url`, `query`, `body`) y responde a través de `ctx.res`. Las rutas se emparejan de forma exacta: no hay segmentos `:param`; para los parámetros de consulta usa `ctx.request.query`.

### Middleware

| Símbolo                  | Descripción                                                                                                                              | Tipo                                              |
| ------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------- |
| `body(options?)`         | Middleware que interpreta el cuerpo. Rellena `ctx.request` y procesa `application/json` y `multipart/form-data`. Devuelve un middleware. | `(o?: Partial<ServerBody>) => MiddlewareFunction` |
| `staticMiddleware(opt?)` | Sirve archivos estáticos desde `opt.pathname` (por defecto `process.cwd()`); para `/` sirve `index.html`.                                | `(o?: Partial<Option>) => MiddlewareFunction`     |
| `connect(fn)`            | Adapta un middleware al estilo de Connect o Express, `(req, res, next)`, al middleware de este framework.                                | `(fn) => MiddlewareFunction`                      |

**Opciones de `body(options)`**

| Opción       | Descripción                                                            | Tipo             | Por defecto          |
| ------------ | ---------------------------------------------------------------------- | ---------------- | -------------------- |
| `uploadDir`  | Directorio donde van los archivos subidos con `multipart/form-data`.   | `string`         | `'.'`                |
| `encoding`   | Codificación del flujo de la petición entrante.                        | `BufferEncoding` | `'utf-8'`/`'binary'` |
| `json`       | Interpreta los cuerpos JSON (con `false` se queda la cadena en crudo). | `boolean`        | `true`               |
| `urlencoded` | Reservado para cuerpos urlencoded.                                     | `boolean`        | `true`               |

**Opciones de `staticMiddleware(option)`**

| Opción      | Descripción                                                         | Tipo                     | Por defecto     |
| ----------- | ------------------------------------------------------------------- | ------------------------ | --------------- |
| `pathname`  | Directorio raíz desde el que se sirven los archivos.                | `string`                 | `process.cwd()` |
| `fileTypes` | Correspondencias `extensión → tipo MIME` adicionales que registrar. | `Record<string, string>` | `{}`            |

### WebSocket

| Símbolo               | Descripción                                                                                                                    | Tipo                           |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------ | ------------------------------ |
| `new WSS(httpServer)` | Engancha un servidor WebSocket a un servidor `node:http` (se encarga del apretón de manos `upgrade` y del troceado en tramas). | `(server: http.Server) => WSS` |

```js
import { Server, WSS } from 'ranuts/node';

const app = new Server();
const server = app.listen(3000);
const wss = new WSS(server);

wss.on('connect', (client) => {
  client.on('message', (data) => client.send('echo: ' + data));
});
// wss.broadcast(data) envía a todos los clientes conectados; wss.clients es la lista.
```

Cada `client` ofrece `send(data, options?)`, `ping()`, `pong()`, `close()` y `socket`, además de los eventos `message`, `close` y `error`.

### Utilidades

| Símbolo                       | Descripción                                                                                        | Firma                                                          |
| ----------------------------- | -------------------------------------------------------------------------------------------------- | -------------------------------------------------------------- |
| `connect(fn)`                 | Adapta un middleware `(req, res, next)` de Connect o Express al middleware del framework.          | `(fn) => MiddlewareFunction`                                   |
| `get({ url })`                | Hace un GET por HTTPS a un punto JSON; resuelve con `{ success, data, message }`.                  | `({ url: string }) => Promise<Response>`                       |
| `getIPAdress()`               | La primera dirección IPv4 no interna de la máquina, o `undefined`.                                 | `() => string \| undefined`                                    |
| `paresUrl(req)`               | Descompone `req.url` en `{ search, query, pathname, path, href }` (ojo a cómo se escribe).         | `(req: IncomingMessage) => ParseUrl \| undefined`              |
| `prompt({ message })`         | Hace una pregunta de sí o no en la terminal; resuelve `true` ante `y` o `yes`.                     | `({ message, stream?, defaultResponse? }) => Promise<boolean>` |
| `runCommand(cmd, args)`       | Lanza un proceso hijo (hereda stdio); resuelve con el código de salida `0`.                        | `(cmd: string, args: string[]) => Promise<void>`               |
| `readStream({ path })`        | Crea un `fs.ReadStream` para `path`.                                                               | `(o: { path: string, ... }) => ReadStream`                     |
| `writeStream({ path })`       | Crea un `fs.WriteStream` para `path`.                                                              | `(o: { path: string, ... }) => WriteStream`                    |
| `startTask()`                 | Arranca un cronómetro de alta resolución; devuelve un `symbol` opaco.                              | `() => symbol`                                                 |
| `taskEnd(symbol)`             | Tiempo transcurrido desde el `startTask()` correspondiente (en Node, nanosegundos como `bigint`).  | `(s: symbol) => number \| bigint`                              |
| `traverse(dir, cb, pre?)`     | Recorre `dir` recursivamente y llama a `cb(relPath, absPath, stats)` por cada archivo (asíncrono). | `(dir, cb, pre?) => Promise<any>`                              |
| `traverseSync(dir, cb, pre?)` | Versión síncrona de `traverse`.                                                                    | `(dir, cb, pre?) => void`                                      |
| `isColorSupported`            | Booleano: si la terminal actual admite colores ANSI.                                               | `boolean`                                                      |
| `colors`                      | Ayudas de color ANSI, por ejemplo `colors.red('text')`, más `reset`, `bold` y `dim`.               | `Record<string, (s: string) => string>`                        |

## Véase también

Ese mismo punto de entrada `ranuts/node` trae además ayudas para el sistema de archivos, documentadas aparte:

- [writeFile](../file/write_file.md)
- [readFile](../file/read_file.md)
- [appendFile](../file/append_file.md)
- [readDir](../file/read_dir.md)
- [watchFile](../file/watch_file.md)
- [queryFileInfo](../file/file_info.md)
