# visual

一个 PixiJS 风格的 2D 渲染引擎。构建由图形组成的场景树，并通过三种后端之一——Canvas2D、WebGL 或 WebGPU——在运行时进行渲染。

引擎分层为 **`Application`**（生命周期 / 渲染循环）→ **`Renderer`**（渲染后端）→ 由 **`Container`**（组）组成的场景树 → **`Graphics`**（可绘制对象）。你把节点添加到 `app.stage` 上，渲染器就会绘制它们。

> **仅限浏览器。** `ranuts/visual` 需要真实的 `HTMLCanvasElement` 以及 GPU / Canvas 上下文，无法在 Node 中运行。

## 导入

```js
import { Application, Graphics, Container } from 'ranuts/visual';
```

## 快速上手

创建一个 application，绘制一个带填充和描边的矩形以及一个圆形，然后启动渲染循环。

```js
import { Application, Graphics, RENDERER_TYPE } from 'ranuts/visual';

const view = document.querySelector('canvas');

// Application.create 是异步的——WebGPU 后端的设备初始化是异步的，
// 必须在首次 render 之前完成。
const app = await Application.create({
  view,
  prefer: RENDERER_TYPE.CANVAS, // CANVAS | WEB_GL | WEB_GPU
  backgroundColor: '#1e1e1e',
});

// 一个矩形：红色填充 + 4px 蓝色描边。
const rect = new Graphics();
rect.beginFill('#ff0000');
rect.lineStyle(4, '#0000ff');
rect.drawRect(20, 20, 160, 100);
rect.endFill();

// 一个圆形。
const circle = new Graphics();
circle.beginFill('#00cc88', 0.8);
circle.drawCircle(300, 120, 60);
circle.endFill();

// 将可绘制对象添加到 stage 上——它是一切待渲染元素的祖先。
app.stage.addChild(rect);
app.stage.addChild(circle);

// 启动 requestAnimationFrame 渲染循环（或调用 app.render() 只渲染一帧）。
app.start();
```

## API

### `Application`

引擎入口。它持有 canvas、渲染器以及场景树的根节点（`stage`）。

推荐使用异步工厂 **`Application.create(...)`** 而非 `new Application(...)`：WebGPU 后端的设备初始化是异步的，必须在首次 render 之前完成。Canvas / WebGL 会立即 resolve，因此该工厂对所有后端都是安全且一致的。

#### `Application.create(options)`

`static async`。构造一个 `Application` 并等待渲染器完成异步初始化。

##### 参数

| 参数      | 说明               | 类型                  | 默认值 |
| --------- | ------------------ | --------------------- | ------ |
| `options` | Application 配置项 | `IApplicationOptions` | 必填   |

##### 返回

| 返回值                 | 说明             | 类型                   |
| ---------------------- | ---------------- | ---------------------- |
| `Promise<Application>` | 初始化完成的实例 | `Promise<Application>` |

#### 属性

| 属性          | 说明                                           | 类型                |
| ------------- | ---------------------------------------------- | ------------------- |
| `stage`       | 场景树根节点。所有需要渲染的节点都添加到这里。 | `Container`         |
| `view`        | 正在渲染的 canvas 元素。                       | `HTMLCanvasElement` |
| `eventSystem` | 绑定到 canvas 与 stage 的指针 / 事件派发系统。 | `EventSystem`       |

#### 方法

| 方法       | 说明                                    | 返回   |
| ---------- | --------------------------------------- | ------ |
| `render()` | 渲染 `stage` 的一帧。                   | `void` |
| `start()`  | 启动 `requestAnimationFrame` 渲染循环。 | `void` |
| `stop()`   | 取消由 `start()` 启动的渲染循环。       | `void` |

#### `IApplicationOptions`

| 字段              | 说明                                             | 类型                | 默认值                 |
| ----------------- | ------------------------------------------------ | ------------------- | ---------------------- |
| `prefer`          | 使用哪种渲染后端。省略时回退为 Canvas。          | `RENDERER_TYPE`     | `RENDERER_TYPE.CANVAS` |
| `view`            | 目标 canvas。省略时会创建一个游离的 `<canvas>`。 | `HTMLCanvasElement` | 新建 canvas            |
| `backgroundColor` | 画布背景色。接受任意 CSS 颜色字符串。            | `string`            | —                      |
| `backgroundAlpha` | 背景不透明度，`0`–`1`。                          | `number`            | —                      |
| `debug`           | 在控制台打印当前选用的渲染后端。                 | `boolean`           | `false`                |

### `Container`

组节点——场景树中的“组”概念。它持有子节点与变换状态，但自身不渲染任何内容；`Graphics` 等可绘制对象继承自它。用 `Container` 可以把需要一起平移 / 缩放 / 旋转的子树组合在一起。

#### 方法

| 方法                 | 说明                                                        | 返回      |
| -------------------- | ----------------------------------------------------------- | --------- |
| `addChild(child)`    | 追加一个子节点（`Container`）。若已有父节点则先解除再挂载。 | `void`    |
| `removeChild(child)` | 从 `children` 中移除一个子节点。                            | `void`    |
| `sortChildren()`     | 按 `zIndex` 重新排序 `children`（仅在需要时）。             | `void`    |
| `containsPoint(p)`   | 用节点的 `hitArea` 对 `Point` 做碰撞检测。                  | `boolean` |

#### 变换与显示属性

以下属性位于共享基类（`Vertex`）上，每个 `Container` / `Graphics` 都可用。

| 属性               | 说明                                           | 类型                     |
| ------------------ | ---------------------------------------------- | ------------------------ |
| `children`         | 子节点（只读数组）。                           | `Container[]`            |
| `parent`           | 父节点（若已挂载）。                           | `Container \| undefined` |
| `x` / `y`          | 位置，位于父节点的坐标系中。                   | `number`                 |
| `position`         | 位置点（`{ x, y }`）。                         | `ObservablePoint`        |
| `scale`            | 缩放点（`{ x, y }`）。                         | `ObservablePoint`        |
| `pivot`            | 旋转 / 缩放的轴心点。                          | `ObservablePoint`        |
| `skew`             | 倾斜点。                                       | `ObservablePoint`        |
| `rotation`         | 旋转角度（**弧度**）。                         | `number`                 |
| `angle`            | 旋转角度（**度**，与 `rotation` 同步）。       | `number`                 |
| `alpha`            | 节点不透明度，`0`–`1`（沿树向下相乘）。        | `number`                 |
| `visible`          | 为 `false` 时，跳过该节点及其子树。            | `boolean`                |
| `zIndex`           | 同级节点间的绘制顺序。                         | `number`                 |
| `hitArea`          | 用于碰撞检测的可选形状。                       | `Shape \| null`          |
| `cursor`           | 指向节点时的鼠标样式。                         | `Cursor`                 |
| `structureVersion` | 场景结构版本号（仅根节点有意义），用于脏检测。 | `number`                 |

### `Graphics`

继承自 `Container` 的可绘制对象。先设置填充 和/或 线条样式，再调用形状方法。大多数方法返回 `this`，可链式调用。

#### 样式

| 方法                               | 说明                                                                       | 返回       |
| ---------------------------------- | -------------------------------------------------------------------------- | ---------- |
| `beginFill(color?, alpha?)`        | 以 `color`（CSS 字符串，默认 `'#000000'`）和 `alpha`（默认 `1`）开始填充。 | `Graphics` |
| `endFill()`                        | 结束填充。                                                                 | `Graphics` |
| `lineStyle(width, color?, alpha?)` | 设置描边：`width` 像素，`color`（默认 `'#000000'`），`alpha`（默认 `1`）。 | `Graphics` |
| `lineStyle(options)`               | 用 `ILineStyleOptions` 对象设置描边。                                      | `Graphics` |
| `resetLineStyle()`                 | 将当前描边重置为默认值。                                                   | `void`     |

#### 形状

| 方法                                           | 说明                                                | 返回       |
| ---------------------------------------------- | --------------------------------------------------- | ---------- |
| `drawRect(x, y, width, height)`                | 矩形。                                              | `Graphics` |
| `drawRoundedRect(x, y, width, height, radius)` | 圆角矩形。                                          | `Graphics` |
| `drawCircle(x, y, radius)`                     | 以 `(x, y)` 为圆心的圆。                            | `Graphics` |
| `drawEllipse(x, y, radiusX, radiusY)`          | 以 `(x, y)` 为中心的椭圆。                          | `Graphics` |
| `drawPolygon(points)`                          | 由扁平数组 `[x0, y0, x1, y1, …]` 构成的闭合多边形。 | `Graphics` |

#### 路径

| 方法                                                        | 说明                                  | 返回       |
| ----------------------------------------------------------- | ------------------------------------- | ---------- |
| `moveTo(x, y)`                                              | 在 `(x, y)` 开始新的子路径。          | `Graphics` |
| `lineTo(x, y)`                                              | 直线连到 `(x, y)`。                   | `Graphics` |
| `quadraticCurveTo(cpX, cpY, toX, toY)`                      | 二阶贝塞尔曲线（采样为线段）。        | `Graphics` |
| `bezierCurveTo(cpX, cpY, cpX2, cpY2, toX, toY)`             | 三阶贝塞尔曲线（采样为线段）。        | `Graphics` |
| `arc(cx, cy, radius, startAngle, endAngle, anticlockwise?)` | 圆弧。                                | `Graphics` |
| `arcTo(x1, y1, x2, y2, radius)`                             | 与两条控制点连线相切的圆弧。          | `Graphics` |
| `closePath()`                                               | 闭合当前子路径。                      | `Graphics` |
| `clear()`                                                   | 清空所有几何内容并重置样式。          | `Graphics` |
| `containsPoint(p)`                                          | 用已绘制的几何对 `Point` 做碰撞检测。 | `boolean`  |

#### `IFillStyleOptions`

| 字段      | 说明                      | 类型      | 默认值      |
| --------- | ------------------------- | --------- | ----------- |
| `color`   | 填充色（任意 CSS 颜色）。 | `string`  | `'#ffffff'` |
| `alpha`   | 填充不透明度，`0`–`1`。   | `number`  | `1`         |
| `visible` | 是否绘制填充。            | `boolean` | `false`     |

#### `ILineStyleOptions`

继承 `IFillStyleOptions`，并增加：

| 字段    | 说明               | 类型        | 默认值            |
| ------- | ------------------ | ----------- | ----------------- |
| `width` | 描边宽度（像素）。 | `number`    | `0`               |
| `cap`   | 线帽样式。         | `LINE_CAP`  | `LINE_CAP.BUTT`   |
| `join`  | 线接样式。         | `LINE_JOIN` | `LINE_JOIN.MITER` |

### 枚举

#### `RENDERER_TYPE`

通过 `IApplicationOptions.prefer` 选择渲染后端。

| 成员      | 值         | 说明                    |
| --------- | ---------- | ----------------------- |
| `CANVAS`  | `'canvas'` | Canvas2D 后端（默认）。 |
| `WEB_GL`  | `'webgl'`  | WebGL 后端。            |
| `WEB_GPU` | `'webgpu'` | WebGPU 后端。           |

#### `SHAPE_TYPE`

`Graphics` 绘制方法所产生的形状类型。

| 成员                | 值                    |
| ------------------- | --------------------- |
| `RECTANGLE`         | `'rectangle'`         |
| `POLYGON`           | `'polygon'`           |
| `CIRCLE`            | `'circle'`            |
| `ELLIPSE`           | `'ellipse'`           |
| `ROUNDED_RECTANGLE` | `'rounded rectangle'` |

#### `LINE_CAP`

| 成员     | 值         |
| -------- | ---------- |
| `BUTT`   | `'butt'`   |
| `ROUND`  | `'round'`  |
| `SQUARE` | `'square'` |

#### `LINE_JOIN`

| 成员    | 值        |
| ------- | --------- |
| `MITER` | `'miter'` |
| `BEVEL` | `'bevel'` |
| `ROUND` | `'round'` |

### 常量

| 常量               | 值      | 说明                                                          |
| ------------------ | ------- | ------------------------------------------------------------- |
| `MAX_VERTEX_COUNT` | `65536` | 单个 batch 缓冲区支持的最大顶点数量。                         |
| `BYTES_PER_VERTEX` | `12`    | 每个顶点占用的字节数（2× `Float32` 位置 + 4× `Uint8` 颜色）。 |

## 渲染后端

后端由 `IApplicationOptions.prefer`（一个 `RENDERER_TYPE`）决定；省略时默认使用 Canvas。

- **`CANVAS`** 直接通过 Canvas2D API 绘制（`fillRect`、`arc`、`ctx.stroke()` 等）。
- **`WEB_GL`** 和 **`WEB_GPU`** 共用同一套 `BatchRenderer` 管线：将形状三角化，打包进单个交错的顶点缓冲区，然后一次性绘制。

三种后端都接受**任意 CSS 颜色**——十六进制（`#rgb` / `#rrggbb`）、颜色名、`rgb()`、`hsl()` 都会被一致地解析。

> **描边几何因后端而异，这是设计使然。** 线帽与线接在 Canvas 后端由浏览器原生的 `ctx.stroke()` 绘制，而在 WebGL / WebGPU 后端则由自定义三角化实现。两者并非逐像素一致。
