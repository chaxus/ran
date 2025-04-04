import type { Container } from '../vertex/container';
import { Rectangle } from '../shape/rectangle';
import type { IApplicationOptions } from '@/src/types';

export abstract class Renderer {
  public canvasEle: HTMLCanvasElement;
  public screen = new Rectangle();
  constructor(options: IApplicationOptions) {
    const { view } = options;
    this.canvasEle = view!;
    this.screen.width = view!.clientWidth;
    this.screen.height = view!.clientHeight;
  }
  public resizeView(width: number, height: number): void {
    this.canvasEle.width = width;
    this.canvasEle.height = height;
  }
  public abstract render(rootContainer: Container): void;
}
