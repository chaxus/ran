import { Matrix } from '@/utils/visual/math/matrix';
import { ObservablePoint } from '@/utils/visual/vertex/point';
// Transform 类就类似 CSS 的 transform，它提供了一些更清晰、更符合人类直觉的变换，而不用直接使用矩阵变换，当然，这些变换最终会转换成矩阵变换。
// 节点的线性变换类
export class Transform {
  // 当前节点相对于父节点的线性变换
  public localTransform = new Matrix();
  // 当前节点相对于 canvas 视窗的线性变换，我们只需要将节点自身的 localTransform 左乘父节点的 worldTransform，就得到了自身的 worldTransform。
  public worldTransform = new Matrix();
  public position: ObservablePoint; // 平移
  public scale: ObservablePoint; // 缩放
  public pivot: ObservablePoint; // 对标 DOM 的 transform-origin，锚点的概念
  public skew: ObservablePoint; // 对标 DOM 的 skew，斜切的概念
  public _rotation = 0; // 旋转角度
  private transformMatrix: Matrix | null = null;

  public shouldUpdateLocalTransform = false;
  public shouldUpdateWorldTransform = false;

  constructor() {
    this.position = new ObservablePoint(this.onChange);
    this.scale = new ObservablePoint(this.onChange, 1, 1);
    this.pivot = new ObservablePoint(this.onChange);
    this.skew = new ObservablePoint(this.onChange);
  }

  get rotation(): number {
    return this._rotation;
  }

  set rotation(r: number) {
    this._rotation = r;
    // 旋转角度发生变化，一定会影响到子元素，
    // 所以要触发更新，通过 shouldUpdateLocalTransform 进行标识需要更新
    this.onChange();
  }

  private onChange = () => {
    this.shouldUpdateLocalTransform = true;
  };

  /**
   * 更新 localTransform
   */
  private updateLocalTransform() {
    if (!this.shouldUpdateLocalTransform) {
      return;
    }

    if (this.transformMatrix) {
      this.localTransform = this.transformMatrix;
      return;
    }

    /**
     * 旋转，斜切 (skew)，缩放不会影响矩阵第三列的值，我们先处理这 3 个操作
     * | cos(rotation)  -sin(rotation)  0 |   | cos(skewY)  sin(skewX)  0 |   | scaleX  0       0 |
     * | sin(rotation)  cos(rotation)   0 | x | sin(skewY)  cos(skewX)  0 | x | 0       scaleY  0 |
     * | 0              0               1 |   | 0           0           1 |   | 0       0       1 |
     */
    const rotateMatrix = new Matrix(
      Math.cos(this.rotation),
      Math.sin(this.rotation),
      -Math.sin(this.rotation),
      Math.cos(this.rotation),
    );
    const skewMatrix = new Matrix(
      Math.cos(this.skew.y),
      Math.sin(this.skew.y),
      Math.sin(this.skew.x),
      Math.cos(this.skew.x),
    );
    const scaleMatrix = new Matrix(this.scale.x, 0, 0, this.scale.y);

    // 朴实无华的 3 个矩阵相乘
    const { a, b, c, d } = rotateMatrix.append(skewMatrix).append(scaleMatrix);

    /**
     * 接下来要处理平移操作了，因为要实现锚点，所以并不能简单地将平移的变换矩阵与上面那个矩阵相乘
     */
    // 首先计算出锚点在经历旋转，斜切 (skew)，缩放后的新位置
    const newPivotX = a * this.pivot.x + c * this.pivot.y;
    const newPivotY = b * this.pivot.x + d * this.pivot.y;

    // 然后计算 tx 和 ty
    const tx = this.position.x - newPivotX;
    const ty = this.position.y - newPivotY;

    this.localTransform.set(a, b, c, d, tx, ty);
    this.shouldUpdateLocalTransform = false;

    // 更新了 localTransform 那么一定要更新 worldTransform
    this.shouldUpdateWorldTransform = true;
  }

  /**
   * @returns {boolean} true 说明 worldTransform 发生了改变，false 说明 worldTransform 没有发生改变
   */
  public updateTransform(parentTransform: Transform): boolean {
    this.updateLocalTransform();

    if (!this.shouldUpdateWorldTransform) {
      return false;
    }

    // 自身的 localTransform 左乘父元素的 worldTransform 就得到了自身的 worldTransform
    this.worldTransform = this.localTransform.clone().prepend(parentTransform.worldTransform);

    this.shouldUpdateWorldTransform = false;

    return true;
  }

  public setFromMatrix(matrix: Matrix): void {
    this.transformMatrix = matrix;
    this.shouldUpdateLocalTransform = true;
  }
}
