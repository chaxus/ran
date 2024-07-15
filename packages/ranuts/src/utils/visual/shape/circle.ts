import { Shape } from '@/utils/visual/shape/shape';
import { ShapeType } from '@/utils/visual/enums';
import type { Point } from '@/utils/visual/vertex/point';

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
  public contains(point: Point): boolean {
    return true;
  }
}
