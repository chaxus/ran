import type { SHAPE_TYPE } from '@/utils/visual/enums';
import type { Point } from '@/utils/visual/vertex/point';
// Every shape this engine supports extends the Shape base class, which requires its
// subclasses to implement `type` and `contains`. `type` lets the engine tell at render time
// which shape it is drawing; `contains` is what hit testing is built on.
export abstract class Shape {
  // Every supported shape extends this base class
  public abstract type: SHAPE_TYPE;
  // Hit testing
  public abstract contains(point: Point): boolean;
}
