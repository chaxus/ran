import { getRenderer } from '@/utils/visual/render';
import { Container } from '@/utils/visual/vertex/container';
import { EventSystem } from '@/utils/visual/event';
import type { Renderer } from '@/utils/visual/render/render';
import type { IApplicationOptions } from '@/utils/visual/types';

// The rendering engine's entry point: hand it the canvas and it starts rendering.
// Its `stage` is a Container — nodes are only rendered once added to the stage, which is the
// ancestor of everything that gets drawn.
export class Application {
  private readonly renderer: Renderer;
  public readonly stage: Container; // the ancestor of everything that gets drawn
  public readonly view: HTMLCanvasElement;
  private animationFrameId: number | undefined;
  public eventSystem: EventSystem;

  constructor(options: IApplicationOptions) {
    const { view = document.createElement('canvas') } = options;
    this.view = view;
    // Pick the rendering backend from the options
    this.renderer = getRenderer({ ...options, view });
    // Create the root container
    this.stage = new Container();
    this.eventSystem = new EventSystem(this.view, this.stage);
  }

  /**
   * Create and initialise an Application.
   *
   * Prefer this async factory over `new Application()`: the WebGPU backend initialises its
   * device asynchronously and must finish before the first render. The Canvas and WebGL
   * backends resolve immediately, so the factory is safe and consistent for all of them.
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
