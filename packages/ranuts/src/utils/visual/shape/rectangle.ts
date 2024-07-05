import { Shape } from '@/utils/visual/shape/shape'
import { ShapeType } from '@/utils/visual/enums'
import { Point } from '@/utils/visual/point'

// Rectangle 类继承自 Shape 类，表示矩形
export class Rectangle extends Shape {
  public x: number
  public y: number
  public width: number
  public height: number
  public type = ShapeType.Rectangle
  constructor(x = 0, y = 0, width = 0, height = 0) {
    super()
    this.x = x
    this.y = y
    this.width = width
    this.height = height
  }
  public contains(point: Point): boolean {
    return true // 碰撞检测目前还用不到，所以还没有实现这个方法
  }
}
