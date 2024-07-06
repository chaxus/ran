import type { ShapeType } from '@/utils/visual/enums';
import type { Point } from '@/utils/visual/vertex';

export abstract class Shape {
  // 支持的所有几何图形都会继承自这个 Shape 基类
  public abstract type: ShapeType;
  constructor() {}
  // 碰撞检测
  public abstract contains(point: Point): boolean;
}
