import { LineCap, LineJoin } from '@/utils/visual/enums'
import { Fill } from '@/utils/visual/style/fill'

export class Line extends Fill {
  public width = 0
  public cap = LineCap.Butt
  public join = LineJoin.Miter

  public clone(): Line {
    const obj = new Line()

    obj.color = this.color
    obj.alpha = this.alpha
    obj.visible = this.visible
    obj.width = this.width
    obj.cap = this.cap
    obj.join = this.join

    return obj
  }

  public reset(): void {
    super.reset()

    this.color = '#ffffff'
    this.width = 0
    this.cap = LineCap.Butt
    this.join = LineJoin.Miter
  }
}
