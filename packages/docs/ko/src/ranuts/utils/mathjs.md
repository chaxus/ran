# mathjs

숫자를 정확히 계산하는 함수로, 자바스크립트 부동소수점 오차를 피하고 체이닝도 지원합니다.

## API

### mathjs

#### 반환값

| 인자                  | 설명           | 타입                                 |
| --------------------- | -------------- | ------------------------------------ |
| `ComputeNumberResult` | 계산 결과 객체 | `{ result: number, next: Function }` |

#### 매개변수

| 매개변수 | 설명                          | 타입     | 기본값 |
| -------- | ----------------------------- | -------- | ------ |
| `a`      | 첫째 수                       | `number` | 필수   |
| `type`   | 연산 종류(`+`, `-`, `*`, `/`) | `string` | 필수   |
| `b`      | 둘째 수                       | `number` | 필수   |

#### ComputeNumberResult

| 프로퍼티 | 설명                  | 타입       |
| -------- | --------------------- | ---------- |
| `result` | 계산 결과             | `number`   |
| `next`   | 계산을 이어 가는 함수 | `Function` |

## 예시

### 기본 사용법

```js
import { mathjs } from 'ranuts';

const result = mathjs(0.1, '+', 0.2);
console.log(result.result); // 0.3 (0.30000000000000004이 아니라 정확한 값)
```

### 메서드 체이닝

```js
import { mathjs } from 'ranuts';

const result = mathjs(1.3, '-', 1.2).next('+', 1.5).next('*', 2.3).next('/', 0.2);
console.log(result.result); // 정확한 계산 결과
```

### 정밀도 문제 피하기

```js
import { mathjs } from 'ranuts';

// 자바스크립트의 기본 계산에는 오차가 있습니다
console.log(0.1 + 0.2); // 0.30000000000000004

// mathjs를 쓰면 정확한 값이 나옵니다
const result = mathjs(0.1, '+', 0.2);
console.log(result.result); // 0.3
```

### 좀 더 긴 계산

```js
import { mathjs } from 'ranuts';

const total = mathjs(100, '*', 0.1).next('+', 50).next('-', 20).next('/', 2);
console.log(total.result); // 정확한 계산 결과
```

## 참고

1. **정밀도 처리**: 부동소수점 오차를 알아서 다뤄 `0.1 + 0.2 !== 0.3` 같은 문제를 피합니다.
2. **체이닝**: `next` 메서드로 계산을 이어 갈 수 있습니다.
3. **연산 종류**: `+`(더하기), `-`(빼기), `*`(곱하기), `/`(나누기) 네 가지를 지원합니다.
4. **속도**: 기본 연산보다 조금 느리지만 정확도는 보장됩니다.
