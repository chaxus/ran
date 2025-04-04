import type { Point } from "../vertex/point";

export interface TransformableObject {
    position: Point;
    scale: Point;
    pivot: Point;
    skew: Point;
    rotation: number;
  }