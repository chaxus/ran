# compose

Junta varias funciones intermedias en una sola que las ejecuta en cadena; cada una recibe el contexto y un `next` que sigue la cadena. Es lo habitual para montar sistemas de middleware, al estilo de Koa.

## API

### compose

#### Devuelve

| Argumento  | Descripción                        | Tipo                    |
| ---------- | ---------------------------------- | ----------------------- |
| `Function` | La función intermedia ya compuesta | `ComposedMiddleware<T>` |

#### Parámetros

| Parámetro    | Descripción                    | Tipo                   | Por defecto |
| ------------ | ------------------------------ | ---------------------- | ----------- |
| `middleware` | Array de funciones intermedias | `Array<Middleware<T>>` | Obligatorio |

#### El tipo del middleware

```typescript
type Middleware<T> = (context: T, next: Next) => any;
type Next = () => Promise<never> | Promise<void>;
```

## Ejemplo

### Uso básico

```js
import { compose } from 'ranuts';

const middleware1 = async (ctx, next) => {
  console.log('Middleware 1: entra');
  await next();
  console.log('Middleware 1: sale');
};

const middleware2 = async (ctx, next) => {
  console.log('Middleware 2: entra');
  await next();
  console.log('Middleware 2: sale');
};

const middleware3 = async (ctx, next) => {
  console.log('Middleware 3: se ejecuta');
  ctx.data = 'Procesado';
};

const composed = compose([middleware1, middleware2, middleware3]);
const context = {};

await composed(context);
// Salida:
// Middleware 1: entra
// Middleware 2: entra
// Middleware 3: se ejecuta
// Middleware 2: sale
// Middleware 1: sale

console.log(context.data); // 'Procesado'
```

### Middleware para atender una petición

```js
import { compose } from 'ranuts';

// Middleware de registro
const logger = async (req, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  await next();
};

// Middleware de autenticación
const auth = async (req, next) => {
  if (!req.headers.authorization) {
    throw new Error('No autorizado');
  }
  await next();
};

// Middleware que atiende la petición
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

### Manejo de errores

```js
import { compose } from 'ranuts';

const errorHandler = async (ctx, next) => {
  try {
    await next();
  } catch (error) {
    console.error('Error:', error.message);
    ctx.error = error;
  }
};

const handler = async (ctx, next) => {
  throw new Error('Falló el procesamiento');
};

const composed = compose([errorHandler, handler]);
const context = {};

await composed(context);
console.log(context.error); // Error: Falló el procesamiento
```

## Notas

1. **Orden de ejecución**: los middleware corren en el orden del array, y el siguiente entra después de llamar a `next()`.
2. **Con async**: todos los middleware deberían ser funciones asíncronas o devolver promesas.
3. **La llamada a `next()`**: hay que llamar a `next()` dentro del middleware para seguir al siguiente.
4. **Llamadas repetidas**: no se puede llamar a `next()` más de una vez; si se hace, se lanza un error.
5. **El contexto**: los datos pasan de un middleware a otro por el objeto `context`.
