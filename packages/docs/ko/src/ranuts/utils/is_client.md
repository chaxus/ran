# isClient

지금 환경이 클라이언트(브라우저) 환경인지 판별합니다.

## API

### isClient

#### 반환값

| 인자      | 설명                     | 타입      |
| --------- | ------------------------ | --------- |
| `boolean` | 클라이언트 환경인지 여부 | `boolean` |

#### 매개변수

매개변수 없음

## 예시

### 기본 사용법

```js
import { isClient } from 'ranuts';

if (isClient) {
  console.log('지금은 브라우저 환경입니다');
  // window나 document 같은 브라우저 API를 쓸 수 있습니다
  window.localStorage.setItem('key', 'value');
} else {
  console.log('지금은 서버 환경입니다');
}
```

### 조건부 실행

```js
import { isClient } from 'ranuts';

// 클라이언트에서만 실행합니다
if (isClient) {
  document.addEventListener('click', handleClick);
}
```

### 서버 렌더링에서의 안전성

```js
import { isClient } from 'ranuts';

function getWindowSize() {
  if (isClient) {
    return {
      width: window.innerWidth,
      height: window.innerHeight,
    };
  }
  return { width: 0, height: 0 };
}
```

## 참고

1. **판별 방법**: `typeof window !== 'undefined'`로 판별합니다.
2. **상수입니다**: `isClient`는 함수가 아니라 상수라, 쓸 때 괄호가 필요 없습니다.
3. **쓰임새**: 클라이언트와 서버 환경을 가르고, 서버에서 브라우저 API를 건드려 나는 오류를 피하는 데 흔히 씁니다.
