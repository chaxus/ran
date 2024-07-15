import type { Shape } from '@/utils/visual/shape/shape';
import type { Fill } from '@/utils/visual/style/fill';
import type { Line } from '@/utils/visual/style/line';
import { GraphicsData } from '@/utils/visual/graphics/graphicsData';

export class GraphicsGeometry {
  public graphicsData: GraphicsData[] = [];
  constructor() {}
  public drawShape(shape: Shape, fillStyle: Fill, lineStyle: Line): void {
    const data = new GraphicsData(shape, fillStyle, lineStyle);
    this.graphicsData.push(data);
  }
  public clear(): void {
    this.graphicsData = [];
  }
}
