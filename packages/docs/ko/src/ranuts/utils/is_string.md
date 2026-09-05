# isString

값이 문자열 타입인지 판별합니다.

## API

### isString

#### 반환값

| 인자 | 설명 | 타입 |
| --------- | ---------------------- | --------- |
| `boolean` | 문자열인지 여부 | `boolean` |

#### 매개변수

| 매개변수 | 설명 | 타입 | 기본값 |
| --------- | -------------- | --------- | -------- |
| `obj` | 검사할 값 | `unknown` | 필수 |

## 예시

### 기본 사용법

```js
import { isString } from 'ranuts';

console.log(isString('hello')); // true
console.log(isString(123)); // false
console.log(isString(null)); // false
console.log(isString(undefined)); // false
```

### 타입 검사

```js
import { isString } from 'ranuts';

function processValue(value) {
  if (isString(value)) {
    console.log('문자열입니다:', value.toUpperCase());
  } else {
    console.log('문자열이 아닙니다');
  }
}

processValue('hello'); // '문자열입니다: HELLO'
processValue(123); // '문자열이 아닙니다'
```

### 인자 검증

```js
import { isString } from 'ranuts';

function validateInput(input) {
  if (!isString(input)) {
    throw new Error('입력값은 문자열이어야 합니다');
  }
  return input.trim();
}
```

## 참고

1. **타입 판별**: `Object.prototype.toString.call()`을 써서 정확하게 판별합니다.
2. **엄격함**: 값이 진짜 문자열 타입일 때만 `true`를 반환하며, 다른 타입(String 객체 포함)은 `false`입니다.
3. **활용**: 타입 검사, 인자 검증 등에 흔히 쓰입니다.
