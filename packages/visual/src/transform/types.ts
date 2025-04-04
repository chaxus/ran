import type { Point } from '../vertex/point';
// 可变换对象
export interface TransformableObject {
  position: Point;
  scale: Point;
  pivot: Point;
  skew: Point;
  rotation: number;
}
