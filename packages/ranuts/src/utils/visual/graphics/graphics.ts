import { Container } from "@/utils/visual/container";
import { Polygon } from "@/utils/visual/shape/polygon";
import { Rectangle } from "@/utils/visual/shape/rectangle";
import type { Shape } from "@/utils/visual/shape/shape";
import { Fill } from "@/utils/visual/style/fill";
import { Line } from "@/utils/visual/style/line";
import { GraphicsGeometry } from "@/utils/visual/graphics/graphicsGeometry";
import type { CanvasRenderer } from '@/utils/visual/render/canvasRenderer'

// Graphics 类继承自 Container 类，表示绘制各种图形的容器
export class Graphics extends Container {
  private _lineStyle = new Line()
  private _fillStyle = new Fill()
  private _geometry = new GraphicsGeometry()
  public currentPath: Polygon | null = null

  constructor() {
    super()
  }
  protected drawShape(shape: Shape): Graphics{
    this._geometry.drawShape(
      shape,
      this._fillStyle.clone(),
      this._lineStyle.clone()
    )
    return this
  }
  /**
 * 清空已有的 path，开始新的 path
 */
  protected startPoly(): void {
    if (this.currentPath) {
      const len = this.currentPath.points.length

      if (len > 2) {
        // 如果超过 2 个点，那么就算一个合法的 path
        this.drawShape(this.currentPath)
      }
    }

    this.currentPath = new Polygon()
  }
  // 填充图形前，给画笔设置填充色
  public beginFill(color = '#000000', alpha = 1):Graphics {
    if (this.currentPath) {
      // 在填充参数变化之前，先将已有的 path 画出来
      this.startPoly()
    }

    this._fillStyle.color = color
    this._fillStyle.alpha = alpha

    if (this._fillStyle.alpha > 0) {
      this._fillStyle.visible = true
    }

    return this
  }
  // 绘制矩形
  public drawRect(x: number, y: number, width: number, height: number): Graphics {
    return this.drawShape(new Rectangle(x, y, width, height))
  }
  protected renderCanvas(render: CanvasRenderer): void{
    const ctx = render.ctx
    const { a, b, c, d, tx, ty } = this.transform.worldTransform

    ctx.setTransform(a, b, c, d, tx, ty)

    const graphicsData = this._geometry.graphicsData

    for (let i = 0; i < graphicsData.length; i++) {
      const data = graphicsData[i]
      const { lineStyle, fillStyle, shape } = data

      if (shape instanceof Rectangle) {
        const rectangle = shape
        if (fillStyle.visible) {
          ctx.fillStyle = fillStyle.color
          ctx.globalAlpha = fillStyle.alpha * this.worldAlpha
          ctx.fillRect(
            rectangle.x,
            rectangle.y,
            rectangle.width,
            rectangle.height
          )
        }
        if (lineStyle.visible) {
          ctx.lineWidth = lineStyle.width
          ctx.lineCap = lineStyle.cap
          ctx.lineJoin = lineStyle.join
          ctx.strokeStyle = lineStyle.color
          ctx.globalAlpha = lineStyle.alpha * this.worldAlpha

          ctx.strokeRect(
            rectangle.x,
            rectangle.y,
            rectangle.width,
            rectangle.height
          )
        }
      }
    }
  }
}
