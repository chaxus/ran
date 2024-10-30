import earcut from 'earcut';
import { Circle, Ellipse, Polygon, Rectangle, RoundedRectangle } from '@/utils/visual/shape';
import type { GraphicsData } from '@/utils/visual/graphics/graphicsData';
import { BatchPart } from '@/utils/visual/render/utils/batch';
import type { GraphicsGeometry } from '@/utils/visual/graphics/graphicsGeometry';
import { LINE_CAP, LINE_JOIN } from '@/utils/visual/enums';

const buildCircleVertices = (circle: Circle, data: GraphicsData) => {
  const { x, y, radius } = circle;
  const len = 2 * Math.PI * radius;
  const segmentCount = Math.min(Math.ceil(len / 5), 2048);

  for (let i = 0; i < segmentCount; i++) {
    const angle = (i / segmentCount) * Math.PI * 2;
    const pX = x + radius * Math.cos(angle);
    const pY = y + radius * Math.sin(angle);
    data.vertices.push(pX, pY);
  }
};

const buildRoundedRectangleVertices = (roundedRectangle: RoundedRectangle, data: GraphicsData) => {
  const { x, y, width, height, radius } = roundedRectangle;

  // 分 4 段来求
  const len = (2 * Math.PI * radius) / 4;
  const segmentCount = Math.min(Math.ceil(len / 4), 2048);

  // 第一段圆弧 (圆角矩形的右下角)
  for (let i = 0; i < segmentCount; i++) {
    const angle = (i / segmentCount) * Math.PI * 0.5;

    const pX = radius * Math.cos(angle);
    const pY = radius * Math.sin(angle);

    data.vertices.push(x + width - radius + pX, y + height - radius + pY);
  }

  // 第二段圆弧(圆角矩形的左下角)
  for (let i = 0; i < segmentCount; i++) {
    const angle = (i / segmentCount) * Math.PI * 0.5 + Math.PI / 2;

    const pX = radius * Math.cos(angle);
    const pY = radius * Math.sin(angle);

    data.vertices.push(x + radius + pX, y + height - radius + pY);
  }

  // 第三段圆弧(圆角矩形的左上角)
  for (let i = 0; i < segmentCount; i++) {
    const angle = (i / segmentCount) * Math.PI * 0.5 + Math.PI;

    const pX = radius * Math.cos(angle);
    const pY = radius * Math.sin(angle);

    data.vertices.push(x + radius + pX, y + radius + pY);
  }

  // 第四段圆弧(圆角矩形的右上角)
  for (let i = 0; i < segmentCount; i++) {
    const angle = (i / segmentCount) * Math.PI * 0.5 + Math.PI * 1.5;

    const pX = radius * Math.cos(angle);
    const pY = radius * Math.sin(angle);

    data.vertices.push(x + width - radius + pX, y + radius + pY);
  }
};

const buildEllipseVertices = (ellipse: Ellipse, data: GraphicsData) => {
  const { x, y, radiusX, radiusY } = ellipse;

  const len = Math.PI * Math.sqrt(2 * (radiusX * radiusX + radiusY * radiusY));
  const segmentCount = Math.min(Math.ceil(len / 5), 2048);

  for (let i = 0; i < segmentCount; i++) {
    const angle = (i / segmentCount) * Math.PI * 2;
    const pX = x + radiusX * Math.cos(angle);
    const pY = y + radiusY * Math.sin(angle);
    data.vertices.push(pX, pY);
  }
};

/**
 * 将一个图形顶点化
 * @param data 子图形data
 */
export const buildVertices = (data: GraphicsData): void => {
  const { shape, vertices } = data;
  if (shape instanceof Rectangle) {
    const { x, y, width, height } = shape;
    vertices.push(x, y, x + width, y, x + width, y + height, x, y + height);
  }

  if (shape instanceof Circle) {
    buildCircleVertices(shape, data);
  }

  if (shape instanceof RoundedRectangle) {
    buildRoundedRectangleVertices(shape, data);
  }

  if (shape instanceof Ellipse) {
    buildEllipseVertices(shape, data);
  }

  if (shape instanceof Polygon) {
    // 多边形本身就是一系列的顶点
    data.vertices = shape.points;
  }
};

const triangulateCircleFill = (vertices: number[]) => {
  const indices: number[] = [];

  // 之前把中心点 push 到了顶点数组，所以顶点的个数要 +1
  const len = vertices.length / 2 + 1;

  for (let i = 1; i < len - 1; i++) {
    indices.push(0, i, i + 1);
  }

  // 还有最后一块
  indices.push(0, len - 1, 1);

  return indices;
};

export const triangulateFill = (data: GraphicsData, geometry: GraphicsGeometry): void => {
  const { shape, vertices, fillStyle } = data;

  const batchPart = new BatchPart(fillStyle);
  geometry.batchParts.push(batchPart);

  batchPart.start(geometry.vertices.length / 2, geometry.indices.length);

  if (shape instanceof Rectangle) {
    geometry.vertices.concat(vertices);
    geometry.indices.concat([0, 1, 2, 0, 2, 3]);

    // 矩形的顶点是固定的 4 个，顶点下标则是固定的 6 个
    batchPart.end(4, 6);
  }

  if (shape instanceof Circle) {
    const { x, y } = shape;

    // 先将圆心 push 进去
    geometry.vertices.push(x);
    geometry.vertices.push(y);

    geometry.vertices.concat(vertices);

    const indices = triangulateCircleFill(vertices);
    geometry.indices.concat(indices);

    batchPart.end(vertices.length / 2 + 1, indices.length);
  }

  if (shape instanceof RoundedRectangle) {
    const { x, y, width, height } = shape;

    // 先将中心点 push 进去
    geometry.vertices.push(x + width / 2);
    geometry.vertices.push(y + height / 2);

    geometry.vertices.concat(vertices);

    const indices = triangulateCircleFill(vertices);
    geometry.indices.concat(indices);

    batchPart.end(vertices.length / 2 + 1, indices.length);
  }

  if (shape instanceof Ellipse) {
    const { x, y } = shape;

    // 先将椭圆中心点 push 进去
    geometry.vertices.push(x);
    geometry.vertices.push(y);

    geometry.vertices.concat(vertices);

    const indices = triangulateCircleFill(vertices);
    geometry.indices.concat(indices);

    batchPart.end(vertices.length / 2 + 1, indices.length);
  }

  if (shape instanceof Polygon) {
    geometry.vertices.concat(vertices);

    const indices = earcut(vertices);
    geometry.indices.concat(indices);

    batchPart.end(vertices.length / 2, indices.length);
  }
};

/**
 * 求两条线段所在的直线的交点，原理：https://www.cnblogs.com/xpvincent/p/5208994.html
 * @param p0x 线段 1 的第一个点的 x
 * @param p0y 线段 1 的第一个点的 y
 * @param p1x 线段 1 的第二个点的 x
 * @param p1y 线段 1 的第二个点的 y
 * @param p2x 线段 2 的第一个点的 x
 * @param p2y 线段 2 的第一个点的 y
 * @param p3x 线段 2 的第二个点的 x
 * @param p3y 线段 2 的第二个点的 y
 * @returns {number[]} 交点坐标
 */
const getIntersectingPoint = (
  p0x: number,
  p0y: number,
  p1x: number,
  p1y: number,
  p2x: number,
  p2y: number,
  p3x: number,
  p3y: number,
): [number, number] => {
  let a = 0;
  let b = 0;
  let c = 0;
  let d = 0;
  let e = 0;
  let f = 0;

  if (Math.abs(p1x - p0x) <= Number.EPSILON) {
    // 是否是垂直线段
    // 垂直线段的解析式为x=a
    a = 1;
    b = 0;
    e = p1x;
  } else {
    // 得到y = kx + b形式的解析式，就得到了a、b和e
    const k = (p1y - p0y) / (p1x - p0x);
    const b0 = p1y - k * p1x;

    a = k;
    b = -1;
    e = -b0;
  }

  // 同理
  if (Math.abs(p3x - p2x) <= Number.EPSILON) {
    c = 1;
    d = 0;
    f = p3x;
  } else {
    const k = (p3y - p2y) / (p3x - p2x);
    const b0 = p3y - k * p3x;

    c = k;
    d = -1;
    f = -b0;
  }

  const x = (e * d - b * f) / (a * d - b * c);
  const y = (a * f - e * c) / (a * d - b * c);

  return [x, y];
};

export const getNormalVector = (x: number, y: number, lineWidth: number): [number, number] => {
  // 旋转 90 度后就是一个法向量了
  const newX = y;
  const newY = -x;

  const len = Math.sqrt(x * x + y * y);

  const finalLen = lineWidth / 2;

  const scale = finalLen / len;

  return [newX * scale, newY * scale];
};

const buildRoundCorner = (
  cx: number,
  cy: number,
  p1x: number,
  p1y: number,
  p2x: number,
  p2y: number,
  lineVertices: number[],
  lineVertexIndices: number[],
) => {
  const v1x = p1x - cx;
  const v1y = p1y - cy;
  const v2x = p2x - cx;
  const v2y = p2y - cy;

  let startAngle = 0;
  // 先判断是否落在坐标轴上，再判断落在第几象限
  if (v1x === 0) {
    if (v1y > 0) {
      startAngle = Math.PI * 0.5;
    } else {
      startAngle = Math.PI * 1.5;
    }
  } else if (v1y === 0) {
    if (v1x > 0) {
      startAngle = 0;
    } else {
      startAngle = Math.PI;
    }
  } else if (v1x >= 0 && v1y >= 0) {
    // 第一象限
    startAngle = Math.atan(v1y / v1x);
  } else if (v1x <= 0 && v1y >= 0) {
    // 第二象限
    startAngle = Math.atan(-v1x / v1y) + Math.PI * 0.5;
  } else if (v1x <= 0 && v1y <= 0) {
    // 第三象限
    startAngle = Math.atan(v1y / v1x) + Math.PI;
  } else {
    // 第四象限
    startAngle = Math.atan(v1x / -v1y) + Math.PI * 1.5;
  }

  let endAngle = 0;
  if (v2x === 0) {
    if (v2y > 0) {
      endAngle = Math.PI * 0.5;
    } else {
      endAngle = Math.PI * 1.5;
    }
  } else if (v2y === 0) {
    if (v2x > 0) {
      endAngle = 0;
    } else {
      endAngle = Math.PI;
    }
  } else if (v2x >= 0 && v2y >= 0) {
    // 第一象限
    endAngle = Math.atan(v2y / v2x);
  } else if (v2x <= 0 && v2y >= 0) {
    // 第二象限
    endAngle = Math.atan(-v2x / v2y) + Math.PI * 0.5;
  } else if (v2x <= 0 && v2y <= 0) {
    // 第三象限
    endAngle = Math.atan(v2y / v2x) + Math.PI;
  } else {
    // 第四象限
    endAngle = Math.atan(v2x / -v2y) + Math.PI * 1.5;
  }

  if (startAngle > endAngle) {
    startAngle -= Math.PI * 2;
  }

  const radius = Math.sqrt((p1x - cx) * (p1x - cx) + (p1y - cy) * (p1y - cy));
  const segmentCount = (2 * Math.PI * radius) / 3;

  const cursor = lineVertices.length / 2;

  lineVertices.push(cx, cy, p1x, p1y);

  for (let i = 1; i < segmentCount; i++) {
    const angle = startAngle + (endAngle - startAngle) * (i / segmentCount);
    const x = cx + radius * Math.cos(angle);
    const y = cy + radius * Math.sin(angle);
    lineVertices.push(x, y);
  }

  lineVertices.push(p2x, p2y);

  for (let i = 1; i < lineVertices.length / 2 - cursor - 1; i++) {
    lineVertexIndices.push(0 + cursor, i + cursor, i + 1 + cursor);
  }
};

/**
 * 构建描边的顶点 & 对其进行三角剖分
 */
export const triangulateStroke = (data: GraphicsData, geometry: GraphicsGeometry): void => {
  const { vertices, shape, lineStyle } = data;
  const { width: lineWidth, cap: lineCap, join: lineJoin, miterLimit } = lineStyle;
  let cursor = 0;

  let closedShape = false;
  if (shape instanceof Polygon) {
    if (shape.closeStroke) {
      closedShape = true;
    }
  } else {
    closedShape = true;
  }

  // 如果是封闭的 stroke，则需要在首尾顶点中间的位置插入 2 个一样的顶点，这是为了处理起点和终点处的 lineJoin
  if (closedShape) {
    // 第一个点
    const fx = vertices[0];
    const fy = vertices[1];

    // 最后一个点
    const lx = vertices[vertices.length - 2];
    const ly = vertices[vertices.length - 1];

    // 如果第一个点和最后一个点的距离太近了，那么需要去掉一个点
    if (Math.abs(fx - lx) < 0.0001 && Math.abs(fy - ly) < 0.0001) {
      vertices.pop();
      vertices.pop();
    }

    // 最后一个点
    const nlx = vertices[vertices.length - 2];
    const nly = vertices[vertices.length - 1];

    // 中间的点
    const mx = (fx + nlx) / 2;
    const my = (fy + nly) / 2;

    vertices.unshift(mx, my);
    vertices.push(mx, my);
  }

  const batchPart = new BatchPart(lineStyle);
  geometry.batchParts.push(batchPart);

  batchPart.start(geometry.vertices.length / 2, geometry.indices.length);

  const lineVertices: number[] = [];
  const lineIndices: number[] = [];

  // 第一个点
  const fx = vertices[0];
  const fy = vertices[1];
  // 第二个点
  const sx = vertices[2];
  const sy = vertices[3];

  const [nvx, nvy] = getNormalVector(sx - fx, sy - fy, lineWidth);

  // 处理起点的lineCap，只有非封闭stroke需要处理
  if (!closedShape) {
    if (lineCap === LINE_CAP.SQUARE) {
      // 将法向量再旋转90度
      const nnvx = nvy;
      const nnvy = -nvx;

      // Square相当于一个矩形
      lineVertices.push(
        fx + nvx,
        fy + nvy,
        fx + nvx + nnvx,
        fy + nvy + nnvy,
        fx - nvx + nnvx,
        fy - nvy + nnvy,
        fx - nvx,
        fy - nvy,
      );

      lineIndices.push(0, 1, 2, 0, 2, 3);
    }

    if (lineCap === LINE_CAP.ROUND) {
      buildRoundCorner(fx, fy, fx - nvx, fy - nvy, fx + nvx, fy + nvy, lineVertices, lineIndices);
    }

    if (lineCap === LINE_CAP.BUTT) {
      // butt是默认值
      // 什么都不用做
    }
  }

  cursor = lineVertices.length / 2;

  // 往顶点数组里塞2个顶点，以供下一次处理lineJoin使用
  lineVertices.push(fx - nvx, fy - nvy, fx + nvx, fy + nvy);

  // 处理每一个线段以及线段之间的lineJoin
  for (let i = 2; i < vertices.length - 2; i += 2) {
    // 第一个点
    const x0 = vertices[i - 2];
    const y0 = vertices[i - 1];
    // 第二个点
    const x1 = vertices[i];
    const y1 = vertices[i + 1];
    // 第三个点
    const x2 = vertices[i + 2];
    const y2 = vertices[i + 3];

    const [nvx1, nvy1] = getNormalVector(x1 - x0, y1 - y0, lineWidth);
    const [nvx2, nvy2] = getNormalVector(x2 - x1, y2 - y1, lineWidth);

    const dx0 = x1 - x0;
    const dy0 = y1 - y0;
    const dx1 = x2 - x1;
    const dy1 = y2 - y1;

    const cross = dx1 * dy0 - dx0 * dy1; // 叉积
    const dot = dx0 * dx1 + dy0 * dy1; // 点积

    // 判断两个线段的夹角是否约等于0或者180度
    if (Math.abs(cross) < 0.001 * Math.abs(dot)) {
      // 右边乘以点积，让这个判断逻辑不受线段长度的影响，从而更加准确

      /**
       * 处理线段本身
       */
      lineVertices.push(x1 + nvx1, y1 + nvy1, x1 - nvx1, y1 - nvy1);
      lineIndices.push(0 + cursor, 1 + cursor, 2 + cursor, 0 + cursor, 2 + cursor, 3 + cursor);

      cursor = lineVertices.length / 2;

      if (dot > 0) {
        // 两个线段同向，当作 0 度处理

        // 往顶点数组里塞 2 个顶点，以供下一次处理 lineJoin 使用
        lineVertices.push(x1 - nvx1, y1 - nvy1, x1 + nvx1, y1 + nvy1);
      } else {
        // 两个线段反向，则当作 180 度处理
        if (lineJoin === LINE_JOIN.ROUND) {
          buildRoundCorner(x1, y1, x1 + nvx1, y1 + nvy1, x1 - nvx1, y1 - nvy1, lineVertices, lineIndices);

          cursor = lineVertices.length / 2;
        }

        if (lineJoin === LINE_JOIN.BEVEL || lineJoin === LINE_JOIN.MITER) {
          // 什么都不用做
        }

        // 往顶点数组里塞 2 个顶点，以供下一次处理 lineJoin 使用
        lineVertices.push(x1 + nvx1, y1 + nvy1, x1 - nvx1, y1 - nvy1);
      }

      continue;
    }

    // 外侧的 miter point
    const [ompx, ompy] = getIntersectingPoint(
      x0 + nvx1,
      y0 + nvy1,
      x1 + nvx1,
      y1 + nvy1,
      x1 + nvx2,
      y1 + nvy2,
      x2 + nvx2,
      y2 + nvy2,
    );
    // 内侧的 miter point
    const [impx, impy] = getIntersectingPoint(
      x0 - nvx1,
      y0 - nvy1,
      x1 - nvx1,
      y1 - nvy1,
      x1 - nvx2,
      y1 - nvy2,
      x2 - nvx2,
      y2 - nvy2,
    );

    let realLineJoin = lineJoin;
    if (lineJoin === LINE_JOIN.MITER) {
      // miterLength 的平方
      const miterLenSq = (impx - ompx) ** 2 + (impy - ompy) ** 2;
      const lineWidthSq = lineWidth ** 2;

      const miterOk = miterLenSq / lineWidthSq <= miterLimit ** 2;

      if (!miterOk) {
        // 超出了miterLimit则将此处的lineJoin置为'bevel'
        realLineJoin = LINE_JOIN.BEVEL;
      }
    }

    const lineLen1Sq = dx0 * dx0 + dy0 * dy0;
    const diagonal1Sq = lineLen1Sq + (lineWidth / 2) ** 2;
    const lineLen2Sq = dx1 * dx1 + dy1 * dy1;
    const diagonal2Sq = lineLen2Sq + (lineWidth / 2) ** 2;

    const isLineLongEnough = (impx - x1) ** 2 + (impy - y1) ** 2 < Math.min(diagonal1Sq, diagonal2Sq);

    if (isLineLongEnough) {
      if (realLineJoin === LINE_JOIN.BEVEL) {
        if (cross > 0) {
          // 四边形
          lineVertices.push(ompx, ompy, x1 - nvx1, y1 - nvy1);
          lineIndices.push(0 + cursor, 1 + cursor, 2 + cursor, 0 + cursor, 2 + cursor, 3 + cursor);

          cursor = lineVertices.length / 2;

          // 三角形
          lineVertices.push(ompx, ompy, x1 - nvx1, y1 - nvy1, x1 - nvx2, y1 - nvy2);

          lineIndices.push(0 + cursor, 1 + cursor, 2 + cursor);

          cursor = lineVertices.length / 2;

          // 结尾
          lineVertices.push(x1 - nvx2, y1 - nvy2, ompx, ompy);
        } else {
          // 四边形
          lineVertices.push(x1 + nvx1, y1 + nvy1, impx, impy);
          lineIndices.push(0 + cursor, 1 + cursor, 2 + cursor, 0 + cursor, 2 + cursor, 3 + cursor);

          cursor = lineVertices.length / 2;

          // 三角形
          lineVertices.push(impx, impy, x1 + nvx1, y1 + nvy1, x1 + nvx2, y1 + nvy2);

          lineIndices.push(0 + cursor, 1 + cursor, 2 + cursor);

          cursor = lineVertices.length / 2;

          // 结尾
          lineVertices.push(impx, impy, x1 + nvx2, y1 + nvy2);
        }
      }

      if (realLineJoin === LINE_JOIN.MITER) {
        lineVertices.push(ompx, ompy, impx, impy);
        lineIndices.push(0 + cursor, 1 + cursor, 2 + cursor, 0 + cursor, 2 + cursor, 3 + cursor);
        cursor = lineVertices.length / 2;

        lineVertices.push(impx, impy, ompx, ompy);
      }

      if (realLineJoin === LINE_JOIN.ROUND) {
        if (cross < 0) {
          // 四边形
          lineVertices.push(x1 + nvx1, y1 + nvy1, impx, impy);
          lineIndices.push(0 + cursor, 1 + cursor, 2 + cursor, 0 + cursor, 2 + cursor, 3 + cursor);

          cursor = lineVertices.length / 2;

          // 三角形1
          lineVertices.push(impx, impy, x1 + nvx1, y1 + nvy1, x1, y1);
          lineIndices.push(0 + cursor, 1 + cursor, 2 + cursor);

          cursor = lineVertices.length / 2;

          // 三角形2
          lineVertices.push(impx, impy, x1 + nvx2, y1 + nvy2, x1, y1);
          lineIndices.push(0 + cursor, 1 + cursor, 2 + cursor);

          cursor = lineVertices.length / 2;

          // 扇形
          buildRoundCorner(x1, y1, x1 + nvx1, y1 + nvy1, x1 + nvx2, y1 + nvy2, lineVertices, lineIndices);

          cursor = lineVertices.length / 2;

          // 线段的结尾
          lineVertices.push(impx, impy, x1 + nvx2, y1 + nvy2);
        } else {
          // 四边形
          lineVertices.push(ompx, ompy, x1 - nvx1, y1 - nvy1);
          lineIndices.push(0 + cursor, 1 + cursor, 2 + cursor, 0 + cursor, 2 + cursor, 3 + cursor);

          cursor = lineVertices.length / 2;

          // 三角形1
          lineVertices.push(ompx, ompy, x1 - nvx1, y1 - nvy1, x1, y1);
          lineIndices.push(0 + cursor, 1 + cursor, 2 + cursor);

          cursor = lineVertices.length / 2;

          // 三角形2
          lineVertices.push(ompx, ompy, x1 - nvx2, y1 - nvy2, x1, y1);
          lineIndices.push(0 + cursor, 1 + cursor, 2 + cursor);

          cursor = lineVertices.length / 2;

          // 扇形
          buildRoundCorner(x1, y1, x1 - nvx2, y1 - nvy2, x1 - nvx1, y1 - nvy1, lineVertices, lineIndices);

          cursor = lineVertices.length / 2;

          // 线段的结尾
          lineVertices.push(x1 - nvx2, y1 - nvy2, ompx, ompy);
        }
      }
    } else {
      // 线段1的整体
      lineVertices.push(x1 + nvx1, y1 + nvy1, x1 - nvx1, y1 - nvy1);
      lineIndices.push(0 + cursor, 1 + cursor, 2 + cursor, 0 + cursor, 2 + cursor, 3 + cursor);

      cursor = lineVertices.length / 2;

      if (realLineJoin === LINE_JOIN.BEVEL) {
        if (cross > 0) {
          // 三角形
          lineVertices.push(x1, y1, x1 - nvx1, y1 - nvy1, x1 - nvx2, y1 - nvy2);
          lineIndices.push(0 + cursor, 1 + cursor, 2 + cursor);
        } else {
          // 三角形
          lineVertices.push(x1, y1, x1 + nvx1, y1 + nvy1, x1 + nvx2, y1 + nvy2);
          lineIndices.push(0 + cursor, 1 + cursor, 2 + cursor);
        }
      }

      if (realLineJoin === LINE_JOIN.MITER) {
        if (cross > 0) {
          // 2 个三角形
          lineVertices.push(x1, y1, x1 - nvx1, y1 - nvy1, impx, impy, x1 - nvx2, y1 - nvy2);
          lineIndices.push(0 + cursor, 1 + cursor, 2 + cursor, 0 + cursor, 2 + cursor, 3 + cursor);
        } else {
          // 2 个三角形
          lineVertices.push(x1, y1, x1 + nvx1, y1 + nvy1, ompx, ompy, x1 + nvx2, y1 + nvy2);
          lineIndices.push(0 + cursor, 1 + cursor, 2 + cursor, 0 + cursor, 2 + cursor, 3 + cursor);
        }
      }

      if (realLineJoin === LINE_JOIN.ROUND) {
        if (cross > 0) {
          // 一个扇形
          buildRoundCorner(x1, y1, x1 - nvx2, y1 - nvy2, x1 - nvx1, y1 - nvy1, lineVertices, lineIndices);
        } else {
          // 一个扇形
          buildRoundCorner(x1, y1, x1 + nvx1, y1 + nvy1, x1 + nvx2, y1 + nvy2, lineVertices, lineIndices);
        }
      }

      cursor = lineVertices.length / 2;

      lineVertices.push(x1 - nvx2, y1 - nvy2, x1 + nvx2, y1 + nvy2);
    }
  }

  // 处理最后一个线段
  const lastX = vertices[vertices.length - 2];
  const lastY = vertices[vertices.length - 1];
  const secondLastX = vertices[vertices.length - 4];
  const secondLastY = vertices[vertices.length - 3];
  const [lastNvx, lastNvy] = getNormalVector(lastX - secondLastX, lastY - secondLastY, lineWidth);

  lineVertices.push(lastX + lastNvx, lastY + lastNvy, lastX - lastNvx, lastY - lastNvy);

  lineIndices.push(0 + cursor, 1 + cursor, 2 + cursor, 0 + cursor, 2 + cursor, 3 + cursor);

  cursor = lineVertices.length / 2;

  // 处理终点的 lineCap，只有非封闭 stroke 需要处理
  if (!closedShape) {
    // 最后一个点
    const lx = vertices[vertices.length - 2];
    const ly = vertices[vertices.length - 1];
    // 倒数第二个点
    const slx = vertices[vertices.length - 4];
    const sly = vertices[vertices.length - 3];

    const [nvx, nvy] = getNormalVector(lx - slx, ly - sly, lineWidth);

    if (lineCap === LINE_CAP.SQUARE) {
      // 将法向量再旋转 90 度
      const nnvx = -nvy;
      const nnvy = nvx;

      lineVertices.push(
        lx + nvx,
        ly + nvy,
        lx + nvx + nnvx,
        ly + nvy + nnvy,
        lx - nvx + nnvx,
        ly - nvy + nnvy,
        lx - nvx,
        ly - nvy,
      );

      lineIndices.push(0 + cursor, 1 + cursor, 2 + cursor, 0 + cursor, 2 + cursor, 3 + cursor);
    }

    if (lineCap === LINE_CAP.ROUND) {
      buildRoundCorner(lx, ly, lx + nvx, ly + nvy, lx - nvx, ly - nvy, lineVertices, lineIndices);
    }
  }

  geometry.vertices.concat(lineVertices);
  geometry.indices.concat(lineIndices);

  batchPart.end(lineVertices.length / 2, lineIndices.length);
};
