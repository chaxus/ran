import { Shape } from '@/utils/visual/shape/shape';
import { SHAPE_TYPE } from '@/utils/visual/enums';
import type { Point } from '@/utils/visual/vertex/point';

// A polygon is a list of points; every 2 elements of `points` are one point's coordinates
export class Polygon extends Shape {
  public points: number[] = [];
  public closeStroke = false;
  public type = SHAPE_TYPE.POLYGON;
  constructor(points: number[] = []) {
    super();
    this.points = points;
  }
  // Does this segment cross the ray?
  private isIntersect(px: number, py: number, p1x: number, p1y: number, p2x: number, p2y: number) {
    // The segment is above the ray
    if (p1y > py && p2y > py) {
      return false;
    }

    // The segment is below the ray
    if (p1y < py && p2y < py) {
      return false;
    }

    // Both endpoints are left of the test point
    if (p1x < px && p2x < px) {
      return false;
    }

    // Both endpoints are right of the test point
    if (p1x > px && p2x > px) {
      return true;
    }
    // One endpoint is left of the test point and the other right, so it may or may not cross:
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

    // Every two elements of `points` are one vertex
    for (let i = 2; i <= len - 2; i += 2) {
      const p1x = this.points[i - 2];
      const p1y = this.points[i - 1];
      const p2x = this.points[i];
      const p2y = this.points[i + 1];
      if (this.isIntersect(p.x, p.y, p1x, p1y, p2x, p2y)) {
        count++;
      }
    }

    // The closing edge from the last point back to the first has to be tested too
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
