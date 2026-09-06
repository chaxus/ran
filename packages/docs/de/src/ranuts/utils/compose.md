# compose

Fügt mehrere Middleware-Funktionen zu einer zusammen, die sie nacheinander ausführt; jede bekommt den Kontext und ein `next`, das die Kette fortsetzt. Üblich, um Middleware-Systeme nach Art von Koa zu bauen.

## API

### compose

#### Rückgabe

| Argument   | Beschreibung                             | Typ                     |
| ---------- | ---------------------------------------- | ----------------------- |
| `Function` | Die zusammengesetzte Middleware-Funktion | `ComposedMiddleware<T>` |

#### Parameter

| Parameter    | Beschreibung                    | Typ                    | Standard     |
| ------------ | ------------------------------- | ---------------------- | ------------ |
| `middleware` | Array von Middleware-Funktionen | `Array<Middleware<T>>` | Erforderlich |

#### Der Typ der Middleware

```typescript
type Middleware<T> = (context: T, next: Next) => any;
type Next = () => Promise<never> | Promise<void>;
```

## Beispiel

### Grundlegende Verwendung

```js
import { compose } from 'ranuts';

const middleware1 = async (ctx, next) => {
  console.log('Middleware 1: Anfang');
  await next();
  console.log('Middleware 1: Ende');
};

const middleware2 = async (ctx, next) => {
  console.log('Middleware 2: Anfang');
  await next();
  console.log('Middleware 2: Ende');
};

const middleware3 = async (ctx, next) => {
  console.log('Middleware 3: läuft');
  ctx.data = 'Verarbeitet';
};

const composed = compose([middleware1, middleware2, middleware3]);
const context = {};

await composed(context);
// Ausgabe:
// Middleware 1: Anfang
// Middleware 2: Anfang
// Middleware 3: läuft
// Middleware 2: Ende
// Middleware 1: Ende

console.log(context.data); // 'Verarbeitet'
```

### Middleware zum Bearbeiten einer Anfrage

```js
import { compose } from 'ranuts';

// Middleware für die Protokollierung
const logger = async (req, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  await next();
};

// Middleware für die Anmeldung
const auth = async (req, next) => {
  if (!req.headers.authorization) {
    throw new Error('Nicht berechtigt');
  }
  await next();
};

// Middleware, die die Anfrage bearbeitet
const handler = async (req, next) => {
  req.response = { message: 'Hello World' };
};

const app = compose([logger, auth, handler]);

const request = {
  method: 'GET',
  url: '/api/users',
  headers: { authorization: 'Bearer token123' },
};

await app(request);
console.log(request.response); // { message: 'Hello World' }
```

### Fehlerbehandlung

```js
import { compose } from 'ranuts';

const errorHandler = async (ctx, next) => {
  try {
    await next();
  } catch (error) {
    console.error('Fehler:', error.message);
    ctx.error = error;
  }
};

const handler = async (ctx, next) => {
  throw new Error('Die Verarbeitung ist fehlgeschlagen');
};

const composed = compose([errorHandler, handler]);
const context = {};

await composed(context);
console.log(context.error); // Error: Die Verarbeitung ist fehlgeschlagen
```

## Hinweise

1. **Reihenfolge**: Die Middleware läuft in der Reihenfolge des Arrays, und die nächste kommt nach dem Aufruf von `next()` an die Reihe.
2. **Mit async**: Alle Middleware sollte asynchron sein oder ein Promise zurückgeben.
3. **Der Aufruf von `next()`**: Ohne `next()` in der Middleware geht es nicht zur nächsten weiter.
4. **Mehrfache Aufrufe**: `next()` darf nicht mehrfach aufgerufen werden, sonst wird ein Fehler geworfen.
5. **Der Kontext**: Daten wandern über das `context`-Objekt von einer Middleware zur nächsten.
