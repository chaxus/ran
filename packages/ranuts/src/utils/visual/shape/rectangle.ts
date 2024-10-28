import { Shape } from '@/utils/visual/shape/shape';
import { ShapeType } from '@/utils/visual/enums';
import type { Point } from '@/utils/visual/vertex/point';

// Rectangle 类继承自 Shape 类，表示矩形
export class Rectangle extends Shape {
  public x: number;
  public y: number;
  public width: number;
  public height: number;
  public type = ShapeType.Rectangle;
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
