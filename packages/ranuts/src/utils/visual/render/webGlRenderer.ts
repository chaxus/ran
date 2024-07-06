import { Renderer } from '@/utils/visual/render/render';
import type { IApplicationOptions } from '@/utils/visual/types';
import type { Container } from '@/utils/visual/vertex';

export class WebGlRenderer extends Renderer {
  constructor(options: IApplicationOptions) {
    super(options);
  }
  public render(container: Container): void {
    // todo
  }
}
