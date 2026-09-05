# appendUrl

질의 매개변수 객체를 URL 끝에 덧붙입니다.

## API

### appendUrl

#### 반환값

| 인자     | 설명                       | 타입     |
| -------- | -------------------------- | -------- |
| `string` | 매개변수가 붙은 완전한 URL | `string` |

#### 매개변수

| 매개변수 | 설명               | 타입                     | 기본값 |
| -------- | ------------------ | ------------------------ | ------ |
| `url`    | 바탕이 되는 URL    | `string`                 | 필수   |
| `params` | 질의 매개변수 객체 | `Record<string, string>` | `{}`   |

## 예시

### 기본 사용법

```js
import { appendUrl } from 'ranuts';

const url = 'https://example.com';
const params = { page: '1', limit: '10' };
const fullUrl = appendUrl(url, params);
console.log(fullUrl); // 'https://example.com?page=1&limit=10'
```

### 이미 질의 매개변수가 있는 URL

```js
import { appendUrl } from 'ranuts';

const url = 'https://example.com?sort=name';
const params = { page: '1' };
const fullUrl = appendUrl(url, params);
console.log(fullUrl); // 'https://example.com?sort=name&page=1'
```

### 프로토콜 상대 URL 다루기

```js
import { appendUrl } from 'ranuts';

// //로 시작하는 URL에는 https://가 알아서 붙습니다
const url = '//example.com';
const params = { id: '123' };
const fullUrl = appendUrl(url, params);
console.log(fullUrl); // 'https://example.com?id=123'
```

### 빈 값은 걸러집니다

```js
import { appendUrl } from 'ranuts';

const url = 'https://example.com';
const params = { page: '1', empty: '' };
const fullUrl = appendUrl(url, params);
// 값이 빈 문자열이면 걸러집니다
console.log(fullUrl); // 'https://example.com?page=1'
```

## 참고

1. **프로토콜 처리**: URL이 `//`로 시작하면 앞에 `https://`가 붙습니다.

2. **매개변수 합치기**: URL에 이미 질의 매개변수가 있으면 새 것이 뒤에 붙습니다.

3. **빈 값 거르기**: 값이 빈 문자열인 매개변수는 걸러져 URL에 들어가지 않습니다.

4. **URL 인코딩**: 매개변수 값은 알아서 URL 인코딩됩니다.

5. **덮어쓰기**: 같은 이름의 매개변수가 있으면 새 값이 옛 값을 덮습니다(`URLSearchParams`의 동작을 그대로 따릅니다).
