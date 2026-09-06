# compose

複数のミドルウェア関数をひとつにまとめ、順に走らせます。それぞれがコンテキストと、鎖を先へ進める `next` を受け取ります。Koa 風のミドルウェアのような仕組みを作るのによく使われます。

## API

### compose

#### 戻り値

| 引数       | 説明                           | 型                      |
| ---------- | ------------------------------ | ----------------------- |
| `Function` | まとめられたミドルウェアの関数 | `ComposedMiddleware<T>` |

#### パラメーター

| パラメーター | 説明                   | 型                     | 既定値 |
| ------------ | ---------------------- | ---------------------- | ------ |
| `middleware` | ミドルウェア関数の配列 | `Array<Middleware<T>>` | 必須   |

#### ミドルウェアの型

```typescript
type Middleware<T> = (context: T, next: Next) => any;
type Next = () => Promise<never> | Promise<void>;
```

## 使用例

### 基本的な使い方

```js
import { compose } from 'ranuts';

const middleware1 = async (ctx, next) => {
  console.log('ミドルウェア 1 開始');
  await next();
  console.log('ミドルウェア 1 終了');
};

const middleware2 = async (ctx, next) => {
  console.log('ミドルウェア 2 開始');
  await next();
  console.log('ミドルウェア 2 終了');
};

const middleware3 = async (ctx, next) => {
  console.log('ミドルウェア 3 実行');
  ctx.data = '処理済み';
};

const composed = compose([middleware1, middleware2, middleware3]);
const context = {};

await composed(context);
// 出力：
// ミドルウェア 1 開始
// ミドルウェア 2 開始
// ミドルウェア 3 実行
// ミドルウェア 2 終了
// ミドルウェア 1 終了

console.log(context.data); // '処理済み'
```

### リクエストを処理するミドルウェア

```js
import { compose } from 'ranuts';

// ログのミドルウェア
const logger = async (req, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  await next();
};

// 認証のミドルウェア
const auth = async (req, next) => {
  if (!req.headers.authorization) {
    throw new Error('認証されていません');
  }
  await next();
};

// 処理を行うミドルウェア
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

### エラーの扱い

```js
import { compose } from 'ranuts';

const errorHandler = async (ctx, next) => {
  try {
    await next();
  } catch (error) {
    console.error('エラー:', error.message);
    ctx.error = error;
  }
};

const handler = async (ctx, next) => {
  throw new Error('処理に失敗しました');
};

const composed = compose([errorHandler, handler]);
const context = {};

await composed(context);
console.log(context.error); // Error: 処理に失敗しました
```

## 補足

1. **実行の順序**：ミドルウェアは配列の順に走り、`next()` を呼ぶと次のミドルウェアが走ります。
2. **非同期への対応**：ミドルウェアはすべて非同期関数にするか、Promise を返すようにしてください。
3. **`next()` の呼び出し**：次のミドルウェアへ進むには、ミドルウェアの中で `next()` を呼ぶ必要があります。
4. **複数回の呼び出し**：`next()` を何度も呼ぶことはできません。呼べば例外が投げられます。
5. **コンテキストの受け渡し**：ミドルウェアどうしのデータの受け渡しは `context` オブジェクトを通して行います。
