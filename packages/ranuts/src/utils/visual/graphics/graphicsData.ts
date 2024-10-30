import type { Shape } from '@/utils/visual/shape/shape';
import type { Fill } from '@/utils/visual/style/fill';
import type { Line } from '@/utils/visual/style/line';

export class GraphicsData {
  public shape: Shape;
  public lineStyle: Line;
  public fillStyle: Fill;
  /**
   * 顶点数组，每 2 个元素代表一个顶点
   */
  public vertices: number[] = [];
  constructor(shape: Shape, fillStyle: Fill, lineStyle: Line) {
    this.shape = shape;
    this.lineStyle = lineStyle;
    this.fillStyle = fillStyle;
  }
}
