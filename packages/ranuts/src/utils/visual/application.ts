import { getRenderer } from '@/utils/visual/render';
import { Container } from '@/utils/visual/vertex/container';
import { EventSystem } from '@/utils/visual/event';
import type { Renderer } from '@/utils/visual/render/render';
import type { IApplicationOptions } from '@/utils/visual/types';

// 这是渲染引擎的入口，将 canvas 元素等参数传给这个类，然后这个类就会启动渲染引擎，开始渲染。
// Application 类的 stage 属性是一个 Container，要把节点添加到 stage 上，渲染引擎才会渲染这些节点，stage 是一切待渲染元素的祖先元素。
export class Application {
  private readonly renderer: Renderer;
  public readonly stage: Container; // stage 是一切待渲染元素的祖先元素。
  public readonly view: HTMLCanvasElement;
  private animationFrameId: number | undefined;
  public eventSystem: EventSystem;

  constructor(options: IApplicationOptions) {
    const { view = document.createElement('canvas') } = options;
    this.view = view;
    // 根据参数，判断是用什么渲染模式
    this.renderer = getRenderer({ ...options, view });
    // 创建一个根容器
    this.stage = new Container();
    this.eventSystem = new EventSystem(this.view, this.stage);
  }

  /**
   * 创建并初始化一个 Application。
   *
   * 推荐使用此异步工厂而非 `new Application()`：WebGPU 后端的设备初始化是异步的，
   * 必须在首次 render 之前 await 完成。Canvas / WebGL 后端的 init 会立即 resolve，
   * 因此该工厂对所有后端都是安全且一致的。
   *
   * @example
   * const app = await Application.create({ view, prefer: RENDERER_TYPE.WEB_GPU });
   * app.stage.addChild(graphics);
   * app.start();
   */
  public static async create(options: IApplicationOptions): Promise<Application> {
    const app = new Application(options);
    await app.renderer.init();
    return app;
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
