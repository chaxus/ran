import type { Container } from '@/utils/visual/vertex/container';
import { Rectangle } from '@/utils/visual/shape/rectangle';
import type { IApplicationOptions } from '@/utils/visual/types';

export abstract class Renderer {
  /**
   * 是否需要重新构建大数组
   */
  static needBuildArr = true;
  public canvasEle: HTMLCanvasElement;
  public screen = new Rectangle();
  constructor(options: IApplicationOptions) {
    const { view } = options;
    this.canvasEle = view;
    this.screen.width = view.width;
    this.screen.height = view.height;
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
