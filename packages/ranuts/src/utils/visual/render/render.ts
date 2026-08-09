import { Rectangle } from '@/utils/visual/shape/rectangle';
import type { Container } from '@/utils/visual/vertex/container';
import type { Filter } from '@/utils/visual/render/filter';
import type { IApplicationOptions } from '@/utils/visual/types';

export abstract class Renderer {
  public canvasEle: HTMLCanvasElement;
  public screen = new Rectangle();
  /**
   * Full-screen post-processing passes, applied in order after the scene is drawn. Only the
   * WebGL backend runs them today; the Canvas backend ignores them.
   */
  public filters: Filter[] = [];
  constructor(options: IApplicationOptions) {
    const { view } = options;
    this.canvasEle = view!;
    this.screen.width = view!.width;
    this.screen.height = view!.height;
  }
  public resizeView(width: number, height: number): void {
    this.canvasEle.width = width;
    this.canvasEle.height = height;
  }
  public abstract render(rootContainer: Container): void;
  public async init(): Promise<any> {
    return Promise.resolve();
  }
}
