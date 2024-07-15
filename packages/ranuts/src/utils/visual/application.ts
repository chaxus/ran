import type { Renderer } from '@/utils/visual/render/render';
import { getRenderer } from '@/utils/visual/render/index';
import { Container } from '@/utils/visual/vertex/container';
import type { IApplicationOptions } from '@/utils/visual/types';

export class Application {
  private renderer: Renderer;
  public stage = new Container();
  public view: HTMLCanvasElement;

  constructor(options: IApplicationOptions) {
    const { view } = options;
    this.view = view;

    this.renderer = getRenderer(options);

    this.start();
  }

  private render() {
    this.renderer.render(this.stage);
  }

  private start() {
    const func = () => {
      this.render();
      requestAnimationFrame(func);
    };
    func();
  }
}
