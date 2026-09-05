# addNumSym

숫자에 부호(+ 또는 -)를 붙입니다.

## API

### addNumSym

#### 반환값

| 인자     | 설명                    | 타입     |
| -------- | ----------------------- | -------- |
| `string` | 부호가 붙은 숫자 문자열 | `string` |

#### 매개변수

| 매개변수 | 설명                                | 타입               | 기본값 |
| -------- | ----------------------------------- | ------------------ | ------ |
| `value`  | 처리할 숫자 또는 문자열             | `string \| number` | 필수   |
| `flag`   | 부호 플래그(선택. 부호를 강제할 때) | `string \| number` | 선택   |

## 예시

### 기본 사용법

```js
import { addNumSym } from 'ranuts';

console.log(addNumSym(100)); // '+100'
console.log(addNumSym(-50)); // '-50'
console.log(addNumSym(0)); // '0'
```

### 문자열로 넘기기

```js
import { addNumSym } from 'ranuts';

console.log(addNumSym('100')); // '+100'
console.log(addNumSym('-50')); // '-50' (이미 부호가 있어 그대로)
```

### 부호 강제하기

```js
import { addNumSym } from 'ranuts';

console.log(addNumSym(100, 1)); // '+100' (flag > 0)
console.log(addNumSym(100, -1)); // '100' (flag <= 0이라 +가 붙지 않음)
console.log(addNumSym(100, 0)); // '100'
```

### 이미 부호가 있는 경우

```js
import { addNumSym } from 'ranuts';

console.log(addNumSym('+100')); // '+100' (이미 부호가 있어 그대로)
console.log(addNumSym('-50')); // '-50' (이미 부호가 있어 그대로)
```

## 참고

1. **부호 규칙**:
   - 양수에는 `+`를 붙입니다
   - 음수는 `-`를 그대로 둡니다
   - 0에는 부호를 붙이지 않습니다

2. **이미 부호가 있으면**: 문자열이 `+`나 `-`로 시작하면 부호를 겹쳐 붙이지 않습니다.

3. **강제 플래그**: `flag` 인자로 `+`를 붙일지 정할 수 있습니다(`flag > 0`일 때 붙습니다).

4. **활용**: 손익이나 증감처럼 부호가 분명히 보여야 하는 표시에 흔히 쓰입니다.
