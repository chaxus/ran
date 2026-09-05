# toString

값을 문자열 타입으로 바꿉니다.

## API

### toString

#### 반환값

| 인자     | 설명        | 타입     |
| -------- | ----------- | -------- |
| `string` | 바뀐 문자열 | `string` |

#### 매개변수

| 매개변수 | 설명    | 타입               | 기본값 |
| -------- | ------- | ------------------ | ------ |
| `value`  | 바꿀 값 | `string \| number` | 필수   |

## 예시

### 기본 사용법

```js
import { toString } from 'ranuts';

const str1 = toString(123);
console.log(str1); // '123'

const str2 = toString('hello');
console.log(str2); // 'hello'
```

### 타입 변환

```js
import { toString } from 'ranuts';

const num = 42;
const str = toString(num);
console.log(typeof str); // 'string'
```

## 참고

1. **얇은 래퍼**: `String()` 함수를 얇게 감싼 것입니다.
2. **지원 타입**: 문자열과 숫자의 변환을 지원합니다.
3. **쓰임새**: 타입 변환이나 문자열 처리 같은 데 흔히 씁니다.
