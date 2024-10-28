import type { Shape } from '@/utils/visual/shape/shape';
import type { Fill } from '@/utils/visual/style/fill';
import type { Line } from '@/utils/visual/style/line';
import { GraphicsData } from '@/utils/visual/graphics/graphicsData';
import type { Point } from '@/utils/visual/vertex/point';

export class GraphicsGeometry {
  public graphicsData: GraphicsData[] = [];
  constructor() {}
  public drawShape(shape: Shape, fillStyle: Fill, lineStyle: Line): void {
    const data = new GraphicsData(shape, fillStyle, lineStyle);
    this.graphicsData.push(data);
  }
  /**
   * @param p 待检测点
   * @returns {boolean} 待检测点是否落在某一个子图形内
   */
  public containsPoint(p: Point): boolean {
    for (let i = 0; i < this.graphicsData.length; i++) {
      const { shape, fillStyle } = this.graphicsData[i];
      if (!fillStyle.visible) {
        continue;
      }
      if (shape.contains(p)) {
        return true;
      }
    }

    return false;
  }
  public clear(): void {
    this.graphicsData = [];
  }
}
