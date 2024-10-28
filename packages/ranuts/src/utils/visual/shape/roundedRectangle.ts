import { Shape } from '@/utils/visual/shape/shape';
import { ShapeType } from '@/utils/visual/enums';
import type { Point } from '@/utils/visual/vertex/point';

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
  public contains(point: Point): boolean {
    return true;
  }
}
