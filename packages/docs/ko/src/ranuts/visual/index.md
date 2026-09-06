# visual

PixiJS 식의 2D 렌더링 엔진입니다. 도형으로 장면 그래프를 짜고, 실행 중에 고른 세 가지 백엔드(Canvas2D, WebGL, WebGPU) 가운데 하나로 그립니다.

엔진은 층으로 되어 있습니다. **`Application`**(생명주기와 렌더 루프) 아래에 **`Renderer`**(백엔드)가 있고, 그 아래로 **`Container`**(묶음)에서 **`Graphics`**(그릴 수 있는 것)로 이어지는 장면 그래프가 있습니다. `app.stage`에 노드를 더하면 렌더러가 그것들을 그립니다.

> **브라우저 전용입니다.** `ranuts/visual`에는 진짜 `HTMLCanvasElement`와 GPU 또는 Canvas 컨텍스트가 필요합니다. Node에서는 돌지 않습니다.

## 가져오기

```js
import { Application, Graphics, Container } from 'ranuts/visual';
```

## 빠른 시작

애플리케이션을 만들고, 칠과 선이 있는 직사각형과 원을 그린 다음, 렌더 루프를 돌립니다.

```js
import { Application, Graphics, RENDERER_TYPE } from 'ranuts/visual';

const view = document.querySelector('canvas');

// Application.create는 비동기입니다. WebGPU 백엔드는 장치 초기화를
// 비동기로 하며, 첫 그리기 전에 그것이 끝나 있어야 합니다.
const app = await Application.create({
  view,
  prefer: RENDERER_TYPE.CANVAS, // CANVAS | WEB_GL | WEB_GPU
  backgroundColor: '#1e1e1e',
});

// 직사각형. 빨간 칠에 4px 파란 선.
const rect = new Graphics();
rect.beginFill('#ff0000');
rect.lineStyle(4, '#0000ff');
rect.drawRect(20, 20, 160, 100);
rect.endFill();

// 원.
const circle = new Graphics();
circle.beginFill('#00cc88', 0.8);
circle.drawCircle(300, 120, 60);
circle.endFill();

// 그릴 것들을 stage에 더합니다. 그려지는 모든 것의 조상이 되는 자리입니다.
app.stage.addChild(rect);
app.stage.addChild(circle);

// requestAnimationFrame 루프를 돌립니다(한 프레임만이면 app.render()를 부르세요).
app.start();
```

## API

### `Application`

엔진의 입구입니다. 캔버스와 렌더러, 그리고 장면 그래프의 뿌리(`stage`)를 품고 있습니다.

`new Application(...)`보다 비동기 팩토리 **`Application.create(...)`**를 쓰세요. WebGPU 백엔드는 장치 초기화를 비동기로 하고, 그것이 첫 그리기 전에 끝나 있어야 하기 때문입니다. Canvas와 WebGL은 곧바로 이행하므로, 이 팩토리는 어느 백엔드에서나 안전하고 쓰는 방식도 한결같습니다.

#### `Application.create(options)`

`static async`입니다. `Application`을 짓고 렌더러의 비동기 초기화를 기다립니다.

##### 매개변수

| 매개변수  | 설명                   | 타입                  | 기본값 |
| --------- | ---------------------- | --------------------- | ------ |
| `options` | 애플리케이션 설정 옵션 | `IApplicationOptions` | 필수   |

##### 돌려주는 값

| 값                     | 설명                       | 타입                   |
| ---------------------- | -------------------------- | ---------------------- |
| `Promise<Application>` | 초기화가 끝난 애플리케이션 | `Promise<Application>` |

#### Properties

| 프로퍼티      | 설명                                                         | 타입                |
| ------------- | ------------------------------------------------------------ | ------------------- |
| `stage`       | 장면 그래프의 뿌리. 그리고 싶은 노드는 모두 여기에 더하세요. | `Container`         |
| `view`        | 그림이 그려지는 canvas 요소.                                 | `HTMLCanvasElement` |
| `eventSystem` | canvas와 stage에 매인 포인터·이벤트 전달.                    | `EventSystem`       |

#### Methods

| 메서드     | 설명                                            | 돌려주는 값 |
| ---------- | ----------------------------------------------- | ----------- |
| `render()` | `stage`를 한 프레임만 그립니다.                 | `void`      |
| `start()`  | `requestAnimationFrame` 렌더 루프를 시작합니다. | `void`      |
| `stop()`   | `start()`가 시작한 렌더 루프를 멈춥니다.        | `void`      |

#### `IApplicationOptions`

| 필드              | 설명                                                                 | 타입                | 기본값                 |
| ----------------- | -------------------------------------------------------------------- | ------------------- | ---------------------- |
| `prefer`          | 어느 백엔드를 쓸지. 빼면 Canvas로 물러납니다.                        | `RENDERER_TYPE`     | `RENDERER_TYPE.CANVAS` |
| `view`            | 그릴 대상 canvas. 빼면 어디에도 붙지 않은 `<canvas>`가 만들어집니다. | `HTMLCanvasElement` | 새 canvas              |
| `backgroundColor` | canvas의 바탕. CSS 색 문자열이면 무엇이든 받습니다.                  | `string`            | —                      |
| `backgroundAlpha` | 바탕의 불투명도. `0`부터 `1`까지.                                    | `number`            | —                      |
| `debug`           | 고른 렌더 백엔드를 콘솔에 찍습니다.                                  | `boolean`           | `false`                |

### `Container`

묶음을 나타내는 노드로, 장면 그래프에서 말하는 「그룹」입니다. 자식과 변환 상태를 쥐고 있을 뿐 스스로는 아무것도 그리지 않으며, `Graphics` 같은 그릴 수 있는 것들이 이를 물려받습니다. 함께 움직이고 커지고 도는 하위 트리를 짜고 싶을 때 `Container`를 더하세요.

#### Methods

| 메서드               | 설명                                                                     | 돌려주는 값 |
| -------------------- | ------------------------------------------------------------------------ | ----------- |
| `addChild(child)`    | 자식(`Container`)을 끝에 더합니다. 이미 부모가 있었다면 부모를 옮깁니다. | `void`      |
| `removeChild(child)` | `children`에서 자식 하나를 뺍니다.                                       | `void`      |
| `sortChildren()`     | `children`을 `zIndex`로 다시 줄 세웁니다(필요할 때만).                   | `void`      |
| `containsPoint(p)`   | `Point`가 이 노드의 `hitArea`에 닿는지 살핍니다.                         | `boolean`   |

#### 변환과 표시 속성

이것들은 공통 바탕 노드(`Vertex`)에 있으며, 어떤 `Container`와 `Graphics`에서든 쓸 수 있습니다.

| 프로퍼티           | 설명                                                          | 타입                     |
| ------------------ | ------------------------------------------------------------- | ------------------------ |
| `children`         | 자식 노드들(읽기 전용 배열).                                  | `Container[]`            |
| `parent`           | 부모 노드. 붙어 있다면.                                       | `Container \| undefined` |
| `x` / `y`          | 위치. 부모의 좌표계에서 잰 값입니다.                          | `number`                 |
| `position`         | 위치를 나타내는 점(`{ x, y }`).                               | `ObservablePoint`        |
| `scale`            | 배율을 나타내는 점(`{ x, y }`).                               | `ObservablePoint`        |
| `pivot`            | 돌리기와 키우기의 중심점.                                     | `ObservablePoint`        |
| `skew`             | 기울임을 나타내는 점.                                         | `ObservablePoint`        |
| `rotation`         | 회전. 단위는 **라디안**.                                      | `number`                 |
| `angle`            | 회전. 단위는 **도**(`rotation`과 짝을 이룹니다).              | `number`                 |
| `alpha`            | 노드의 불투명도. `0`부터 `1`까지(트리를 내려가며 곱해집니다). | `number`                 |
| `visible`          | `false`면 그 노드와 하위 트리를 건너뜁니다.                   | `boolean`                |
| `zIndex`           | 형제들 사이에서의 그리는 차례.                                | `number`                 |
| `hitArea`          | 맞았는지 살필 때 쓰는 도형. 없어도 됩니다.                    | `Shape \| null`          |
| `cursor`           | 그 노드를 가리킬 때의 커서 모양.                              | `Cursor`                 |
| `structureVersion` | 장면 구조의 판 번호(뿌리에만). 달라진 곳을 좇는 데 쓰입니다.  | `number`                 |

### `Graphics`

`Container`를 물려받은, 그릴 수 있는 것입니다. 칠이나 선 모양을 정한 다음 도형 메서드를 부르세요. 대부분의 메서드가 `this`를 돌려주므로 그대로 이어 쓸 수 있습니다.

#### 모양새

| 메서드                             | 설명                                                                               | 돌려주는 값 |
| ---------------------------------- | ---------------------------------------------------------------------------------- | ----------- |
| `beginFill(color?, alpha?)`        | `color`(CSS 문자열, 기본값 `'#000000'`)와 `alpha`(기본값 `1`)로 칠하기 시작합니다. | `Graphics`  |
| `endFill()`                        | 칠하기를 마칩니다.                                                                 | `Graphics`  |
| `lineStyle(width, color?, alpha?)` | 선을 정합니다. 굵기 `width` px, `color`(기본값 `'#000000'`), `alpha`(기본값 `1`).  | `Graphics`  |
| `lineStyle(options)`               | `ILineStyleOptions` 객체로 선을 정합니다.                                          | `Graphics`  |
| `resetLineStyle()`                 | 지금 선을 기본값으로 되돌립니다.                                                   | `void`      |

#### 도형

| 메서드                                         | 설명                                                     | 돌려주는 값 |
| ---------------------------------------------- | -------------------------------------------------------- | ----------- |
| `drawRect(x, y, width, height)`                | 직사각형.                                                | `Graphics`  |
| `drawRoundedRect(x, y, width, height, radius)` | 모서리가 둥근 직사각형.                                  | `Graphics`  |
| `drawCircle(x, y, radius)`                     | `(x, y)`를 중심으로 하는 원.                             | `Graphics`  |
| `drawEllipse(x, y, radiusX, radiusY)`          | `(x, y)`를 중심으로 하는 타원.                           | `Graphics`  |
| `drawPolygon(points)`                          | 납작한 `[x0, y0, x1, y1, …]` 배열로 만드는, 닫힌 다각형. | `Graphics`  |

#### 패스

| 메서드                                                      | 설명                                                | 돌려주는 값 |
| ----------------------------------------------------------- | --------------------------------------------------- | ----------- |
| `moveTo(x, y)`                                              | `(x, y)`에서 새 하위 패스를 시작합니다.             | `Graphics`  |
| `lineTo(x, y)`                                              | `(x, y)`까지 곧은 선.                               | `Graphics`  |
| `quadraticCurveTo(cpX, cpY, toX, toY)`                      | 2차 베지에 곡선(잘게 나눈 선분으로 그립니다).       | `Graphics`  |
| `bezierCurveTo(cpX, cpY, cpX2, cpY2, toX, toY)`             | 3차 베지에 곡선(잘게 나눈 선분으로 그립니다).       | `Graphics`  |
| `arc(cx, cy, radius, startAngle, endAngle, anticlockwise?)` | 원호.                                               | `Graphics`  |
| `arcTo(x1, y1, x2, y2, radius)`                             | 제어점을 지나는 두 직선에 접하는 호.                | `Graphics`  |
| `closePath()`                                               | 지금 하위 패스를 닫습니다.                          | `Graphics`  |
| `clear()`                                                   | 모든 도형을 지우고 모양새를 처음 상태로 되돌립니다. | `Graphics`  |
| `containsPoint(p)`                                          | `Point`가 그려진 도형에 닿는지 살핍니다.            | `boolean`   |

#### `IFillStyleOptions`

| 필드      | 설명                            | 타입      | 기본값      |
| --------- | ------------------------------- | --------- | ----------- |
| `color`   | 칠 색(CSS 색이면 무엇이든).     | `string`  | `'#ffffff'` |
| `alpha`   | 칠의 불투명도. `0`부터 `1`까지. | `number`  | `1`         |
| `visible` | 칠을 그릴지 여부.               | `boolean` | `false`     |

#### `ILineStyleOptions`

`IFillStyleOptions`를 물려받고 여기에 더합니다.

| 필드    | 설명              | 타입        | 기본값            |
| ------- | ----------------- | ----------- | ----------------- |
| `width` | 선의 굵기(px).    | `number`    | `0`               |
| `cap`   | 선 끝의 모양.     | `LINE_CAP`  | `LINE_CAP.BUTT`   |
| `join`  | 선 이음매의 모양. | `LINE_JOIN` | `LINE_JOIN.MITER` |

### 열거형

#### `RENDERER_TYPE`

`IApplicationOptions.prefer`로 렌더링 백엔드를 고릅니다.

| 멤버      | 값         | 설명                   |
| --------- | ---------- | ---------------------- |
| `CANVAS`  | `'canvas'` | Canvas2D 백엔드(기본). |
| `WEB_GL`  | `'webgl'`  | WebGL 백엔드.          |
| `WEB_GPU` | `'webgpu'` | WebGPU 백엔드.         |

#### `SHAPE_TYPE`

`Graphics`의 그리기 메서드가 만들어 내는 도형의 종류입니다.

| 멤버                | 값                    |
| ------------------- | --------------------- |
| `RECTANGLE`         | `'rectangle'`         |
| `POLYGON`           | `'polygon'`           |
| `CIRCLE`            | `'circle'`            |
| `ELLIPSE`           | `'ellipse'`           |
| `ROUNDED_RECTANGLE` | `'rounded rectangle'` |

#### `LINE_CAP`

| 멤버     | 값         |
| -------- | ---------- |
| `BUTT`   | `'butt'`   |
| `ROUND`  | `'round'`  |
| `SQUARE` | `'square'` |

#### `LINE_JOIN`

| 멤버    | 값        |
| ------- | --------- |
| `MITER` | `'miter'` |
| `BEVEL` | `'bevel'` |
| `ROUND` | `'round'` |

### 상수

| 상수               | 값      | 설명                                                        |
| ------------------ | ------- | ----------------------------------------------------------- |
| `MAX_VERTEX_COUNT` | `65536` | 배치 버퍼 하나가 감당하는 정점의 최대 개수.                 |
| `BYTES_PER_VERTEX` | `12`    | 정점 하나당 바이트 수(`Float32` 위치 2개와 `Uint8` 색 4개). |

## 백엔드

백엔드는 `IApplicationOptions.prefer`(`RENDERER_TYPE`)로 고릅니다. 빼면 Canvas가 됩니다.

- **`CANVAS`**는 Canvas2D API(`fillRect`, `arc`, `ctx.stroke()` 등)로 곧장 그립니다.
- **`WEB_GL`**과 **`WEB_GPU`**는 같은 `BatchRenderer` 흐름을 함께 씁니다. 도형은 삼각형으로 쪼개져 하나의 엇갈려 담은 정점 버퍼에 실리고, 한 번의 호출로 그려집니다.

세 백엔드 모두 **CSS 색이면 무엇이든** 받습니다. 16진수(`#rgb`, `#rrggbb`), 이름 있는 색, `rgb()`, `hsl()` 모두 한결같이 풀립니다.

> **선의 생김새는 백엔드마다 다릅니다. 일부러 그렇게 두었습니다.** Canvas 백엔드에서는 선의 끝과 이음매를 브라우저 본래의 `ctx.stroke()`가 그리지만, WebGL과 WebGPU에서는 직접 짠 삼각형 분할로 그립니다. 둘은 픽셀까지 같지는 않습니다.
