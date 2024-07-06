import { Point } from '@/utils/visual/point';
// 矩阵的操作
export class Matrix {
  public a: number;
  public b: number;
  public c: number;
  public d: number;
  public tx: number;
  public ty: number;
  constructor(a = 1, b = 0, c = 0, d = 1, tx = 0, ty = 0) {
    this.a = a;
    this.b = b;
    this.c = c;
    this.d = d;
    this.tx = tx;
    this.ty = ty;
  }

  set(a: number, b: number, c: number, d: number, tx: number, ty: number): Matrix {
    this.a = a;
    this.b = b;
    this.c = c;
    this.d = d;
    this.tx = tx;
    this.ty = ty;

    return this;
  }

  /**
   * 将当前矩阵右乘一个矩阵
   */
  public append(m: Matrix): Matrix {
    const { a: a0, b: b0, c: c0, d: d0, tx: tx0, ty: ty0 } = this;
    const { a: a1, b: b1, c: c1, d: d1, tx: tx1, ty: ty1 } = m;
    this.a = a0 * a1 + c0 * b1;
    this.b = b0 * a1 + d0 * b1;
    this.c = a0 * c1 + c0 * d1;
    this.d = b0 * c1 + d0 * d1;
    this.tx = a0 * tx1 + c0 * ty1 + tx0;
    this.ty = b0 * tx1 + d0 * ty1 + ty0;

    return this;
  }

  /**
   * 对某个点应用当前的变换矩阵
   * @param p 某个点
   * @returns {Point} 点 p 应用当前变换矩阵后得到的一个新的点
   */
  apply(p: Point): Point {
    const newPos = new Point();

    const x = p.x;
    const y = p.y;

    newPos.x = this.a * x + this.c * y + this.tx;
    newPos.y = this.b * x + this.d * y + this.ty;

    return newPos;
  }

  /**
   * 对某个点应用当前的变换矩阵的逆矩阵
   * @param p 某个点
   * @returns {Point} 点 p 应用当前变换矩阵的逆矩阵后得到的一个新的点
   */
  applyInverse(p: Point): Point {
    const newPos = new Point();

    const id = 1 / (this.a * this.d + this.c * -this.b);

    const x = p.x;
    const y = p.y;

    newPos.x = this.d * id * x + -this.c * id * y + (this.ty * this.c - this.tx * this.d) * id;
    newPos.y = this.a * id * y + -this.b * id * x + (-this.ty * this.a + this.tx * this.b) * id;

    return newPos;
  }

  /**
   * 将当前矩阵左乘一个矩阵
   */
  public prepend(m: Matrix): Matrix {
    const { a: a0, b: b0, c: c0, d: d0, tx: tx0, ty: ty0 } = m;
    const { a: a1, b: b1, c: c1, d: d1, tx: tx1, ty: ty1 } = this;
    this.a = a0 * a1 + c0 * b1;
    this.b = b0 * a1 + d0 * b1;
    this.c = a0 * c1 + c0 * d1;
    this.d = b0 * c1 + d0 * d1;
    this.tx = a0 * tx1 + c0 * ty1 + tx0;
    this.ty = b0 * tx1 + d0 * ty1 + ty0;

    return this;
  }

  public clone(): Matrix {
    const matrix = new Matrix();

    matrix.a = this.a;
    matrix.b = this.b;
    matrix.c = this.c;
    matrix.d = this.d;
    matrix.tx = this.tx;
    matrix.ty = this.ty;

    return matrix;
  }
}
