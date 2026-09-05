# getWindow

브라우저를 가리지 않고 뷰포트 크기를 가져옵니다.

## API

### getWindow

#### 반환값

| 인자 | 설명 | 타입 |
| ------------- | ------------------ | ------------- |
| `ClientRatio` | 창 크기 객체 | `ClientRatio` |

#### ClientRatio

| 프로퍼티 | 설명 | 타입 |
| -------- | ---------------------- | -------- |
| `width` | 창 너비(픽셀) | `number` |
| `height` | 창 높이(픽셀) | `number` |

#### 매개변수

매개변수 없음

## 예시

### 기본 사용법

```js
import { getWindow } from 'ranuts';

const windowSize = getWindow();
console.log('창 너비:', windowSize.width);
console.log('창 높이:', windowSize.height);
```

### 반응형 레이아웃

```js
import { getWindow } from 'ranuts';

function handleResize() {
  const { width, height } = getWindow();
  if (width < 768) {
    // 모바일 레이아웃
  } else {
    // 데스크톱 레이아웃
  }
}

window.addEventListener('resize', handleResize);
```

### 서버에서의 안전성

```js
import { getWindow } from 'ranuts';

// 서버 환경에서도 예외 없이 { width: 0, height: 0 }을 반환합니다
const size = getWindow();
console.log(size); // { width: 0, height: 0 }
```

### 가로세로 비 구하기

```js
import { getWindow } from 'ranuts';

const { width, height } = getWindow();
const aspectRatio = width / height;
console.log('가로세로 비:', aspectRatio);
```

## 참고

1. **브라우저 호환**: `window.innerWidth`와 `window.innerHeight`를 쓰므로 요즘 브라우저라면 모두 동작합니다.

2. **서버에서도 안전**: 서버 환경(`window` 객체가 없는 경우)에서는 `{ width: 0, height: 0 }`을 반환하며 예외를 던지지 않습니다.

3. **그 순간의 값**: 부른 시점의 크기를 돌려주므로, 창 크기가 바뀌면 다시 불러야 합니다.

4. **활용**: 반응형 레이아웃, 미디어 쿼리, 창 크기 관찰 등에 흔히 쓰입니다.
