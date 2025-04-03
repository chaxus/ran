# 可视化渲染引擎

## 零：系统设计

在系统设计的过程中，需要明确**使用场景**，**约束条件**，**边界情况**。描述出最主要实现的功能，将这些功能进行高层级的设计，分类，链接。

有了具体要实现的功能模块后，我们就再根据功能模块，深入细节，讨论具体的实现。

功能实现后，通过可扩展的设计原则，将这些重要的功能进行链接。

最后是一些业务场景的具体实现。

因此，对于可视化绘制引擎，需要考虑以下几个方面：

1. **组的管理：** 将多个图形元素组织成一个整体（即“组”）。这样的设计使得对组进行整体移动、缩放或变形时，组内所有元素都能响应，简化了复杂场景下的操作和管理。
2. **基础图形封装：** 构建丰富的基础图形类库，提供便捷的 `API` 来绘制常见的几何形状，如矩形、圆形、多边形、曲线等。这些基础图形应支持自定义样式和属性，以满足多样化的设计需求。
3. **层级管理：** 对于 `2D` 图形来说，必然需要层级关系的处理，定义元素之间的堆叠顺序，如确保文字总是绘制在图表的上方。层级管理将确保视觉呈现符合预期。
4. **变换矩阵：** 对一个图形组执行平移、旋转、缩放等变形操作，从而以动态和灵活的方式调整图形的展示效果。为了实现这些变形操作，变形操作类通常会采用矩阵变换的原理。通过维护一个变换矩阵，并在绘制图形组之前应用该矩阵，可以一次性完成所有变形操作的计算，提高绘制效率。
5. **事件系统：** 允许用户将事件监听器绑定到单个图形元素或整个组上。实现用户交互（如点击、拖动）。
6. **扩展设计：** 明确整个渲染过程的生命周期，并且允许开发者在对应的生命周期中插入自定义的代码，从而实现对渲染流程，事件处理，资源控制等方面的控制。
7. **应用层封装：** 实现条形图，折线图，饼图，桑基图等应用层图形，满足业务和产品的多样化需求。

首先我们实现第一个，组的管理：

## 一：组的管理：

为了进行图形组的管理，会继续实现一个容器类 `Container`，这个类代表了‘组’的概念，它提供了添加子元素，移除子元素等的方法；后续要被渲染的一些类 (如 `Graphics`，`Text`，`Sprite` 等) 都会继承于这个类；这个类本身不会被渲染 (因为它只是一个‘组’，它本身没有内容可以渲染)。

属性：

- `children`: 表示所有的子元素
- `isSort`: 添加或者删除元素后，需要表示，当前组需要更新
- `parent`: 表示当前组的父节点

方法：

- `addChild`: 添加子元素
- `removeChild`: 移除子元素

因此，实现如下：

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

有了`组`的概念后，就很自然思考：最初的`组`是什么？要怎么去创建？我们需要一个`入口`。

我们会实现`Application`类，它表示整个可视化引擎。初始化的时候，会自动创建一个根组，作为一切待渲染元素的祖先元素。

```ts
export class Application {
  public readonly stage: Container; // stage 是一切待渲染元素的祖先元素。
  public readonly view: HTMLCanvasElement; // canvas 元素

  constructor(options: IApplicationOptions) {
    const { view = document.createElement('canvas') } = options;
    this.view = view;
    // 创建一个根容器
    this.stage = new Container();
  }
}
```

有了根组后，就可以从根开始，进行遍历，继而渲染所有图形。因此我们需要实现一个`render`方法。

在这里我们需要思考下渲染的模式：

- 在传统 `web` 开发的过程中，我们需要去维护 `UI` 的状态。根据状态变量的改变，添加回调监听，从而去更新 `UI`。这就是 [Model–view–viewmodel](https://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93viewmodel)。
- 另一种渲染模式则更常见于游戏领域。`UI` 会在每一帧都进行重新渲染，不保存状态和数据，就没有 `UI diff`，双向绑定，回调更新等过程。这就是[Immediate Mode GUI ](<https://en.wikipedia.org/wiki/Immediate_mode_(computer_graphics)>)。

我们会按照这两种渲染模式，实现一个`start`方法和`render`方法，。

在渲染前，还需要考虑扩展性，虽然目前只用到`canvas`进行渲染，但要很显然要保留`webGL`，`webGPU`渲染能力的扩展接口。

因此设计一个`getRenderer`方法，用来抉择。根据传入的`prefer`，指定渲染方式。根据[接口分离原则](https://chaxus.github.io/ran/cn/src/article/designMode.html)每一种渲染方法都是一个独立的类。

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

`CanvasRenderer`实现就非常简单，只有一个`render`方法，从根`container`开始，递归渲染所有的元素：

```ts
export class CanvasRenderer extends Renderer {
  public ctx: CanvasRenderingContext2D;
  constructor(options: IApplicationOptions) {
    super(options);
    console.log('正在使用 %c canvas2D ', 'color: #05aa6d; background-color: #ffffff;font-size: 20px;', '渲染');
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

最后是`start`方法和`render`方法的实现：

```ts
export class Application {
  private readonly renderer: Renderer;
  private animationFrameId: number | undefined;
  public readonly stage: Container; // stage 是一切待渲染元素的祖先元素。
  public readonly view: HTMLCanvasElement;
  constructor(options: IApplicationOptions) {
    const { view = document.createElement('canvas') } = options;
    this.view = view;
    // 根据参数，判断是用什么渲染模式
    this.renderer = getRenderer({ ...options, view });
    // 创建一个根容器
    this.stage = new Container();
  }

  public render(): void {
    this.renderer.render(this.stage);
  }
  // 立即渲染模式
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

有了组的管理和`application`类，便可以在此之上进行基础图形的实现。后续的基础图形也会继承`Container`类，方便进行基础图形的组合和嵌套。

下一章实现后，就可以实例化`application`，然后在页面上`render`各种图形了。

## 二：基础图形的封装

在多数二维绘图业务场景中，复杂图形往往可以简化为基础图形的组合。核心的基础元素包括圆形、多边形以及贝塞尔曲线，它们是实现图形构建的基本单位。

此外，还有一些常用的基础图形，如矩形、圆角矩形和椭圆。我们将这些统称为“基础图形库”，通过它们的灵活组合，能够轻松构建出满足各种需求的二维场景。

首先我们定一个`Graphics`类，继承自 `Container` 类，表示绘制各种图形的容器。

```ts
class Graphics extends Container {}
```

绘制的过程中，我们需要考虑是**填充**还是**描边**图形。因此，需要定义两个属性：

`lineStyle`和`fillStyle`，用来表示 `line` 的属性，和 `fill` 的属性。

因此我们将`Graphics`类继续细分：

- 一个是：`GraphicsData`,用于保存基础图形的数据和是描边的还是填充的。
- 另一个是：`GraphicsGeometry`,表示通用的基础图形，用于一些通用的基础图形操作，比如保存图形数据

`GraphicsData`类的实现如下：

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

其中`lineStyle`和`fillStyle`也通过实现各自的类进行实例话而成：

`line` 的属性有：`color`,`alpha`,`visible`,`width`,[cap](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/lineCap),[join](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/lineJoin),[miterLimit](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/miterLimit)

`fill`的属性有：`color`,`alpha`,`visible`

我们可以用两个类去描述这些数据，其中的`Fill` 类是：

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

`Line` 继承 `Fill` 类：

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

`GraphicsGeometry`类上会提供一个`drawShape`方法，用于添加通过`GraphicsData`实例化的图形数据。

```ts
  public drawShape(shape: Shape, fillStyle: Fill, lineStyle: Line): void {
    const data = new GraphicsData(shape, fillStyle, lineStyle);
    this.graphicsData.push(data);
  }
```

因此，`Graphics`类的属性如下：

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

还需要增加一些画线的方法和填充的方法：

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
  // 如果要填充图形，则需要先调用这个函数给画笔设置填充色
  public beginFill(color = '#000000', alpha = 1): Graphics {
    this._fillStyle.color = color;
    this._fillStyle.alpha = alpha;
    if (this._fillStyle.alpha > 0) {
      this._fillStyle.visible = true;
    }
    return this;
  }
  /**
   * 结束填充模式
   */
  public endFill = (): Graphics => {
    this.startPoly();
    this._fillStyle.reset();
    return this;
  };
}
```

表示该图形是填充还是描边的。

接下来是绘制各种基础图形了，我们会将图形的绘制数据和绘制方法进行分离

1. 生成绘制图形的数据：`state`
2. 执行绘制图形的方法：`action`

`Graphics` 类作为绘制各种图形的容器，会接收`state`和`action`，最后通过`render`方法绘制到页面上。

### 1.圆

首先在 `Graphics` 类上实现绘制方法：

```ts
  /**
   * 画圆
   * @param x 圆心 X 坐标
   * @param y 圆心 Y 坐标
   * @param radius 半径
   */
  public drawCircle = (x: number, y: number, radius: number): Graphics => {
    return this.drawShape(new Circle(x, y, radius));
  };
```

实现绘制一个圆锁需要的数据，由圆的数据公式可知，绘制一个圆只需要知道圆点，半径即可：

<r-math latex="(x - a)^{2} + (y - b)^{2} = r^{2}"></r-math>

因此实现如下：

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

最后是绘制的方法：

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

### 2.矩形

矩形数据的实现是：

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

绘制方法：

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

在`Graphics`类上，添加数据的方法：

```ts
  /**
   * 画矩形
   * @param x x 坐标
   * @param y y 坐标
   * @param width 宽度
   * @param height 高度
   */
  public drawRect = (x: number, y: number, width: number, height: number): Graphics => {
    return this.drawShape(new Rectangle(x, y, width, height));
  };
```

### 3.椭圆

如何确定一个椭圆呢，由椭圆的标准方程可知：

<r-math latex="\frac{x^2}{a^2} + \frac{y^2}{b^2} = 1"></r-math>

我们只要知道椭圆的长轴和短轴即可：

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

最后是绘制的方法：

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

### 4.多边形

多边形由多个点构成，因此，用一个 `points` 数组表示，每 `2` 个元素代表一个点的坐标

用`closeStroke`属性表示该多边形是否闭合

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

绘制方法如下：

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

### 5.圆角矩形

圆角矩形的实现相比起矩形，需要多一个`radius`属性：

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

实现绘制方法时，需要在四个角绘制圆弧

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

## 三：层级管理

在 `canvas` 绘图环境中，先绘制的图形会被后绘制的图形所覆盖，因此，层级的管理就自然地通过绘制顺序来实现。在这种情况下，最先被绘制的图形将位于最底层，而随后绘制的图形则逐层叠加，直至最上层。

因此，我们需要考虑两个部分：

1. 如何标识当前层级
2. 如何根据层级来绘制图形

首先是第一个问题：如何标识层级

### 1.层级标识

层级属性并不只在`Container`类上实现，`Container`类表示组的概念，实际上，任何元素节点都需要层级概念，包括`Container`类。

所以，我们需要实现一个通用的节点类 `Vertex`，这个类代表了最原始的‘节点’的概念，所有可以被展示到 `canvas` 画布上的、各种类型的节点都会继承于这个类，这是一个抽象类，我们并不会直接实例化这个类。

这个类上面挂载了‘节点’的各种通用属性，比如：父元素、层级、节点是否可见等。

同时，`Container`类继承于 `Vertex` 类，‘组’也算作‘节点’。

`Vertex` 类实现如下：

```ts
class Vertex {
  protected _zIndex = 0; // 节点的层级关系
  public parent: Container | undefined = undefined; // 节点的父子关系
  public visible = true;
}
```

同时要对 `Container` 类进行改造，增加根据 `zIndex` 的排序方法，实现如下：

```ts
class Container extends Vertex {
  public readonly children: Container[] = [];
  public isSort: boolean = false; // true 的时候表示需要更新排序
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

### 2.根据层级来绘制图形

目前，我们已经实现了基础图形，也实现了组的功能，接下来我们会按照层级和嵌套关系去渲染，比如如下代码：

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

    app.render();
  </script>
</body>
```

那么根据层级和嵌套关系，我们会构造出一个树结构：

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

前面说了，我们的渲染策略是：子节点在父节点之上 (先绘制父节点，再绘制子节点)，相同层级的兄弟节点，zIndex 越大，层级越高，相同 zIndex，则按照添加顺序来决定，后添加的节点，层级更高 (越晚绘制)。

也就是说我们期望的渲染顺序是这样的：

```sh
Application --> container2 --> container1 --> blackGraphics --> redGraphics --> greenGraphics --> yellowGraphics --> blueGraphic --> grayGraphic
```

也就是：

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

可以得出：我们要**先序遍历**这棵对象树，也就是说我们会先处理根节点，再递归处理子节点，直至所有节点处理完毕，退出递归。

在不断深入这棵对象树的同时，我们还要根据 `zIndex` 给每个节点的子节点进行排序。

```ts
/**
 * @description: 根据 z-index 排序子元素
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
 * 递归渲染以自身为根的整棵节点树
 */
public renderCanvasRecursive(render: CanvasRenderer) {
  if (!this.visible) return
  this.renderCanvas(render) // 先渲染自身
  // 渲染子节点
  for (let i = 0; i < this.children.length; i++) {
    const child = this.children[i]
    child.renderCanvasRecursive(render)
  }
}
```

既然是有嵌套结构，那么自然就会思考一个问题：循环嵌套怎么办？

这个时候，我们就能发现，根据层级和父子关系组成的渲染链，不是树结构，而是图结构。即任意两个节点之间都可能存在关系。

所以问题就可以转换成，如何解决有向图中的回环问题。

这时候就要进行有向图的拓扑排序，如果一个图能够完成拓扑排序，则图中不存在回环。否则，找到回环的节点，并进行提示，避免内存泄漏。

## 四：变换矩阵

在组的管理，层级管理，基础图形都实现了后，我们需要封装一些常用的图形变换方法。比如平移，旋转，缩放等。

虽然 `canvas` 为了开发的便捷，也提供了 `ctx.rotate`,`ctx.scale` 等方法，但 `ctx.rotate()` 和 `ctx.scale()` 方法是对当前 `CanvasRenderingContext2D` 对象的变换矩阵进行操作的。这些变换会影响之后的所有变换。

我们更希望的是，我们能对一组或者一个图形进行变换。而不是影响后续的所有操作。

我们有两种方式去解决这个问题，一种是，每次变化完成后，都进行 `ctx.resetTransform()` 重置变换矩阵，命令式编程。第二种是，构建直观的变换矩阵，通过矩阵相乘，来实现变换。

因此，我们来构建`Transform`类，添加旋转，平移，斜切 (skew) 等变换矩阵。

> 很遗憾，矩阵是什么是说不清的，你必须得自己亲眼看看 --墨菲斯
> Unfortunately, no one can be told what the Matrix is. You have to see it for yourself. --Morpheus

对于旋转和斜切，它们能保证网格平行且等距分布，原点不变。因此是线性变换，可以通过矩阵的左乘来实现。

但由于平移是仿射变换，因此，我们需要通过升维，在高纬度的线性变换来表示低维度的仿射变换。从而可以通过矩阵的乘法来实现这些变换的操作。

`Matrix` 类将会提供各种各样的与矩阵操作相关的函数 (矩阵相乘，矩阵求逆等)，任何变换的叠加都将会转换成 `matrix`，方便我们调用 `canvas` 的指令。

`Transform` 类就类似 `CSS` 的 `transform`，它提供了一些更清晰、更符合人类直觉的变换，而不用直接使用矩阵变换，当然，这些变换最终会转换成矩阵变换。

所以对于二维图形的变换操作，我们需要一个 3x3 的矩阵。因此`Matrix`类的实现如下：

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

旋转矩阵：

<r-math latex="\begin{bmatrix} \cos \theta & -\sin \theta \\ \sin \theta & \cos \theta \end{bmatrix}"></r-math>

如果我们有一个二维向量<r-math  style="display: inline-block;" latex="\vec{v} = \begin{bmatrix} x \\ y \end{bmatrix}"></r-math>，则旋转后的向量 可以通过矩阵乘法得到：

<r-math latex="\vec{v}' = R(\theta) \vec{v} = \begin{bmatrix} \cos \theta & -\sin \theta \\ \sin \theta & \cos \theta \end{bmatrix} \begin{bmatrix} x \\ y \end{bmatrix}"></r-math>

代码实现矩阵的乘法如下：

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

斜切矩阵：

<r-math latex="\left[ \begin{matrix} cos(y) & sin(x) \\ sin(y) & cos(x) \\ \end{matrix} \right]"></r-math>

缩放矩阵：

<r-math latex="\begin{bmatrix} s_x & 0 \\ 0 & s_y \end{bmatrix}"></r-math>

矩阵的乘法：

<r-math latex="\begin{bmatrix} s_x & 0 \\ 0 & s_y \end{bmatrix} \begin{bmatrix} x \\ y \end{bmatrix} = \begin{bmatrix} s_x x \\ s_y y \end{bmatrix}"></r-math>

代码实现：

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

平移矩阵：

代码实现：

```ts
  public translate = (x: number, y: number): Matrix => {
    this.tx += x;
    this.ty += y;

    return this;
  };
```

最后是综合的变换实现：

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

## 五：事件系统

由于我们已经实现了组和节点的概念，因此只要在节点类上继承发布订阅的类即可。

同时在 canavs 上监听各种事件，进行事件的传递：

```ts
this.canvasEle.addEventListener('pointermove', this.onPointerMove, true);
this.canvasEle.addEventListener('pointerleave', this.onPointerLeave, true);
this.canvasEle.addEventListener('pointerdown', this.onPointerDown, true);
this.canvasEle.addEventListener('pointerup', this.onPointerup, true);
```

接下来的核心是，如何判断点击到的是哪个元素。

### 1.碰撞检测

针对复杂的多边形，可以采用射线法来做碰撞检测，对于规则图形则用不到射线法，比如圆，碰撞检测的方式是：判断待检测点与圆心的距离是否小于圆的半径就行了。

#### (1) 射线法：

维护一个计数器 `count`，计数器的初始值为 `0`，然后从待检测点发出一条射线，这条射线每穿过封闭图形的边一次，就让 `count` 加 `1`，如果最后 `count` 为奇数，则判断该点在封闭图形内部，如果为偶数，则判断该点在封闭图形外部。

判断射线与曲线线段是否相交，是比较困难的，但是判断射线与直线线段相交，相对就简单许多，因此，除了一些规则的曲线图形 (完整的圆、椭圆)，其他的不规则的曲线图形，都会用直边多边形来代替。

所以，射线法其实只需要处理直边多边形的情况，如下：

具体做法就是，用 `for` 循环判断这个直边多边形的每一条边，如果相交则让 `count+1`，循环结束后就能得到 `count` 了。

#### (2) 如何判断射线与线段是否相交

我们会从待检测点发出一条水平向右的无限远的射线

首先我们可以排除一些一定不相交的情况：

1. 线段在射线上方

2. 线段在射线下方

3. 线段的两个端点都在待检测点的左边

排除了以上 `3` 种一定不相交的情况后，接下来会有一种一定相交的情况，也就是线段的 `2` 个端点都在待检测点的右边：

最后，还剩下了 `1` 种情况：线段的一个端点在待检测点的左边，另一个端点在待检测点的右边，这个时候可能相交，也可能不相交：

这种情况下，计算出射线所处的直线与线段的交点的 x 坐标，然后判断这个交点的 x 坐标是否大于待检测点的 x 坐标，如果是，则说明射线与线段相交了，反之则没有相交。

还有一种极限的情况，射线和多边形的边缘重合。(不考虑，因为理论存在，但实际不存在)

判断线段与射线是否相交：

```ts
private isIntersect(
  px: number,
  py: number,
  p1x: number,
  p1y: number,
  p2x: number,
  p2y: number
) {
  // 线段在射线上方
  if (p1y > py && p2y > py) {
    return false
  }

  // 线段在射线下方
  if (p1y < py && p2y < py) {
    return false
  }

  // 线段的两个端点都在待检测点的左边
  if (p1x < px && p2x < px) {
    return false
  }

  // 线段的2个端点都在待检测点的右边
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

因此，把以上方法汇总起来，判断待检测点是否在一个多边形内部：

```ts
public contains(p: Point): boolean {
  const len = this.points.length
  let count = 0

  // points 数组的每两个元素为一个顶点的坐标
  for (let i = 2; i <= len - 2; i += 2) {
    const p1x = this.points[i - 2]
    const p1y = this.points[i - 1]
    const p2x = this.points[i]
    const p2y = this.points[i + 1]
    if (this.isIntersect(p.x, p.y, p1x, p1y, p2x, p2y)) {
      count++
    }
  }

  // 还需要判断最后一个点和第一个点的连线是否与射线相交
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

至此，多边形的碰撞检测就实现了。

#### (3) 补充所有类型的图形的碰撞检测方法

##### 圆

只要待检测点离圆心的距离小于半径，就判断待检测点在该封闭图形的内部

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

##### 矩形

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

##### 椭圆

椭圆的方程是：

<r-math latex="\frac{x^2}{a^2} + \frac{y^2}{b^2} = 1"></r-math>

因此只要<r-math  style="display: inline-block;" latex="\frac{x^2}{a^2} + \frac{y^2}{b^2} < 1"></r-math>,我们就判断待检测点落在椭圆的内部

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

##### 圆角矩形

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

  // 判断左上角
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

  // 判断左下角
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

  // 判断右上角
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

  // 判断右下角
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

#### （4）引入了层级关系的碰撞检测

渲染引擎在拿到这棵带有层级关系的对象树 (根节点为 `stage`) 后，会采用先序遍历的方式来渲染这棵树，这意味着，父节点会比子节点先渲染，而相同层级的兄弟节点，则按照 `zIndex` 来排序，`zIndex` 越大的兄弟节点越晚被渲染，`zIndex` 相同的兄弟节点则按照数组中的顺序来渲染，这也是层级关系的核心所在。

对于碰撞检测，同样需要遍历这棵对象树，只不过遍历的顺序不一样了。

对于碰撞检测的遍历顺序，只有一条原则：谁处于层级关系的更高层，谁先被检测 (这也是为什么我们能使用像素标记法来做碰撞检测)。这一点和渲染的顺序是反过来的。这其实也非常好理解，假设在桌子上放了一堆纸，这些纸形成了一个层级关系，然后在这堆纸所在的区域随机滴一滴墨水，这滴墨水肯定是滴在尽可能上层的那张纸上。

可以得到：我们会后序遍历这棵对象树，越晚被渲染出来的元素，越早进行碰撞检测。

```ts
let hasFoundTarget = false;
let hitTarget: Container | null = null;

const hitTestRecursive = (curTarget: Container, globalPos: Point) => {
  // 如果对象不可见
  if (!curTarget.visible) {
    return;
  }

  if (hasFoundTarget) {
    return;
  }

  // 深度优先遍历子元素
  for (let i = curTarget.children.length - 1; i >= 0; i--) {
    const child = curTarget.children[i];
    hitTestRecursive(child, globalPos);
  }

  if (hasFoundTarget) {
    return;
  }

  // 最后检测自身
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

接下来还有一个问题，那就是曲线的边缘碰撞检测：

### 2.贝塞尔曲线

上面已经实现了多边形和各种图形的碰撞检测，但是曲线就没办法计算了。所以我们需要把贝塞尔曲线用多边形来进行近似。

这样就可以把曲线的碰撞检测问题，转化成多边形的碰撞检测。这样就可以用上述的方法直接解决了。

### （1）二阶贝塞尔曲线

<r-math latex="B(t) = (1-t)^2 \mathbf{P_0} + 2t(1-t) \mathbf{P_1} + t^2 \mathbf{P_2}, \quad t \in [0, 1]"></r-math>

起点（P0）：这是曲线开始的位置。在绘制过程中，曲线会精确地通过这个点。
控制点（P1）：这个点是用来控制曲线形状和弯曲程度的。它不一定在曲线上，但会对曲线的走向产生重要影响。通过调整控制点的位置，可以改变曲线的弯曲程度和方向。
终点（P2）：这是曲线结束的位置。同样地，曲线也会精确地通过这个点。

我们首先要在贝塞尔曲线上采样一系列的点

贝塞尔曲线是一个 <r-math  style="display: inline-block;" latex="x"></r-math> 和 <r-math  style="display: inline-block;" latex="y"></r-math> 关于 <r-math  style="display: inline-block;" latex="t"></r-math> 的参数方程，<r-math  style="display: inline-block;" latex="t\in[0,1]"></r-math>，要在贝塞尔曲线上采样多个点，可以把<r-math  style="display: inline-block;" latex="[0,1]"></r-math>这个区间分成 n 份，这样我们就得到了 n 个 t 值，然后把这些 t 值代入贝塞尔曲线的参数方程，我们就可以得到 n 个位于贝塞尔曲线上的点，然后把这些点连起来，就得到了一条近似的贝塞尔曲线。

所以我们要计算，贝塞尔曲线的长度，然后根据长度来计算需要多少个采样点。

那么如何求曲线的长度呢，用定积分。

我们首先写出贝塞尔曲线关于 <r-math  style="display: inline-block;" latex="x"></r-math> 和 <r-math  style="display: inline-block;" latex="y"></r-math>的方程：

<r-math latex="\begin{cases} x=(1-t)^2\times P_0x + 2t(1-t) \times P_1x + t^2 \times P_2x \\ y=(1-t)^2\times P_0y + 2t(1-t) \times P_1y + t^2 \times P_2y \end{cases}"></r-math>

以起始点 <r-math  style="display: inline-block;" latex="P_0=(1,1)"></r-math>,<r-math  style="display: inline-block;" latex="P_1=(1,2)"></r-math>,<r-math  style="display: inline-block;" latex="P_2=(2,2)"></r-math>的贝塞尔曲线为例，它的图像是这样的：

<img></img>

假设我们要求 <r-math  style="display: inline-block;" latex="t\in[0,1]"></r-math> 时，这条曲线的弧长 (即整条贝塞尔曲线的长度)。

我们要求的量是整条贝塞尔曲线的长度，依然是按照惯例，我们先将图像放大到很大，然后再截取一小段 (假设无限小)：

<img></img>

这个红色的线段的长度 <r-math  style="display: inline-block;" latex="L"></r-math> 就是我们要求的一份，<r-math  style="display: inline-block;" latex="dx"></r-math> 是这条线段在 <r-math  style="display: inline-block;" latex="x"></r-math> 轴方向上的长度，<r-math  style="display: inline-block;" latex="dy"></r-math> 是这条线段在 <r-math  style="display: inline-block;" latex="y"></r-math> 轴方向上的长度，当 <r-math  style="display: inline-block;" latex="dx"></r-math> 和 <r-math  style="display: inline-block;" latex="dy"></r-math> 趋近于无穷小时，可以把红色的线段看作一条直线，所以，我们依然可以使用勾股定理，得出 <r-math  style="display: inline-block;" latex="L=\sqrt{(dx)^2+(dy)^2}"></r-math>​。但是，到这里还没有结束，我们要对 <r-math  style="display: inline-block;" latex="t"></r-math> 进行积分，而不是对 <r-math  style="display: inline-block;" latex="x"></r-math> 和 <r-math  style="display: inline-block;" latex="y"></r-math> 进行积分，所以这里我们还要得出 <r-math  style="display: inline-block;" latex="dx"></r-math> 和 <r-math  style="display: inline-block;" latex="dy"></r-math> 对于 <r-math  style="display: inline-block;" latex="dt"></r-math> 的表达式；由于 <r-math  style="display: inline-block;" latex="dx"></r-math> 对 <r-math  style="display: inline-block;" latex="dt"></r-math> 的函数和 <r-math  style="display: inline-block;" latex="dy"></r-math> 对 <r-math  style="display: inline-block;" latex="dt"></r-math> 的函数的形式是一样的，所以我们只需要求出 <r-math  style="display: inline-block;" latex="dx"></r-math> 对 <r-math  style="display: inline-block;" latex="dt"></r-math> 的表达式也就得到了 <r-math  style="display: inline-block;" latex="dy"></r-math> 对 <r-math  style="display: inline-block;" latex="dt"></r-math> 的表达式。

<r-math  style="display: inline-block;" latex="dx"></r-math> 就是 <r-math  style="display: inline-block;" latex="x"></r-math> 对 <r-math  style="display: inline-block;" latex="t"></r-math> 的函数在 <r-math  style="display: inline-block;" latex="t"></r-math> 的变化量为 <r-math  style="display: inline-block;" latex="dt"></r-math> (<r-math  style="display: inline-block;" latex="dt"></r-math>趋近于无穷小) 时，<r-math  style="display: inline-block;" latex="x"></r-math> 的变化量。如下：

<img>

<r-math  style="display: inline-block;" latex="dt"></r-math> 是一个无穷小量，这个时候，我们可以通过导数 (即斜率) 得出 <r-math  style="display: inline-block;" latex="\frac{dx}{dt}=x_0'"></r-math>​，<r-math  style="display: inline-block;" latex="x_0'"></r-math>​是 <r-math  style="display: inline-block;" latex="x"></r-math> 对 <r-math  style="display: inline-block;" latex="t"></r-math> 的函数在 <r-math  style="display: inline-block;" latex="t=t_0"></r-math> ​处的导数，将 <r-math  style="display: inline-block;" latex="dt"></r-math> 乘到右边，我们有：<r-math style="display: inline-block;" latex="dx=x_0' \times dt"></r-math>。通过同样的方法，我们可以得到：<r-math  style="display: inline-block;" latex="dy=y_0' \times dt"></r-math>。所以我们要求的一份 <r-math style="display: inline-block;" latex="L=\sqrt{(dx)^2+(dy)^2}=\sqrt{(x_0' \times dt)^2+(y_0' \times dt)^2}=\sqrt{(x_0')^2+(y_0')^2} \times dt"></r-math>，所以，我们的积分表达式是：<r-math style="display: inline-block;" latex="\int_0^1\sqrt{(x')^2+(y')^2}dt"></r-math>，接下来就是求函数 <r-math style="display: inline-block;" latex="\sqrt{(x')^2+(y')^2}"></r-math> ​的不定积分了。

根据贝塞尔曲线的参数方程，有：

<r-math latex="\begin{cases} x'=2(P_0x-2P_1x+P_2x)t-2(P_0x-P_1x) \\ y'=2(P_0y-2P_1y+P_2y)t-2(P_0y-P_1y) \end{cases}"></r-math>

为了简化这个公式，我们把一些常数挪到一起，用另一些常数代替，令 <r-math  style="display: inline-block;" latex="a_x=2(P_0x-2P_1x+P_2x)"></r-math>,<r-math  style="display: inline-block;" latex="b_x=-2(P_0x-P_1x)"></r-math>,<r-math  style="display: inline-block;" latex="a_y=2(P_0y-2P_1y+P_2y)"></r-math>,<r-math  style="display: inline-block;" latex="b_y=-2(P_0y-P_1y)"></r-math>, 所以：

<r-math latex="\begin{cases} x'=a_xt+b_x \\ y'=a_yt+b_y \end{cases}"></r-math>

所以 <r-math  style="display: inline-block;" latex="\sqrt{(x')^2+(y')^2}=\sqrt{(a_x^2+a_y^2)t^2+2(a_xb_x+a_yb_y)t+b_x^2+b_y^2}"></r-math>,为了简化这个式子，我们再次将常量挪到一起，用另一些常量替换，令 <r-math  style="display: inline-block;" latex="A=a_x^2+a_y^2"></r-math>,<r-math  style="display: inline-block;" latex="B=2(a_xb_x+a_yb_y)"></r-math>,<r-math  style="display: inline-block;" latex="C=b_x^2+b_y^2"></r-math>,所以：

<r-math latex="\sqrt{(x')^2+(y')^2}=\sqrt{At^2+Bt+C}"></r-math>

接下来我们依然会使用换元法，来求解这个不定积分，我们会用换元法将其化解成 <r-math  style="display: inline-block;" latex="\int\sqrt{x^2+a^2}dx"></r-math> 型不定积分，然后套公式得出结果。

首先，<r-math  style="display: inline-block;" latex="At^2+Bt+C"></r-math>是两个平方量的和 (<r-math  style="display: inline-block;" latex="(x')^2"></r-math> 和 <r-math  style="display: inline-block;" latex="(y')^2"></r-math>)，所以<r-math  style="display: inline-block;" latex="At^2+Bt+C>=0"></r-math>,根据一元二次方程解的个数的判断公式，我们有 <r-math  style="display: inline-block;" latex="B^2-4AC<=0"></r-math>

接下来就是开始换元了：

<r-math style="--ran-math-justify-content: flex-start;" latex="\int\sqrt{At^2+Bt+C}dt"></r-math>

<r-math style="--ran-math-justify-content: flex-start;" latex="=\int\frac{1}{\sqrt{A}}\times{\sqrt{A}}\times\sqrt{At^2+Bt+C}dt"></r-math>

<r-math style="--ran-math-justify-content: flex-start;" latex="=\int\frac{1}{\sqrt{A}}\times\sqrt{(At+\frac{B}{2})^2+(\sqrt{\frac{4AC-B^2}{4}})^2}dt"></r-math>

<r-math style="--ran-math-justify-content: flex-start;" latex="=\int\frac{1}{\sqrt{A}}\times\sqrt{(At+\frac{B}{2})^2+(\sqrt{\frac{4AC-B^2}{4}})^2}\times \frac{1}{A} \times d(At+\frac{B}{2})"></r-math>

<r-math style="--ran-math-justify-content: flex-start;" latex="=\frac{1}{A\sqrt{A}}\times\int\sqrt{(At+\frac{B}{2})^2+(\sqrt{\frac{4AC-B^2}{4}})^2} \times d(At+\frac{B}{2})"></r-math>

令<r-math  style="display: inline-block;" latex="u=At+\frac{B}{2}"></r-math>,<r-math  style="display: inline-block;" latex="a=\sqrt{\frac{4AC-B^2}{4}}"></r-math>,我们就得到了<r-math  style="display: inline-block;" latex="\int\sqrt{x^2+a^2}dx"></r-math>型不定积分，即<r-math  style="display: inline-block;" latex="\frac{1}{A\sqrt{A}}\int\sqrt{u^2+a^2}du"></r-math> 这个时候，积分变量从 <r-math  style="display: inline-block;" latex="t"></r-math> 变成了<r-math  style="display: inline-block;" latex="u"></r-math>，因为对<r-math  style="display: inline-block;" latex="t"></r-math> 的积分区间是 <r-math  style="display: inline-block;" latex="t\in[0,1]"></r-math>且 <r-math  style="display: inline-block;" latex="u=At+\frac{B}{2}"></r-math>,所以对 <r-math  style="display: inline-block;" latex="u"></r-math> 的积分区间为 <r-math  style="display: inline-block;" latex="u\in[\frac{B}{2},A+\frac{B}{2}]"></r-math>所以我们可以得出：

<r-math style="--ran-math-justify-content: flex-start;" latex="\int_0^1\sqrt{(x')^2+(y')^2}dt"></r-math>

<r-math style="--ran-math-justify-content: flex-start;" latex="= \int_0^1\sqrt{At^2+Bt+C}dt"></r-math>

<r-math style="--ran-math-justify-content: flex-start;" latex="= \frac{1}{A\sqrt{A}}\int_{\frac{B}{2}}^{A+\frac{B}{2}}\sqrt{u^2+a^2}du"></r-math>

<r-math style="--ran-math-justify-content: flex-start;" latex="= \frac{1}{A\sqrt{A}}\times\bigg[\frac{A+\frac{B}{2}}{2}\sqrt{(A+\frac{B}{2})^2+a^2}+\frac{a^2}{2}\ln\bigg\lvert A+\frac{B}{2}+\sqrt{(A+\frac{B}{2})^2+a^2}\bigg\rvert - \bigg(\frac{B}{4}\sqrt{\frac{B^4}{4}+a^2}+\frac{a^2}{2}\ln\bigg\lvert \frac{B}{2}+\sqrt{\frac{B^2}{4}+a^2}\bigg\rvert\bigg)\bigg]"></r-math>

接下来就是把各个常量代进去了。结果<r-math  style="display: inline-block;" latex="\approx1.6232"></r-math>

#### 代码实现：

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

  // 牛顿 - 莱布尼兹公式
  const F1 =
    (A / 2 + B / 4) * Math.sqrt((A + B / 2) * (A + B / 2) + a * a) +
    ((a * a) / 2) * Math.log(Math.abs(A + B / 2 + Math.sqrt((A + B / 2) * (A + B / 2) + a * a)));

  const F0 =
    (B / 4) * Math.sqrt((B * B) / 4 + a * a) + ((a * a) / 2) * Math.log(B / 2 + Math.sqrt((B * B) / 4 + a * a));

  const length = (1 / (Math.sqrt(A) * A)) * (F1 - F0); // 不要忘了前面还有个(A根号A分之一)

  return length;
};
```

虽然公式很长，但是代码看起来就短多了。

采样多个点，然后连成一个近似于二阶贝塞尔曲线的直边多边形

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

  // 求出这条二阶贝塞尔曲线的长度
  const curveLength = getQuadraticBezierLength(P0X, P0Y, P1X, P1Y, P2X, P2Y)

  let segmentsCount = Math.ceil(curveLength / 10) // 每10个像素采样一次

  // 最大 2048 份
  if (segmentsCount > 2048) {
    segmentsCount = 2048
  }

  // 最小 8 份
  if (segmentsCount < 8) {
    segmentsCount = 8
  }

  // 计算出采样点的坐标然后放入 points 数组
  for (let i = 1; i <= segmentsCount; i++) {
    const t = i / segmentsCount

    // 直接套用二阶贝塞尔曲线的公式
    const x = (1 - t) * (1 - t) * P0X + 2 * t * (1 - t) * P1X + t * t * P2X
    const y = (1 - t) * (1 - t) * P0Y + 2 * t * (1 - t) * P1Y + t * t * P2Y

    this.currentPath.points.push(x, y)
  }

  return this
}

```

# 参考资料：

1. [如何通俗地讲解「仿射变换」？](https://www.zhihu.com/question/20666664/answer/157400568)
2. [仿射变换及其变换矩阵的理解](https://www.cnblogs.com/shine-lee/p/10950963.html)
3. [深入理解贝塞尔曲线](https://juejin.cn/post/6844903666361565191)
4. [如何理解并应用贝塞尔曲线](https://juejin.cn/post/6844903796582121485)
