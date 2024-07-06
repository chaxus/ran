import type { Renderer } from '@/utils/visual/render';
import { getRenderer } from '@/utils/visual/render';
import { Container } from '@/utils/visual/vertex/container';
import type { IApplicationOptions } from '@/utils/visual/types';
import { EventSystem } from '@/utils/visual/event';

// let hasFoundTarget = false
// let hitTarget: Container | null = null

// const hitTestRecursive = (curTarget: Container, globalPos: Point) => {
//   // 如果对象不可见
//   if (!curTarget.visible) {
//     return
//   }

//   if (hasFoundTarget) {
//     return
//   }

//   // 深度优先遍历子元素
//   for (let i = curTarget.children.length - 1; i >= 0; i--) {
//     const child = curTarget.children[i]
//     hitTestRecursive(child, globalPos)
//   }

//   if (hasFoundTarget) {
//     return
//   }

//   // 最后检测自身
//   const p = curTarget.worldTransform.applyInverse(globalPos)
//   if (curTarget.containsPoint(p)) {
//     hitTarget = curTarget
//     hasFoundTarget = true
//   }
// }

// const hitTest = (root: Container, globalPos: Point): Container | null => {
//   hasFoundTarget = false
//   hitTarget = null

//   hitTestRecursive(root, globalPos)

//   return hitTarget
// }

export class Application {
  private renderer: Renderer;
  public stage: Container;
  public view: HTMLCanvasElement;
  private eventSystem: EventSystem;
  private animationFrameId: number | undefined;

  constructor(options: IApplicationOptions) {
    const { view } = options;
    this.view = view;

    this.renderer = getRenderer(options);
    this.stage = new Container();
    this.eventSystem = new EventSystem(this.view, this.stage);
    // this.render()
    // this.start()
    // 在 Application 类的构造函数里执行这段逻辑
    // this.view.addEventListener('pointermove', (e) => {
    //   const target = hitTest(this.stage, new Point(e.offsetX, e.offsetY))
    //   if (target) {
    //     this.view.style.cursor = 'pointer'
    //   } else {
    //     this.view.style.cursor = 'auto'
    //   }
    // })
    // this.view.addEventListener('click', (e) => {
    //   const target = hitTest(this.stage, new Point(e.offsetX, e.offsetY))
    //   if (target) {
    //     target.call('click')
    //   }
    // })
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
