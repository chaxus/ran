import { Shape } from '@/utils/visual/shape/shape';
import { SHAPE_TYPE } from '@/utils/visual/enums';
import type { Point } from '@/utils/visual/vertex/point';

// Rectangle, extending Shape
export class Rectangle extends Shape {
  public x: number;
  public y: number;
  public width: number;
  public height: number;
  public type = SHAPE_TYPE.RECTANGLE;
  constructor(x = 0, y = 0, width = 0, height = 0) {
    super();
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }
  public contains(p: Point): boolean {
    if (p.x > this.x && p.x < this.x + this.width && p.y > this.y && p.y < this.y + this.height) {
      return true;
    } else {
      return false;
    }
  }
}
