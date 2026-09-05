# encodeUrl

URL을 안전하게 인코딩합니다. 이미 인코딩된 부분은 건드리지 않고, 짝이 맞지 않는 서러게이트 쌍도 처리합니다.

## API

### encodeUrl

#### 반환값

| 인자     | 설명         | 타입     |
| -------- | ------------ | -------- |
| `string` | 인코딩된 URL | `string` |

#### 매개변수

| 매개변수 | 설명         | 타입     | 기본값 |
| -------- | ------------ | -------- | ------ |
| `url`    | 인코딩할 URL | `string` | 필수   |

## 예시

### 기본 사용법

```js
import { encodeUrl } from 'ranuts';

const url = 'https://example.com/path with spaces';
const encoded = encodeUrl(url);
console.log(encoded); // 'https://example.com/path%20with%20spaces'
```

### 이미 인코딩된 URL 다루기

```js
import { encodeUrl } from 'ranuts';

// 이미 인코딩된 부분은 다시 인코딩되지 않습니다
const url = 'https://example.com/path%20with%20spaces';
const encoded = encodeUrl(url);
console.log(encoded); // 'https://example.com/path%20with%20spaces'
```

### 특수 문자 다루기

```js
import { encodeUrl } from 'ranuts';

const url = 'https://example.com/search?q=hello world&lang=zh-CN';
const encoded = encodeUrl(url);
console.log(encoded); // 인코딩된 URL
```

### 깨진 인코딩 다루기

```js
import { encodeUrl } from 'ranuts';

// %foo처럼 깨진 인코딩은 다시 인코딩됩니다
const url = 'https://example.com/path%foo';
const encoded = encodeUrl(url);
console.log(encoded); // 'https://example.com/path%25foo'
```

## 참고

1. **똑똑한 인코딩**: 인코딩되지 않은 부분만 손대고, `%20` 같은 이미 인코딩된 부분은 그대로 둡니다.
2. **서러게이트 쌍 처리**: 짝이 맞지 않는 서러게이트 쌍을 알아서 처리해 유니코드 대체 문자로 바꿉니다.
3. **안전**: 예외를 던지지 않으며, 되도록 올바르게 인코딩하려 합니다.
4. **활용**: 사용자가 입력한 URL을 다루거나 안전한 URL을 만들 때 흔히 쓰입니다.
