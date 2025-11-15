# compose

Compose multiple middleware functions, converting asynchronous functions to execute synchronously. Commonly used to build middleware systems, such as Koa-style middleware.

## API

### compose

#### Return

| Argument   | Description                  | Type                    |
| ---------- | ---------------------------- | ----------------------- |
| `Function` | Composed middleware function | `ComposedMiddleware<T>` |

#### Parameters

| Parameter    | Description                   | Type                   | Default  |
| ------------ | ----------------------------- | ---------------------- | -------- |
| `middleware` | Array of middleware functions | `Array<Middleware<T>>` | Required |

#### Middleware Type

```typescript
type Middleware<T> = (context: T, next: Next) => any;
type Next = () => Promise<never> | Promise<void>;
```

## Example

### Basic Usage

```js
import { compose } from 'ranuts';

const middleware1 = async (ctx, next) => {
  console.log('Middleware 1 start');
  await next();
  console.log('Middleware 1 end');
};

const middleware2 = async (ctx, next) => {
  console.log('Middleware 2 start');
  await next();
  console.log('Middleware 2 end');
};

const middleware3 = async (ctx, next) => {
  console.log('Middleware 3 execute');
  ctx.data = 'Processed';
};

const composed = compose([middleware1, middleware2, middleware3]);
const context = {};

await composed(context);
// Output:
// Middleware 1 start
// Middleware 2 start
// Middleware 3 execute
// Middleware 2 end
// Middleware 1 end

console.log(context.data); // 'Processed'
```

### Request Processing Middleware

```js
import { compose } from 'ranuts';

// Logger middleware
const logger = async (req, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  await next();
};

// Auth middleware
const auth = async (req, next) => {
  if (!req.headers.authorization) {
    throw new Error('Unauthorized');
  }
  await next();
};

// Handler middleware
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

### Error Handling

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
  throw new Error('Processing failed');
};

const composed = compose([errorHandler, handler]);
const context = {};

await composed(context);
console.log(context.error); // Error: Processing failed
```

## Notes

1. **Execution order**: Middleware executes in array order, and the next middleware executes after calling `next()`.
2. **Async support**: All middleware should be async functions or return Promises.
3. **next() call**: Must call `next()` in middleware to continue to the next middleware.
4. **Multiple calls**: Cannot call `next()` multiple times, otherwise an error will be thrown.
5. **Context passing**: Pass data between middleware through the `context` object.
