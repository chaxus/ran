# imageRequest

이미지 요청으로 네트워크 지연(ping)을 잽니다.

## API

### imageRequest

#### 반환값

| 인자              | 설명                                          | 타입      |
| ----------------- | --------------------------------------------- | --------- |
| `Promise<number>` | 요청에 걸린 시간(밀리초)으로 이행되는 Promise | `Promise` |

#### 매개변수

| 매개변수 | 설명                                        | 타입     | 기본값 |
| -------- | ------------------------------------------- | -------- | ------ |
| `url`    | 이미지 URL(선택. 기본값은 GitHub의 favicon) | `string` | 선택   |

## 예시

### 기본 사용법

```js
import { imageRequest } from 'ranuts';

const latency = await imageRequest();
console.log('네트워크 지연:', latency, 'ms');
```

### 측정에 쓸 URL 지정하기

```js
import { imageRequest } from 'ranuts';

const latency = await imageRequest('https://example.com/test-image.jpg');
console.log('지연:', latency, 'ms');
```

### 네트워크 상태 재기

```js
import { imageRequest } from 'ranuts';

async function testNetwork() {
  try {
    const latency = await imageRequest();
    if (latency < 100) {
      console.log('네트워크 양호');
    } else if (latency < 300) {
      console.log('네트워크 보통');
    } else {
      console.log('네트워크 느림');
    }
  } catch (error) {
    console.error('측정 실패:', error);
  }
}
```

## 참고

1. **기본 URL**: URL을 넘기지 않으면 GitHub의 favicon(약 2.2KB)을 씁니다.
2. **재는 방식**: 요청이 시작된 순간부터 이미지가 다 불릴 때까지의 시간을 재서 지연으로 삼습니다.
3. **오류 처리**: 이미지를 불러오지 못하면 Promise가 거부됩니다.
4. **활용**: 네트워크 품질 판단, 성능 모니터링 등에 흔히 쓰입니다.
