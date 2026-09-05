# clearStr

문자열에서 앞뒤 공백, URL 인코딩, 따옴표를 걷어냅니다.

## API

### clearStr

#### 반환값

| 인자 | 설명 | 타입 |
| -------- | -------------- | -------- |
| `string` | 정리된 문자열 | `string` |

#### 매개변수

| 매개변수 | 설명 | 타입 | 기본값 |
| --------- | --------------------- | ---------------- | -------- |
| `str` | 정리할 문자열 | `string` | 필수 |
| `options` | 설정 옵션 | `ClearStrOption` | `{}` |

#### 옵션

| 매개변수 | 설명 | 타입 | 기본값 |
| ------------ | ----------------------------- | --------- | ------- |
| `urlencoded` | URL 디코딩을 할지 여부 | `boolean` | `true` |

## 예시

### 기본 사용법

```js
import { clearStr } from 'ranuts';

const str = '  "hello world"  ';
const cleaned = clearStr(str);
console.log(cleaned); // 'hello world'
```

### URL로 인코딩된 문자열

```js
import { clearStr } from 'ranuts';

const encoded = '  "hello%20world"  ';
const cleaned = clearStr(encoded);
console.log(cleaned); // 'hello world' (알아서 디코딩됨)
```

### URL 디코딩 끄기

```js
import { clearStr } from 'ranuts';

const str = '  "hello%20world"  ';
const cleaned = clearStr(str, { urlencoded: false });
console.log(cleaned); // 'hello%20world' (디코딩 안 됨)
```

### 따옴표 다루기

```js
import { clearStr } from 'ranuts';

const str1 = "'test'";
const str2 = '"test"';
console.log(clearStr(str1)); // 'test'
console.log(clearStr(str2)); // 'test'
```

## 참고

1. **걷어내는 것**: 앞뒤 공백, 작은따옴표, 큰따옴표를 걷어냅니다.
2. **URL 디코딩**: 기본으로 URL 디코딩을 하며, `urlencoded: false`로 끌 수 있습니다.
3. **활용**: 사용자가 입력한 값이나 URL 매개변수에서 꺼낸 값을 정리할 때 흔히 쓰입니다.
