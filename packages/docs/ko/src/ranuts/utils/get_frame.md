# getFrame

1밀리초당 프레임 수를 구합니다. 1초당으로 바꾸려면 1000을 곱하세요.

## API

### getFrame

#### 반환값

| 인자              | 설명                                    | 타입      |
| ----------------- | --------------------------------------- | --------- |
| `Promise<number>` | 프레임 수(1밀리초당)로 이행되는 Promise | `Promise` |

#### 매개변수

| 매개변수 | 설명                    | 타입     | 기본값 |
| -------- | ----------------------- | -------- | ------ |
| `n`      | 표본으로 삼을 프레임 수 | `number` | `10`   |

## 예시

### 기본 사용법

```js
import { getFrame } from 'ranuts';

const fps = await getFrame();
console.log('1밀리초당 프레임:', fps);
console.log('1초당 프레임:', fps * 1000);
```

### 표본 수 바꾸기

```js
import { getFrame } from 'ranuts';

// 20프레임을 표본으로 평균 프레임 수를 구합니다
const fps = await getFrame(20);
console.log('FPS:', fps * 1000);
```

### 성능 측정

```js
import { getFrame } from 'ranuts';

async function monitorPerformance() {
  const fps = await getFrame(30);
  const fpsPerSecond = fps * 1000;

  if (fpsPerSecond < 30) {
    console.warn('프레임이 낮습니다:', fpsPerSecond);
  } else {
    console.log('프레임이 정상입니다:', fpsPerSecond);
  }
}
```

### 애니메이션 성능 확인하기

```js
import { getFrame } from 'ranuts';

async function checkAnimationPerformance() {
  const fps = await getFrame(60);
  const fpsPerSecond = fps * 1000;
  console.log(`애니메이션 프레임: ${fpsPerSecond.toFixed(2)} FPS`);
}
```

## 참고

1. **단위**: 1밀리초당 프레임 수를 반환하므로, 1초당(FPS)으로 보려면 1000을 곱하세요.
2. **표본 뽑는 방식**: `requestAnimationFrame`으로 표본을 뽑아 여러 프레임의 평균 간격을 구합니다.
3. **비동기**: Promise를 반환하니 `await`나 `.then()`으로 다루세요.
4. **활용**: 성능 관찰, 애니메이션 점검, 게임 프레임 관찰 등에 흔히 쓰입니다.
