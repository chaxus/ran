# ranuts/node — mini framework HTTP

Um pequeno conjunto de ferramentas HTTP para Node.js, sem dependências: um servidor HTTP, um roteador, um servidor WebSocket, middleware de corpo e de arquivos estáticos, e um punhado de auxiliares de terminal e de sistema de arquivos.

> ⚠️ **Só Node.** Este ponto de entrada puxa `node:http`, `node:fs`, `node:child_process` e companhia. Importe-o de `ranuts/node`, nunca de código de navegador.

## Importar

```js
import { Server, Router, staticMiddleware, body } from 'ranuts/node';
```

> O middleware que interpreta o corpo é exportado como **`body`** (o nome interno dele é `bodyMiddleware`). Não existe exportação chamada `bodyMiddleware`.

## Primeiros passos

```js
import { Server, Router, staticMiddleware, body } from 'ranuts/node';

const app = new Server();
const router = new Router();

// As rotas casam por caminho exato. O manipulador recebe o Context da requisição.
router.get('/hello', (ctx) => {
  ctx.res.setHeader('Content-Type', 'application/json');
  ctx.res.end(JSON.stringify({ message: 'hello world' }));
});

// POST com corpo JSON: body() interpreta e deixa em ctx.request.body
router.post('/echo', (ctx) => {
  ctx.res.end(JSON.stringify({ youSent: ctx.request.body }));
});

// body() interpreta o corpo da requisição E preenche ctx.request (method / path / url / query),
// que é o que o roteador lê, então registre-o ANTES de router.routes().
app.use(body());
app.use(router.routes());
app.use(router.allowedMethods());

// Serve arquivos estáticos (para `/` recorre a ./public/index.html)
app.use(staticMiddleware({ pathname: './public' }));

const server = app.listen(3000, () => {
  console.log('Server running at http://localhost:3000');
});
// `server` é a instância de Server do node:http que está por baixo.
```

A ordem do middleware conta: o `Router` lê `ctx.request.path` e `ctx.request.method`, e quem preenche isso é o `body()`. Registre o `body()` primeiro. O `body()` que vem junto interpreta, por ora, corpos `application/json` e `multipart/form-data`.

## API

### Server

Exportação padrão. Um servidor mínimo ao estilo do Koa, montado sobre `node:http`.

| Membro            | Descrição                                                                                                   | Tipo                               |
| ----------------- | ----------------------------------------------------------------------------------------------------------- | ---------------------------------- |
| `new Server()`    | Cria um servidor. Não recebe argumentos.                                                                    | `() => Server`                     |
| `use(middleware)` | Acrescenta um middleware ao fim da corrente. Devolve `void`, ou seja, não encadeia.                         | `(fn: MiddlewareFunction) => void` |
| `listen(...args)` | Põe-se a escutar. Os argumentos vão tal e qual para `http.Server.listen`. Devolve o `http.Server` de baixo. | `(...args) => http.Server`         |
| `middleware`      | O array dos middlewares registrados.                                                                        | `MiddlewareFunction[]`             |
| `ctx`             | O `Context` de requisição compartilhado (o `req` e o `res` dele trocam a cada requisição).                  | `Context`                          |

**Assinatura do middleware**

```ts
type Next = () => Promise<void> | Promise<never>;
type MiddlewareFunction = (ctx: Context, next: Next) => void | Promise<void>;
```

Chame `next()` para passar o controle ao middleware seguinte. Os middlewares são despachados na ordem em que foram registrados; chamar `next()` duas vezes lança erro.

**Formato do Context**

| Campo     | Descrição                                                                                           | Tipo                        |
| --------- | --------------------------------------------------------------------------------------------------- | --------------------------- |
| `req`     | A requisição que chega.                                                                             | `http.IncomingMessage`      |
| `res`     | A resposta do servidor. Escreve-se com `res.setHeader`, `res.writeHead` e `res.end`.                | `http.ServerResponse`       |
| `ipv4()`  | Devolve o primeiro endereço IPv4 não interno da máquina (ou `undefined`).                           | `() => string \| undefined` |
| `request` | Acrescentado pelo `body()`: `{ method, path, url, query, body }`. O `query` é um `URLSearchParams`. | `object` (dynamic)          |
| `[key]`   | O `Context` é um saco aberto: qualquer middleware pode pendurar campos nele.                        | `any`                       |

### Router

Exportação padrão. Registra manipuladores por método HTTP e caminho exato, e depois os oferece como middleware por meio de `routes()`.

| Método                  | Descrição                                                                                        | Tipo                                |
| ----------------------- | ------------------------------------------------------------------------------------------------ | ----------------------------------- |
| `new Router()`          | Cria um roteador.                                                                                | `() => Router`                      |
| `get(url, handler)`     | Registra uma rota `GET`.                                                                         | `(url: string, h: Handler) => void` |
| `post(url, handler)`    | Registra uma rota `POST`.                                                                        | `(url: string, h: Handler) => void` |
| `put(url, handler)`     | Registra uma rota `PUT`.                                                                         | `(url: string, h: Handler) => void` |
| `patch(url, handler)`   | Registra uma rota `PATCH`.                                                                       | `(url: string, h: Handler) => void` |
| `del(url, handler)`     | Registra uma rota `DELETE`.                                                                      | `(url: string, h: Handler) => void` |
| `head(url, handler)`    | Registra uma rota `HEAD`.                                                                        | `(url: string, h: Handler) => void` |
| `options(url, handler)` | Registra uma rota `OPTIONS`.                                                                     | `(url: string, h: Handler) => void` |
| `routes()`              | Devolve um middleware que encaminha ao manipulador que casou.                                    | `() => MiddlewareFunction`          |
| `allowedMethods()`      | Devolve um middleware que responde `404`, `405` ou `501` quando o caminho ou o método não casam. | `() => MiddlewareFunction`          |

**Assinatura do manipulador**

```ts
type Handler = (ctx: Context, next: Next) => void;
```

Leia os dados da requisição em `ctx.request` (`method`, `path`, `url`, `query`, `body`) e responda por `ctx.res`. Os caminhos casam de forma exata: não há segmentos `:param`; para parâmetros de consulta use `ctx.request.query`.

### Middleware

| Símbolo                  | Descrição                                                                                                                                 | Tipo                                              |
| ------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------- |
| `body(options?)`         | Middleware que interpreta o corpo. Preenche o `ctx.request` e processa `application/json` e `multipart/form-data`. Devolve um middleware. | `(o?: Partial<ServerBody>) => MiddlewareFunction` |
| `staticMiddleware(opt?)` | Serve arquivos estáticos a partir de `opt.pathname` (por padrão `process.cwd()`); para `/` serve `index.html`.                            | `(o?: Partial<Option>) => MiddlewareFunction`     |
| `connect(fn)`            | Adapta um middleware ao estilo do Connect ou do Express, `(req, res, next)`, ao middleware deste framework.                               | `(fn) => MiddlewareFunction`                      |

**Opções de `body(options)`**

| Opção        | Descrição                                                      | Tipo             | Padrão               |
| ------------ | -------------------------------------------------------------- | ---------------- | -------------------- |
| `uploadDir`  | Diretório para os arquivos enviados por `multipart/form-data`. | `string`         | `'.'`                |
| `encoding`   | Codificação do fluxo da requisição que chega.                  | `BufferEncoding` | `'utf-8'`/`'binary'` |
| `json`       | Interpreta corpos JSON (com `false` fica a string crua).       | `boolean`        | `true`               |
| `urlencoded` | Reservado para corpos urlencoded.                              | `boolean`        | `true`               |

**Opções de `staticMiddleware(option)`**

| Opção       | Descrição                                                       | Tipo                     | Padrão          |
| ----------- | --------------------------------------------------------------- | ------------------------ | --------------- |
| `pathname`  | Diretório raiz de onde os arquivos são servidos.                | `string`                 | `process.cwd()` |
| `fileTypes` | Correspondências `extensão → tipo MIME` adicionais a registrar. | `Record<string, string>` | `{}`            |

### WebSocket

| Símbolo               | Descrição                                                                                                     | Tipo                           |
| --------------------- | ------------------------------------------------------------------------------------------------------------- | ------------------------------ |
| `new WSS(httpServer)` | Prende um servidor WebSocket a um servidor `node:http` (cuida do aperto de mão `upgrade` e do enquadramento). | `(server: http.Server) => WSS` |

```js
import { Server, WSS } from 'ranuts/node';

const app = new Server();
const server = app.listen(3000);
const wss = new WSS(server);

wss.on('connect', (client) => {
  client.on('message', (data) => client.send('echo: ' + data));
});
// wss.broadcast(data) envia a todos os clientes conectados; wss.clients é a lista.
```

Cada `client` oferece `send(data, options?)`, `ping()`, `pong()`, `close()` e `socket`, além dos eventos `message`, `close` e `error`.

### Utilitários

| Símbolo                       | Descrição                                                                                             | Assinatura                                                     |
| ----------------------------- | ----------------------------------------------------------------------------------------------------- | -------------------------------------------------------------- |
| `connect(fn)`                 | Adapta um middleware `(req, res, next)` do Connect ou do Express ao middleware do framework.          | `(fn) => MiddlewareFunction`                                   |
| `get({ url })`                | Faz um GET por HTTPS num endpoint JSON; resolve com `{ success, data, message }`.                     | `({ url: string }) => Promise<Response>`                       |
| `getIPAdress()`               | O primeiro endereço IPv4 não interno da máquina, ou `undefined`.                                      | `() => string \| undefined`                                    |
| `paresUrl(req)`               | Decompõe `req.url` em `{ search, query, pathname, path, href }` (repare na grafia).                   | `(req: IncomingMessage) => ParseUrl \| undefined`              |
| `prompt({ message })`         | Faz uma pergunta de sim ou não no terminal; resolve `true` diante de `y` ou `yes`.                    | `({ message, stream?, defaultResponse? }) => Promise<boolean>` |
| `runCommand(cmd, args)`       | Dispara um processo filho (herda o stdio); resolve com o código de saída `0`.                         | `(cmd: string, args: string[]) => Promise<void>`               |
| `readStream({ path })`        | Cria um `fs.ReadStream` para `path`.                                                                  | `(o: { path: string, ... }) => ReadStream`                     |
| `writeStream({ path })`       | Cria um `fs.WriteStream` para `path`.                                                                 | `(o: { path: string, ... }) => WriteStream`                    |
| `startTask()`                 | Inicia um cronômetro de alta resolução; devolve um `symbol` opaco.                                    | `() => symbol`                                                 |
| `taskEnd(symbol)`             | Tempo decorrido desde o `startTask()` correspondente (no Node, nanossegundos como `bigint`).          | `(s: symbol) => number \| bigint`                              |
| `traverse(dir, cb, pre?)`     | Percorre `dir` recursivamente, chamando `cb(relPath, absPath, stats)` para cada arquivo (assíncrono). | `(dir, cb, pre?) => Promise<any>`                              |
| `traverseSync(dir, cb, pre?)` | Versão síncrona do `traverse`.                                                                        | `(dir, cb, pre?) => void`                                      |
| `isColorSupported`            | Booleano: se o terminal atual aceita cores ANSI.                                                      | `boolean`                                                      |
| `colors`                      | Auxiliares de cor ANSI, por exemplo `colors.red('text')`, mais `reset`, `bold` e `dim`.               | `Record<string, (s: string) => string>`                        |

## Veja também

Esse mesmo ponto de entrada `ranuts/node` traz ainda auxiliares de sistema de arquivos, documentados à parte:

- [writeFile](../file/write_file.md)
- [readFile](../file/read_file.md)
- [appendFile](../file/append_file.md)
- [readDir](../file/read_dir.md)
- [watchFile](../file/watch_file.md)
- [queryFileInfo](../file/file_info.md)
