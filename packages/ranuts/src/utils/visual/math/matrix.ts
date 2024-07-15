// 矩阵的操作
export class Matrix {
  public a: number
  public b: number
  public c: number
  public d: number
  public tx: number
  public ty: number
  constructor(a = 1, b = 0, c = 0, d = 1, tx = 0, ty = 0) {
    this.a = a
    this.b = b
    this.c = c
    this.d = d
    this.tx = tx
    this.ty = ty
  }

  set(a: number, b: number, c: number, d: number, tx: number, ty: number) {
    this.a = a
    this.b = b
    this.c = c
    this.d = d
    this.tx = tx
    this.ty = ty

    return this
  }

  /**
   * 将当前矩阵右乘一个矩阵
   */
  public append(m: Matrix) {
    const { a: a0, b: b0, c: c0, d: d0, tx: tx0, ty: ty0 } = this
    const { a: a1, b: b1, c: c1, d: d1, tx: tx1, ty: ty1 } = m
    this.a = a0 * a1 + c0 * b1
    this.b = b0 * a1 + d0 * b1
    this.c = a0 * c1 + c0 * d1
    this.d = b0 * c1 + d0 * d1
    this.tx = a0 * tx1 + c0 * ty1 + tx0
    this.ty = b0 * tx1 + d0 * ty1 + ty0

    return this
  }

  /**
   * 将当前矩阵左乘一个矩阵
   */
  public prepend(m: Matrix) {
    const { a: a0, b: b0, c: c0, d: d0, tx: tx0, ty: ty0 } = m
    const { a: a1, b: b1, c: c1, d: d1, tx: tx1, ty: ty1 } = this
    this.a = a0 * a1 + c0 * b1
    this.b = b0 * a1 + d0 * b1
    this.c = a0 * c1 + c0 * d1
    this.d = b0 * c1 + d0 * d1
    this.tx = a0 * tx1 + c0 * ty1 + tx0
    this.ty = b0 * tx1 + d0 * ty1 + ty0

    return this
  }

  public clone() {
    const matrix = new Matrix()

    matrix.a = this.a
    matrix.b = this.b
    matrix.c = this.c
    matrix.d = this.d
    matrix.tx = this.tx
    matrix.ty = this.ty

    return matrix
  }
}
