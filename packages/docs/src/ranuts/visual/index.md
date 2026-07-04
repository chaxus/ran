# visual

A PixiJS-style 2D rendering engine. Build a scene graph of shapes and render it through one of three backends — Canvas2D, WebGL, or WebGPU — chosen at runtime.

The engine is layered as **`Application`** (lifecycle / render loop) → **`Renderer`** (the backend) → a scene graph of **`Container`** (a group) → **`Graphics`** (a drawable). You add nodes to `app.stage` and the renderer draws them.

> **Browser only.** `ranuts/visual` needs a real `HTMLCanvasElement` and a GPU/Canvas context. It cannot run in Node.

## Import

```js
import { Application, Graphics, Container } from 'ranuts/visual';
```

## Quick start

Create an application, draw a filled-and-stroked rectangle and a circle, and start the render loop.

```js
import { Application, Graphics, RENDERER_TYPE } from 'ranuts/visual';

const view = document.querySelector('canvas');

// Application.create is async — the WebGPU backend initializes its device
// asynchronously and must finish before the first render.
const app = await Application.create({
  view,
  prefer: RENDERER_TYPE.CANVAS, // CANVAS | WEB_GL | WEB_GPU
  backgroundColor: '#1e1e1e',
});

// A rectangle: red fill + a 4px blue stroke.
const rect = new Graphics();
rect.beginFill('#ff0000');
rect.lineStyle(4, '#0000ff');
rect.drawRect(20, 20, 160, 100);
rect.endFill();

// A circle.
const circle = new Graphics();
circle.beginFill('#00cc88', 0.8);
circle.drawCircle(300, 120, 60);
circle.endFill();

// Add drawables to the stage — the ancestor of everything that gets rendered.
app.stage.addChild(rect);
app.stage.addChild(circle);

// Start the requestAnimationFrame loop (or call app.render() for a single frame).
app.start();
```

## API

### `Application`

The engine entry point. It owns the canvas, the renderer, and the scene-graph root (`stage`).

Prefer the async factory **`Application.create(...)`** over `new Application(...)`: the WebGPU backend initializes its device asynchronously and must finish before the first render. Canvas / WebGL resolve immediately, so the factory is safe and consistent for all backends.

#### `Application.create(options)`

`static async`. Constructs an `Application` and awaits the renderer's async initialization.

##### Parameters

| Parameter | Description                       | Type                  | Default  |
| --------- | --------------------------------- | --------------------- | -------- |
| `options` | Application configuration options | `IApplicationOptions` | Required |

##### Return

| Value                  | Description                 | Type                   |
| ---------------------- | --------------------------- | ---------------------- |
| `Promise<Application>` | The initialized application | `Promise<Application>` |

#### Properties

| Property      | Description                                                  | Type                |
| ------------- | ------------------------------------------------------------ | ------------------- |
| `stage`       | The scene-graph root. Add every node you want rendered here. | `Container`         |
| `view`        | The canvas element being rendered into.                      | `HTMLCanvasElement` |
| `eventSystem` | Pointer/event dispatch bound to the canvas and the stage.    | `EventSystem`       |

#### Methods

| Method     | Description                                    | Return |
| ---------- | ---------------------------------------------- | ------ |
| `render()` | Render a single frame of `stage`.              | `void` |
| `start()`  | Begin the `requestAnimationFrame` render loop. | `void` |
| `stop()`   | Cancel the render loop started by `start()`.   | `void` |

#### `IApplicationOptions`

| Field             | Description                                                 | Type                | Default                |
| ----------------- | ----------------------------------------------------------- | ------------------- | ---------------------- |
| `prefer`          | Which backend to use. Falls back to Canvas when omitted.    | `RENDERER_TYPE`     | `RENDERER_TYPE.CANVAS` |
| `view`            | Target canvas. A detached `<canvas>` is created if omitted. | `HTMLCanvasElement` | new canvas             |
| `backgroundColor` | Canvas background. Accepts any CSS color string.            | `string`            | —                      |
| `backgroundAlpha` | Background opacity, `0`–`1`.                                | `number`            | —                      |
| `debug`           | Log the chosen render backend to the console.               | `boolean`           | `false`                |

### `Container`

A group node — the "group" concept of the scene graph. It holds children and transform state but renders nothing itself; drawables such as `Graphics` extend it. Add a `Container` to build subtrees that move/scale/rotate together.

#### Methods

| Method               | Description                                                             | Return    |
| -------------------- | ----------------------------------------------------------------------- | --------- |
| `addChild(child)`    | Append a child (`Container`). Re-parents it if it already had a parent. | `void`    |
| `removeChild(child)` | Remove a child from `children`.                                         | `void`    |
| `sortChildren()`     | Re-sort `children` by `zIndex` (only when needed).                      | `void`    |
| `containsPoint(p)`   | Hit-test a `Point` against this node's `hitArea`.                       | `boolean` |

#### Transform & display properties

These live on the shared base node (`Vertex`) and are available on every `Container`/`Graphics`.

| Property           | Description                                                 | Type                     |
| ------------------ | ----------------------------------------------------------- | ------------------------ |
| `children`         | The child nodes (read-only array).                          | `Container[]`            |
| `parent`           | The parent node, if attached.                               | `Container \| undefined` |
| `x` / `y`          | Position, in the parent's coordinate space.                 | `number`                 |
| `position`         | The position point (`{ x, y }`).                            | `ObservablePoint`        |
| `scale`            | Scale point (`{ x, y }`).                                   | `ObservablePoint`        |
| `pivot`            | Rotation/scale pivot point.                                 | `ObservablePoint`        |
| `skew`             | Skew point.                                                 | `ObservablePoint`        |
| `rotation`         | Rotation in **radians**.                                    | `number`                 |
| `angle`            | Rotation in **degrees** (mirrors `rotation`).               | `number`                 |
| `alpha`            | Node opacity, `0`–`1` (multiplies down the tree).           | `number`                 |
| `visible`          | When `false`, the node and its subtree are skipped.         | `boolean`                |
| `zIndex`           | Draw order among siblings.                                  | `number`                 |
| `hitArea`          | Optional shape used for hit-testing.                        | `Shape \| null`          |
| `cursor`           | Cursor style when pointing at the node.                     | `Cursor`                 |
| `structureVersion` | Scene-structure version (root only); drives dirty-tracking. | `number`                 |

### `Graphics`

A drawable that extends `Container`. Set a fill and/or line style, then call a shape method. Most methods return `this`, so calls chain.

#### Style

| Method                             | Description                                                                             | Return     |
| ---------------------------------- | --------------------------------------------------------------------------------------- | ---------- |
| `beginFill(color?, alpha?)`        | Start filling with `color` (CSS string, default `'#000000'`) and `alpha` (default `1`). | `Graphics` |
| `endFill()`                        | Stop filling.                                                                           | `Graphics` |
| `lineStyle(width, color?, alpha?)` | Set the stroke: `width` px, `color` (default `'#000000'`), `alpha` (default `1`).       | `Graphics` |
| `lineStyle(options)`               | Set the stroke from an `ILineStyleOptions` object.                                      | `Graphics` |
| `resetLineStyle()`                 | Reset the current stroke to defaults.                                                   | `void`     |

#### Shapes

| Method                                         | Description                                             | Return     |
| ---------------------------------------------- | ------------------------------------------------------- | ---------- |
| `drawRect(x, y, width, height)`                | Rectangle.                                              | `Graphics` |
| `drawRoundedRect(x, y, width, height, radius)` | Rounded rectangle.                                      | `Graphics` |
| `drawCircle(x, y, radius)`                     | Circle centered at `(x, y)`.                            | `Graphics` |
| `drawEllipse(x, y, radiusX, radiusY)`          | Ellipse centered at `(x, y)`.                           | `Graphics` |
| `drawPolygon(points)`                          | Closed polygon from a flat `[x0, y0, x1, y1, …]` array. | `Graphics` |

#### Paths

| Method                                                      | Description                                              | Return     |
| ----------------------------------------------------------- | -------------------------------------------------------- | ---------- |
| `moveTo(x, y)`                                              | Start a new sub-path at `(x, y)`.                        | `Graphics` |
| `lineTo(x, y)`                                              | Straight line to `(x, y)`.                               | `Graphics` |
| `quadraticCurveTo(cpX, cpY, toX, toY)`                      | Quadratic Bézier curve (sampled into segments).          | `Graphics` |
| `bezierCurveTo(cpX, cpY, cpX2, cpY2, toX, toY)`             | Cubic Bézier curve (sampled into segments).              | `Graphics` |
| `arc(cx, cy, radius, startAngle, endAngle, anticlockwise?)` | Circular arc.                                            | `Graphics` |
| `arcTo(x1, y1, x2, y2, radius)`                             | Arc tangent to the two lines through the control points. | `Graphics` |
| `closePath()`                                               | Close the current sub-path.                              | `Graphics` |
| `clear()`                                                   | Remove all geometry and reset styles.                    | `Graphics` |
| `containsPoint(p)`                                          | Hit-test a `Point` against the drawn geometry.           | `boolean`  |

#### `IFillStyleOptions`

| Field     | Description                 | Type      | Default     |
| --------- | --------------------------- | --------- | ----------- |
| `color`   | Fill color (any CSS color). | `string`  | `'#ffffff'` |
| `alpha`   | Fill opacity, `0`–`1`.      | `number`  | `1`         |
| `visible` | Whether the fill is drawn.  | `boolean` | `false`     |

#### `ILineStyleOptions`

Extends `IFillStyleOptions` and adds:

| Field   | Description         | Type        | Default           |
| ------- | ------------------- | ----------- | ----------------- |
| `width` | Stroke width in px. | `number`    | `0`               |
| `cap`   | Line-cap style.     | `LINE_CAP`  | `LINE_CAP.BUTT`   |
| `join`  | Line-join style.    | `LINE_JOIN` | `LINE_JOIN.MITER` |

### Enums

#### `RENDERER_TYPE`

Selects the rendering backend via `IApplicationOptions.prefer`.

| Member    | Value      | Description                 |
| --------- | ---------- | --------------------------- |
| `CANVAS`  | `'canvas'` | Canvas2D backend (default). |
| `WEB_GL`  | `'webgl'`  | WebGL backend.              |
| `WEB_GPU` | `'webgpu'` | WebGPU backend.             |

#### `SHAPE_TYPE`

Shape kinds produced by the `Graphics` draw methods.

| Member              | Value                 |
| ------------------- | --------------------- |
| `RECTANGLE`         | `'rectangle'`         |
| `POLYGON`           | `'polygon'`           |
| `CIRCLE`            | `'circle'`            |
| `ELLIPSE`           | `'ellipse'`           |
| `ROUNDED_RECTANGLE` | `'rounded rectangle'` |

#### `LINE_CAP`

| Member   | Value      |
| -------- | ---------- |
| `BUTT`   | `'butt'`   |
| `ROUND`  | `'round'`  |
| `SQUARE` | `'square'` |

#### `LINE_JOIN`

| Member  | Value     |
| ------- | --------- |
| `MITER` | `'miter'` |
| `BEVEL` | `'bevel'` |
| `ROUND` | `'round'` |

### Constants

| Constant           | Value   | Description                                                  |
| ------------------ | ------- | ------------------------------------------------------------ |
| `MAX_VERTEX_COUNT` | `65536` | Maximum number of vertices supported per batch buffer.       |
| `BYTES_PER_VERTEX` | `12`    | Bytes per vertex (2× `Float32` position + 4× `Uint8` color). |

## Backends

The backend is chosen by `IApplicationOptions.prefer` (a `RENDERER_TYPE`); it defaults to Canvas when omitted.

- **`CANVAS`** draws directly through the Canvas2D API (`fillRect`, `arc`, `ctx.stroke()`, …).
- **`WEB_GL`** and **`WEB_GPU`** share one `BatchRenderer` pipeline: shapes are triangulated, packed into a single interleaved vertex buffer, and drawn in one call.

All three backends accept **any CSS color** — hex (`#rgb` / `#rrggbb`), named colors, `rgb()`, and `hsl()` all resolve consistently.

> **Stroke geometry differs by backend, by design.** Line caps and joins are drawn by the browser's native `ctx.stroke()` on the Canvas backend, but by custom triangulation on the WebGL/WebGPU backends. The two are not pixel-identical.
