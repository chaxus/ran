import { Container } from './vertex/container';
import { EventSystem } from './event/event';
import type { IApplicationOptions } from './types';
import type { Renderer } from './render/render';
import { getRenderer } from './render';
// 这是渲染引擎的入口，将 canvas 元素等参数传给这个类，然后这个类就会启动渲染引擎，开始渲染。
// Application 类的 stage 属性是一个 Container，要把节点添加到 stage 上，渲染引擎才会渲染这些节点，stage 是一切待渲染元素的祖先元素。
export class Application {
  private readonly renderer: Renderer;
  public readonly stage: Container; // stage 是一切待渲染元素的祖先元素。
  public readonly view: HTMLCanvasElement;
  private animationFrameId: number | undefined;
  public eventSystem: EventSystem;

  constructor(options?: IApplicationOptions) {
    const { view = document.createElement('canvas') } = options || {};
    // 创建 canvas 元素
    this.view = view;
    // 根据参数，判断是用什么渲染模式
    this.renderer = getRenderer({ ...options, view });
    // 创建一个根容器
    this.stage = new Container();
    // 创建事件系统
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
