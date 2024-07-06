import { Container } from '@/utils/visual/container';
import { Polygon } from '@/utils/visual/shape/polygon';
import { Rectangle, RoundedRectangle } from '@/utils/visual/shape/rectangle';
import { getBezierLength, getQuadraticBezierLength } from '@/utils/visual/math/bezier';
import { Circle } from '@/utils/visual/shape/circle';
import { Ellipse } from '@/utils/visual/shape/ellipse';
import type { Shape } from '@/utils/visual/shape/shape';
import { Fill } from '@/utils/visual/style/fill';
import { Line } from '@/utils/visual/style/line';
import { GraphicsGeometry } from '@/utils/visual/graphics/graphicsGeometry';
import type { CanvasRenderer } from '@/utils/visual/render/canvasRenderer';
import type { ILineStyleOptions } from '@/utils/visual/types';
import type { Point } from '@/utils/visual/point';

// Graphics 类继承自 Container 类，表示绘制各种图形的容器
export class Graphics extends Container {
  private _lineStyle = new Line();
  private _fillStyle = new Fill();
  private _geometry = new GraphicsGeometry();
  private currentPath = new Polygon();

  constructor() {
    super();
  }

  public lineStyle(width: number, color?: string, alpha?: number): this;
  public lineStyle(options: ILineStyleOptions): this;
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

  public resetLineStyle(): void {
    this._lineStyle.reset();
  }

  protected drawShape(shape: Shape): Graphics {
    this._geometry.drawShape(shape, this._fillStyle.clone(), this._lineStyle.clone());
    return this;
  }

  /**
   * 清空已有的 path，开始新的 path
   */
  protected startPoly(): void {
    if (this.currentPath.points.length > 2) {
      // 如果点的个数大于或等于 2，那么就算一个有效的 path，需要将其画出来
      this.drawShape(this.currentPath);
    }

    this.currentPath = new Polygon();
  }

  /**
   * 开始填充模式，接下来绘制的所有路径都将被填充，直到调用了 endFill
   * @param color 填充颜色
   * @param alpha 不透明度
   */
  public beginFill(color = '#000000', alpha = 1): Graphics {
    // 在填充参数变化之前，先将已有的 path 画出来
    this.startPoly();

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
  public endFill(): Graphics {
    this.startPoly();

    this._fillStyle.reset();

    return this;
  }

  /**
   * 画矩形
   * @param x x 坐标
   * @param y y 坐标
   * @param width 宽度
   * @param height 高度
   */
  public drawRect(x: number, y: number, width: number, height: number): Graphics {
    return this.drawShape(new Rectangle(x, y, width, height));
  }

  /**
   * 画圆
   * @param x 圆心 X 坐标
   * @param y 圆心 Y 坐标
   * @param radius 半径
   */
  public drawCircle(x: number, y: number, radius: number): Graphics {
    return this.drawShape(new Circle(x, y, radius));
  }

  /**
   * 画圆角矩形
   * @param x x 坐标
   * @param y y 坐标
   * @param width 宽度
   * @param height 高度
   * @param radius 圆角半径
   */
  public drawRoundedRect(x: number, y: number, width: number, height: number, radius: number): Graphics {
    return this.drawShape(new RoundedRectangle(x, y, width, height, radius));
  }
  // 画椭圆
  public drawEllipse(x: number, y: number, radiusX: number, radiusY: number): Graphics {
    return this.drawShape(new Ellipse(x, y, radiusX, radiusY));
  }

  /**
   * 画多边形
   * @param points 多边形顶点坐标数组，每 2 个元素算一组 (x,y)
   */
  public drawPolygon(points: number[]): Graphics {
    const poly = new Polygon(points);
    poly.closeStroke = true;

    return this.drawShape(poly);
  }

  public moveTo(x: number, y: number): Graphics {
    this.startPoly();
    this.currentPath.points[0] = x;
    this.currentPath.points[1] = y;

    return this;
  }

  public lineTo(x: number, y: number): Graphics {
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
  }

  public closePath(): Graphics {
    this.currentPath.closeStroke = true;
    this.startPoly();

    return this;
  }

  /**
   * 画二阶贝塞尔曲线
   * @param cpX 控制点的 X 坐标
   * @param cpY 控制点的 Y 坐标
   * @param toX 终点的 X 坐标
   * @param toY 终点的 Y 坐标
   */
  public quadraticCurveTo(cpX: number, cpY: number, toX: number, toY: number): Graphics {
    const len = this.currentPath.points.length;

    if (len === 0) {
      this.moveTo(0, 0);
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

    // 计算出采样点的坐标然后放入points数组
    for (let i = 1; i <= segmentsCount; i++) {
      const t = i / segmentsCount;

      // 直接套用二阶贝塞尔曲线的公式
      const x = (1 - t) * (1 - t) * P0X + 2 * t * (1 - t) * P1X + t * t * P2X;
      const y = (1 - t) * (1 - t) * P0Y + 2 * t * (1 - t) * P1Y + t * t * P2Y;

      this.lineTo(x, y);
    }

    return this;
  }

  /**
   * 画三阶贝塞尔曲线
   * @param cpX 控制点1的X坐标
   * @param cpY 控制点1的Y坐标
   * @param cpX2 控制点2的X坐标
   * @param cpY2 控制点2的Y坐标
   * @param toX 终点的X坐标
   * @param toY 终点的Y坐标
   */
  public bezierCurveTo(cpX: number, cpY: number, cpX2: number, cpY2: number, toX: number, toY: number): Graphics {
    const len = this.currentPath.points.length;

    if (len === 0) {
      this.moveTo(0, 0);
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

    // 最大2048份
    if (segmentsCount > 2048) {
      segmentsCount = 2048;
    }

    // 最小 8 份
    if (segmentsCount < 8) {
      segmentsCount = 8;
    }

    // 计算出采样点的坐标然后放入points数组
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

      this.lineTo(x, y);
    }

    return this;
  }

  /**
   * 画圆弧
   * @param cx 圆弧对应的圆的中心点的x坐标
   * @param cy 圆弧对应的圆的中心点的y坐标
   * @param radius 半径
   * @param startAngle 开始角度
   * @param endAngle 结束角度
   * @param anticlockwise 是否逆时针
   */
  public arc(
    cx: number,
    cy: number,
    radius: number,
    startAngle: number,
    endAngle: number,
    anticlockwise = false,
  ): Graphics {
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
  }

  /**
   * 画圆弧
   * @param x1 控制点1的x坐标
   * @param y1 控制点1的y坐标
   * @param x2 控制点2的x坐标
   * @param y2 控制点2的y坐标
   * @param radius 半径
   */
  public arcTo(x1: number, y1: number, x2: number, y2: number, radius: number): Graphics {
    const len = this.currentPath.points.length;

    /**
     * 如果画笔当前没有落点，则该操作相当于moveTo(x1, y1)
     * 如果半径为0，则该操作也相当于lineTo(x1, y1)
     */
    if (len === 0 || radius === 0) {
      this.lineTo(x1, y1);
      return this;
    }

    /**
     * 假设画笔落点为P0，控制点1为P1，控制点2为P2，如果向量P0P1和向量P1P2的夹角太小或者夹角接近180度，
     * 或者向量P0P1或向量P1P2其中一个的长度为0，
     * 那么该操作也相当于moveTo(x1, y1)，
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

    // copy from pixijs
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
  }

  public clear(): Graphics {
    this._geometry.clear();
    this._lineStyle.reset();
    this._fillStyle.reset();
    this.currentPath = new Polygon();

    return this;
  }

  /**
   * 调用 canvas API 绘制自身
   */
  protected renderCanvas(render: CanvasRenderer): void {
    this.startPoly();

    const ctx = render.ctx;
    const { a, b, c, d, tx, ty } = this.transform.worldTransform;

    ctx.setTransform(a, b, c, d, tx, ty);

    const graphicsData = this._geometry.graphicsData;

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
      // 矩形
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
      // 圆
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
      // 圆角矩形
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
      // 椭圆
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
      // 多边形
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
  }
  public containsPoint(p: Point): boolean {
    return this._geometry.containsPoint(p);
  }
}
