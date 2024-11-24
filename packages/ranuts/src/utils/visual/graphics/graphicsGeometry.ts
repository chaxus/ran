import { GraphicsData } from '@/utils/visual/graphics/graphicsData';
import { CustomFloatArray, CustomIntArray } from '@/utils/visual/render/utils/float';
import { buildVertices, triangulateFill, triangulateStroke } from '@/utils/visual/render/utils/verticy';
import type { Point } from '@/utils/visual/vertex/point';
import type { BatchPart } from '@/utils/visual/render/utils/batch';
import type { Shape } from '@/utils/visual/shape/shape';
import type { Fill } from '@/utils/visual/style/fill';
import type { Line } from '@/utils/visual/style/line';

export class GraphicsGeometry {
  public graphicsData: GraphicsData[] = [];
  private dirty = false;
  public shapeIndex = 0;
  /**
   * 每个 batchPart 代表一个 fill 或者一个 stroke
   */
  public batchParts: BatchPart[] = [];

  /**
   * 顶点数组，每 2 个元素代表一个顶点
   */
  public vertices = new CustomFloatArray();
  /**
   * 顶点下标数组，每个元素代表一个顶点下标
   */
  public indices = new CustomIntArray();
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
  /**
   * 将所有子图形都转化成顶点并且进行三角剖分
   */
  public buildVerticesAndTriangulate(): void {
    if (!this.dirty) {
      return;
    }
    this.dirty = false;
    for (let i = this.shapeIndex; i < this.graphicsData.length; i++) {
      const data = this.graphicsData[i];
      buildVertices(data);
      if (data.fillStyle.visible) {
        triangulateFill(data, this);
      }
      if (data.lineStyle.visible) {
        triangulateStroke(data, this);
      }
    }
    this.shapeIndex = this.graphicsData.length;
  }
  public clear(): void {
    this.graphicsData = [];
  }
}
