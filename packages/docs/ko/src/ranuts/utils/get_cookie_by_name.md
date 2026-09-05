# getCookieByName

정규식을 써서 이름으로 쿠키 값을 가져옵니다.

## API

### getCookieByName

#### 반환값

| 인자     | 설명                      | 타입     |
| -------- | ------------------------- | -------- |
| `string` | 쿠키 값. 없으면 빈 문자열 | `string` |

#### 매개변수

| 매개변수 | 설명      | 타입     | 기본값 |
| -------- | --------- | -------- | ------ |
| `name`   | 쿠키 이름 | `string` | 필수   |

## 예시

### 기본 사용법

```js
import { getCookieByName } from 'ranuts';

const token = getCookieByName('token');
console.log(token); // 쿠키 값 또는 빈 문자열
```

### getCookie와 다른 점

```js
import { getCookie, getCookieByName } from 'ranuts';

// getCookie는 문자열을 나눠서 찾습니다
const value1 = getCookie('token');

// getCookieByName은 정규식을 씁니다
const value2 = getCookieByName('token');

// 하는 일은 같고 구현만 다릅니다
```

### 쿠키가 있는지 확인하기

```js
import { getCookieByName } from 'ranuts';

const sessionId = getCookieByName('sessionId');
if (sessionId) {
  console.log('세션 ID:', sessionId);
} else {
  console.log('세션 ID가 없습니다');
}
```

## 참고

1. **정규식 매칭**: 정규식으로 쿠키를 찾기 때문에 이름 앞뒤에 공백이 있어도 됩니다.
2. **서버에서도 안전**: 서버 환경(`window` 객체가 없는 경우)에서는 빈 문자열을 반환하며 예외를 던지지 않습니다.
3. **getCookie와 차이**: 하는 일은 같지만 `getCookieByName`은 정규식을, `getCookie`는 문자열 나누기를 씁니다.
4. **반환값**: 쿠키가 없으면 `null`이나 `undefined`가 아니라 빈 문자열을 반환합니다.
