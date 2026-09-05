# connection

현재 네트워크 연결 정보를 가져옵니다(Network Information API).

## API

### connection

#### 반환값

| 인자                              | 설명                              | 타입                              |
| --------------------------------- | --------------------------------- | --------------------------------- |
| `NetworkInformation \| undefined` | 네트워크 연결 객체 또는 undefined | `NetworkInformation \| undefined` |

#### 매개변수

매개변수 없음

## 예시

### 기본 사용법

```js
import { connection } from 'ranuts';

const conn = connection();
if (conn) {
  console.log('네트워크 종류:', conn.effectiveType);
  console.log('내려받기 속도:', conn.downlink, 'Mbps');
  console.log('RTT:', conn.rtt, 'ms');
}
```

### 네트워크 변화 감지하기

```js
import { connection } from 'ranuts';

const conn = connection();
if (conn) {
  conn.addEventListener('change', () => {
    console.log('네트워크 상태가 바뀌었습니다');
    console.log('새 네트워크 종류:', conn.effectiveType);
  });
}
```

### 네트워크에 맞춰 전략 바꾸기

```js
import { connection } from 'ranuts';

const conn = connection();
if (conn) {
  if (conn.effectiveType === 'slow-2g' || conn.effectiveType === '2g') {
    // 느린 네트워크: 저화질 이미지를 불러옵니다
    loadLowQualityImages();
  } else {
    // 빠른 네트워크: 고화질 이미지를 불러옵니다
    loadHighQualityImages();
  }
}
```

## 참고

1. **브라우저 지원**: Network Information API를 지원하는 브라우저가 필요하며, 지원하지 않는 브라우저도 있습니다.
2. **서버 환경**: 서버 환경(`window` 객체가 없는 경우)에서는 `undefined`를 반환합니다.
3. **연결 객체의 속성**:
   - `effectiveType`: 네트워크 종류('slow-2g', '2g', '3g', '4g')
   - `downlink`: 내려받기 속도(Mbps)
   - `rtt`: 왕복 시간(밀리초)
   - `saveData`: 데이터 절약 모드가 켜져 있는지 여부
4. **활용**: 네트워크 상태에 맞춰 콘텐츠 불러오기 방식을 조정하는 등 성능을 다듬는 데 흔히 쓰입니다.
