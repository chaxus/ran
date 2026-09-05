# SyncHook

동기 이벤트 훅 클래스로, 발행-구독 패턴을 꾸리는 데 씁니다.

## API

### SyncHook

#### 주요 메서드

| 메서드     | 설명                                           | 반환값          |
| ---------- | ---------------------------------------------- | --------------- |
| `tap`      | 이벤트를 구독합니다                            | `this`          |
| `call`     | 이벤트를 일으킵니다                            | `this`          |
| `callSync` | 이벤트를 동기로 일으킵니다(비동기 콜백도 지원) | `Promise<this>` |
| `once`     | 이벤트를 한 번만 구독합니다                    | `this`          |
| `off`      | 구독을 해지합니다                              | `this`          |

## 예시

### 기본 사용법

```js
import { SyncHook } from 'ranuts';

const hook = new SyncHook();

// 이벤트를 구독합니다
hook.tap('event1', () => {
  console.log('이벤트 1이 일어났습니다');
});

// 이벤트를 일으킵니다
hook.call('event1'); // '이벤트 1이 일어났습니다'
```

### 인자 넘기기

```js
import { SyncHook } from 'ranuts';

const hook = new SyncHook();

hook.tap('greet', (name) => {
  console.log(`안녕하세요, ${name}님!`);
});

hook.call('greet', 'World'); // '안녕하세요, World님!'
```

### 한 번만 구독하기

```js
import { SyncHook } from 'ranuts';

const hook = new SyncHook();

hook.once('onceEvent', () => {
  console.log('이건 한 번만 일어납니다');
});

hook.call('onceEvent'); // '이건 한 번만 일어납니다'
hook.call('onceEvent'); // 아무 일도 없습니다
```

### 구독 해지하기

```js
import { SyncHook } from 'ranuts';

const hook = new SyncHook();

const callback = () => {
  console.log('콜백');
};

hook.tap('event', callback);
hook.call('event'); // '콜백'

hook.off('event', callback);
hook.call('event'); // 아무 일도 없습니다
```

### 비동기 콜백

```js
import { SyncHook } from 'ranuts';

const hook = new SyncHook();

hook.tap('asyncEvent', async () => {
  await new Promise((resolve) => setTimeout(resolve, 100));
  console.log('비동기 콜백');
});

await hook.callSync('asyncEvent'); // '비동기 콜백'
```

## 참고

1. **동기 실행**: `call` 메서드는 모든 콜백을 동기로 실행합니다.
2. **비동기 지원**: `callSync` 메서드는 비동기 콜백을 받아 전부 끝날 때까지 기다립니다.
3. **이벤트 관리**: 안에서 `Map`과 `Set`으로 이벤트와 콜백을 챙깁니다.
4. **활용**: 이벤트 체계, 플러그인 체계, 미들웨어 등에 흔히 쓰입니다.
