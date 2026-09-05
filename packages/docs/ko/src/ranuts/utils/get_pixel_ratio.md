# getPixelRatio

캔버스 컨텍스트의 해상도 비율을 가져옵니다. 고DPI 화면에 맞추는 데 씁니다.

## API

### getPixelRatio

#### 반환값

| 인자 | 설명 | 타입 |
| -------- | ----------- | -------- |
| `number` | 픽셀 비율 | `number` |

#### 매개변수

| 매개변수 | 설명 | 타입 | 기본값 |
| --------- | --------------------------- | -------------------------- | -------- |
| `context` | 캔버스의 2D 렌더링 컨텍스트 | `CanvasRenderingContext2D` | 필수 |

## 예시

### 기본 사용법

```js
import { getPixelRatio } from 'ranuts';

const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');
const ratio = getPixelRatio(ctx);
console.log('픽셀 비율:', ratio);
```

### 고DPI 화면에 맞추기

```js
import { getPixelRatio } from 'ranuts';

const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');
const ratio = getPixelRatio(ctx);

// 비율에 맞춰 캔버스 크기를 조정합니다
canvas.width = canvas.clientWidth * ratio;
canvas.height = canvas.clientHeight * ratio;

// 그리는 크기를 지키려고 컨텍스트를 확대합니다
ctx.scale(ratio, ratio);
```

### 또렷하게 그리기

```js
import { getPixelRatio } from 'ranuts';

function drawHighDPI(canvas) {
  const ctx = canvas.getContext('2d');
  const ratio = getPixelRatio(ctx);

  // 실제 크기를 정합니다
  canvas.width = canvas.clientWidth * ratio;
  canvas.height = canvas.clientHeight * ratio;

  // 컨텍스트를 확대합니다
  ctx.scale(ratio, ratio);

  // 내용을 그립니다(논리 픽셀 기준)
  ctx.fillRect(10, 10, 100, 100);
}
```

## 참고

1. **브라우저 호환**: 브라우저마다 다른 `backingStorePixelRatio` 속성을 두루 지원합니다.
2. **고DPI 지원**: 고DPI(레티나) 화면을 알아서 다뤄 그림이 또렷하게 나오도록 합니다.
3. **계산 방식**: `devicePixelRatio / backingStorePixelRatio`를 반환합니다.
4. **활용**: 캔버스 드로잉, 차트 라이브러리, 게임 개발처럼 또렷함이 중요한 곳에 흔히 쓰입니다.
