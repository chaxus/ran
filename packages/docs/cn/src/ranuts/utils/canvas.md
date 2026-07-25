# Canvas 2D 几何

Canvas 2D 的路径构建与角度计算。所有路径函数**只负责构建路径**，不调用 `fill()` / `stroke()`，由调用方决定怎么上色。

## 使用

```ts
import { roundRectByArc, getLinearGradient } from 'ranuts/utils';

const ctx = canvas.getContext('2d')!;

roundRectByArc(ctx, 10, 10, 200, 80, 12);
ctx.fillStyle = getLinearGradient(ctx, 10, 10, 200, 80, 'linear-gradient(90deg, #06f, #0cf)');
ctx.fill();
```

## API

### getAngle

角度转弧度。

#### 参数

| 参数  | 说明     | 类型     | 默认值 |
| ----- | -------- | -------- | ------ |
| `deg` | 数学角度 | `number` | 必填   |

#### 返回

| 参数  | 说明     | 类型     |
| ----- | -------- | -------- |
| `rad` | 运算弧度 | `number` |

### getArcPointerByDeg

根据角度计算圆上的点。

#### 参数

| 参数  | 说明     | 类型     | 默认值 |
| ----- | -------- | -------- | ------ |
| `deg` | 运算弧度 | `number` | 必填   |
| `r`   | 半径     | `number` | 必填   |

#### 返回

| 参数    | 说明     | 类型               |
| ------- | -------- | ------------------ |
| `point` | `[x, y]` | `[number, number]` |

### getTangentByPointer

根据圆上一点计算该点的切线方程。

#### 参数

| 参数 | 说明   | 类型     | 默认值 |
| ---- | ------ | -------- | ------ |
| `x`  | 横坐标 | `number` | 必填   |
| `y`  | 纵坐标 | `number` | 必填   |

#### 返回

| 参数   | 说明           | 类型            |
| ------ | -------------- | --------------- |
| `line` | `[斜率, 常数]` | `Array<number>` |

### roundRectByArc

绘制圆角矩形路径。圆角半径超过短边一半时会被**钳制到一半**，避免相邻圆角互相穿透。

#### 参数

| 参数      | 说明             | 类型                       | 默认值 |
| --------- | ---------------- | -------------------------- | ------ |
| `ctx`     | Canvas 2D 上下文 | `CanvasRenderingContext2D` | 必填   |
| `...rest` | `x, y, w, h, r`  | `number[]`                 | 必填   |

#### 返回

无返回值（`void`）

### fanShapedByArc

绘制扇形路径，含扇形之间的间隙。

#### 参数

| 参数        | 说明               | 类型                       | 默认值 |
| ----------- | ------------------ | -------------------------- | ------ |
| `ctx`       | Canvas 2D 上下文   | `CanvasRenderingContext2D` | 必填   |
| `maxRadius` | 外圈半径           | `number`                   | 必填   |
| `start`     | 起始弧度           | `number`                   | 必填   |
| `end`       | 结束弧度           | `number`                   | 必填   |
| `gutter`    | 扇形之间的间隙宽度 | `number`                   | 必填   |

#### 返回

无返回值（`void`）

### getLinearGradient

把一个 CSS `linear-gradient(...)` 字符串翻译成 Canvas 的 `CanvasGradient`。

`createLinearGradient` 只接受起点和终点两个坐标，而 CSS 用角度描述方向，所以这里按 45° 划分 8 个区域，用正切把角度还原成矩形边界上的起止坐标。关键字方向（`to top` / `to bottom` / `to left` / `to right`）直接处理。

#### 参数

| 参数         | 说明                                     | 类型                       | 默认值 |
| ------------ | ---------------------------------------- | -------------------------- | ------ |
| `ctx`        | Canvas 2D 上下文                         | `CanvasRenderingContext2D` | 必填   |
| `x`          | 矩形左上角横坐标                         | `number`                   | 必填   |
| `y`          | 矩形左上角纵坐标                         | `number`                   | 必填   |
| `w`          | 矩形宽                                   | `number`                   | 必填   |
| `h`          | 矩形高                                   | `number`                   | 必填   |
| `background` | 形如 `linear-gradient(90deg, red, blue)` | `string`                   | 必填   |

#### 返回

| 参数       | 说明                                   | 类型             |
| ---------- | -------------------------------------- | ---------------- |
| `gradient` | 可直接赋给 `fillStyle` / `strokeStyle` | `CanvasGradient` |

::: warning
色标必须是无单位的（`red 0, blue 1`）。百分比色标（`red 50%`）会解析成 `NaN`，`addColorStop` 会抛错。
:::
