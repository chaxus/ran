import { Shape } from '@/utils/visual/shape/shape';
import { ShapeType } from '@/utils/visual/enums';
import type { Point } from '@/utils/visual/vertex/point';

// 多边形由多个点构成，points 数组每 2 个元素代表一个点的坐标
export class Polygon extends Shape {
  public points: number[] = [];
  public closeStroke = false;
  public type = ShapeType.Polygon;
  constructor(points: number[] = []) {
    super();
    this.points = points;
  }
  // 判断线段与射线是否相交
  private isIntersect(px: number, py: number, p1x: number, p1y: number, p2x: number, p2y: number) {
    // 线段在射线上方
    if (p1y > py && p2y > py) {
      return false;
    }

    // 线段在射线下方
    if (p1y < py && p2y < py) {
      return false;
    }

    // 线段的两个端点都在待检测点的左边
    if (p1x < px && p2x < px) {
      return false;
    }

    // 线段的2个端点都在待检测点的右边
    if (p1x > px && p2x > px) {
      return true;
    }
    // 线段的一个端点在待检测点的左边，另一个端点在待检测点的右边，这个时候可能相交，也可能不相交：
    const p2o = p1y - p2y;
    const p1o = p2x - p1x;
    const p2q = py - p2y;

    const x = p2x - (p1o / p2o) * p2q;
    if (x > px) {
      return true;
    } else {
      return false;
    }
  }
  public contains(p: Point): boolean {
    const len = this.points.length;
    let count = 0;

    // points 数组的每两个元素为一个顶点的坐标
    for (let i = 2; i <= len - 2; i += 2) {
      const p1x = this.points[i - 2];
      const p1y = this.points[i - 1];
      const p2x = this.points[i];
      const p2y = this.points[i + 1];
      if (this.isIntersect(p.x, p.y, p1x, p1y, p2x, p2y)) {
        count++;
      }
    }

    // 还需要判断最后一个点和第一个点的连线是否与射线相交
    const p1x = this.points[0];
    const p1y = this.points[1];
    const p2x = this.points[len - 2];
    const p2y = this.points[len - 1];
    if (this.isIntersect(p.x, p.y, p1x, p1y, p2x, p2y)) {
      count++;
    }

    if (count % 2 === 0) {
      return false;
    } else {
      return true;
    }
  }
}
