# ranuts/node — kleines HTTP-Framework

Ein kleiner, abhängigkeitsfreier HTTP-Werkzeugkasten für Node.js: ein HTTP-Server, ein Router, ein WebSocket-Server, Middleware für Request-Bodys und statische Dateien sowie eine Handvoll Helfer für Kommandozeile und Dateisystem.

> ⚠️ **Nur für Node.** Dieser Einstiegspunkt zieht `node:http`, `node:fs`, `node:child_process` und dergleichen herein. Importiere ihn aus `ranuts/node`, niemals aus Browser-Code.

## Import

```js
import { Server, Router, staticMiddleware, body } from 'ranuts/node';
```

> Die Middleware, die den Request-Body liest, wird als **`body`** exportiert (intern heißt sie `bodyMiddleware`). Einen Export namens `bodyMiddleware` gibt es nicht.

## Schnellstart

```js
import { Server, Router, staticMiddleware, body } from 'ranuts/node';

const app = new Server();
const router = new Router();

// Routen greifen nur bei exakt gleichem Pfad. Der Handler bekommt den Context der Anfrage.
router.get('/hello', (ctx) => {
  ctx.res.setHeader('Content-Type', 'application/json');
  ctx.res.end(JSON.stringify({ message: 'hello world' }));
});

// POST mit JSON-Body: body() liest ihn und legt ihn in ctx.request.body ab
router.post('/echo', (ctx) => {
  ctx.res.end(JSON.stringify({ youSent: ctx.request.body }));
});

// body() liest den Request-Body UND füllt ctx.request (method / path / url / query),
// woraus der Router liest – also VOR router.routes() registrieren.
app.use(body());
app.use(router.routes());
app.use(router.allowedMethods());

// Statische Dateien ausliefern (für `/` greift ./public/index.html)
app.use(staticMiddleware({ pathname: './public' }));

const server = app.listen(3000, () => {
  console.log('Server running at http://localhost:3000');
});
// `server` ist die darunterliegende Server-Instanz von node:http.
```

Die Reihenfolge der Middleware zählt: Der `Router` liest `ctx.request.path` und `ctx.request.method`, und gefüllt werden die von `body()`. Registriere `body()` zuerst. Das mitgelieferte `body()` liest derzeit Request-Bodys vom Typ `application/json` und `multipart/form-data`.

## API

### Server

Standardexport. Ein minimaler Server im Stil von Koa, aufgesetzt auf `node:http`.

| Element           | Beschreibung                                                                                                                   | Typ                                |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------- |
| `new Server()`    | Erzeugt einen Server. Nimmt keine Argumente.                                                                                   | `() => Server`                     |
| `use(middleware)` | Hängt eine Middleware ans Ende der Kette. Gibt `void` zurück, ist also nicht verkettbar.                                       | `(fn: MiddlewareFunction) => void` |
| `listen(...args)` | Beginnt zu lauschen. Die Argumente gehen unverändert an `http.Server.listen`. Zurück kommt der darunterliegende `http.Server`. | `(...args) => http.Server`         |
| `middleware`      | Das Array der registrierten Middleware.                                                                                        | `MiddlewareFunction[]`             |
| `ctx`             | Der gemeinsam genutzte Anfrage-`Context` (sein `req` und sein `res` werden je Anfrage ausgetauscht).                           | `Context`                          |

**Signatur der Middleware**

```ts
type Next = () => Promise<void> | Promise<never>;
type MiddlewareFunction = (ctx: Context, next: Next) => void | Promise<void>;
```

Ruf `next()` auf, um die Kontrolle an die nächste Middleware weiterzugeben. Middleware werden in der Reihenfolge ihrer Registrierung abgearbeitet; ein zweiter Aufruf von `next()` wirft.

**Aufbau des Context**

| Feld      | Beschreibung                                                                                       | Typ                         |
| --------- | -------------------------------------------------------------------------------------------------- | --------------------------- |
| `req`     | Die eingehende Anfrage.                                                                            | `http.IncomingMessage`      |
| `res`     | Die Antwort des Servers. Beschrieben wird sie mit `res.setHeader`, `res.writeHead` und `res.end`.  | `http.ServerResponse`       |
| `ipv4()`  | Liefert die erste nicht interne IPv4-Adresse des Rechners (sonst `undefined`).                     | `() => string \| undefined` |
| `request` | Von `body()` hinzugefügt: `{ method, path, url, query, body }`. `query` ist ein `URLSearchParams`. | `object` (dynamic)          |
| `[key]`   | `Context` ist ein offener Beutel: Middleware darf beliebige Felder daranhängen.                    | `any`                       |

### Router

Standardexport. Registriert Handler je HTTP-Methode und exaktem Pfad und stellt sie über `routes()` als Middleware bereit.

| Methode                 | Beschreibung                                                                                             | Typ                                 |
| ----------------------- | -------------------------------------------------------------------------------------------------------- | ----------------------------------- |
| `new Router()`          | Erzeugt einen Router.                                                                                    | `() => Router`                      |
| `get(url, handler)`     | Registriert eine `GET`-Route.                                                                            | `(url: string, h: Handler) => void` |
| `post(url, handler)`    | Registriert eine `POST`-Route.                                                                           | `(url: string, h: Handler) => void` |
| `put(url, handler)`     | Registriert eine `PUT`-Route.                                                                            | `(url: string, h: Handler) => void` |
| `patch(url, handler)`   | Registriert eine `PATCH`-Route.                                                                          | `(url: string, h: Handler) => void` |
| `del(url, handler)`     | Registriert eine `DELETE`-Route.                                                                         | `(url: string, h: Handler) => void` |
| `head(url, handler)`    | Registriert eine `HEAD`-Route.                                                                           | `(url: string, h: Handler) => void` |
| `options(url, handler)` | Registriert eine `OPTIONS`-Route.                                                                        | `(url: string, h: Handler) => void` |
| `routes()`              | Liefert eine Middleware, die an den passenden Handler weiterreicht.                                      | `() => MiddlewareFunction`          |
| `allowedMethods()`      | Liefert eine Middleware, die mit `404`, `405` oder `501` antwortet, wenn Pfad oder Methode nicht passen. | `() => MiddlewareFunction`          |

**Signatur des Handlers**

```ts
type Handler = (ctx: Context, next: Next) => void;
```

Lies die Daten der Anfrage aus `ctx.request` (`method`, `path`, `url`, `query`, `body`) und antworte über `ctx.res`. Pfade greifen nur bei exakter Übereinstimmung: Segmente der Form `:param` gibt es nicht; für Abfrageparameter nimm `ctx.request.query`.

### Middleware

| Symbol                   | Beschreibung                                                                                                                                           | Typ                                               |
| ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------- |
| `body(options?)`         | Middleware zum Lesen des Request-Bodys. Füllt `ctx.request` und verarbeitet `application/json` und `multipart/form-data`. Gibt eine Middleware zurück. | `(o?: Partial<ServerBody>) => MiddlewareFunction` |
| `staticMiddleware(opt?)` | Liefert statische Dateien aus `opt.pathname` (voreingestellt `process.cwd()`); für `/` kommt `index.html`.                                             | `(o?: Partial<Option>) => MiddlewareFunction`     |
| `connect(fn)`            | Passt eine Middleware im Connect- oder Express-Stil, `(req, res, next)`, an die Middleware dieses Frameworks an.                                       | `(fn) => MiddlewareFunction`                      |

**Optionen von `body(options)`**

| Option       | Beschreibung                                                        | Typ              | Standard             |
| ------------ | ------------------------------------------------------------------- | ---------------- | -------------------- |
| `uploadDir`  | Verzeichnis für Datei-Uploads per `multipart/form-data`.            | `string`         | `'.'`                |
| `encoding`   | Kodierung des eingehenden Anfrage-Streams.                          | `BufferEncoding` | `'utf-8'`/`'binary'` |
| `json`       | Liest JSON-Bodys (bei `false` bleibt die rohe Zeichenkette stehen). | `boolean`        | `true`               |
| `urlencoded` | Für urlencoded-Bodys vorgemerkt.                                    | `boolean`        | `true`               |

**Optionen von `staticMiddleware(option)`**

| Option      | Beschreibung                                                              | Typ                      | Standard        |
| ----------- | ------------------------------------------------------------------------- | ------------------------ | --------------- |
| `pathname`  | Wurzelverzeichnis, aus dem Dateien ausgeliefert werden.                   | `string`                 | `process.cwd()` |
| `fileTypes` | Zusätzliche Zuordnungen `Dateiendung → MIME-Typ`, die registriert werden. | `Record<string, string>` | `{}`            |

### WebSocket

| Symbol                | Beschreibung                                                                                                   | Typ                            |
| --------------------- | -------------------------------------------------------------------------------------------------------------- | ------------------------------ |
| `new WSS(httpServer)` | Hängt einen WebSocket-Server an einen `node:http`-Server (übernimmt den `upgrade`-Handschlag und das Framing). | `(server: http.Server) => WSS` |

```js
import { Server, WSS } from 'ranuts/node';

const app = new Server();
const server = app.listen(3000);
const wss = new WSS(server);

wss.on('connect', (client) => {
  client.on('message', (data) => client.send('echo: ' + data));
});
// wss.broadcast(data) schickt an jeden verbundenen Client; wss.clients ist die Liste.
```

Jeder `client` bietet `send(data, options?)`, `ping()`, `pong()`, `close()` und `socket` sowie die Ereignisse `message`, `close` und `error`.

### Hilfsmittel

| Symbol                        | Beschreibung                                                                                           | Signatur                                                       |
| ----------------------------- | ------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------- |
| `connect(fn)`                 | Passt eine `(req, res, next)`-Middleware aus Connect oder Express an die Middleware des Frameworks an. | `(fn) => MiddlewareFunction`                                   |
| `get({ url })`                | Holt per HTTPS-GET einen JSON-Endpunkt; löst mit `{ success, data, message }` auf.                     | `({ url: string }) => Promise<Response>`                       |
| `getIPAdress()`               | Die erste nicht interne IPv4-Adresse des Rechners, sonst `undefined`.                                  | `() => string \| undefined`                                    |
| `paresUrl(req)`               | Zerlegt `req.url` in `{ search, query, pathname, path, href }` (auf die Schreibweise achten).          | `(req: IncomingMessage) => ParseUrl \| undefined`              |
| `prompt({ message })`         | Stellt im Terminal eine Ja-Nein-Frage; löst bei `y` oder `yes` mit `true` auf.                         | `({ message, stream?, defaultResponse? }) => Promise<boolean>` |
| `runCommand(cmd, args)`       | Startet einen Kindprozess (erbt stdio); löst beim Exit-Code `0` auf.                                   | `(cmd: string, args: string[]) => Promise<void>`               |
| `readStream({ path })`        | Erzeugt einen `fs.ReadStream` für `path`.                                                              | `(o: { path: string, ... }) => ReadStream`                     |
| `writeStream({ path })`       | Erzeugt einen `fs.WriteStream` für `path`.                                                             | `(o: { path: string, ... }) => WriteStream`                    |
| `startTask()`                 | Startet eine hochauflösende Uhr; liefert ein undurchsichtiges `symbol`.                                | `() => symbol`                                                 |
| `taskEnd(symbol)`             | Vergangene Zeit seit dem zugehörigen `startTask()` (unter Node Nanosekunden als `bigint`).             | `(s: symbol) => number \| bigint`                              |
| `traverse(dir, cb, pre?)`     | Läuft `dir` rekursiv ab und ruft für jede Datei `cb(relPath, absPath, stats)` (asynchron).             | `(dir, cb, pre?) => Promise<any>`                              |
| `traverseSync(dir, cb, pre?)` | Synchrone Fassung von `traverse`.                                                                      | `(dir, cb, pre?) => void`                                      |
| `isColorSupported`            | Wahrheitswert: ob das aktuelle Terminal ANSI-Farben beherrscht.                                        | `boolean`                                                      |
| `colors`                      | Helfer für ANSI-Farben, etwa `colors.red('text')`, dazu `reset`, `bold` und `dim`.                     | `Record<string, (s: string) => string>`                        |

## Siehe auch

Derselbe Einstiegspunkt `ranuts/node` bringt außerdem Helfer fürs Dateisystem mit, die gesondert beschrieben sind:

- [writeFile](../file/write_file.md)
- [readFile](../file/read_file.md)
- [appendFile](../file/append_file.md)
- [readDir](../file/read_dir.md)
- [watchFile](../file/watch_file.md)
- [queryFileInfo](../file/file_info.md)
