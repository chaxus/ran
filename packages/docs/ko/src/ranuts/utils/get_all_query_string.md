# getAllQueryString

URL에서 질의 매개변수를 모두 뽑아 객체로 만듭니다.

## API

### getAllQueryString

#### 반환값

| 인자     | 설명               | 타입                     |
| -------- | ------------------ | ------------------------ |
| `Object` | 질의 매개변수 객체 | `Record<string, string>` |

#### 매개변수

| 매개변수 | 설명                                   | 타입     | 기본값 |
| -------- | -------------------------------------- | -------- | ------ |
| `url`    | 해석할 URL(선택. 기본은 지금 쪽의 URL) | `string` | 선택   |

## 예시

### 기본 사용법

```js
import { getAllQueryString } from 'ranuts';

// 지금 URL이 https://example.com?name=John&age=30 이라고 합시다
const params = getAllQueryString();
console.log(params); // { name: 'John', age: '30' }
```

### 지정한 URL 해석하기

```js
import { getAllQueryString } from 'ranuts';

const url = 'https://example.com?page=1&limit=10&sort=name';
const params = getAllQueryString(url);
console.log(params); // { page: '1', limit: '10', sort: 'name' }
```

### 특정 매개변수 읽기

```js
import { getAllQueryString } from 'ranuts';

const params = getAllQueryString();
const page = params.page || '1';
const limit = params.limit || '10';
console.log(`쪽: ${page}, 개수: ${limit}`);
```

### 인코딩된 매개변수 다루기

```js
import { getAllQueryString } from 'ranuts';

// URL: https://example.com?search=hello%20world
const params = getAllQueryString();
console.log(params.search); // 'hello world' (알아서 디코딩됩니다)
```

## 참고

1. **값 없는 플래그도 자리를 지킵니다.** `?embed`와 `?embed=` 둘 다 `{ embed: '' }`이 됩니다. 0.3 이전에는 값 없는 매개변수를 버렸기 때문에, 불리언 플래그를 쓰는 흔한 방식인 `?readonly`와 `?embed`가 매개변수가 아예 없는 경우와 구별되지 않았습니다. 그런 플래그는 [`queryFlag`](/ko/src/ranuts/utils/query_flag)로 읽으세요.

2. **프래그먼트가 마지막 값으로 새어 들지 않습니다.** `?lang=en#section`은 `{ lang: 'en' }`이 됩니다.

3. **가르는 것은 첫 `=`뿐**이라 값 안에 `=`가 들어 있어도 됩니다. `?next=/a?b=1`은 `{ next: '/a?b=1' }`이 됩니다.

4. **URL 디코딩**: 키와 값 모두 퍼센트 디코딩되고 `+`는 공백이 됩니다. `URLSearchParams`와 같은 동작입니다. `%zz`처럼 망가진 이스케이프는 매개변수째 버리지 않고 그대로 둡니다. 값 하나가 잘못됐다고 나머지가 가려지지 않게 하기 위해서입니다.

5. **서버 환경**: `window`도 없고 `url`도 넘기지 않으면 `{}`를 돌려줍니다. URL을 건네면 빌드 스크립트에서도 쓸 수 있습니다.

6. **기본 URL**: `url`이 없으면 `window.location.href`를 씁니다.

7. **같은 이름의 매개변수**: 마지막 값만 남습니다.
