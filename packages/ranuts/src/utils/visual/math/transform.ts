import { Matrix } from '@/utils/visual/math/matrix';
import { ObservablePoint } from '@/utils/visual/vertex/point';

// Transform is the counterpart of CSS's transform: it offers clearer, more intuitive
// operations than writing matrices by hand, though they all end up as matrix transforms.
// The node's linear transform.
export class Transform {
  public localTransform = new Matrix();
  public worldTransform = new Matrix();
  public position: ObservablePoint;
  public scale: ObservablePoint;
  public pivot: ObservablePoint;
  public skew: ObservablePoint;
  public _rotation = 0;
  private rotateMatrix = new Matrix();
  private skewMatrix = new Matrix();
  private scaleMatrix = new Matrix();
  private localMatrix = new Matrix(); // localTransform without the translation
  public shouldUpdateLocalTransform = false;
  public worldId = 0;
  private parentId = 0;
  constructor() {
    this.position = new ObservablePoint(this.onChange);
    this.scale = new ObservablePoint(this.onScaleChange, 1, 1);
    this.pivot = new ObservablePoint(this.onChange);
    this.skew = new ObservablePoint(this.onSkewChange);
  }

  get rotation(): number {
    return this._rotation;
  }

  set rotation(r: number) {
    this._rotation = r;
    this.rotateMatrix.set(
      Math.cos(this.rotation),
      Math.sin(this.rotation),
      -Math.sin(this.rotation),
      Math.cos(this.rotation),
      0,
      0,
    );

    this.shouldUpdateLocalTransform = true;
  }

  private onSkewChange = (skewX: number, skewY: number) => {
    this.skewMatrix.set(Math.cos(skewY), Math.sin(skewY), Math.sin(skewX), Math.cos(skewX), 0, 0);
    this.shouldUpdateLocalTransform = true;
  };

  private onScaleChange = (scaleX: number, scaleY: number) => {
    this.scaleMatrix.set(scaleX, 0, 0, scaleY, 0, 0);
    this.shouldUpdateLocalTransform = true;
  };

  private onChange = () => {
    this.shouldUpdateLocalTransform = true;
  };

  /**
   * Update localTransform
   */
  public updateLocalTransform(): void {
    if (!this.shouldUpdateLocalTransform) {
      return;
    }

    /**
     * Rotation, skew and scale leave the matrix's third column alone, so handle those first.
     * | cos(rotation)  -sin(rotation)  0 |   | cos(skewY)  sin(skewX)  0 |   | scaleX  0       0 |
     * | sin(rotation)  cos(rotation)   0 | x | sin(skewY)  cos(skewX)  0 | x | 0       scaleY  0 |
     * | 0              0               1 |   | 0           0           1 |   | 0       0       1 |
     */

    // Three plain matrix multiplications
    const { a, b, c, d } = this.localMatrix
      .set(1, 0, 0, 1, 0, 0)
      .append(this.rotateMatrix)
      .append(this.skewMatrix)
      .append(this.scaleMatrix);

    /**
     * Translation comes next. Because of the anchor point it cannot simply be multiplied into the matrix above.
     */
    // First work out where the anchor lands after rotation, skew and scale
    const newPivotX = a * this.pivot.x + c * this.pivot.y;
    const newPivotY = b * this.pivot.x + d * this.pivot.y;

    // then compute tx and ty
    const tx = this.position.x - newPivotX;
    const ty = this.position.y - newPivotY;

    this.localTransform.set(a, b, c, d, tx, ty);
    this.shouldUpdateLocalTransform = false;

    // Updating localTransform always means updating worldTransform
    this.parentId = -1;
  }

  public updateTransform(parentTransform: Transform): void {
    this.updateLocalTransform();
    // Recompute this node's worldTransform when either the parent's worldTransform or this node's localTransform changed
    if (this.parentId !== parentTransform.worldId) {
      // worldTransform is this node's localTransform pre-multiplied by the parent's worldTransform
      const { a: a0, b: b0, c: c0, d: d0, tx: tx0, ty: ty0 } = parentTransform.worldTransform;
      const { a: a1, b: b1, c: c1, d: d1, tx: tx1, ty: ty1 } = this.localTransform;
      this.worldTransform.set(
        a0 * a1 + c0 * b1,
        b0 * a1 + d0 * b1,
        a0 * c1 + c0 * d1,
        b0 * c1 + d0 * d1,
        a0 * tx1 + c0 * ty1 + tx0,
        b0 * tx1 + d0 * ty1 + ty0,
      );
      this.parentId = parentTransform.worldId;
      this.worldId++;
    }
  }
}
