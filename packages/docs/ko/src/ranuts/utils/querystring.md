# querystring

객체를 URL 질의 문자열로 바꿉니다.

## API

### querystring

#### 반환값

| 인자 | 설명 | 타입 |
| -------- | ---------------- | -------- |
| `string` | URL 질의 문자열 | `string` |

#### 매개변수

| 매개변수 | 설명 | 타입 | 기본값 |
| --------- | ----------------- | -------- | ------- |
| `data` | 바꿀 객체 | `Object` | `{}` |

## 예시

### 기본 사용법

```js
import { querystring } from 'ranuts';

const params = {
  name: 'John',
  age: 30,
  city: 'New York',
};

const query = querystring(params);
console.log(query); // 'name=John&age=30&city=New%20York'
```

### URL 만들기

```js
import { querystring } from 'ranuts';

const baseUrl = 'https://api.example.com/users';
const params = {
  page: 1,
  limit: 10,
  sort: 'name',
};

const url = `${baseUrl}?${querystring(params)}`;
console.log(url);
// 'https://api.example.com/users?page=1&limit=10&sort=name'
```

### 특수 문자 다루기

```js
import { querystring } from 'ranuts';

const params = {
  search: 'hello world',
  category: 'web development',
};

const query = querystring(params);
console.log(query); // 'search=hello%20world&category=web%20development'
```

### undefined와 null은 걸러집니다

```js
import { querystring } from 'ranuts';

const params = {
  name: 'John',
  age: undefined,
  city: null,
  active: true,
};

const query = querystring(params);
console.log(query); // 'name=John&active=true'
// 값이 undefined이거나 null이면 걸러집니다
```

## 참고

1. **URL 인코딩**: 값은 알아서 URL 인코딩됩니다.
2. **빈 값 거르기**: 값이 `undefined`이거나 `null`이면 알아서 걸러져 질의 문자열에 나오지 않습니다.
3. **객체여야 합니다**: 객체가 아닌 값을 넘기면 `TypeError`가 납니다.
4. **인코딩 전 처리**: 키와 값 모두 인코딩 전에 `decodeURIComponent`를 거칩니다.
