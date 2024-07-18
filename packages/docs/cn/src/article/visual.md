在业务持续演进的过程中，遭遇了高度定制化图表的需求。为了寻找解决方案，首先深入探索了现有的开源图表库，遗憾的是，这些库虽能覆盖大部分常见的功能，但在一些定制化设计上却显得力不从心，但 UI 层的定制化又是十分常见的。

为了精准复现设计愿景，我转而采用 canvas 技术手动绘制图表。这一过程中，尽管已尽力通过函数式编程范式封装和模块化绘制逻辑以提升代码的可维护性，但 canvas 的命令式特性在面临需求变动时，仍易导致直接而频繁的代码调整，影响了整体的开发效率和灵活性。

鉴于此，意识到，需要从更高层次的业务逻辑和设计理念出发，构建一个更为底层且灵活的图表绘制引擎。这样的引擎应能够抽象出绘制操作的核心要素，不仅服务于当前应用层的定制化需求，更应具备良好的扩展性和复用性，以便在未来面对更多样化的业务场景时，能够迅速响应并高效实现定制化图表的绘制需求。这样的策略转变，旨在从根本上提升图表定制化的开发效率和图表的维护性，确保业务迭代的顺畅进行。

## 一 技术设计

针对常见的绘制需求进行详尽的功能分析后，我们系统性地规划了高效且灵活的图表绘制引擎的核心构成要素。这些精心设计的组件旨在确保引擎不仅能够灵活应对多样化的定制需求，还具备出色的可维护性和可扩展性。具体而言，设计蓝图涵盖以下关键方面：

1. **基础图形库：**构建一个丰富的基础图形类库，提供便捷的 API 来绘制常见的几何形状，如矩形、圆形、多边形、曲线等。这些基础图形应支持自定义样式和属性，以满足多样化的设计需求。
2. **层级管理：**构建一个清晰的层级结构是绘制引擎的基础。这包括定义元素之间的堆叠顺序，如确保文字总是绘制在图表的上方，以及处理不同图表或元素之间的层级关系。层级管理将确保视觉呈现符合预期，即使在复杂的布局中也能保持清晰有序。
3. **图形组的管理：**引入节点和组的概念，允许用户将多个图形元素组织成一个整体（即“组”）。这样的设计使得对组进行整体移动、缩放或变形时，组内所有元素都能同步响应，大大简化了复杂场景下的操作和管理。
4. **变换矩阵：**对一个图形组执行平移、旋转、缩放等变形操作，从而以动态和灵活的方式调整图形的展示效果。为了实现这些变形操作，变形操作类通常会采用矩阵变换的原理。通过维护一个变换矩阵，并在绘制图形组之前应用该矩阵，可以一次性完成所有变形操作的计算，从而提高绘制效率。
5. **事件系统：**集成一个高效的事件处理系统，允许用户将事件监听器绑定到单个图形元素或整个组上。这样，无论是用户交互（如点击、拖动）还是系统事件（如加载完成、数据更新），都能得到及时响应和处理。
6. **应用层封装：**在应用层，我们需要封装绘制引擎提供的底层功能，使其更加贴近业务需求。这包括提供易于使用的 API 接口、优化性能、处理异常和错误等。同时，通过持续的应用层反馈，不断优化和调整绘制引擎，确保其能够更好地服务于业务的发展。

因此，在绘制引擎架构中，我们会首先实现一个节点类 Vertex，这个类代表了最原始的‘节点’的概念，所有可以被展示到 canvas 画布上的、各种类型的节点都会继承于这个类，这是一个抽象类，我们并不会直接实例化这个类。

这个类上面挂载了‘节点’的各种通用属性，比如：父元素、透明度、旋转角度、缩放、平移、节点是否可见等。

```ts

```

为了进行图形组的管理，会继续实现一个容器类 Container，这个类代表了‘组’的概念，它提供了添加子元素，移除子元素等的方法；后续的要被渲染的一些类 (如 Graphics，Text，Sprite 等) 会继承于这个类；这个类本身不会被渲染 (因为它只是一个‘组’，它本身没有内容可以渲染)。

这个类继承于 Vertex 类，‘组’也算作‘节点’。

Graphics 这个类会用来构建一些几何图形元素；它会继承 Container 类。

在渲染引擎中，一切变换 (平移、旋转、缩放等) 都会转化成变换矩阵 (matrix)，因为 canvas 只接受矩阵变换，虽然 canvas 为了开发的便捷，也提供了 ctx.rotate,ctx.scale 等操作，但是 canvas 中的这些操作会直接转换成变换矩阵，而不像 DOM 那样，有锚点的概念，所以 canvas 提供的 rotate，scale 等操作，和 DOM 提供的 rotate，scale 的表现是不一样的。

Matrix 类将会提供各种各样的与矩阵操作相关的函数 (矩阵相乘，矩阵求逆等)，任何变换的叠加都将会转换成 matrix，方便我们调用 canvas 的指令。

Transform 类就类似 CSS 的 transform，它提供了一些更清晰、更符合人类直觉的变换，而不用直接使用矩阵变换，当然，这些变换最终会转换成矩阵变换。

线性变换从几何直观有三个要点：

- 变换前是直线的，变换后依然是直线
- 直线比例保持不变
- 变换前是原点的，变换后依然是原点

比如有一个二维基向量

<r-math latex="\left[\begin{matrix}x & 0 \\0 & y \\ \end{matrix}\right]"></r-math>

旋转矩阵：

<r-math latex="\left[ \begin{matrix} cos(r) & -sin(r) \\ sin(r) & cos(r) \\ \end{matrix} \right]"></r-math>

浏览器的 skew:

<r-math latex="\left[ \begin{matrix} 1 & tan(x) \\ tan(y) & 1 \\ \end{matrix} \right]"></r-math>

pixijs 的 skew:

<r-math latex="\left[ \begin{matrix} cos(y) & sin(x) \\ sin(y) & cos(x) \\ \end{matrix} \right]"></r-math>

平移操作：

这里就需要仿射变换

仿射变换从几何直观只有两个要点：

- 变换前是直线的，变换后依然是直线
- 直线比例保持不变

少了原点保持不变这一条。

因此，平移不再是线性变化了，而是仿射变化。

每一个矩阵变换都是线性变换，反正则不成立。

仿射变换不能光通过矩阵乘法来实现，还得有加法。

主要用途是，通过高纬度的线性变换，模拟低维度的仿射变换。从而把平移操作也数据化。

# 实现曲线

## 二阶贝塞尔曲线

<r-math latex="B(t) = (1-t)^2 \mathbf{P_0} + 2t(1-t) \mathbf{P_1} + t^2 \mathbf{P_2}, \quad t \in [0, 1]"></r-math>

起点（P0）：这是曲线开始的位置。在绘制过程中，曲线会精确地通过这个点。
控制点（P1）：这个点是用来控制曲线形状和弯曲程度的。它不一定在曲线上，但会对曲线的走向产生重要影响。通过调整控制点的位置，可以改变曲线的弯曲程度和方向。
终点（P2）：这是曲线结束的位置。同样地，曲线也会精确地通过这个点。

## 二 基础图形库：

常见的基础图形有：

1. 圆
2. 椭圆
3. 多边形
4. 矩形
5. 圆角矩形

先实现一个基础类，然后其他的所有图形类都继承这个抽象类：

```ts
export abstract class Shape {
  // 支持的所有几何图形都会继承自这个 Shape 基类
  public abstract type: ShapeType;
  constructor() {}
}
```

其中`ShapeType`目前有以下几个属性：

```ts
// 支持的形状类型
export enum ShapeType {
  Rectangle = 'rectangle',
  Polygon = 'polygon',
  Circle = 'circle',
  Ellipse = 'ellipse',
  RoundedRectangle = 'rounded rectangle',
}
```

其中，我们只实现基础图形类的**数据部分**，渲染到逻辑统一到一个地方。尽量分离数据和实际的 UI 渲染操作。

### 1.圆

要绘制一个圆，只需要知道圆心和半径即可

数据类：

```ts
export class Circle extends Shape {
  public x: number;
  public y: number;
  public radius: number;
  public readonly type = ShapeType.Circle;
  constructor(x = 0, y = 0, radius = 0) {
    super();
    this.x = x;
    this.y = y;
    this.radius = radius;
  }
}
```

绘制方法：

```ts
const { x, y, radius } = circle;

ctx.arc(x, y, radius, 0, 2 * Math.PI);

if (fillStyle.visible) {
  ctx.globalAlpha = fillStyle.alpha * this.worldAlpha;
  ctx.fill();
}
if (lineStyle.visible) {
  ctx.globalAlpha = lineStyle.alpha * this.worldAlpha;
  ctx.stroke();
}
```

### 2.椭圆

椭圆的标准方程是：

<r-math latex="\frac{x^2}{a^2} + \frac{y^2}{b^2} = 1 \quad (a > b > 0)"></r-math>

因此只需要圆心，长轴，短轴就可以确定一个圆，因此

```ts
export class Ellipse extends Shape {
  public x: number;
  public y: number;
  public radiusX: number;
  public radiusY: number;
  public readonly type = ShapeType.Ellipse;
  constructor(x = 0, y = 0, radiusX = 0, radiusY = 0) {
    super();
    this.x = x;
    this.y = y;
    this.radiusX = radiusX;
    this.radiusY = radiusY;
  }
}
```

绘制方法：

```ts
const { x, y, radiusX, radiusY } = ellipse;

ctx.ellipse(x, y, radiusX, radiusY, 0, 0, Math.PI * 2);

if (fillStyle.visible) {
  ctx.globalAlpha = fillStyle.alpha * this.worldAlpha;
  ctx.fill();
}

if (lineStyle.visible) {
  ctx.globalAlpha = lineStyle.alpha * this.worldAlpha;
  ctx.stroke();
}
```

### 3.多边形

多边形是由三条或三条以上不在同一直线上的线段首尾顺次连接所组成的封闭图形。这样的图形由多个点（称为顶点）和连接这些点的线段（称为边）构成，且所有边均在同一平面内。

简单来说，就是一个数组，里面很多个点的坐标，把点连起来，就是多边形了。

```ts
export class Polygon extends Shape {
  public points: number[]; // 多边形由多个点构成，points 数组每 2 个元素代表一个点的坐标
  public closeStroke = false;
  public readonly type = ShapeType.Polygon;
  constructor(points: number[] = []) {
    super();
    this.points = points;
  }
}
```

绘制方法：

```ts
const { points, closeStroke } = polygon;

ctx.moveTo(points[0], points[1]);

for (let i = 2; i < points.length; i += 2) {
  ctx.lineTo(points[i], points[i + 1]);
}

if (closeStroke) {
  ctx.closePath();
}

if (fillStyle.visible) {
  ctx.globalAlpha = fillStyle.alpha * this.worldAlpha;
  ctx.fill();
}

if (lineStyle.visible) {
  ctx.globalAlpha = lineStyle.alpha * this.worldAlpha;
  ctx.stroke();
}
```

### 4.矩形

```ts
export class Rectangle extends Shape {
  public x: number;
  public y: number;
  public width: number;
  public height: number;
  public type = ShapeType.Rectangle;
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
const { x, y, width, height } = rectangle;
if (fillStyle.visible) {
  ctx.globalAlpha = fillStyle.alpha * this.worldAlpha;
  ctx.fillRect(x, y, width, height);
}
if (lineStyle.visible) {
  ctx.globalAlpha = lineStyle.alpha * this.worldAlpha;
  ctx.strokeRect(x, y, width, height);
}
```

### 5.圆角矩形

```ts
export class RoundedRectangle extends Shape {
  public x: number;
  public y: number;
  public width: number;
  public height: number;
  public radius: number;
  public readonly type = ShapeType.RoundedRectangle;
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

绘制方法：

```ts
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
  ctx.globalAlpha = fillStyle.alpha * this.worldAlpha;
  ctx.fill();
}
if (lineStyle.visible) {
  ctx.globalAlpha = lineStyle.alpha * this.worldAlpha;
  ctx.stroke();
}
```

## 三 层级管理

在 canvas 绘图环境中，先绘制的图形会被后绘制的图形所覆盖，因此，层级的管理就自然地通过绘制顺序来实现。在这种情况下，最先被绘制的图形将位于最底层，而随后绘制的图形则逐层叠加，直至最上层。

我们已经实现了各种基础图形的绘制，接下来继续分离绘制时的数据和绘制操作。

我们需要一个容器类，在容器类中统一绘制所有的图形。

用一个 children 属性来添加所有的图形，在 render 方法中统一绘制。

同时，我们会根据 zIndex 属性来排序子元素，zIndex 越大的元素会被排在 children 数组的越后面，但是注意，排序的时候，要保证相同 zIndex 的相对顺序不变。

## 四 图形组的管理

我们会实现一个节点类 Vertex 这个类代表了最原始的‘节点’的概念，所有可以被展示到 canvas 画布上的、各种类型的节点都会继承于这个类，这是一个抽象类，我们并不会直接实例化这个类。

这个类上面挂载了‘节点’的各种属性，比如：父元素、透明度、旋转角度、缩放、平移、节点是否可见等。

为了进行图形组的管理，会继续实现一个容器类 Container，这个类代表了‘组’的概念，它提供了添加子元素，移除子元素等的方法；后续的要被渲染的一些类 (如 Graphics，Text，Sprite 等) 会继承于这个类；这个类本身不会被渲染 (因为它只是一个‘组’，它本身没有内容可以渲染)。

这个类继承于 Vertex 类，‘组’也算作‘节点’。

Graphics 这个类会用来构建一些几何图形元素；它会继承 Container 类。

在渲染引擎中，一切变换 (平移、旋转、缩放等) 都会转化成变换矩阵 (matrix)，因为 canvas 只接受矩阵变换，虽然 canvas 为了开发的便捷，也提供了 ctx.rotate,ctx.scale 等操作，但是 canvas 中的这些操作会直接转换成变换矩阵，而不像 DOM 那样，有锚点的概念，所以 canvas 提供的 rotate，scale 等操作，和 DOM 提供的 rotate，scale 的表现是不一样的。

Matrix 类将会提供各种各样的与矩阵操作相关的函数 (矩阵相乘，矩阵求逆等)，任何变换的叠加都将会转换成 matrix，方便我们调用 canvas 的指令。

Transform 类就类似 CSS 的 transform，它提供了一些更清晰、更符合人类直觉的变换，而不用直接使用矩阵变换，当然，这些变换最终会转换成矩阵变换。

# 参考资料：

1. [如何通俗地讲解「仿射变换」？](https://www.zhihu.com/question/20666664/answer/157400568)
2. [仿射变换及其变换矩阵的理解](https://www.cnblogs.com/shine-lee/p/10950963.html)
3. [深入理解贝塞尔曲线](https://juejin.cn/post/6844903666361565191)
4. [如何理解并应用贝塞尔曲线](https://juejin.cn/post/6844903796582121485)
