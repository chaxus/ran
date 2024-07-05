import { Shape } from "@/utils/visual/shape/shape";
import { Fill } from "@/utils/visual/style/fill";
import { Line } from "@/utils/visual/style/line";
import { GraphicsData } from '@/utils/visual/graphics/graphicsData'

export class GraphicsGeometry {
  public graphicsData: GraphicsData[] = []
  constructor() {}
  public drawShape(shape: Shape, fillStyle: Fill, lineStyle: Line) {
    const data = new GraphicsData(shape, fillStyle, lineStyle)
    this.graphicsData.push(data)
  }
  public clear() {
    this.graphicsData = []
  }
}
