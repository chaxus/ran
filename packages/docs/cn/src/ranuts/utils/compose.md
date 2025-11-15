# compose

组合多个中间件函数，将异步函数转化为同步的方式进行执行。常用于构建中间件系统，如 Koa 风格的中间件。

## API

### compose

#### Return

| 参数       | 说明               | 类型                    |
| ---------- | ------------------ | ----------------------- |
| `Function` | 组合后的中间件函数 | `ComposedMiddleware<T>` |

#### Parameters

| 参数         | 说明           | 类型                   | 默认值 |
| ------------ | -------------- | ---------------------- | ------ |
| `middleware` | 中间件函数数组 | `Array<Middleware<T>>` | 无     |

#### Middleware 类型

```typescript
type Middleware<T> = (context: T, next: Next) => any;
type Next = () => Promise<never> | Promise<void>;
```

## Example

### 基础用法

```js
import { compose } from 'ranuts';

const middleware1 = async (ctx, next) => {
  console.log('中间件 1 开始');
  await next();
  console.log('中间件 1 结束');
};

const middleware2 = async (ctx, next) => {
  console.log('中间件 2 开始');
  await next();
  console.log('中间件 2 结束');
};

const middleware3 = async (ctx, next) => {
  console.log('中间件 3 执行');
  ctx.data = '处理完成';
};

const composed = compose([middleware1, middleware2, middleware3]);
const context = {};

await composed(context);
// 输出:
// 中间件 1 开始
// 中间件 2 开始
// 中间件 3 执行
// 中间件 2 结束
// 中间件 1 结束

console.log(context.data); // '处理完成'
```

### 请求处理中间件

```js
import { compose } from 'ranuts';

// 日志中间件
const logger = async (req, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  await next();
};

// 认证中间件
const auth = async (req, next) => {
  if (!req.headers.authorization) {
    throw new Error('未授权');
  }
  await next();
};

// 处理中间件
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

### 错误处理

```js
import { compose } from 'ranuts';

const errorHandler = async (ctx, next) => {
  try {
    await next();
  } catch (error) {
    console.error('错误:', error.message);
    ctx.error = error;
  }
};

const handler = async (ctx, next) => {
  throw new Error('处理失败');
};

const composed = compose([errorHandler, handler]);
const context = {};

await composed(context);
console.log(context.error); // Error: 处理失败
```

## 注意事项

1. **执行顺序**：中间件按照数组顺序执行，`next()` 调用后执行下一个中间件。
2. **异步支持**：所有中间件都应该是异步函数或返回 Promise。
3. **next() 调用**：必须在中间件中调用 `next()` 才能继续执行下一个中间件。
4. **多次调用**：不能多次调用 `next()`，否则会抛出错误。
5. **上下文传递**：通过 `context` 对象在中间件之间传递数据。
