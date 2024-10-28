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
  public contains(p: Point): boolean {
    const con1 = p.x > this.x && p.x < this.x + this.width && p.y > this.y && p.y < this.y + this.height;
    if (!con1) {
      return false;
    }

    // 判断左上角
    const c1x = this.x + this.radius;
    const c1y = this.y + this.radius;
    if (p.x < c1x && p.y < c1y) {
      if ((p.x - c1x) * (p.x - c1x) + (p.y - c1y) * (p.y - c1y) < this.radius * this.radius) {
        return true;
      } else {
        return false;
      }
    }

    // 判断左下角
    const c2x = this.x + this.radius;
    const c2y = this.y + this.height - this.radius;
    if (p.x < c2x && p.y > c2y) {
      if ((p.x - c2x) * (p.x - c2x) + (p.y - c2y) * (p.y - c2y) < this.radius * this.radius) {
        return true;
      } else {
        return false;
      }
    }

    // 判断右上角
    const c3x = this.x + this.width - this.radius;
    const c3y = this.y + this.radius;
    if (p.x > c3x && p.y < c3y) {
      if ((p.x - c3x) * (p.x - c3x) + (p.y - c3y) * (p.y - c3y) < this.radius * this.radius) {
        return true;
      } else {
        return false;
      }
    }

    // 判断右下角
    const c4x = this.x + this.width - this.radius;
    const c4y = this.y + this.height - this.radius;
    if (p.x > c4x && p.y < c4y) {
      if ((p.x - c4x) * (p.x - c4x) + (p.y - c4y) * (p.y - c4y) < this.radius * this.radius) {
        return true;
      } else {
        return false;
      }
    }

    return true;
  }
}
