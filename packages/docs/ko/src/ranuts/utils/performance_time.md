# performanceTime

브라우저와 Node.js 양쪽에서 쓸 수 있는 고정밀 타임스탬프를 가져옵니다.

## API

### performanceTime

#### 반환값

| 인자 | 설명 | 타입 |
| -------- | --------------------------------------- | -------- |
| `number` | 고정밀 타임스탬프(밀리초) | `number` |

#### 매개변수

매개변수 없음

## 예시

### 기본 사용법

```js
import { performanceTime } from 'ranuts';

const start = performanceTime();
// 어떤 작업을 실행
const end = performanceTime();
console.log(`걸린 시간: ${end - start} ms`);
```

### 성능 측정

```js
import { performanceTime } from 'ranuts';

const start = performanceTime();
// 오래 걸리는 작업을 실행
for (let i = 0; i < 1000000; i++) {
  Math.sqrt(i);
}
const end = performanceTime();
console.log(`작업에 걸린 시간: ${end - start} ms`);
```

### 함수 실행 시간

```js
import { performanceTime } from 'ranuts';

function expensiveFunction() {
  // 복잡한 계산
  return Math.random() * 1000;
}

const start = performanceTime();
const result = expensiveFunction();
const end = performanceTime();
console.log(`결과: ${result}, 걸린 시간: ${end - start} ms`);
```

## 참고

1. **지원 환경**:
   - 브라우저: `performance.now()`를 사용
   - Node.js: `process.hrtime()`을 사용
   - 그 밖의 환경: `Date.now()`로 대체

2. **정밀도**: `performance.now()`와 `process.hrtime()`은 마이크로초 단위까지 재므로 `Date.now()`보다 정확합니다.

3. **상대 시간**: 반환되는 타임스탬프는 상대 시간이라 시간 차를 재는 데는 알맞지만 절대 시각으로 쓰기에는 맞지 않습니다.

4. **단위**: 반환값의 단위는 밀리초입니다.
