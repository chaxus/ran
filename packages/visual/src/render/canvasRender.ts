import type { IApplicationOptions } from '@/src/types'
import { Renderer } from '@/src/render/render';


export class CanvasRenderer extends Renderer {
    public ctx: CanvasRenderingContext2D;
    private backgroundColor: string | undefined;
    private backgroundAlpha: number | undefined;
    constructor(options: IApplicationOptions) {
      super(options);
      console.log('正在使用 %c canvas2D ', 'color: #05aa6d; background-color: #ffffff;font-size: 20px;', '渲染');
      const { backgroundColor, backgroundAlpha } = options;
      this.backgroundColor = backgroundColor;
      this.backgroundAlpha = backgroundAlpha;
      this.ctx = this.canvasEle.getContext('2d')!;
    }
    public render(container: Container): void {
      container.updateTransform();
      this.ctx.save();
      // 清空画布
      this.ctx.clearRect(0, 0, this.screen.width, this.screen.height);
      // 绘制背景
      if (this.backgroundAlpha) {
        this.ctx.globalAlpha = this.backgroundAlpha;
      }
      if (this.backgroundColor) {
        this.ctx.fillStyle = this.backgroundColor;
      }
      this.ctx.fillRect(0, 0, this.screen.width, this.screen.height);
      // 递归渲染容器
      container.renderCanvasRecursive(this);
      this.ctx.restore();
    }
  }