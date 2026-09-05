# durationHandler

정해진 시간이 지난 뒤에 지정한 함수를 실행하는, 지연 실행 함수를 만듭니다.

## API

### durationHandler

#### 반환값

| 인자       | 설명                               | 타입                               |
| ---------- | ---------------------------------- | ---------------------------------- |
| `Function` | 지연 시간을 받는 함수를 반환합니다 | `(duration: number) => Promise<U>` |

#### 매개변수

| 매개변수    | 설명             | 타입       | 기본값 |
| ----------- | ---------------- | ---------- | ------ |
| `handler`   | 실행할 함수      | `Function` | 필수   |
| `...params` | 함수에 넘길 인자 | `T[]`      | 필수   |

## 예시

### 기본 사용법

```js
import { durationHandler } from 'ranuts';

const delayedFn = durationHandler((name) => {
  console.log('안녕하세요', name);
  return 'done';
}, 'World');

// 1초 뒤에 실행합니다
const result = await delayedFn(1000);
console.log(result); // 'done'
```

### API 요청 미루기

```js
import { durationHandler } from 'ranuts';

const delayedRequest = durationHandler(async (url) => {
  const response = await fetch(url);
  return response.json();
}, 'https://api.example.com/data');

// 2초 뒤에 요청을 보냅니다
const data = await delayedRequest(2000);
console.log(data);
```

### networkSpeed와 함께 쓰기

```js
import { durationHandler, imageRequest } from 'ranuts';

// 지연된 이미지 요청 함수를 만듭니다
const delayedImageRequest = durationHandler(imageRequest, 'https://example.com/test.jpg');

// 3초 뒤에 실행합니다
const latency = await delayedImageRequest(3000);
console.log('지연:', latency, 'ms');
```

## 참고

1. **커링된 함수**: 지연 시간을 받는 함수를 반환하므로 함수형 스타일에 잘 맞습니다.
2. **비동기 지원**: 비동기 함수도 받아 실행이 끝날 때까지 기다립니다.
3. **오류 처리**: 함수 실행이 실패하면 Promise가 거부됩니다.
4. **활용**: 지연 실행, 예약 작업, 네트워크 측정 등에 흔히 쓰입니다.
