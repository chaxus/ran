import type { Fill, Line, Shape } from '../shape';

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
