# currentDevice

현재 기기의 종류를 가져옵니다.

## API

### currentDevice

#### 반환값

| 인자 | 설명 | 타입 |
| --------------- | ------------------ | ----------------------------------------- |
| `CurrentDevice` | 기기 종류 문자열 | `'ipad' \| 'android' \| 'iphone' \| 'pc'` |

#### 매개변수

매개변수 없음

## 예시

### 기본 사용법

```js
import { currentDevice } from 'ranuts';

const device = currentDevice();
console.log(`현재 기기: ${device}`);
// 출력 예: 'ipad', 'android', 'iphone', 'pc'
```

### 기기 종류에 따라 다른 로직 실행하기

```js
import { currentDevice } from 'ranuts';

const device = currentDevice();
switch (device) {
  case 'iphone':
    // iPhone 전용 로직
    break;
  case 'android':
    // Android 전용 로직
    break;
  case 'ipad':
    // iPad 전용 로직
    break;
  case 'pc':
    // PC 전용 로직
    break;
}
```

### 기기별 스타일

```js
import { currentDevice } from 'ranuts';

const device = currentDevice();
document.body.classList.add(`device-${device}`);
```

## 참고

1. **판별 순서**: 다음 순서로 확인합니다.
   - iPad/iPod
   - Android
   - iPhone
   - 그 밖의 경우(기본값으로 'pc'를 반환)

2. **서버 사이드 렌더링**: 서버 환경(`window` 객체가 없는 경우)에서는 `'pc'`를 반환합니다.

3. **판별 방식**: User Agent 문자열로 판별합니다.

4. **반환값**: 열거형이라 `'ipad'`, `'android'`, `'iphone'`, `'pc'` 중 하나만 나옵니다.
