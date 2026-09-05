# isSafari

지금 브라우저가 Safari인지 판별합니다.

## API

### isSafari

#### 반환값

| 인자                             | 설명                     | 타입                             |
| -------------------------------- | ------------------------ | -------------------------------- |
| `boolean \| undefined \| string` | Safari 브라우저인지 여부 | `boolean \| undefined \| string` |

#### 매개변수

매개변수 없음

## 예시

### 기본 사용법

```js
import { isSafari } from 'ranuts';

const isSafariBrowser = isSafari();
if (isSafariBrowser) {
  console.log('지금 브라우저는 Safari입니다');
} else {
  console.log('Safari가 아닙니다');
}
```

### Safari 전용 기능

```js
import { isSafari } from 'ranuts';

if (isSafari()) {
  // Safari 전용 처리
  // 예: Safari의 호환성 문제를 다룹니다
  applySafariFix();
}
```

### 서버 환경

```js
import { isSafari } from 'ranuts';

// 서버 환경에서는 undefined를 돌려줍니다
const result = isSafari();
console.log(result); // undefined(서버 환경)
```

## 참고

1. **판별 방법**: `navigator.vendor`에 'Apple'이 있는지로 판별합니다.
2. **다른 브라우저 제외**: Chrome iOS(CriOS)와 Firefox iOS(FxiOS)는 뺍니다.
3. **서버 환경**: 서버 환경(`navigator` 객체가 없음)에서는 `undefined`를 돌려줍니다.
4. **반환값**: 브라우저에서는 `boolean`, 서버에서는 `undefined`이며, 경우에 따라 문자열을 돌려줄 수도 있습니다.
