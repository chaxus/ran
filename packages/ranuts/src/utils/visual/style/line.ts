import { LINE_CAP, LINE_JOIN } from '@/utils/visual/enums';
import { Fill } from '@/utils/visual/style/fill';

export class Line extends Fill {
  public width = 0;
  public cap = LINE_CAP.BUTT;
  public join = LINE_JOIN.MITER;
  public miterLimit = 10;

  public clone(): Line {
    const obj = new Line();
    obj.color = this.color;
    obj.alpha = this.alpha;
    obj.visible = this.visible;
    obj.width = this.width;
    obj.cap = this.cap;
    obj.join = this.join;
    obj.miterLimit = this.miterLimit;
    return obj;
  }

  public reset(): void {
    super.reset();
    this.color = '#ffffff';
    this.width = 0;
    this.cap = LINE_CAP.BUTT;
    this.join = LINE_JOIN.MITER;
    this.miterLimit = 10;
  }
}
