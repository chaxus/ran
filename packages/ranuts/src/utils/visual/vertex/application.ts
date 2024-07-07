import type { Renderer } from '@/utils/visual/render';
import { getRenderer } from '@/utils/visual/render';
import { Container } from '@/utils/visual/vertex/container';
import type { IApplicationOptions } from '@/utils/visual/types';
import { EventSystem } from '@/utils/visual/event';

export class Application {
  private renderer: Renderer;
  public stage: Container;
  public view: HTMLCanvasElement;
  private eventSystem: EventSystem;
  private animationFrameId: number | undefined;

  constructor(options: IApplicationOptions) {
    const { view } = options;
    this.view = view;
    // 根据参数，判断是用什么渲染模式
    this.renderer = getRenderer(options);
    // 创建一个根容器
    this.stage = new Container();
    this.eventSystem = new EventSystem(this.view, this.stage);
  }

  public render(): void {
    this.renderer.render(this.stage);
  }

  public start(): void {
    const func = () => {
      this.render();
      this.animationFrameId = requestAnimationFrame(func);
    };
    func();
  }

  public stop(): void {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = undefined;
    }
  }
}
