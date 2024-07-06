import { Renderer } from '@/utils/visual/render/render';
import { IApplicationOptions } from '@/utils/visual/types';
import { Container } from '@/utils/visual/container';

export class WebGlRenderer extends Renderer {
  constructor(options: IApplicationOptions) {
    super(options);
  }
  public render(container: Container): void {
    // todo
  }
}
