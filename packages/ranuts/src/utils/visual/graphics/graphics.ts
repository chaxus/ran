import { Container } from '@/utils/visual/vertex/container';
import { Polygon } from '@/utils/visual/shape/polygon';
import { Rectangle } from '@/utils/visual/shape/rectangle';
import { Fill } from '@/utils/visual/style/fill';
import { Line } from '@/utils/visual/style/line';
import { GraphicsGeometry } from '@/utils/visual/graphics/graphicsGeometry';
import { getBezierLength, getQuadraticBezierLength } from '@/utils/visual/math/bezier';
import { Circle } from '@/utils/visual/shape/circle';
import { RoundedRectangle } from '@/utils/visual/shape/roundedRectangle';
import { Ellipse } from '@/utils/visual/shape/ellipse';
import { toRgbaLittleEndian } from '@/utils/visual/render/utils';
import { batchPool } from '@/utils/visual/render/utils/batch';
import { GRAPHICS } from '@/utils/visual/enums';
import type { GraphicsBatch } from '@/utils/visual/render/utils/batch';
import type { Shape } from '@/utils/visual/shape/shape';
import type { BatchRenderer } from '@/utils/visual/render/batchRenderer';
import type { ILineStyleOptions } from '@/utils/visual/types';
import type { CanvasRenderer } from '@/utils/visual/render/canvasRenderer';
import type { Point } from '@/utils/visual/vertex/point';

// Graphics extends Container: the container that draws shapes
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
  public lineStyle(options: ILineStyleOptions | number, color: string = '#000000', alpha: number = 1): Graphics {
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
    // The geometry changed — tell the renderer to rebuild the big array
    this.markStructureDirty();
    return this;
  };
  /**
   * Finish the current path and start a new one
   */
  protected startPoly = (): void => {
    const len = this.currentPath.points.length;
    if (len > 2) {
      // More than 2 points makes it a valid path
      this.drawShape(this.currentPath);
    }
    this.currentPath = new Polygon();
  };
  // Call this before filling a shape, to give the pen its fill colour
  public beginFill = (color = '#000000', alpha = 1): Graphics => {
    // Flush the current path before the fill parameters change
    this.startPoly();
    this._fillStyle.color = color;
    this._fillStyle.alpha = alpha;
    if (this._fillStyle.alpha > 0) {
      this._fillStyle.visible = true;
    }
    return this;
  };
  /**
   * Leave fill mode
   */
  public endFill = (): Graphics => {
    this.startPoly();
    this._fillStyle.reset();
    return this;
  };
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
  /**
   * Draw a circle
   * @param x x of the centre
   * @param y y of the centre
   * @param radius radius
   */
  public drawCircle = (x: number, y: number, radius: number): Graphics => {
    return this.drawShape(new Circle(x, y, radius));
  };
  /**
   * Draw a rounded rectangle
   * @param x x coordinate
   * @param y y coordinate
   * @param width width
   * @param height height
   * @param radius corner radius
   */
  public drawRoundedRect = (x: number, y: number, width: number, height: number, radius: number): Graphics => {
    return this.drawShape(new RoundedRectangle(x, y, width, height, radius));
  };
  /**
   * Draw an ellipse
   * @param x x of the ellipse's centre
   * @param y y of the ellipse's centre
   * @param radiusX x-axis radius
   * @param radiusY y-axis radius
   */

  public drawEllipse = (x: number, y: number, radiusX: number, radiusY: number): Graphics => {
    return this.drawShape(new Ellipse(x, y, radiusX, radiusY));
  };

  /**
   * Draw a polygon
   * @param points the polygon's vertices; every 2 elements are one (x, y)
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

    // Drop duplicate points
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
    // With a hitArea set, only the hitArea is tested
    if (this.hitArea) {
      return this.hitArea.contains(p);
    }
    return this.geometry.containsPoint(p);
  };
  // Quadratic Bézier curve
  // Sampled into points, then joined into a straight-edged polygon approximating the curve
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
    // Length of the quadratic Bézier
    const curveLength = getQuadraticBezierLength(P0X, P0Y, P1X, P1Y, P2X, P2Y);
    let segmentsCount = Math.ceil(curveLength / 10); // one sample every 10 pixels
    // at most 2048 segments
    if (segmentsCount > 2048) {
      segmentsCount = 2048;
    }
    // at least 8 segments
    if (segmentsCount < 8) {
      segmentsCount = 8;
    }
    // Compute each sample's coordinates and push them into points
    for (let i = 1; i <= segmentsCount; i++) {
      const t = i / segmentsCount;
      // Straight from the quadratic Bézier formula
      const x = (1 - t) * (1 - t) * P0X + 2 * t * (1 - t) * P1X + t * t * P2X;
      const y = (1 - t) * (1 - t) * P0Y + 2 * t * (1 - t) * P1Y + t * t * P2Y;
      this.currentPath.points.push(x, y);
    }
    return this;
  };
  // Cubic Bézier curve
  // Sampled into points, then joined into a straight-edged polygon approximating the curve
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
    // Length of the cubic Bézier
    const curveLength = getBezierLength(P0X, P0Y, P1X, P1Y, P2X, P2Y, P3X, P3Y);
    let segmentsCount = Math.ceil(curveLength / 10); // one sample every 10 pixels
    // at most 2048 segments
    if (segmentsCount > 2048) {
      segmentsCount = 2048;
    }
    // at least 8 segments
    if (segmentsCount < 8) {
      segmentsCount = 8;
    }
    // Compute each sample's coordinates and push them into points
    for (let i = 1; i <= segmentsCount; i++) {
      const t = i / segmentsCount;
      // Straight from the cubic Bézier formula
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
  // Arc
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
    const curveLen = Math.abs(diff) * radius; // angle in radians times radius is the arc length
    let segmentsCount = Math.ceil(curveLen / 10);
    // at most 2048 segments
    if (segmentsCount > 2048) {
      segmentsCount = 2048;
    }
    // at least 8 segments
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
     * With no current point, this behaves as moveTo(x1, y1).
     * With a radius of 0, it behaves as lineTo(x1, y1).
     */
    if (len === 0 || radius === 0) {
      this.lineTo(x1, y1);
      return this;
    }
    /**
     * Take the current point as P0 and the control points as P1 and P2. When the angle
     * between P0P1 and P1P2 is very small or close to 180°, or either vector has zero
     * length, this also behaves as moveTo(x1, y1). The cross product detects that case.
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
    this.batches = [];
    this.batchCount = 0;
    // The geometry was cleared — tell the renderer to rebuild the big array
    this.markStructureDirty();
    return this;
  };
  /**
   * Draw itself through the Canvas API
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

  public buildBatches = (batchRenderer: BatchRenderer): void => {
    this.startPoly();
    this.worldId = this.transform.worldId;
    this.geometry.buildVerticesAndTriangulate();
    const batchParts = this.geometry.batchParts;
    for (let i = 0; i < batchParts.length; i++) {
      const { style, vertexStart, vertexCount, indexStart, indexCount } = batchParts[i];
      const { color, alpha } = style;
      const rgba = toRgbaLittleEndian(color, alpha * this.worldAlpha);
      const batch = batchPool.get(this.type) as GraphicsBatch;
      batch.vertexCount = vertexCount;
      batch.indexCount = indexCount;
      batch.rgba = rgba;
      batch.vertexOffset = vertexStart;
      batch.indexOffset = indexStart;
      batch.graphics = this;
      this.batches[i] = batch;
      batchRenderer.addBatch(this.batches[i]);
    }
    this.batchCount = batchParts.length;
  };

  public updateBatches = (floatView: Float32Array): void => {
    if (this.worldId === this.transform.worldId) {
      return;
    }
    this.worldId = this.transform.worldId;
    for (let i = 0; i < this.batchCount; i++) {
      this.batches[i].updateVertices(floatView);
    }
  };
}
