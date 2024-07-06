import { Shape } from '@/utils/visual/shape/shape'
import { ShapeType } from '@/utils/visual/enums'
import type { Point } from '@/utils/visual/point'

// 多边形由多个点构成，points 数组每 2 个元素代表一个点的坐标
export class Polygon extends Shape {
  public points: number[] = []
  public closeStroke = false
  public type = ShapeType.Polygon
  constructor() {
    super()
  }
  public contains(point: Point): boolean {
    return true
  }
}
