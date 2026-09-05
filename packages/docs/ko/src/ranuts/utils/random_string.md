# randomString

앞에 타임스탬프를 붙인 무작위 문자열을 만들어 겹치기 어렵게 합니다.

## API

### randomString

#### 반환값

| 인자     | 설명                                        | 타입     |
| -------- | ------------------------------------------- | -------- |
| `string` | 무작위 문자열(형식: 타임스탬프-무작위 문자) | `string` |

#### 매개변수

| 매개변수 | 설명                                | 타입     | 기본값 |
| -------- | ----------------------------------- | -------- | ------ |
| `len`    | 무작위 부분의 길이(타임스탬프 제외) | `number` | `8`    |

## 예시

### 기본 사용법

```js
import { randomString } from 'ranuts';

const str = randomString();
console.log(str); // 예: '1703123456789-abc12345'
```

### 길이 지정하기

```js
import { randomString } from 'ranuts';

const str = randomString(12);
console.log(str); // 예: '1703123456789-abcdefghijkl'
```

### 고유 ID 만들기

```js
import { randomString } from 'ranuts';

const uniqueId = randomString(16);
console.log('고유 ID:', uniqueId);
```

### 임시 파일 이름

```js
import { randomString } from 'ranuts';

const tempFileName = `temp_${randomString(10)}.txt`;
console.log(tempFileName); // 예: 'temp_1703123456789-xyz1234567.txt'
```

## 참고

1. **겹치기 어려움**: 타임스탬프가 들어가므로 만들어진 문자열이 겹칠 일이 드뭅니다.
2. **쓰는 글자**: `ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678`을 쓰며, 헷갈리기 쉬운 글자(0, O, 1, I, l 등)는 뺐습니다.
3. **형식**: `{타임스탬프}-{무작위 문자}` 꼴로 반환합니다.
4. **길이**: 인자 `len`은 무작위 부분의 길이만 정하며, 타임스탬프와 하이픈은 세지 않습니다.

## getRandomString

더 가벼운 대안입니다. 타임스탬프도 붙지 않고 쓰는 글자도 제한하지 않으며, 그저 `Math.random().toString(36)`을 `len`자로 잘라 씁니다(36진수라 `0-9a-z`). `randomString`만큼 충돌에 강하지는 않으니, 한 번 쓰고 마는 DOM id나 캐시를 피하려는 질의 매개변수처럼 타임스탬프 충돌까지 버틸 필요가 없는 곳에 쓰세요.

```js
import { getRandomString } from 'ranuts/utils';

getRandomString(); // 예: 'k3j9x2p1' (8자)
getRandomString(4); // 예: 'a1b2'
```
