# perToNum

퍼센트 문자열을 숫자로 바꿉니다.

## API

### perToNum

#### 반환값

| 인자     | 설명        | 타입     |
| -------- | ----------- | -------- |
| `number` | 변환된 숫자 | `number` |

#### 매개변수

| 매개변수 | 설명          | 타입     | 기본값 |
| -------- | ------------- | -------- | ------ |
| `str`    | 퍼센트 문자열 | `string` | `''`   |

## 예시

### 기본 사용법

```js
import { perToNum } from 'ranuts';

console.log(perToNum('50%')); // 0.5
console.log(perToNum('100%')); // 1
console.log(perToNum('150%')); // 1.5
```

### 1을 넘는 퍼센트 다루기

```js
import { perToNum } from 'ranuts';

console.log(perToNum('50%')); // 0.5 (1 이하라 그대로 반환)
console.log(perToNum('150%')); // 1.5 (1을 넘어 100으로 나눔)
console.log(perToNum('200%')); // 2
```

### 보통 숫자 문자열 다루기

```js
import { perToNum } from 'ranuts';

console.log(perToNum('0.5')); // 0.5
console.log(perToNum('100')); // 100
```

### 빈 문자열 다루기

```js
import { perToNum } from 'ranuts';

console.log(perToNum('')); // 0
console.log(perToNum()); // 0
```

## 참고

1. **퍼센트 처리**:
   - 값이 1을 넘으면 100으로 나눕니다(예: `150%` → `1.5`)
   - 값이 1 이하이면 그대로 반환합니다(예: `50%` → `0.5`)

2. **퍼센트가 아닌 문자열**: `%`로 끝나지 않으면 곧바로 숫자로 바꿉니다.

3. **빈 값 처리**: 빈 문자열은 `0`이 됩니다.

4. **활용**: CSS의 퍼센트 값이나 진행률 값을 다룰 때 흔히 쓰입니다.
