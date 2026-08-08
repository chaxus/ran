import earcut from './earcut';
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

  // Solved in four arcs
  const len = (2 * Math.PI * radius) / 4;
  const segmentCount = Math.min(Math.ceil(len / 4), 2048);

  // First arc (bottom-right corner)
  for (let i = 0; i < segmentCount; i++) {
    const angle = (i / segmentCount) * Math.PI * 0.5;

    const pX = radius * Math.cos(angle);
    const pY = radius * Math.sin(angle);

    data.vertices.push(x + width - radius + pX, y + height - radius + pY);
  }

  // Second arc (bottom-left corner)
  for (let i = 0; i < segmentCount; i++) {
    const angle = (i / segmentCount) * Math.PI * 0.5 + Math.PI / 2;

    const pX = radius * Math.cos(angle);
    const pY = radius * Math.sin(angle);

    data.vertices.push(x + radius + pX, y + height - radius + pY);
  }

  // Third arc (top-left corner)
  for (let i = 0; i < segmentCount; i++) {
    const angle = (i / segmentCount) * Math.PI * 0.5 + Math.PI;

    const pX = radius * Math.cos(angle);
    const pY = radius * Math.sin(angle);

    data.vertices.push(x + radius + pX, y + radius + pY);
  }

  // Fourth arc (top-right corner)
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
 * Turn a shape into vertices
 * @param data the sub-shape's data
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
    // A polygon is already a list of vertices
    data.vertices = shape.points;
  }
};

const triangulateCircleFill = (vertices: number[]) => {
  const indices: number[] = [];

  // The centre point was pushed onto the vertex array, so the count is one higher
  const len = vertices.length / 2 + 1;

  for (let i = 1; i < len - 1; i++) {
    indices.push(0, i, i + 1);
  }

  // And the final wedge
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

    // A rectangle is always 4 vertices and always 6 indices
    batchPart.end(4, 6);
  }

  if (shape instanceof Circle) {
    const { x, y } = shape;

    // Push the centre first
    geometry.vertices.push(x);
    geometry.vertices.push(y);

    geometry.vertices.concat(vertices);

    const indices = triangulateCircleFill(vertices);
    geometry.indices.concat(indices);

    batchPart.end(vertices.length / 2 + 1, indices.length);
  }

  if (shape instanceof RoundedRectangle) {
    const { x, y, width, height } = shape;

    // Push the centre first
    geometry.vertices.push(x + width / 2);
    geometry.vertices.push(y + height / 2);

    geometry.vertices.concat(vertices);

    const indices = triangulateCircleFill(vertices);
    geometry.indices.concat(indices);

    batchPart.end(vertices.length / 2 + 1, indices.length);
  }

  if (shape instanceof Ellipse) {
    const { x, y } = shape;

    // Push the ellipse's centre first
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
 * Intersection of the lines through two segments. Derivation: https://www.cnblogs.com/xpvincent/p/5208994.html
 * @param p0x x of segment 1's first point
 * @param p0y y of segment 1's first point
 * @param p1x x of segment 1's second point
 * @param p1y y of segment 1's second point
 * @param p2x x of segment 2's first point
 * @param p2y y of segment 2's first point
 * @param p3x x of segment 2's second point
 * @param p3y y of segment 2's second point
 * @returns {number[]} the intersection point
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
    // Vertical segment? A vertical line's equation is x = a
    a = 1;
    b = 0;
    e = p1x;
  } else {
    // Putting it in y = kx + b form gives a, b and e
    const k = (p1y - p0y) / (p1x - p0x);
    const b0 = p1y - k * p1x;

    a = k;
    b = -1;
    e = -b0;
  }

  // Same again for the other segment
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
  // Rotating by 90° gives the normal
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
  // First check whether it lies on an axis, then work out the quadrant
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
    // First quadrant
    startAngle = Math.atan(v1y / v1x);
  } else if (v1x <= 0 && v1y >= 0) {
    // Second quadrant
    startAngle = Math.atan(-v1x / v1y) + Math.PI * 0.5;
  } else if (v1x <= 0 && v1y <= 0) {
    // Third quadrant
    startAngle = Math.atan(v1y / v1x) + Math.PI;
  } else {
    // Fourth quadrant
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
    // First quadrant
    endAngle = Math.atan(v2y / v2x);
  } else if (v2x <= 0 && v2y >= 0) {
    // Second quadrant
    endAngle = Math.atan(-v2x / v2y) + Math.PI * 0.5;
  } else if (v2x <= 0 && v2y <= 0) {
    // Third quadrant
    endAngle = Math.atan(v2y / v2x) + Math.PI;
  } else {
    // Fourth quadrant
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
 * Build the stroke's vertices and triangulate them
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

  // A closed stroke needs two identical vertices inserted between the first and last points, so the join at the start/end is handled
  if (closedShape) {
    // First point
    const fx = vertices[0];
    const fy = vertices[1];

    // Last point
    const lx = vertices[vertices.length - 2];
    const ly = vertices[vertices.length - 1];

    // Drop one of them when the first and last points are too close together
    if (Math.abs(fx - lx) < 0.0001 && Math.abs(fy - ly) < 0.0001) {
      vertices.pop();
      vertices.pop();
    }

    // Last point
    const nlx = vertices[vertices.length - 2];
    const nly = vertices[vertices.length - 1];

    // Midpoint
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

  // First point
  const fx = vertices[0];
  const fy = vertices[1];
  // Second point
  const sx = vertices[2];
  const sy = vertices[3];

  const [nvx, nvy] = getNormalVector(sx - fx, sy - fy, lineWidth);

  // Handle the start cap — only an open stroke needs one
  if (!closedShape) {
    if (lineCap === LINE_CAP.SQUARE) {
      // Rotate the normal by another 90°
      const nnvx = nvy;
      const nnvy = -nvx;

      // 'square' amounts to a rectangle
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
      // 'butt' is the default — nothing to do
    }
  }

  cursor = lineVertices.length / 2;

  // Push two vertices for the next join to build on
  lineVertices.push(fx - nvx, fy - nvy, fx + nvx, fy + nvy);

  // Walk each segment and the join between them
  for (let i = 2; i < vertices.length - 2; i += 2) {
    // First point
    const x0 = vertices[i - 2];
    const y0 = vertices[i - 1];
    // Second point
    const x1 = vertices[i];
    const y1 = vertices[i + 1];
    // Third point
    const x2 = vertices[i + 2];
    const y2 = vertices[i + 3];

    const [nvx1, nvy1] = getNormalVector(x1 - x0, y1 - y0, lineWidth);
    const [nvx2, nvy2] = getNormalVector(x2 - x1, y2 - y1, lineWidth);

    const dx0 = x1 - x0;
    const dy0 = y1 - y0;
    const dx1 = x2 - x1;
    const dy1 = y2 - y1;

    const cross = dx1 * dy0 - dx0 * dy1; // cross product
    const dot = dx0 * dx1 + dy0 * dy1; // dot product

    // Is the angle between the two segments roughly 0° or 180°?
    if (Math.abs(cross) < 0.001 * Math.abs(dot)) {
      // Multiplying the right side by the dot product makes the test independent of segment length, and so more accurate

      /**
       * Handle the segment itself
       */
      lineVertices.push(x1 + nvx1, y1 + nvy1, x1 - nvx1, y1 - nvy1);
      lineIndices.push(0 + cursor, 1 + cursor, 2 + cursor, 0 + cursor, 2 + cursor, 3 + cursor);

      cursor = lineVertices.length / 2;

      if (dot > 0) {
        // Same direction — treat it as 0°

        // Push two vertices for the next join to build on
        lineVertices.push(x1 - nvx1, y1 - nvy1, x1 + nvx1, y1 + nvy1);
      } else {
        // Opposite directions — treat it as 180°
        if (lineJoin === LINE_JOIN.ROUND) {
          buildRoundCorner(x1, y1, x1 + nvx1, y1 + nvy1, x1 - nvx1, y1 - nvy1, lineVertices, lineIndices);

          cursor = lineVertices.length / 2;
        }

        if (lineJoin === LINE_JOIN.BEVEL || lineJoin === LINE_JOIN.MITER) {
          // nothing to do
        }

        // Push two vertices for the next join to build on
        lineVertices.push(x1 + nvx1, y1 + nvy1, x1 - nvx1, y1 - nvy1);
      }

      continue;
    }

    // Outer miter point
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
    // Inner miter point
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
      // miterLength squared
      const miterLenSq = (impx - ompx) ** 2 + (impy - ompy) ** 2;
      const lineWidthSq = lineWidth ** 2;

      const miterOk = miterLenSq / lineWidthSq <= miterLimit ** 2;

      if (!miterOk) {
        // Past miterLimit, so this join falls back to 'bevel'
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
          // quad
          lineVertices.push(ompx, ompy, x1 - nvx1, y1 - nvy1);
          lineIndices.push(0 + cursor, 1 + cursor, 2 + cursor, 0 + cursor, 2 + cursor, 3 + cursor);

          cursor = lineVertices.length / 2;

          // triangle
          lineVertices.push(ompx, ompy, x1 - nvx1, y1 - nvy1, x1 - nvx2, y1 - nvy2);

          lineIndices.push(0 + cursor, 1 + cursor, 2 + cursor);

          cursor = lineVertices.length / 2;

          // end
          lineVertices.push(x1 - nvx2, y1 - nvy2, ompx, ompy);
        } else {
          // quad
          lineVertices.push(x1 + nvx1, y1 + nvy1, impx, impy);
          lineIndices.push(0 + cursor, 1 + cursor, 2 + cursor, 0 + cursor, 2 + cursor, 3 + cursor);

          cursor = lineVertices.length / 2;

          // triangle
          lineVertices.push(impx, impy, x1 + nvx1, y1 + nvy1, x1 + nvx2, y1 + nvy2);

          lineIndices.push(0 + cursor, 1 + cursor, 2 + cursor);

          cursor = lineVertices.length / 2;

          // end
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
          // quad
          lineVertices.push(x1 + nvx1, y1 + nvy1, impx, impy);
          lineIndices.push(0 + cursor, 1 + cursor, 2 + cursor, 0 + cursor, 2 + cursor, 3 + cursor);

          cursor = lineVertices.length / 2;

          // triangle 1
          lineVertices.push(impx, impy, x1 + nvx1, y1 + nvy1, x1, y1);
          lineIndices.push(0 + cursor, 1 + cursor, 2 + cursor);

          cursor = lineVertices.length / 2;

          // triangle 2
          lineVertices.push(impx, impy, x1 + nvx2, y1 + nvy2, x1, y1);
          lineIndices.push(0 + cursor, 1 + cursor, 2 + cursor);

          cursor = lineVertices.length / 2;

          // fan
          buildRoundCorner(x1, y1, x1 + nvx1, y1 + nvy1, x1 + nvx2, y1 + nvy2, lineVertices, lineIndices);

          cursor = lineVertices.length / 2;

          // end of the segment
          lineVertices.push(impx, impy, x1 + nvx2, y1 + nvy2);
        } else {
          // quad
          lineVertices.push(ompx, ompy, x1 - nvx1, y1 - nvy1);
          lineIndices.push(0 + cursor, 1 + cursor, 2 + cursor, 0 + cursor, 2 + cursor, 3 + cursor);

          cursor = lineVertices.length / 2;

          // triangle 1
          lineVertices.push(ompx, ompy, x1 - nvx1, y1 - nvy1, x1, y1);
          lineIndices.push(0 + cursor, 1 + cursor, 2 + cursor);

          cursor = lineVertices.length / 2;

          // triangle 2
          lineVertices.push(ompx, ompy, x1 - nvx2, y1 - nvy2, x1, y1);
          lineIndices.push(0 + cursor, 1 + cursor, 2 + cursor);

          cursor = lineVertices.length / 2;

          // fan
          buildRoundCorner(x1, y1, x1 - nvx2, y1 - nvy2, x1 - nvx1, y1 - nvy1, lineVertices, lineIndices);

          cursor = lineVertices.length / 2;

          // end of the segment
          lineVertices.push(x1 - nvx2, y1 - nvy2, ompx, ompy);
        }
      }
    } else {
      // Segment 1 as a whole
      lineVertices.push(x1 + nvx1, y1 + nvy1, x1 - nvx1, y1 - nvy1);
      lineIndices.push(0 + cursor, 1 + cursor, 2 + cursor, 0 + cursor, 2 + cursor, 3 + cursor);

      cursor = lineVertices.length / 2;

      if (realLineJoin === LINE_JOIN.BEVEL) {
        if (cross > 0) {
          // triangle
          lineVertices.push(x1, y1, x1 - nvx1, y1 - nvy1, x1 - nvx2, y1 - nvy2);
          lineIndices.push(0 + cursor, 1 + cursor, 2 + cursor);
        } else {
          // triangle
          lineVertices.push(x1, y1, x1 + nvx1, y1 + nvy1, x1 + nvx2, y1 + nvy2);
          lineIndices.push(0 + cursor, 1 + cursor, 2 + cursor);
        }
      }

      if (realLineJoin === LINE_JOIN.MITER) {
        if (cross > 0) {
          // two triangles
          lineVertices.push(x1, y1, x1 - nvx1, y1 - nvy1, impx, impy, x1 - nvx2, y1 - nvy2);
          lineIndices.push(0 + cursor, 1 + cursor, 2 + cursor, 0 + cursor, 2 + cursor, 3 + cursor);
        } else {
          // two triangles
          lineVertices.push(x1, y1, x1 + nvx1, y1 + nvy1, ompx, ompy, x1 + nvx2, y1 + nvy2);
          lineIndices.push(0 + cursor, 1 + cursor, 2 + cursor, 0 + cursor, 2 + cursor, 3 + cursor);
        }
      }

      if (realLineJoin === LINE_JOIN.ROUND) {
        if (cross > 0) {
          // a fan
          buildRoundCorner(x1, y1, x1 - nvx2, y1 - nvy2, x1 - nvx1, y1 - nvy1, lineVertices, lineIndices);
        } else {
          // a fan
          buildRoundCorner(x1, y1, x1 + nvx1, y1 + nvy1, x1 + nvx2, y1 + nvy2, lineVertices, lineIndices);
        }
      }

      cursor = lineVertices.length / 2;

      lineVertices.push(x1 - nvx2, y1 - nvy2, x1 + nvx2, y1 + nvy2);
    }
  }

  // Handle the last segment
  const lastX = vertices[vertices.length - 2];
  const lastY = vertices[vertices.length - 1];
  const secondLastX = vertices[vertices.length - 4];
  const secondLastY = vertices[vertices.length - 3];
  const [lastNvx, lastNvy] = getNormalVector(lastX - secondLastX, lastY - secondLastY, lineWidth);

  lineVertices.push(lastX + lastNvx, lastY + lastNvy, lastX - lastNvx, lastY - lastNvy);

  lineIndices.push(0 + cursor, 1 + cursor, 2 + cursor, 0 + cursor, 2 + cursor, 3 + cursor);

  cursor = lineVertices.length / 2;

  // Handle the end cap — only an open stroke needs one
  if (!closedShape) {
    // Last point
    const lx = vertices[vertices.length - 2];
    const ly = vertices[vertices.length - 1];
    // Second-to-last point
    const slx = vertices[vertices.length - 4];
    const sly = vertices[vertices.length - 3];

    const [nvx, nvy] = getNormalVector(lx - slx, ly - sly, lineWidth);

    if (lineCap === LINE_CAP.SQUARE) {
      // Rotate the normal by another 90°
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
