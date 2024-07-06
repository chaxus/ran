import { Renderer } from '@/utils/visual/render/render';
import type { IApplicationOptions } from '@/utils/visual/types';
import type { Container } from '@/utils/visual/container';

export class CanvasRenderer extends Renderer {
  public ctx: CanvasRenderingContext2D;
  private background: string | undefined;
  constructor(options: IApplicationOptions) {
    super(options);
    const { backgroundColor } = options;
    this.background = backgroundColor;
    this.ctx = this.canvasEle.getContext('2d') as CanvasRenderingContext2D;
  }
  public render = (container: Container): void => {
    container.updateTransform();

    this.ctx.save();

    this.ctx.clearRect(0, 0, this.screen.width, this.screen.height);

    if (this.background) {
      this.ctx.fillStyle = this.background;
      this.ctx.fillRect(0, 0, this.screen.width, this.screen.height);
    }

    container.renderCanvasRecursive(this);

    this.ctx.restore();
  };
}
