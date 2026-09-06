# compose

여러 미들웨어 함수를 하나로 엮어 차례로 돌립니다. 저마다 컨텍스트와, 사슬을 이어 가는 `next`를 받습니다. Koa 식 미들웨어 같은 체계를 짜는 데 흔히 쓰입니다.

## API

### compose

#### 반환값

| 인자       | 설명               | 타입                    |
| ---------- | ------------------ | ----------------------- |
| `Function` | 엮인 미들웨어 함수 | `ComposedMiddleware<T>` |

#### 매개변수

| 매개변수     | 설명                 | 타입                   | 기본값 |
| ------------ | -------------------- | ---------------------- | ------ |
| `middleware` | 미들웨어 함수의 배열 | `Array<Middleware<T>>` | 필수   |

#### 미들웨어의 타입

```typescript
type Middleware<T> = (context: T, next: Next) => any;
type Next = () => Promise<never> | Promise<void>;
```

## 예시

### 기본 사용법

```js
import { compose } from 'ranuts';

const middleware1 = async (ctx, next) => {
  console.log('미들웨어 1 시작');
  await next();
  console.log('미들웨어 1 끝');
};

const middleware2 = async (ctx, next) => {
  console.log('미들웨어 2 시작');
  await next();
  console.log('미들웨어 2 끝');
};

const middleware3 = async (ctx, next) => {
  console.log('미들웨어 3 실행');
  ctx.data = '처리됨';
};

const composed = compose([middleware1, middleware2, middleware3]);
const context = {};

await composed(context);
// 출력:
// 미들웨어 1 시작
// 미들웨어 2 시작
// 미들웨어 3 실행
// 미들웨어 2 끝
// 미들웨어 1 끝

console.log(context.data); // '처리됨'
```

### 요청을 처리하는 미들웨어

```js
import { compose } from 'ranuts';

// 로그 미들웨어
const logger = async (req, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  await next();
};

// 인증 미들웨어
const auth = async (req, next) => {
  if (!req.headers.authorization) {
    throw new Error('권한이 없습니다');
  }
  await next();
};

// 실제로 처리하는 미들웨어
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

### 오류 다루기

```js
import { compose } from 'ranuts';

const errorHandler = async (ctx, next) => {
  try {
    await next();
  } catch (error) {
    console.error('오류:', error.message);
    ctx.error = error;
  }
};

const handler = async (ctx, next) => {
  throw new Error('처리에 실패했습니다');
};

const composed = compose([errorHandler, handler]);
const context = {};

await composed(context);
console.log(context.error); // Error: 처리에 실패했습니다
```

## 참고

1. **실행 순서**: 미들웨어는 배열 순서대로 돌고, `next()`를 부르면 다음 미들웨어가 돕니다.
2. **비동기 지원**: 미들웨어는 모두 비동기 함수로 만들거나 프로미스를 돌려주어야 합니다.
3. **`next()` 호출**: 다음 미들웨어로 넘어가려면 미들웨어 안에서 `next()`를 불러야 합니다.
4. **거듭 호출**: `next()`를 여러 번 부를 수는 없습니다. 부르면 오류가 납니다.
5. **컨텍스트 전달**: 미들웨어끼리 데이터를 주고받는 것은 `context` 객체를 통해서입니다.
