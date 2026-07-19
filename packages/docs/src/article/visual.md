---
description: "Designing a 2D visualization rendering engine: use cases, constraints and edge cases across Canvas, WebGL and WebGPU."
---

# Visualization Rendering Engine

## Zero: System Design

In the process of system design, we need to clarify the **use cases**, **constraints**, and **edge cases**. Describe the most important functionality to implement, and organize these features into a high-level design, classifying and linking them.

Once we have the specific feature modules to implement, we dig into the details based on those modules and discuss the concrete implementation.

After implementing the features, we link these important pieces together following extensible design principles.

Finally, there are concrete implementations for some business scenarios.

Therefore, for a visualization rendering engine, we need to consider the following aspects:

1. **Group management:** Organize multiple graphical elements into a single whole (a "group"). This design allows all elements within a group to respond when the group is moved, scaled, or transformed as a whole, simplifying operations and management in complex scenarios.
2. **Basic shape encapsulation:** Build a rich library of basic shape classes, providing a convenient `API` to draw common geometric shapes such as rectangles, circles, polygons, and curves. These basic shapes should support custom styles and properties to satisfy diverse design requirements.
3. **Layer management:** For `2D` graphics, handling stacking relationships is essential — defining the stacking order between elements, such as ensuring text is always drawn above the chart. Layer management ensures the visual presentation matches expectations.
4. **Transformation matrix:** Perform translation, rotation, scaling, and other transform operations on a group of graphics, adjusting the visual presentation dynamically and flexibly. To implement these transform operations, the transform class typically relies on matrix transformation principles. By maintaining a transformation matrix and applying it before drawing the graphics group, all transform calculations can be completed in one pass, improving drawing efficiency.
5. **Event system:** Allow users to bind event listeners to a single graphical element or to an entire group, enabling user interactions such as clicking and dragging.
6. **Extensible design:** Clearly define the lifecycle of the entire rendering process, and allow developers to insert custom code at the corresponding lifecycle stages, enabling control over the rendering pipeline, event handling, resource management, and more.
7. **Application-layer encapsulation:** Implement application-layer graphics such as bar charts, line charts, pie charts, and Sankey diagrams to meet diverse business and product needs.

Let's start by implementing the first one: group management.

## One: Group Management

To manage groups of graphics, we implement a container class, `Container`, which represents the concept of a "group." It provides methods for adding and removing child elements. Classes to be rendered later (such as `Graphics`, `Text`, `Sprite`, etc.) will all inherit from this class. The class itself is never rendered directly (since it's just a "group" with no content of its own to render).

Properties:

- `children`: represents all child elements
- `isSort`: after adding or removing an element, this flags that the current group needs to be updated
- `parent`: represents the parent node of the current group

Methods:

- `addChild`: adds a child element
- `removeChild`: removes a child element

The implementation is as follows:

```ts
class Container {
  public readonly children: Container[] = [];
  public isSort: boolean = false;
  public parent: Container | undefined = undefined;
  addChild = (child: Container) => {
    child.parent?.removeChild(child);
    this.children.push(child);
    this.isSort = true;
    child.parent = this;
  };
  removeChild = (child: Container) => {
    for (let i = 0; i < this.children.length; i++) {
      if (this.children[i] === child) {
        this.children.splice(i, 1);
        child.parent = undefined;
        return;
      }
    }
  };
}
```

With the concept of a `group` in place, it's natural to ask: what is the very first `group`? How is it created? We need an `entry point`.

We'll implement the `Application` class, which represents the entire visualization engine. On initialization, it automatically creates a root group as the ancestor of every element to be rendered.

```ts
export class Application {
  public readonly stage: Container; // stage is the ancestor of all elements to be rendered.
  public readonly view: HTMLCanvasElement; // canvas element

  constructor(options: IApplicationOptions) {
    const { view = document.createElement('canvas') } = options;
    this.view = view;
    // Create a root container
    this.stage = new Container();
  }
}
```

With the root group in place, we can traverse from the root and render all shapes. So we need to implement a `render` method.

Here we need to think about the rendering mode:

- In traditional `web` development, we need to maintain the state of the `UI`. Based on changes to state variables, we register callback listeners to update the `UI`. This is [Model–view–viewmodel](https://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93viewmodel).
- Another rendering mode, more common in the gaming world, re-renders the `UI` on every frame, without persisting state or data — there's no `UI diff`, two-way binding, or callback-driven updates. This is [Immediate Mode GUI](<https://en.wikipedia.org/wiki/Immediate_mode_(computer_graphics)>).

We'll implement a `start` method and a `render` method following these two rendering modes.

Before rendering, we also need to consider extensibility. Although only `canvas` rendering is used for now, we should obviously leave room for extending to `webGL` and `webGPU` rendering capability.

So we design a `getRenderer` method to make that choice. Based on the passed-in `prefer`, it selects the rendering method. Following the [Interface Segregation Principle](/src/article/design_mode), each rendering method is its own independent class.

```ts
export const getRenderer = (options: IApplicationOptions): Renderer => {
  const { prefer: renderType } = options;
  switch (renderType) {
    case RENDERER_TYPE.CANVAS:
      return new CanvasRenderer(options);
    case RENDERER_TYPE.WEB_GL:
      return new WebGLRenderer(options);
    case RENDERER_TYPE.WEB_GPU:
      return new WebGPURenderer(options);
    default:
      return new CanvasRenderer(options);
  }
};
```

The `CanvasRenderer` implementation is very simple: it has just one `render` method that recursively renders all elements starting from the root `container`:

```ts
export class CanvasRenderer extends Renderer {
  public ctx: CanvasRenderingContext2D;
  constructor(options: IApplicationOptions) {
    super(options);
    console.log('Now using %c canvas2D ', 'color: #05aa6d; background-color: #ffffff;font-size: 20px;', 'to render');
    this.ctx = this.canvasEle.getContext('2d')!;
  }
  public render(container: Container): void {
    this.ctx.save();
    this.ctx.clearRect(0, 0, this.screen.width, this.screen.height);
    this.ctx.fillRect(0, 0, this.screen.width, this.screen.height);
    container.renderCanvasRecursive(this);
    this.ctx.restore();
  }
}
```

Finally, here is the implementation of the `start` and `render` methods:

```ts
export class Application {
  private readonly renderer: Renderer;
  private animationFrameId: number | undefined;
  public readonly stage: Container; // stage is the ancestor of all elements to be rendered.
  public readonly view: HTMLCanvasElement;
  constructor(options: IApplicationOptions) {
    const { view = document.createElement('canvas') } = options;
    this.view = view;
    // Decide which rendering mode to use based on the options
    this.renderer = getRenderer({ ...options, view });
    // Create a root container
    this.stage = new Container();
  }

  public render(): void {
    this.renderer.render(this.stage);
  }
  // Immediate rendering mode
  public start(): void {
    const func = () => {
      this.render();
      this.animationFrameId = requestAnimationFrame(func);
    };
    func();
  }

  public stop(): void {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = undefined;
    }
  }
}
```

With group management and the `application` class in place, we can build basic shape implementations on top of them. Basic shapes will also inherit from the `Container` class, making it easy to compose and nest them.

Once the next chapter is implemented, we'll be able to instantiate `application` and `render` all kinds of shapes on the page.

## Two: Encapsulating Basic Shapes

In most 2D drawing scenarios, complex shapes can often be reduced to combinations of basic shapes. The core primitives include circles, polygons, and Bézier curves — the fundamental building blocks for constructing graphics.

There are also some commonly used basic shapes, such as rectangles, rounded rectangles, and ellipses. We collectively call these the "basic shape library"; combining them flexibly makes it easy to build a 2D scene that satisfies almost any requirement.

First, let's define a `Graphics` class, inheriting from `Container`, to represent a container for drawing various shapes.

```ts
class Graphics extends Container {}
```

During drawing, we need to consider whether a shape is **filled** or **stroked**. So we need to define two properties:

`lineStyle` and `fillStyle`, representing the properties of the `line` and the `fill`, respectively.

So we further break down the `Graphics` class:

- One is `GraphicsData`, used to store the data for a basic shape and whether it is stroked or filled.
- The other is `GraphicsGeometry`, representing a generic basic shape, used for common basic shape operations, such as storing shape data.

The `GraphicsData` class is implemented as follows:

```ts
export class GraphicsData {
  public shape: Shape;
  public lineStyle: Line;
  public fillStyle: Fill;
  constructor(shape: Shape, fillStyle: Fill, lineStyle: Line) {
    this.shape = shape;
    this.lineStyle = lineStyle;
    this.fillStyle = fillStyle;
  }
}
```

`lineStyle` and `fillStyle` are also each instantiated from their own class:

The `line` properties are: `color`, `alpha`, `visible`, `width`, [cap](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/lineCap), [join](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/lineJoin), [miterLimit](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/miterLimit)

The `fill` properties are: `color`, `alpha`, `visible`

We can use two classes to describe this data. The `Fill` class is:

```ts
class Fill {
  public color = '#ffffff';
  public alpha = 1.0;
  public visible = false;

  constructor() {
    this.reset();
  }

  public clone(): Fill {
    const obj = new Fill();
    obj.color = this.color;
    obj.alpha = this.alpha;
    obj.visible = this.visible;
    return obj;
  }

  public reset(): void {
    this.color = '#ffffff';
    this.alpha = 1;
    this.visible = false;
  }
}
```

`Line` extends the `Fill` class:

```ts
class Line extends Fill {
  public width = 0;
  public cap = LINE_CAP.BUTT;
  public join = LINE_JOIN.MITER;
  public miterLimit = 10;

  public clone(): Line {
    const obj = new Line();
    obj.color = this.color;
    obj.alpha = this.alpha;
    obj.visible = this.visible;
    obj.width = this.width;
    obj.cap = this.cap;
    obj.join = this.join;
    obj.miterLimit = this.miterLimit;
    return obj;
  }

  public reset(): void {
    super.reset();
    this.color = '#ffffff';
    this.width = 0;
    this.cap = LINE_CAP.BUTT;
    this.join = LINE_JOIN.MITER;
    this.miterLimit = 10;
  }
}
```

The `GraphicsGeometry` class provides a `drawShape` method, used to add shape data instantiated via `GraphicsData`.

```ts
  public drawShape(shape: Shape, fillStyle: Fill, lineStyle: Line): void {
    const data = new GraphicsData(shape, fillStyle, lineStyle);
    this.graphicsData.push(data);
  }
```

So, the properties of the `Graphics` class are as follows:

```ts
class Graphics extends Container {
  private _lineStyle = new Line();
  private _fillStyle = new Fill();
  constructor() {
    super();
    this.type = GRAPHICS;
  }
}
```

We also need to add some line-drawing and fill methods:

```ts
class Graphics extends Container {
  private _lineStyle = new Line();
  private _fillStyle = new Fill();
  constructor() {
    super();
    this.type = GRAPHICS;
  }
  public lineStyle(width: number, color?: string, alpha?: number): Graphics;
  public lineStyle(options: ILineStyleOptions): Graphics;
  public lineStyle(options: ILineStyleOptions | number, color: string = '0x000000', alpha: number = 1): Graphics {
    this.startPoly();
    if (typeof options === 'object') {
      Object.assign(this._lineStyle, options);
    } else {
      const opts: ILineStyleOptions = { width: options, color, alpha };
      Object.assign(this._lineStyle, opts);
    }
    this._lineStyle.visible = true;
    return this;
  }
  // To fill a shape, this function must be called first to set the fill color on the pen
  public beginFill(color = '#000000', alpha = 1): Graphics {
    this._fillStyle.color = color;
    this._fillStyle.alpha = alpha;
    if (this._fillStyle.alpha > 0) {
      this._fillStyle.visible = true;
    }
    return this;
  }
  /**
   * End fill mode
   */
  public endFill = (): Graphics => {
    this.startPoly();
    this._fillStyle.reset();
    return this;
  };
}
```

This indicates whether the shape is filled or stroked.

Next comes drawing the various basic shapes. We'll separate the shape's drawing data from its drawing method:

1. Generate the shape's drawing data: `state`
2. Execute the drawing method: `action`

The `Graphics` class, acting as the container for drawing various shapes, receives the `state` and `action`, and finally renders them to the page via the `render` method.

### 1. Circle

First, implement the drawing method on the `Graphics` class:

```ts
  /**
   * Draw a circle
   * @param x center X coordinate
   * @param y center Y coordinate
   * @param radius radius
   */
  public drawCircle = (x: number, y: number, radius: number): Graphics => {
    return this.drawShape(new Circle(x, y, radius));
  };
```

To implement the data needed to draw a circle, from the circle's equation, we know that drawing a circle only requires the center point and radius:

<r-math latex="(x - a)^{2} + (y - b)^{2} = r^{2}"></r-math>

So the implementation is:

```ts
export class Circle extends Shape {
  public x: number;
  public y: number;
  public radius: number;
  public readonly type = SHAPE_TYPE.CIRCLE;
  constructor(x = 0, y = 0, radius = 0) {
    super();
    this.x = x;
    this.y = y;
    this.radius = radius;
  }
}
```

Finally, the drawing method:

```ts
const circle = shape;
const { x, y, radius } = circle;
ctx.arc(x, y, radius, 0, 2 * Math.PI);
if (fillStyle.visible) {
  ctx.fill();
}
if (lineStyle.visible) {
  ctx.stroke();
}
```

### 2. Rectangle

The rectangle data implementation is:

```ts
export class Rectangle extends Shape {
  public x: number;
  public y: number;
  public width: number;
  public height: number;
  public type = SHAPE_TYPE.RECTANGLE;
  constructor(x = 0, y = 0, width = 0, height = 0) {
    super();
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }
}
```

The drawing method:

```ts
const rectangle = shape;
const { x, y, width, height } = rectangle;
if (fillStyle.visible) {
  ctx.fillRect(x, y, width, height);
}
if (lineStyle.visible) {
  ctx.strokeRect(x, y, width, height);
}
```

On the `Graphics` class, the method for adding data:

```ts
  /**
   * Draw a rectangle
   * @param x x coordinate
   * @param y y coordinate
   * @param width width
   * @param height height
   */
  public drawRect = (x: number, y: number, width: number, height: number): Graphics => {
    return this.drawShape(new Rectangle(x, y, width, height));
  };
```

### 3. Ellipse

How do we determine an ellipse? From the standard equation of an ellipse:

<r-math latex="\frac{x^2}{a^2} + \frac{y^2}{b^2} = 1"></r-math>

We only need to know the semi-major and semi-minor axes of the ellipse:

```ts
export class Ellipse extends Shape {
  public x: number;
  public y: number;
  public radiusX: number;
  public radiusY: number;
  public readonly type = SHAPE_TYPE.ELLIPSE;
  constructor(x = 0, y = 0, radiusX = 0, radiusY = 0) {
    super();
    this.x = x;
    this.y = y;
    this.radiusX = radiusX;
    this.radiusY = radiusY;
  }
}
```

Finally, the drawing method:

```ts
const ellipse = shape;
const { x, y, radiusX, radiusY } = ellipse;
ctx.ellipse(x, y, radiusX, radiusY, 0, 0, Math.PI * 2);
if (fillStyle.visible) {
  ctx.fill();
}
if (lineStyle.visible) {
  ctx.stroke();
}
```

### 4. Polygon

A polygon is composed of multiple points, so it's represented by a `points` array, where every `2` elements represent one point's coordinates.

The `closeStroke` property indicates whether the polygon is closed.

```ts
export class Polygon extends Shape {
  public points: number[] = [];
  public closeStroke = false;
  public type = SHAPE_TYPE.POLYGON;
  constructor(points: number[] = []) {
    super();
    this.points = points;
  }
}
```

The drawing method is as follows:

```ts
const polygon = shape;
const { points, closeStroke } = polygon;
ctx.moveTo(points[0], points[1]);
for (let i = 2; i < points.length; i += 2) {
  ctx.lineTo(points[i], points[i + 1]);
}
if (closeStroke) {
  ctx.closePath();
}
if (fillStyle.visible) {
  ctx.fill();
}
if (lineStyle.visible) {
  ctx.stroke();
}
```

### 5. Rounded Rectangle

Compared to a plain rectangle, a rounded rectangle needs one extra `radius` property:

```ts
export class RoundedRectangle extends Shape {
  public x: number;
  public y: number;
  public width: number;
  public height: number;
  public radius: number;
  public readonly type = SHAPE_TYPE.ROUNDED_RECTANGLE;
  constructor(x = 0, y = 0, width = 0, height = 0, radius = 20) {
    super();
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    const r = Math.min(width, height) / 2;
    this.radius = radius > r ? r : radius;
  }
}
```

When implementing the drawing method, we need to draw an arc at each of the four corners:

```ts
const roundedRectangle = shape;
const { x, y, width, height, radius } = roundedRectangle;
ctx.moveTo(x + radius, y);
ctx.arc(x + radius, y + radius, radius, Math.PI * 1.5, Math.PI, true);
ctx.lineTo(x, y + height - radius);
ctx.arc(x + radius, y + height - radius, radius, Math.PI, Math.PI / 2, true);
ctx.lineTo(x + width - radius, y + height);
ctx.arc(x + width - radius, y + height - radius, radius, Math.PI / 2, 0, true);
ctx.lineTo(x + width, y + radius);
ctx.arc(x + width - radius, y + radius, radius, 0, Math.PI * 1.5, true);
ctx.closePath();
if (fillStyle.visible) {
  ctx.fill();
}
if (lineStyle.visible) {
  ctx.stroke();
}
```

## Three: Layer Management

In a `canvas` drawing environment, shapes drawn earlier are covered by shapes drawn later, so layer management naturally follows from draw order. In this scheme, the shape drawn first sits at the bottom, and subsequent shapes are stacked on top of it, layer by layer, up to the topmost one.

So we need to consider two parts:

1. How to identify the current layer
2. How to draw shapes according to layer

First, the initial question: how to identify a layer.

### 1. Layer Identification

The layer property isn't implemented only on the `Container` class. `Container` represents the concept of a group, but in fact, any element node needs the concept of a layer — including the `Container` class itself.

So we need to implement a generic node class, `Vertex`, representing the most primitive concept of a "node." Every type of node that can be displayed on the `canvas` will inherit from this class. It's an abstract class — we never instantiate it directly.

This class carries the general-purpose properties shared by all "nodes," such as the parent element, layer, and whether the node is visible.

Meanwhile, the `Container` class inherits from `Vertex`, since a "group" is also considered a "node."

The `Vertex` class is implemented as follows:

```ts
class Vertex {
  protected _zIndex = 0; // The node's layer relationship
  public parent: Container | undefined = undefined; // The node's parent-child relationship
  public visible = true;
}
```

We also need to modify the `Container` class, adding a sort method based on `zIndex`, implemented as follows:

```ts
class Container extends Vertex {
  public readonly children: Container[] = [];
  public isSort: boolean = false; // true means the sort order needs to be updated
  public parent: Container | undefined = undefined;
  public addChild = (child: Container) => {
    child.parent?.removeChild(child);
    this.children.push(child);
    this.isSort = true;
    child.parent = this;
  };
  public removeChild = (child: Container) => {
    for (let i = 0; i < this.children.length; i++) {
      if (this.children[i] === child) {
        this.children.splice(i, 1);
        child.parent = undefined;
        return;
      }
    }
  };
  public sortChildren = (): void => {
    if (!this.isSort) return;
    this.children.sort((a, b) => a.zIndex - b.zIndex);
    this.isSort = false;
  };
}
```

### 2. Drawing Shapes by Layer

At this point, we've implemented basic shapes and group functionality, so next we'll render according to layer and nesting relationships, as in the following code:

```html
<body>
  <div id="app">
    <canvas id="hierarchy" width="500" height="500"></canvas>
  </div>
  <script type="module">
    import { Application, Graphics, Container } from './src/utils/visual/index.ts';
    const app = new Application({
      view: document.getElementById('hierarchy'),
    });

    const blackGraphic = new Graphics();
    blackGraphic.beginFill('black');
    blackGraphic.drawRect(0, 0, 300, 300);

    const redGraphic = new Graphics();
    redGraphic.beginFill('red');
    redGraphic.drawRect(0, 0, 200, 200);

    const container1 = new Container();
    container1.addChild(blackGraphic);
    container1.addChild(redGraphic);

    const container2 = new Container();
    container2.addChild(container1);

    const greenGraphic = new Graphics();
    greenGraphic.beginFill('green');
    greenGraphic.drawRect(150, 0, 180, 180);

    container2.addChild(greenGraphic);

    const yellowGraphic = new Graphics();
    // yellowGraphic.beginFill('yellow');
    yellowGraphic.lineStyle({ width: 30, color: 'yellow', cap: 'round', join: 'round' });
    yellowGraphic.drawRect(0, 0, 250, 150);

    const blueGraphic = new Graphics();
    blueGraphic.beginFill('blue');

    const grayGraphic = new Graphics();
    grayGraphic.beginFill('gray');

    app.stage.addChild(container2);
    app.stage.addChild(yellowGraphic);
    app.stage.addChild(blueGraphic);
    app.stage.addChild(grayGraphic);

    const path = new Graphics()
      .lineStyle(3, 'purple')
      .beginFill('pink', 0.6)
      .moveTo(100, 100)
      .lineTo(300, 100)
      .arc(300, 300, 200, Math.PI * 1.5, Math.PI * 2)
      .bezierCurveTo(500, 400, 600, 500, 700, 500)
      .lineTo(600, 300)
      .arcTo(700, 100, 800, 300, 150)
      .quadraticCurveTo(900, 100, 1100, 200)
      .closePath();

    app.stage.addChild(path);

    app.render();
  </script>
</body>
```

Based on the layer and nesting relationships, we get the following tree structure:

```
Application
├── yellowGraphic
├── container2
|   ├── greenGraphic
|   └── container1
|       ├── blackGraphic
|       └── redGraphic
├── blueGraphic
└── grayGraphic
```

As mentioned earlier, our rendering strategy is: child nodes render above their parent node (the parent is drawn first, then its children); among sibling nodes at the same level, the one with the larger zIndex sits higher; with the same zIndex, the order is determined by insertion order — nodes added later sit higher (drawn later).

In other words, the render order we expect looks like this:

```sh
Application --> container2 --> container1 --> blackGraphics --> redGraphics --> greenGraphics --> yellowGraphics --> blueGraphic --> grayGraphic
```

That is:

```
(1)Application
├── (7)yellowGraphic
├── (2)container2
|   ├── (6)greenGraphic
|   └── (3)container1
|       ├── (4)blackGraphic
|       └── (5)redGraphic
├── (8)blueGraphic
└── (9)grayGraphic
```

We can conclude that we need to perform a **pre-order traversal** of this object tree — that is, we process the root node first, then recursively process its children, until all nodes are processed and the recursion exits.

As we go deeper into this object tree, we also need to sort each node's children by `zIndex`.

```ts
/**
 * @description: Sort child elements by z-index
 * @return {*}
 */
public sortChildren = (): void => {
    if (!this.isSort) {
      return;
    }
    this.children.sort((a, b) => a.zIndex - b.zIndex);
    this.isSort = false;
};
/**
 * Recursively render the entire node tree rooted at this node
 */
public renderCanvasRecursive(render: CanvasRenderer) {
  if (!this.visible) return
  this.renderCanvas(render) // render itself first
  // render child nodes
  for (let i = 0; i < this.children.length; i++) {
    const child = this.children[i]
    child.renderCanvasRecursive(render)
  }
}
```

Given a nested structure, it's natural to wonder: what about circular nesting?

At this point, we realize that the rendering chain formed by layer and parent-child relationships isn't actually a tree — it's a graph, since any two nodes could potentially have a relationship.

So the problem becomes: how do we resolve cycles in a directed graph?

This is where we'd apply topological sorting on the directed graph. If a graph can be topologically sorted, it contains no cycles. Otherwise, we find the nodes involved in the cycle and surface a warning, to avoid memory leaks.

## Four: Transformation Matrix

Once group management, layer management, and basic shapes have all been implemented, we need to encapsulate some commonly used shape transformation methods — such as translation, rotation, and scaling.

Although `canvas`, for developer convenience, also provides methods like `ctx.rotate` and `ctx.scale`, these methods operate on the transformation matrix of the current `CanvasRenderingContext2D` object. These transforms affect every subsequent transform.

What we actually want is to be able to transform a group or a single shape, without affecting subsequent operations.

There are two ways to solve this problem. One is to call `ctx.resetTransform()` to reset the transformation matrix after every change — an imperative style. The other is to build an intuitive transformation matrix and apply transforms through matrix multiplication.

So, let's build a `Transform` class, adding rotation, translation, skew, and other transformation matrices.

> Unfortunately, no one can be told what the Matrix is. You have to see it for yourself. --Morpheus
> Unfortunately, no one can be told what the Matrix is. You have to see it for yourself. --Morpheus

Rotation and skew preserve the parallelism and equal spacing of the grid, and keep the origin fixed. So they're linear transformations, which can be implemented via left-multiplication of a matrix.

But because translation is an affine transformation, we need to raise the dimensionality, representing a lower-dimensional affine transformation as a linear transformation in a higher dimension. This lets us implement these transform operations through matrix multiplication.

The `Matrix` class will provide a variety of matrix operation functions (matrix multiplication, matrix inversion, etc.). Any combination of transforms will ultimately be converted into a `matrix`, making it convenient to call `canvas`'s drawing instructions.

The `Transform` class is similar to `CSS`'s `transform` — it offers a set of clearer, more intuitive transforms, without requiring direct use of matrix transforms. Of course, these transforms are ultimately converted into matrix transforms internally.

So for 2D shape transform operations, we need a 3x3 matrix. The `Matrix` class is therefore implemented as follows:

```ts
export class Matrix {
  public a: number; // x scale
  public b: number; // y skew
  public c: number; // x skew
  public d: number; //  y scale
  public tx: number; // x translation
  public ty: number; // y translation
  public array: Float32Array | null = null; // An array of the current matrix. Only populated when `toArray` is called
  constructor(a = 1, b = 0, c = 0, d = 1, tx = 0, ty = 0) {
    this.a = a;
    this.b = b;
    this.c = c;
    this.d = d;
    this.tx = tx;
    this.ty = ty;
  }
}
```

Rotation matrix:

<r-math latex="\begin{bmatrix} \cos \theta & -\sin \theta \\ \sin \theta & \cos \theta \end{bmatrix}"></r-math>

Given a 2D vector <r-math  style="display: inline-block;" latex="\vec{v} = \begin{bmatrix} x \\ y \end{bmatrix}"></r-math>, the rotated vector can be obtained via matrix multiplication:

<r-math latex="\vec{v}' = R(\theta) \vec{v} = \begin{bmatrix} \cos \theta & -\sin \theta \\ \sin \theta & \cos \theta \end{bmatrix} \begin{bmatrix} x \\ y \end{bmatrix}"></r-math>

The code implementation of the matrix multiplication is as follows:

```ts
public rotate = (angle: number): Matrix => {
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);

    const a1 = this.a;
    const c1 = this.c;
    const tx1 = this.tx;

    this.a = a1 * cos - this.b * sin;
    this.b = a1 * sin + this.b * cos;
    this.c = c1 * cos - this.d * sin;
    this.d = c1 * sin + this.d * cos;
    this.tx = tx1 * cos - this.ty * sin;
    this.ty = tx1 * sin + this.ty * cos;

    return this;
  };
```

Skew matrix:

<r-math latex="\left[ \begin{matrix} cos(y) & sin(x) \\ sin(y) & cos(x) \\ \end{matrix} \right]"></r-math>

Scale matrix:

<r-math latex="\begin{bmatrix} s_x & 0 \\ 0 & s_y \end{bmatrix}"></r-math>

Matrix multiplication:

<r-math latex="\begin{bmatrix} s_x & 0 \\ 0 & s_y \end{bmatrix} \begin{bmatrix} x \\ y \end{bmatrix} = \begin{bmatrix} s_x x \\ s_y y \end{bmatrix}"></r-math>

Code implementation:

```ts
  public scale = (x: number, y: number): Matrix => {
    this.a *= x;
    this.d *= y;
    this.c *= x;
    this.b *= y;
    this.tx *= x;
    this.ty *= y;

    return this;
  };
```

Translation matrix:

Code implementation:

```ts
  public translate = (x: number, y: number): Matrix => {
    this.tx += x;
    this.ty += y;

    return this;
  };
```

Finally, the combined transform implementation:

```ts
  public setTransform = (
    x: number,
    y: number,
    pivotX: number,
    pivotY: number,
    scaleX: number,
    scaleY: number,
    rotation: number,
    skewX: number,
    skewY: number,
  ): Matrix => {
    this.a = Math.cos(rotation + skewY) * scaleX;
    this.b = Math.sin(rotation + skewY) * scaleX;
    this.c = -Math.sin(rotation - skewX) * scaleY;
    this.d = Math.cos(rotation - skewX) * scaleY;

    this.tx = x - (pivotX * this.a + pivotY * this.c);
    this.ty = y - (pivotX * this.b + pivotY * this.d);

    return this;
  };
```

## Five: Event System

Since we've already implemented the concepts of groups and nodes, we simply need the node class to inherit from a publish-subscribe class.

At the same time, we listen for various events on the canvas and dispatch them accordingly:

```ts
this.canvasEle.addEventListener('pointermove', this.onPointerMove, true);
this.canvasEle.addEventListener('pointerleave', this.onPointerLeave, true);
this.canvasEle.addEventListener('pointerdown', this.onPointerDown, true);
this.canvasEle.addEventListener('pointerup', this.onPointerup, true);
```

The core challenge next is: how do we determine which element was clicked?

### 1. Hit Testing

For complex polygons, the ray-casting method can be used for hit testing. For regular shapes, the ray-casting method isn't needed — for a circle, for instance, hit testing is simply a matter of checking whether the distance from the point being tested to the center is less than the circle's radius.

#### (1) Ray-casting method:

Maintain a counter `count`, initialized to `0`. Cast a ray from the point being tested; each time this ray crosses an edge of the closed shape, increment `count` by `1`. If `count` ends up odd, the point is inside the closed shape; if even, the point is outside it.

Determining whether a ray intersects a curved segment is relatively hard, but determining whether a ray intersects a straight line segment is much simpler. So, apart from a few regular curved shapes (full circles, ellipses), other irregular curved shapes are all approximated with straight-edged polygons.

So, the ray-casting method really only needs to handle the straight-edged polygon case, as follows:

The specific approach is: use a `for` loop to check each edge of the straight-edged polygon; if it intersects, increment `count` by 1; once the loop finishes, we have the final `count`.

#### (2) How to determine whether a ray intersects a segment

We cast a horizontal ray extending infinitely to the right from the point being tested.

First, we can rule out some cases that definitely don't intersect:

1. The segment is above the ray

2. The segment is below the ray

3. Both endpoints of the segment are to the left of the point being tested

After ruling out these `3` cases that definitely don't intersect, there's one case that definitely does intersect: both endpoints of the segment are to the right of the point being tested.

Finally, there's one remaining case: one endpoint of the segment is to the left of the point being tested, and the other is to the right. In this case, the segment may or may not intersect the ray:

In this case, we compute the x-coordinate of the intersection point between the line containing the ray and the segment, then check whether that x-coordinate is greater than the x-coordinate of the point being tested. If so, the ray intersects the segment; otherwise, it doesn't.

There's also an edge case where the ray coincides exactly with the polygon's edge. (We won't consider this — it exists in theory but not in practice.)

Determining whether a segment intersects the ray:

```ts
private isIntersect(
  px: number,
  py: number,
  p1x: number,
  p1y: number,
  p2x: number,
  p2y: number
) {
  // The segment is above the ray
  if (p1y > py && p2y > py) {
    return false
  }

  // The segment is below the ray
  if (p1y < py && p2y < py) {
    return false
  }

  // Both endpoints of the segment are to the left of the point being tested
  if (p1x < px && p2x < px) {
    return false
  }

  // Both endpoints of the segment are to the right of the point being tested
  if (p1x > px && p2x > px) {
    return true
  }
  const p2o = p1y - p2y
  const p1o = p2x - p1x
  const p2q = py - p2y
  const x = p2x - (p1o / p2o) * p2q
  if (x > px) {
    return true
  } else {
    return false
  }
}

```

So, putting the above method together, we can determine whether the point being tested is inside a polygon:

```ts
public contains(p: Point): boolean {
  const len = this.points.length
  let count = 0

  // Every two elements of the points array represent one vertex's coordinates
  for (let i = 2; i <= len - 2; i += 2) {
    const p1x = this.points[i - 2]
    const p1y = this.points[i - 1]
    const p2x = this.points[i]
    const p2y = this.points[i + 1]
    if (this.isIntersect(p.x, p.y, p1x, p1y, p2x, p2y)) {
      count++
    }
  }

  // We also need to check whether the line connecting the last and first points intersects the ray
  const p1x = this.points[0]
  const p1y = this.points[1]
  const p2x = this.points[len - 2]
  const p2y = this.points[len - 1]
  if (this.isIntersect(p.x, p.y, p1x, p1y, p2x, p2y)) {
    count++
  }

  if (count % 2 === 0) {
    return false
  } else {
    return true
  }
}

```

With this, hit testing for polygons is implemented.

#### (3) Hit testing for all remaining shape types

##### Circle

As long as the distance from the point being tested to the center is less than the radius, we consider the point to be inside the closed shape.

```ts
public contains(p: Point): boolean {
  if (
    (p.x - this.x) * (p.x - this.x) + (p.y - this.y) * (p.y - this.y) < this.radius * this.radius
  ) {
    return true
  } else {
    return false
  }
}
```

##### Rectangle

```ts
public contains(p: Point): boolean {
  if (
    p.x > this.x &&
    p.x < this.x + this.width &&
    p.y > this.y &&
    p.y < this.y + this.height
  ) {
    return true
  } else {
    return false
  }
}
```

##### Ellipse

The equation of an ellipse is:

<r-math latex="\frac{x^2}{a^2} + \frac{y^2}{b^2} = 1"></r-math>

So as long as <r-math  style="display: inline-block;" latex="\frac{x^2}{a^2} + \frac{y^2}{b^2} < 1"></r-math>, we consider the point being tested to fall inside the ellipse.

```ts
public contains(p: Point): boolean {
  if (
    ((p.x - this.x) * (p.x - this.x)) / (this.radiusX * this.radiusX) +
      ((p.y - this.y) * (p.y - this.y)) / (this.radiusY * this.radiusY) <
    1
  ) {
    return true
  } else {
    return false
  }
}
```

##### Rounded Rectangle

```ts
public contains(p: Point): boolean {
  const con1 =
    p.x > this.x &&
    p.x < this.x + this.width &&
    p.y > this.y &&
    p.y < this.y + this.height
  if (!con1) {
    return false
  }

  // Check the top-left corner
  const c1x = this.x + this.radius
  const c1y = this.y + this.radius
  if (p.x < c1x && p.y < c1y) {
    if (
      (p.x - c1x) * (p.x - c1x) + (p.y - c1y) * (p.y - c1y) <
      this.radius * this.radius
    ) {
      return true
    } else {
      return false
    }
  }

  // Check the bottom-left corner
  const c2x = this.x + this.radius
  const c2y = this.y + this.height - this.radius
  if (p.x < c2x && p.y > c2y) {
    if (
      (p.x - c2x) * (p.x - c2x) + (p.y - c2y) * (p.y - c2y) <
      this.radius * this.radius
    ) {
      return true
    } else {
      return false
    }
  }

  // Check the top-right corner
  const c3x = this.x + this.width - this.radius
  const c3y = this.y + this.radius
  if (p.x > c3x && p.y < c3y) {
    if (
      (p.x - c3x) * (p.x - c3x) + (p.y - c3y) * (p.y - c3y) <
      this.radius * this.radius
    ) {
      return true
    } else {
      return false
    }
  }

  // Check the bottom-right corner
  const c4x = this.x + this.width - this.radius
  const c4y = this.y + this.height - this.radius
  if (p.x > c4x && p.y < c4y) {
    if (
      (p.x - c4x) * (p.x - c4x) + (p.y - c4y) * (p.y - c4y) <
      this.radius * this.radius
    ) {
      return true
    } else {
      return false
    }
  }

  return true
}

```

#### (4) Hit testing that incorporates layer relationships

After the rendering engine gets this object tree with layer relationships (rooted at `stage`), it renders the tree via pre-order traversal, meaning parent nodes are always rendered before their children, while sibling nodes at the same level are sorted by `zIndex` — siblings with a larger `zIndex` are rendered later, and siblings with the same `zIndex` are rendered in array order. This is the core of the layer relationship.

For hit testing, we also need to traverse this object tree, just in a different order.

For the hit-testing traversal order, there's only one principle: whichever node is higher in the layer hierarchy gets tested first (this is also why we can use a pixel-marking approach for hit testing). This is the reverse of the render order. It's actually quite intuitive: imagine a stack of papers on a desk forming a layered hierarchy, then dropping a single drop of ink somewhere over that stack — the ink will inevitably land on whichever sheet is on top.

We can conclude: we perform a post-order traversal of this object tree — the element rendered later gets hit-tested earlier.

```ts
let hasFoundTarget = false;
let hitTarget: Container | null = null;

const hitTestRecursive = (curTarget: Container, globalPos: Point) => {
  // If the object isn't visible
  if (!curTarget.visible) {
    return;
  }

  if (hasFoundTarget) {
    return;
  }

  // Depth-first traversal of child elements
  for (let i = curTarget.children.length - 1; i >= 0; i--) {
    const child = curTarget.children[i];
    hitTestRecursive(child, globalPos);
  }

  if (hasFoundTarget) {
    return;
  }

  // Finally, check the node itself
  const p = curTarget.worldTransform.applyInverse(globalPos);
  if (curTarget.containsPoint(p)) {
    hitTarget = curTarget;
    hasFoundTarget = true;
  }
};

const hitTest = (root: Container, globalPos: Point) => {
  hasFoundTarget = false;
  hitTarget = null;

  hitTestRecursive(root, globalPos);

  return hitTarget;
};
```

There's still one more problem left: hit testing along the edge of a curve.

### 2. Bézier Curves

We've already implemented hit testing for polygons and various shapes above, but curves can't be computed the same way. So we need to approximate Bézier curves with polygons.

That way, hit testing for curves can be reduced to hit testing for polygons, which can then be solved directly using the method above.

### (1) Quadratic Bézier Curve

<r-math latex="B(t) = (1-t)^2 \mathbf{P_0} + 2t(1-t) \mathbf{P_1} + t^2 \mathbf{P_2}, \quad t \in [0, 1]"></r-math>

Start point (P0): this is where the curve begins. During drawing, the curve passes through this point exactly.
Control point (P1): this point controls the curve's shape and curvature. It doesn't necessarily lie on the curve itself, but it strongly influences the curve's direction. Adjusting the control point's position changes how much the curve bends and in which direction.
End point (P2): this is where the curve ends. Likewise, the curve passes through this point exactly.

First, we need to sample a series of points along the Bézier curve.

A Bézier curve is a parametric equation for <r-math  style="display: inline-block;" latex="x"></r-math> and <r-math  style="display: inline-block;" latex="y"></r-math> in terms of <r-math  style="display: inline-block;" latex="t"></r-math>, where <r-math  style="display: inline-block;" latex="t\in[0,1]"></r-math>. To sample multiple points along the curve, we can divide the interval <r-math  style="display: inline-block;" latex="[0,1]"></r-math> into n parts, giving us n values of t. Plugging these t values into the curve's parametric equation gives us n points on the curve. Connecting these points gives us an approximation of the Bézier curve.

So we need to compute the length of the Bézier curve, and then determine how many sample points are needed based on that length.

How do we find the length of the curve? Using a definite integral.

First, let's write out the equations for the Bézier curve in terms of <r-math  style="display: inline-block;" latex="x"></r-math> and <r-math  style="display: inline-block;" latex="y"></r-math>:

<r-math latex="\begin{cases} x=(1-t)^2\times P_0x + 2t(1-t) \times P_1x + t^2 \times P_2x \\ y=(1-t)^2\times P_0y + 2t(1-t) \times P_1y + t^2 \times P_2y \end{cases}"></r-math>

Take, for example, a Bézier curve with start point <r-math  style="display: inline-block;" latex="P_0=(1,1)"></r-math>, control point <r-math  style="display: inline-block;" latex="P_1=(1,2)"></r-math>, and end point <r-math  style="display: inline-block;" latex="P_2=(2,2)"></r-math>. Its graph looks like this:

<img></img>

Suppose we want to find the arc length of this curve for <r-math  style="display: inline-block;" latex="t\in[0,1]"></r-math> (i.e., the total length of the whole Bézier curve).

The quantity we're after is the total length of the entire Bézier curve. As is customary, we first zoom way into the graph, then take an infinitesimally small segment:

<img></img>

The length <r-math  style="display: inline-block;" latex="L"></r-math> of this red segment is the small piece we're after. <r-math  style="display: inline-block;" latex="dx"></r-math> is the length of this segment along the <r-math  style="display: inline-block;" latex="x"></r-math> axis, and <r-math  style="display: inline-block;" latex="dy"></r-math> is its length along the <r-math  style="display: inline-block;" latex="y"></r-math> axis. As <r-math  style="display: inline-block;" latex="dx"></r-math> and <r-math  style="display: inline-block;" latex="dy"></r-math> approach zero, the red segment can be treated as a straight line, so we can still apply the Pythagorean theorem to get <r-math  style="display: inline-block;" latex="L=\sqrt{(dx)^2+(dy)^2}"></r-math>​. But we're not done yet — we need to integrate with respect to <r-math  style="display: inline-block;" latex="t"></r-math>, not with respect to <r-math  style="display: inline-block;" latex="x"></r-math> and <r-math  style="display: inline-block;" latex="y"></r-math>, so we still need expressions for <r-math  style="display: inline-block;" latex="dx"></r-math> and <r-math  style="display: inline-block;" latex="dy"></r-math> in terms of <r-math  style="display: inline-block;" latex="dt"></r-math>. Since the form of the function relating <r-math  style="display: inline-block;" latex="dx"></r-math> to <r-math  style="display: inline-block;" latex="dt"></r-math> is the same as the one relating <r-math  style="display: inline-block;" latex="dy"></r-math> to <r-math  style="display: inline-block;" latex="dt"></r-math>, we only need to derive the expression for <r-math  style="display: inline-block;" latex="dx"></r-math> in terms of <r-math  style="display: inline-block;" latex="dt"></r-math> in order to also get the expression for <r-math  style="display: inline-block;" latex="dy"></r-math> in terms of <r-math  style="display: inline-block;" latex="dt"></r-math>.

<r-math  style="display: inline-block;" latex="dx"></r-math> is the change in <r-math  style="display: inline-block;" latex="x"></r-math> — that is, when the function of x with respect to <r-math  style="display: inline-block;" latex="t"></r-math>, evaluated at <r-math  style="display: inline-block;" latex="t"></r-math>, changes by <r-math  style="display: inline-block;" latex="dt"></r-math> (as <r-math  style="display: inline-block;" latex="dt"></r-math> approaches zero), this is the resulting change in <r-math  style="display: inline-block;" latex="x"></r-math>. As follows:

<img>

<r-math  style="display: inline-block;" latex="dt"></r-math> is an infinitesimal quantity. At this point, we can obtain <r-math  style="display: inline-block;" latex="\frac{dx}{dt}=x_0'"></r-math>​ via the derivative (i.e., the slope), where <r-math  style="display: inline-block;" latex="x_0'"></r-math>​ is the derivative of the function of <r-math  style="display: inline-block;" latex="x"></r-math> with respect to <r-math  style="display: inline-block;" latex="t"></r-math> at <r-math  style="display: inline-block;" latex="t=t_0"></r-math>​. Multiplying both sides by <r-math  style="display: inline-block;" latex="dt"></r-math>, we get: <r-math style="display: inline-block;" latex="dx=x_0' \times dt"></r-math>. Using the same approach, we get: <r-math  style="display: inline-block;" latex="dy=y_0' \times dt"></r-math>. So the small piece we're after is <r-math style="display: inline-block;" latex="L=\sqrt{(dx)^2+(dy)^2}=\sqrt{(x_0' \times dt)^2+(y_0' \times dt)^2}=\sqrt{(x_0')^2+(y_0')^2} \times dt"></r-math>, so our integral expression is: <r-math style="display: inline-block;" latex="\int_0^1\sqrt{(x')^2+(y')^2}dt"></r-math>. Next, we need to find the indefinite integral of the function <r-math style="display: inline-block;" latex="\sqrt{(x')^2+(y')^2}"></r-math>​.

From the Bézier curve's parametric equation, we have:

<r-math latex="\begin{cases} x'=2(P_0x-2P_1x+P_2x)t-2(P_0x-P_1x) \\ y'=2(P_0y-2P_1y+P_2y)t-2(P_0y-P_1y) \end{cases}"></r-math>

To simplify this formula, we group some constants together and replace them with other constants. Let <r-math  style="display: inline-block;" latex="a_x=2(P_0x-2P_1x+P_2x)"></r-math>, <r-math  style="display: inline-block;" latex="b_x=-2(P_0x-P_1x)"></r-math>, <r-math  style="display: inline-block;" latex="a_y=2(P_0y-2P_1y+P_2y)"></r-math>, <r-math  style="display: inline-block;" latex="b_y=-2(P_0y-P_1y)"></r-math>, so:

<r-math latex="\begin{cases} x'=a_xt+b_x \\ y'=a_yt+b_y \end{cases}"></r-math>

So <r-math  style="display: inline-block;" latex="\sqrt{(x')^2+(y')^2}=\sqrt{(a_x^2+a_y^2)t^2+2(a_xb_x+a_yb_y)t+b_x^2+b_y^2}"></r-math>. To simplify this expression further, we again group constants together and replace them with new constants. Let <r-math  style="display: inline-block;" latex="A=a_x^2+a_y^2"></r-math>, <r-math  style="display: inline-block;" latex="B=2(a_xb_x+a_yb_y)"></r-math>, <r-math  style="display: inline-block;" latex="C=b_x^2+b_y^2"></r-math>, so:

<r-math latex="\sqrt{(x')^2+(y')^2}=\sqrt{At^2+Bt+C}"></r-math>

Next, we'll again use substitution to solve this indefinite integral. We'll reduce it via substitution to the form <r-math  style="display: inline-block;" latex="\int\sqrt{x^2+a^2}dx"></r-math>, then apply the standard formula to get the result.

First, <r-math  style="display: inline-block;" latex="At^2+Bt+C"></r-math> is a sum of two squared terms (<r-math  style="display: inline-block;" latex="(x')^2"></r-math> and <r-math  style="display: inline-block;" latex="(y')^2"></r-math>), so <r-math  style="display: inline-block;" latex="At^2+Bt+C>=0"></r-math>. Based on the criterion for the number of solutions of a quadratic equation, we have <r-math  style="display: inline-block;" latex="B^2-4AC<=0"></r-math>.

Now let's perform the substitution:

<r-math style="--ran-math-justify-content: flex-start;" latex="\int\sqrt{At^2+Bt+C}dt"></r-math>

<r-math style="--ran-math-justify-content: flex-start;" latex="=\int\frac{1}{\sqrt{A}}\times{\sqrt{A}}\times\sqrt{At^2+Bt+C}dt"></r-math>

<r-math style="--ran-math-justify-content: flex-start;" latex="=\int\frac{1}{\sqrt{A}}\times\sqrt{(At+\frac{B}{2})^2+(\sqrt{\frac{4AC-B^2}{4}})^2}dt"></r-math>

<r-math style="--ran-math-justify-content: flex-start;" latex="=\int\frac{1}{\sqrt{A}}\times\sqrt{(At+\frac{B}{2})^2+(\sqrt{\frac{4AC-B^2}{4}})^2}\times \frac{1}{A} \times d(At+\frac{B}{2})"></r-math>

<r-math style="--ran-math-justify-content: flex-start;" latex="=\frac{1}{A\sqrt{A}}\times\int\sqrt{(At+\frac{B}{2})^2+(\sqrt{\frac{4AC-B^2}{4}})^2} \times d(At+\frac{B}{2})"></r-math>

Let <r-math  style="display: inline-block;" latex="u=At+\frac{B}{2}"></r-math>, <r-math  style="display: inline-block;" latex="a=\sqrt{\frac{4AC-B^2}{4}}"></r-math>, and we get the form <r-math  style="display: inline-block;" latex="\int\sqrt{x^2+a^2}dx"></r-math>, i.e., <r-math  style="display: inline-block;" latex="\frac{1}{A\sqrt{A}}\int\sqrt{u^2+a^2}du"></r-math>. At this point, the integration variable changes from <r-math  style="display: inline-block;" latex="t"></r-math> to <r-math  style="display: inline-block;" latex="u"></r-math>. Since the integration interval for <r-math  style="display: inline-block;" latex="t"></r-math> is <r-math  style="display: inline-block;" latex="t\in[0,1]"></r-math> and <r-math  style="display: inline-block;" latex="u=At+\frac{B}{2}"></r-math>, the integration interval for <r-math  style="display: inline-block;" latex="u"></r-math> becomes <r-math  style="display: inline-block;" latex="u\in[\frac{B}{2},A+\frac{B}{2}]"></r-math>, so we get:

<r-math style="--ran-math-justify-content: flex-start;" latex="\int_0^1\sqrt{(x')^2+(y')^2}dt"></r-math>

<r-math style="--ran-math-justify-content: flex-start;" latex="= \int_0^1\sqrt{At^2+Bt+C}dt"></r-math>

<r-math style="--ran-math-justify-content: flex-start;" latex="= \frac{1}{A\sqrt{A}}\int_{\frac{B}{2}}^{A+\frac{B}{2}}\sqrt{u^2+a^2}du"></r-math>

<r-math style="--ran-math-justify-content: flex-start;" latex="= \frac{1}{A\sqrt{A}}\times\bigg[\frac{A+\frac{B}{2}}{2}\sqrt{(A+\frac{B}{2})^2+a^2}+\frac{a^2}{2}\ln\bigg\lvert A+\frac{B}{2}+\sqrt{(A+\frac{B}{2})^2+a^2}\bigg\rvert - \bigg(\frac{B}{4}\sqrt{\frac{B^4}{4}+a^2}+\frac{a^2}{2}\ln\bigg\lvert \frac{B}{2}+\sqrt{\frac{B^2}{4}+a^2}\bigg\rvert\bigg)\bigg]"></r-math>

Next, we plug in each constant. The result is approximately <r-math  style="display: inline-block;" latex="\approx1.6232"></r-math>.

#### Code Implementation:

```ts
export const getQuadraticBezierLength = (
  P0X: number,
  P0Y: number,
  P1X: number,
  P1Y: number,
  P2X: number,
  P2Y: number,
) => {
  const ax = 2 * (P0X - 2 * P1X + P2X);
  const bx = -2 * (P0X - P1X);
  const ay = 2 * (P0Y - 2 * P1Y + P2Y);
  const by = -2 * (P0Y - P1Y);

  const A = ax * ax + ay * ay;
  const B = 2 * (ax * bx + ay * by);
  const C = bx * bx + by * by;

  const a = Math.sqrt((4 * A * C - B * B) / 4);

  // Newton-Leibniz formula
  const F1 =
    (A / 2 + B / 4) * Math.sqrt((A + B / 2) * (A + B / 2) + a * a) +
    ((a * a) / 2) * Math.log(Math.abs(A + B / 2 + Math.sqrt((A + B / 2) * (A + B / 2) + a * a)));

  const F0 =
    (B / 4) * Math.sqrt((B * B) / 4 + a * a) + ((a * a) / 2) * Math.log(B / 2 + Math.sqrt((B * B) / 4 + a * a));

  const length = (1 / (Math.sqrt(A) * A)) * (F1 - F0); // Don't forget the leading factor of (1 over A times sqrt(A))

  return length;
};
```

The formula is long, but the code is much shorter.

Sample multiple points, then connect them into a straight-edged polygon that approximates a quadratic Bézier curve:

```ts
public quadraticCurveTo(cpX: number, cpY: number, toX: number, toY: number) {
  const len = this.currentPath.points.length

  if (len === 0) {
    this.currentPath.points = [0, 0]
  }

  const P0X = this.currentPath.points[len - 2]
  const P0Y = this.currentPath.points[len - 1]
  const P1X = cpX
  const P1Y = cpY
  const P2X = toX
  const P2Y = toY

  // Compute the length of this quadratic Bézier curve
  const curveLength = getQuadraticBezierLength(P0X, P0Y, P1X, P1Y, P2X, P2Y)

  let segmentsCount = Math.ceil(curveLength / 10) // Sample once every 10 pixels

  // Maximum of 2048 segments
  if (segmentsCount > 2048) {
    segmentsCount = 2048
  }

  // Minimum of 8 segments
  if (segmentsCount < 8) {
    segmentsCount = 8
  }

  // Compute the coordinates of each sample point and push them into the points array
  for (let i = 1; i <= segmentsCount; i++) {
    const t = i / segmentsCount

    // Apply the quadratic Bézier curve formula directly
    const x = (1 - t) * (1 - t) * P0X + 2 * t * (1 - t) * P1X + t * t * P2X
    const y = (1 - t) * (1 - t) * P0Y + 2 * t * (1 - t) * P1Y + t * t * P2Y

    this.currentPath.points.push(x, y)
  }

  return this
}

```

# References:

1. [How to explain "affine transformation" in plain terms?](https://www.zhihu.com/question/20666664/answer/157400568)
2. [Understanding affine transformations and their transformation matrices](https://www.cnblogs.com/shine-lee/p/10950963.html)
3. [A deep dive into Bézier curves](https://juejin.cn/post/6844903666361565191)
4. [How to understand and apply Bézier curves](https://juejin.cn/post/6844903796582121485)
