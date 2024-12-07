import { getRenderer } from '@/utils/visual/render/index';
import { Container } from '@/utils/visual/vertex/container';
import type { IApplicationOptions } from '@/utils/visual/types';
import type { Renderer } from '@/utils/visual/render/render';

export class Application {
  private renderer: Renderer;
  public stage = new Container();
  public view: HTMLCanvasElement;
  public requestAnimationId?: number;

  constructor(options: IApplicationOptions) {
    const { view = document.createElement('canvas') } = options || {};
    this.view = view;
    this.renderer = getRenderer(options);
  }
  public render = (): void => {
    this.renderer.render(this.stage);
  };
  public start = (): number => {
    const func = () => {
      this.render();
      return requestAnimationFrame(func);
    };
    this.requestAnimationId = func();
    return this.requestAnimationId;
  };
  public destroy = (): void => {
    if (this.requestAnimationId !== undefined) {
      cancelAnimationFrame(this.requestAnimationId);
    }
  };
}
