# Canvas 2D geometry

Path builders and angle maths for Canvas 2D. Every path function **only builds the path**; it
never calls `fill()` or `stroke()`, so the caller decides how to paint it.

## Usage

```ts
import { roundRectByArc, getLinearGradient } from 'ranuts/utils';

const ctx = canvas.getContext('2d')!;

roundRectByArc(ctx, 10, 10, 200, 80, 12);
ctx.fillStyle = getLinearGradient(ctx, 10, 10, 200, 80, 'linear-gradient(90deg, #06f, #0cf)');
ctx.fill();
```

## API

### getAngle

Degrees to radians.

#### Parameters

| Parameter | Description      | Type     | Default  |
| --------- | ---------------- | -------- | -------- |
| `deg`     | Angle in degrees | `number` | Required |

#### Return

| Argument | Description      | Type     |
| -------- | ---------------- | -------- |
| `rad`    | Angle in radians | `number` |

### getArcPointerByDeg

The point on a circle at a given angle.

#### Parameters

| Parameter | Description      | Type     | Default  |
| --------- | ---------------- | -------- | -------- |
| `deg`     | Angle in radians | `number` | Required |
| `r`       | Radius           | `number` | Required |

#### Return

| Argument | Description | Type               |
| -------- | ----------- | ------------------ |
| `point`  | `[x, y]`    | `[number, number]` |

### getTangentByPointer

The tangent line at a point on a circle.

#### Parameters

| Parameter | Description  | Type     | Default  |
| --------- | ------------ | -------- | -------- |
| `x`       | x coordinate | `number` | Required |
| `y`       | y coordinate | `number` | Required |

#### Return

| Argument | Description          | Type            |
| -------- | -------------------- | --------------- |
| `line`   | `[slope, intercept]` | `Array<number>` |

### roundRectByArc

Trace a rounded rectangle. A corner radius larger than half the shorter side is **clamped to
half**, so adjacent corners can never overlap.

#### Parameters

| Parameter | Description       | Type                       | Default  |
| --------- | ----------------- | -------------------------- | -------- |
| `ctx`     | Canvas 2D context | `CanvasRenderingContext2D` | Required |
| `...rest` | `x, y, w, h, r`   | `number[]`                 | Required |

#### Return

No return value (`void`)

### fanShapedByArc

Trace a pie slice, including the gutter between slices.

#### Parameters

| Parameter   | Description                     | Type                       | Default  |
| ----------- | ------------------------------- | -------------------------- | -------- |
| `ctx`       | Canvas 2D context               | `CanvasRenderingContext2D` | Required |
| `maxRadius` | Outer radius                    | `number`                   | Required |
| `start`     | Start angle in radians          | `number`                   | Required |
| `end`       | End angle in radians            | `number`                   | Required |
| `gutter`    | Width of the gap between slices | `number`                   | Required |

#### Return

No return value (`void`)

### getLinearGradient

Translate a CSS `linear-gradient(...)` string into a Canvas `CanvasGradient`.

`createLinearGradient` only takes a start and an end point, while CSS describes direction as an
angle, so the circle is split into eight 45° sectors and the tangent turns the angle back into
start/end coordinates on the rectangle's boundary. Keyword directions (`to top` / `to bottom` /
`to left` / `to right`) are handled directly.

#### Parameters

| Parameter    | Description                              | Type                       | Default  |
| ------------ | ---------------------------------------- | -------------------------- | -------- |
| `ctx`        | Canvas 2D context                        | `CanvasRenderingContext2D` | Required |
| `x`          | x of the rectangle's top-left corner     | `number`                   | Required |
| `y`          | y of the rectangle's top-left corner     | `number`                   | Required |
| `w`          | Rectangle width                          | `number`                   | Required |
| `h`          | Rectangle height                         | `number`                   | Required |
| `background` | e.g. `linear-gradient(90deg, red, blue)` | `string`                   | Required |

#### Return

| Argument   | Description                                        | Type             |
| ---------- | -------------------------------------------------- | ---------------- |
| `gradient` | Assignable straight to `fillStyle` / `strokeStyle` | `CanvasGradient` |

::: warning
Colour stops must be unitless (`red 0, blue 1`). A percentage stop (`red 50%`) parses to `NaN` and
`addColorStop` will throw.
:::
