import type { Point } from '../vertex';
import { SHAPE_TYPE } from './enums';
import { Shape } from './shape';

export class Circle extends Shape {
  public x: number;
  public y: number;
  public radius: number;
  public readonly type = SHAPE_TYPE.CIRCLE;
  constructor(x = 0, y = 0, radius = 0) {
    super();
    this.x = x;
    this.y = y;
    this.radius = radius;
  }
  public contains(p: Point): boolean {
    if ((p.x - this.x) * (p.x - this.x) + (p.y - this.y) * (p.y - this.y) < this.radius * this.radius) {
      return true;
    } else {
      return false;
    }
  }
}
