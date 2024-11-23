import { Shape } from '@/utils/visual/shape/shape';
import { SHAPE_TYPE } from '@/utils/visual/enums';
import type { Point } from '@/utils/visual/vertex/point';
// 椭圆类，继承自 Shape 类
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
  public contains(p: Point): boolean {
    if (
      ((p.x - this.x) * (p.x - this.x)) / (this.radiusX * this.radiusX) +
        ((p.y - this.y) * (p.y - this.y)) / (this.radiusY * this.radiusY) <
      1
    ) {
      return true;
    } else {
      return false;
    }
  }
}
