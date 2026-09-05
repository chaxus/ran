# networkSpeed

요청을 여러 번 보내 지금 네트워크의 ping 값과 흔들림을 잽니다.

## API

### networkSpeed

#### 반환값

| 인자                  | 설명                                  | 타입      |
| --------------------- | ------------------------------------- | --------- |
| `Promise<ReturnType>` | 네트워크 측정 결과로 이행되는 Promise | `Promise` |

#### ReturnType

| 프로퍼티 | 설명                    | 타입     |
| -------- | ----------------------- | -------- |
| `ping`   | 평균 ping 값(밀리초)    | `number` |
| `jitter` | 네트워크 흔들림(밀리초) | `number` |

#### 매개변수

| 매개변수  | 설명      | 타입      | 기본값 |
| --------- | --------- | --------- | ------ |
| `options` | 설정 옵션 | `Options` | 필수   |

#### 옵션

| 매개변수   | 설명                 | 타입     | 기본값 |
| ---------- | -------------------- | -------- | ------ |
| `url`      | 측정에 쓸 이미지 URL | `string` | 필수   |
| `duration` | 요청 사이의 간격(ms) | `number` | `3000` |
| `count`    | 측정 횟수            | `number` | `5`    |

## 예시

### 기본 사용법

```js
import { networkSpeed } from 'ranuts';

const result = await networkSpeed({
  url: 'https://example.com/test.jpg',
  count: 5,
  duration: 3000,
});

console.log('평균 지연:', result.ping, 'ms');
console.log('네트워크 흔들림:', result.jitter, 'ms');
```

### 네트워크 품질 가늠하기

```js
import { networkSpeed } from 'ranuts';

async function assessNetwork() {
  const { ping, jitter } = await networkSpeed({ count: 10, url: 'https://example.com/test.jpg' });

  if (ping < 50 && jitter < 20) {
    console.log('네트워크 품질이 아주 좋습니다');
  } else if (ping < 100 && jitter < 50) {
    console.log('네트워크 품질이 좋습니다');
  } else {
    console.log('네트워크 품질이 보통입니다');
  }
}
```

### 측정 조건 바꾸기

```js
import { networkSpeed } from 'ranuts';

// 2초 간격으로 열 번 잽니다
const result = await networkSpeed({
  url: 'https://example.com/ping.jpg',
  count: 10,
  duration: 2000,
});
```

## 참고

1. **흔들림**: 네트워크가 얼마나 요동치는지를 나타냅니다. 여러 번 잰 값 가운데 최댓값과 최솟값의 차이이며, 작을수록 네트워크가 안정적입니다.
2. **재는 방식**: 이미지 요청을 여러 번 보내 평균 지연과 흔들림을 구합니다.
3. **기본 조건**: 3초 간격으로 다섯 번 잽니다.
4. **활용**: 네트워크 품질 판단, 성능 관찰, 사용 경험 다듬기 등에 흔히 쓰입니다.
