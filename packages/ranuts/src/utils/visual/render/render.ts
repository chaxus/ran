import type { Container } from '@/utils/visual/container';
import { Rectangle } from '@/utils/visual/shape/rectangle';
import type { IApplicationOptions } from '@/utils/visual/types';

export class Renderer {
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
  public render(container: Container): void {
    // nothing
  }
}
