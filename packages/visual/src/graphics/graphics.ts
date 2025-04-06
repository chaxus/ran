import { Container } from '../vertex';
import {
  Circle,
  Ellipse,
  Fill,
  Line,
  Polygon,
  Rectangle,
  RoundedRectangle,
  getBezierLength,
  getQuadraticBezierLength,
} from '../shape';
import { GRAPHICS } from '../enums';
import type { ILineStyleOptions, Shape } from '../shape';
import type { Point } from '../vertex';
import type { CanvasRenderer } from '../render/canvasRender';
import { GraphicsGeometry } from './geometry';

// Graphics 类继承自 Container 类，表示绘制各种图形的容器
export class Graphics extends Container {
  private _lineStyle = new Line();
  private _fillStyle = new Fill();
  public geometry = new GraphicsGeometry();
  public currentPath = new Polygon();
  public type: string;
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
  public resetLineStyle = (): void => {
    this._lineStyle.reset();
  };
  protected drawShape = (shape: Shape): Graphics => {
    this.geometry.drawShape(shape, this._fillStyle.clone(), this._lineStyle.clone());
    return this;
  };
  /**
   * 清空已有的 path，开始新的 path
   */
  protected startPoly = (): void => {
    const len = this.currentPath.points.length;
    if (len > 2) {
      // 如果超过 2 个点，那么就算一个合法的 path
      this.drawShape(this.currentPath);
    }
    this.currentPath = new Polygon();
  };
  // 如果要填充图形，则需要先调用这个函数给画笔设置填充色
  public beginFill = (color = '#000000', alpha = 1): Graphics => {
    // 在填充参数变化之前，先将已有的 path 画出来
    this.startPoly();
    this._fillStyle.color = color;
    this._fillStyle.alpha = alpha;
    if (this._fillStyle.alpha > 0) {
      this._fillStyle.visible = true;
    }
    return this;
  };
  /**
   * 结束填充模式
   */
  public endFill = (): Graphics => {
    this.startPoly();
    this._fillStyle.reset();
    return this;
  };
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
  /**
   * 画圆
   * @param x 圆心 X 坐标
   * @param y 圆心 Y 坐标
   * @param radius 半径
   */
  public drawCircle = (x: number, y: number, radius: number): Graphics => {
    return this.drawShape(new Circle(x, y, radius));
  };
  /**
   * 画圆角矩形
   * @param x x 坐标
   * @param y y 坐标
   * @param width 宽度
   * @param height 高度
   * @param radius 圆角半径
   */
  public drawRoundedRect = (x: number, y: number, width: number, height: number, radius: number): Graphics => {
    return this.drawShape(new RoundedRectangle(x, y, width, height, radius));
  };
  /**
   * 画椭圆
   * @param x 椭圆中心 x 坐标
   * @param y 椭圆中心 y 坐标
   * @param radiusX 椭圆 x 轴半径
   * @param radiusY 椭圆 y 轴半径
   */

  public drawEllipse = (x: number, y: number, radiusX: number, radiusY: number): Graphics => {
    return this.drawShape(new Ellipse(x, y, radiusX, radiusY));
  };

  /**
   * 画多边形
   * @param points 多边形顶点坐标数组，每 2 个元素算一组 (x,y)
   */
  public drawPolygon = (points: number[]): Graphics => {
    const poly = new Polygon(points);
    poly.closeStroke = true;

    return this.drawShape(poly);
  };

  public moveTo = (x: number, y: number): Graphics => {
    this.startPoly();
    this.currentPath.points[0] = x;
    this.currentPath.points[1] = y;

    return this;
  };

  public lineTo = (x: number, y: number): Graphics => {
    if (this.currentPath.points.length === 0) {
      this.moveTo(x, y);
      return this;
    }

    // 去除重复的点
    const points = this.currentPath.points;
    const fromX = points[points.length - 2];
    const fromY = points[points.length - 1];
    if (fromX !== x || fromY !== y) {
      points.push(x, y);
    }
    return this;
  };

  public closePath = (): Graphics => {
    this.currentPath.closeStroke = true;
    this.startPoly();
    return this;
  };

  public containsPoint = (p: Point): boolean => {
    // 如果设置了 hitArea 则只判断 hitArea
    if (this.hitArea) {
      return this.hitArea.contains(p);
    }
    return this.geometry.containsPoint(p);
  };
  // 二阶贝塞尔曲线
  // 采样多个点，然后连成一个近似于二阶贝塞尔曲线的直边多边形
  public quadraticCurveTo = (cpX: number, cpY: number, toX: number, toY: number): Graphics => {
    const len = this.currentPath.points.length;
    if (len === 0) {
      this.currentPath.points = [0, 0];
    }
    const P0X = this.currentPath.points[len - 2];
    const P0Y = this.currentPath.points[len - 1];
    const P1X = cpX;
    const P1Y = cpY;
    const P2X = toX;
    const P2Y = toY;
    // 求出这条二阶贝塞尔曲线的长度
    const curveLength = getQuadraticBezierLength(P0X, P0Y, P1X, P1Y, P2X, P2Y);
    let segmentsCount = Math.ceil(curveLength / 10); // 每10个像素采样一次
    // 最大 2048 份
    if (segmentsCount > 2048) {
      segmentsCount = 2048;
    }
    // 最小 8 份
    if (segmentsCount < 8) {
      segmentsCount = 8;
    }
    // 计算出采样点的坐标然后放入 points 数组
    for (let i = 1; i <= segmentsCount; i++) {
      const t = i / segmentsCount;
      // 直接套用二阶贝塞尔曲线的公式
      const x = (1 - t) * (1 - t) * P0X + 2 * t * (1 - t) * P1X + t * t * P2X;
      const y = (1 - t) * (1 - t) * P0Y + 2 * t * (1 - t) * P1Y + t * t * P2Y;
      this.currentPath.points.push(x, y);
    }
    return this;
  };
  // 三阶贝塞尔曲线
  // 采样多个点，然后连成一个近似于三阶贝塞尔曲线的直边多边形
  public bezierCurveTo = (cpX: number, cpY: number, cpX2: number, cpY2: number, toX: number, toY: number): Graphics => {
    const len = this.currentPath.points.length;
    if (len === 0) {
      this.currentPath.points = [0, 0];
    }
    const P0X = this.currentPath.points[len - 2];
    const P0Y = this.currentPath.points[len - 1];
    const P1X = cpX;
    const P1Y = cpY;
    const P2X = cpX2;
    const P2Y = cpY2;
    const P3X = toX;
    const P3Y = toY;
    // 求出这条三阶贝塞尔曲线的长度
    const curveLength = getBezierLength(P0X, P0Y, P1X, P1Y, P2X, P2Y, P3X, P3Y);
    let segmentsCount = Math.ceil(curveLength / 10); // 每10个像素采样一次
    // 最大 2048 份
    if (segmentsCount > 2048) {
      segmentsCount = 2048;
    }
    // 最小 8 份
    if (segmentsCount < 8) {
      segmentsCount = 8;
    }
    // 计算出采样点的坐标然后放入 points 数组
    for (let i = 1; i <= segmentsCount; i++) {
      const t = i / segmentsCount;
      // 直接套用三阶贝塞尔曲线的公式
      const x =
        (1 - t) * (1 - t) * (1 - t) * P0X +
        3 * t * (1 - t) * (1 - t) * P1X +
        3 * t * t * (1 - t) * P2X +
        t * t * t * P3X;
      const y =
        (1 - t) * (1 - t) * (1 - t) * P0Y +
        3 * t * (1 - t) * (1 - t) * P1Y +
        3 * t * t * (1 - t) * P2Y +
        t * t * t * P3Y;
      this.currentPath.points.push(x, y);
    }

    return this;
  };
  // 圆弧arc
  public arc = (
    cx: number,
    cy: number,
    radius: number,
    startAngle: number,
    endAngle: number,
    anticlockwise = false,
  ): Graphics => {
    if (!anticlockwise) {
      while (endAngle < startAngle) {
        endAngle += Math.PI * 2;
      }
      if (endAngle - startAngle > Math.PI * 2) {
        endAngle = startAngle + Math.PI * 2;
      }
    }
    if (anticlockwise) {
      while (endAngle > startAngle) {
        startAngle += Math.PI * 2;
      }
      if (startAngle - endAngle > Math.PI * 2) {
        endAngle = startAngle - Math.PI * 2;
      }
    }
    const diff = endAngle - startAngle;
    if (diff === 0) {
      return this;
    }
    const startX = cx + Math.cos(startAngle) * radius;
    const startY = cy + Math.sin(startAngle) * radius;
    this.lineTo(startX, startY);
    const curveLen = Math.abs(diff) * radius; // 角度 (弧度制) 乘以半径等于弧长
    let segmentsCount = Math.ceil(curveLen / 10);
    // 最大 2048 份
    if (segmentsCount > 2048) {
      segmentsCount = 2048;
    }
    // 最小 8 份
    if (segmentsCount < 8) {
      segmentsCount = 8;
    }
    for (let i = 1; i <= segmentsCount; i++) {
      const angle = startAngle + diff * (i / segmentsCount);
      const x = cx + Math.cos(angle) * radius;
      const y = cy + Math.sin(angle) * radius;
      this.lineTo(x, y);
    }
    return this;
  };
  public arcTo = (x1: number, y1: number, x2: number, y2: number, radius: number): Graphics => {
    if (!this.currentPath) return this;
    const len = this.currentPath.points.length;
    /**
     * 如果画笔当前没有落点，则该操作相当于 moveTo(x1, y1)
     * 如果半径为 0，则该操作也相当于 lineTo(x1, y1)
     */
    if (len === 0 || radius === 0) {
      this.lineTo(x1, y1);
      return this;
    }
    /**
     * 假设画笔落点为 P0，控制点 1 为 P1，控制点 2 为 P2，如果向量 P0P1 和向量 P1P2 的夹角太小或者夹角接近 180 度，
     * 或者向量 P0P1 或向量 P1P2 其中一个的长度为 0，
     * 那么该操作也相当于 moveTo(x1, y1)，
     * 我们用叉积来判断这种情况
     */
    const a1 = this.currentPath.points[len - 1] - y1;
    const b1 = this.currentPath.points[len - 2] - x1;
    const a2 = y2 - y1;
    const b2 = x2 - x1;
    const crossProduct = a1 * b2 - b1 * a2;
    const mm = Math.abs(crossProduct);
    if (mm < 1.0e-8) {
      this.lineTo(x1, y1);
      return this;
    }
    const dd = a1 * a1 + b1 * b1;
    const cc = a2 * a2 + b2 * b2;
    const tt = a1 * a2 + b1 * b2;
    const k1 = (radius * Math.sqrt(dd)) / mm;
    const k2 = (radius * Math.sqrt(cc)) / mm;
    const j1 = (k1 * tt) / dd;
    const j2 = (k2 * tt) / cc;
    const cx = k1 * b2 + k2 * b1;
    const cy = k1 * a2 + k2 * a1;
    const px = b1 * (k2 + j1);
    const py = a1 * (k2 + j1);
    const qx = b2 * (k1 + j2);
    const qy = a2 * (k1 + j2);
    const startAngle = Math.atan2(py - cy, px - cx);
    const endAngle = Math.atan2(qy - cy, qx - cx);
    const anticlockwise = b1 * a2 > b2 * a1;
    return this.arc(cx + x1, cy + y1, radius, startAngle, endAngle, anticlockwise);
  };
  public clear = (): Graphics => {
    this.geometry.clear();
    this._lineStyle.reset();
    this._fillStyle.reset();
    this.currentPath = new Polygon();
    return this;
  };
  /**
   * 调用 canvas API 绘制自身
   */
  protected renderCanvas = (render: CanvasRenderer): void => {
    this.startPoly();
    const ctx = render.ctx;
    const { a, b, c, d, tx, ty } = this.transform.worldTransform;
    ctx.setTransform(a, b, c, d, tx, ty);
    const graphicsData = this.geometry.graphicsData;
    for (let i = 0; i < graphicsData.length; i++) {
      const data = graphicsData[i];
      const { lineStyle, fillStyle, shape } = data;
      if (fillStyle.visible) {
        ctx.fillStyle = fillStyle.color;
      }
      if (lineStyle.visible) {
        ctx.lineWidth = lineStyle.width;
        ctx.lineCap = lineStyle.cap;
        ctx.lineJoin = lineStyle.join;
        ctx.strokeStyle = lineStyle.color;
      }
      ctx.beginPath();
      if (shape instanceof Rectangle) {
        const rectangle = shape;
        const { x, y, width, height } = rectangle;
        if (fillStyle.visible) {
          ctx.globalAlpha = fillStyle.alpha * this.worldAlpha;
          ctx.fillRect(x, y, width, height);
        }
        if (lineStyle.visible) {
          ctx.globalAlpha = lineStyle.alpha * this.worldAlpha;
          ctx.strokeRect(x, y, width, height);
        }
      }
      if (shape instanceof Circle) {
        const circle = shape;
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
      }
      if (shape instanceof RoundedRectangle) {
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
          ctx.globalAlpha = fillStyle.alpha * this.worldAlpha;
          ctx.fill();
        }
        if (lineStyle.visible) {
          ctx.globalAlpha = lineStyle.alpha * this.worldAlpha;
          ctx.stroke();
        }
      }
      if (shape instanceof Ellipse) {
        const ellipse = shape;
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
      }
      if (shape instanceof Polygon) {
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
          ctx.globalAlpha = fillStyle.alpha * this.worldAlpha;
          ctx.fill();
        }
        if (lineStyle.visible) {
          ctx.globalAlpha = lineStyle.alpha * this.worldAlpha;
          ctx.stroke();
        }
      }
    }
  };
}
