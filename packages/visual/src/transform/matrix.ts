
import { Point } from '../vertex/point';
import { PI_2 } from './enums';
import type { TransformableObject } from './types';
// 在渲染引擎中，一切变换 (平移、旋转、缩放等) 都会转化成变换矩阵 (matrix)，
// 因为 canvas 只接受矩阵变换，虽然 canvas 为了开发的便捷，也提供了 ctx.rotate,ctx.scale 等操作，
// 但是 canvas 中的这些操作会直接转换成变换矩阵，而不像 DOM 那样，有锚点的概念，
// 所以 canvas 提供的 rotate，scale 等操作，和 DOM 提供的 rotate，scale 的表现是不一样的。
// Matrix 类将会提供各种各样的与矩阵操作相关的函数 (矩阵相乘，矩阵求逆等)，任何变换的叠加都将会转换成 matrix，方便我们调用 canvas 的指令。
// 矩阵的操作
export class Matrix {
    public a: number; // x scale
    public b: number; // y skew
    public c: number; // x skew
    public d: number; //  y scale
    public tx: number; // x translation
    public ty: number; // y translation
    public array: Float32Array | null = null; // An array of the current matrix. Only populated when `toArray` is called
    constructor(a = 1, b = 0, c = 0, d = 1, tx = 0, ty = 0) {
      this.a = a;
      this.b = b;
      this.c = c;
      this.d = d;
      this.tx = tx;
      this.ty = ty;
    }
  
    set = (a: number, b: number, c: number, d: number, tx: number, ty: number): Matrix => {
      this.a = a;
      this.b = b;
      this.c = c;
      this.d = d;
      this.tx = tx;
      this.ty = ty;
  
      return this;
    };
  
    /**
     * 将当前矩阵右乘一个矩阵
     */
    public append = (m: Matrix): Matrix => {
      const { a: a0, b: b0, c: c0, d: d0, tx: tx0, ty: ty0 } = this;
      const { a: a1, b: b1, c: c1, d: d1, tx: tx1, ty: ty1 } = m;
      this.a = a0 * a1 + c0 * b1;
      this.b = b0 * a1 + d0 * b1;
      this.c = a0 * c1 + c0 * d1;
      this.d = b0 * c1 + d0 * d1;
      this.tx = a0 * tx1 + c0 * ty1 + tx0;
      this.ty = b0 * tx1 + d0 * ty1 + ty0;
  
      return this;
    };
  
    /**
     * Creates a Matrix object based on the given array. The Element to Matrix mapping order is as follows:
     *
     * a = array[0]
     * b = array[1]
     * c = array[3]
     * d = array[4]
     * tx = array[2]
     * ty = array[5]
     * @param array - The array that the matrix will be populated from.
     *
     * a,b,tx
     * c,d,ty
     */
    public fromArray = (array: number[]): void => {
      this.a = array[0];
      this.b = array[1];
      this.c = array[3];
      this.d = array[4];
      this.tx = array[2];
      this.ty = array[5];
    };
    /**
     * Translates the matrix on the x and y.
     * @param x - How much to translate x by
     * @param y - How much to translate y by
     * @returns This matrix. Good for chaining method calls.
     */
    public translate = (x: number, y: number): Matrix => {
      this.tx += x;
      this.ty += y;
  
      return this;
    };
    /**
     * Applies a scale transformation to the matrix.
     * @param x - The amount to scale horizontally
     * @param y - The amount to scale vertically
     * @returns This matrix. Good for chaining method calls.
     */
    public scale = (x: number, y: number): Matrix => {
      this.a *= x;
      this.d *= y;
      this.c *= x;
      this.b *= y;
      this.tx *= x;
      this.ty *= y;
  
      return this;
    };
    /**
     * Sets the matrix based on all the available properties
     * @param x - Position on the x axis
     * @param y - Position on the y axis
     * @param pivotX - Pivot on the x axis
     * @param pivotY - Pivot on the y axis
     * @param scaleX - Scale on the x axis
     * @param scaleY - Scale on the y axis
     * @param rotation - Rotation in radians
     * @param skewX - Skew on the x axis
     * @param skewY - Skew on the y axis
     * @returns This matrix. Good for chaining method calls.
     */
    public setTransform = (
      x: number,
      y: number,
      pivotX: number,
      pivotY: number,
      scaleX: number,
      scaleY: number,
      rotation: number,
      skewX: number,
      skewY: number,
    ): Matrix => {
      this.a = Math.cos(rotation + skewY) * scaleX;
      this.b = Math.sin(rotation + skewY) * scaleX;
      this.c = -Math.sin(rotation - skewX) * scaleY;
      this.d = Math.cos(rotation - skewX) * scaleY;
  
      this.tx = x - (pivotX * this.a + pivotY * this.c);
      this.ty = y - (pivotX * this.b + pivotY * this.d);
  
      return this;
    };
    /**
     * Applies a rotation transformation to the matrix.
     * @param angle - The angle in radians.
     * @returns This matrix. Good for chaining method calls.
     */
    public rotate = (angle: number): Matrix => {
      const cos = Math.cos(angle);
      const sin = Math.sin(angle);
  
      const a1 = this.a;
      const c1 = this.c;
      const tx1 = this.tx;
  
      this.a = a1 * cos - this.b * sin;
      this.b = a1 * sin + this.b * cos;
      this.c = c1 * cos - this.d * sin;
      this.d = c1 * sin + this.d * cos;
      this.tx = tx1 * cos - this.ty * sin;
      this.ty = tx1 * sin + this.ty * cos;
  
      return this;
    };
    /**
     * check to see if two matrices are the same
     * @param matrix - The matrix to compare to.
     */
    public equals = (matrix: Matrix): boolean => {
      return (
        matrix.a === this.a &&
        matrix.b === this.b &&
        matrix.c === this.c &&
        matrix.d === this.d &&
        matrix.tx === this.tx &&
        matrix.ty === this.ty
      );
    };
    /**
     * Resets this Matrix to an identity (default) matrix.
     * @returns This matrix. Good for chaining method calls.
     */
    public identity = (): Matrix => {
      this.a = 1;
      this.b = 0;
      this.c = 0;
      this.d = 1;
      this.tx = 0;
      this.ty = 0;
  
      return this;
    };
  
    /**
     * Decomposes the matrix (x, y, scaleX, scaleY, and rotation) and sets the properties on to a transform.
     * @param transform - The transform to apply the properties to.
     * @returns The transform with the newly applied properties
     */
    public decompose = (transform: TransformableObject): TransformableObject => {
      // sort out rotation / skew..
      const a = this.a;
      const b = this.b;
      const c = this.c;
      const d = this.d;
      const pivot = transform.pivot;
  
      const skewX = -Math.atan2(-c, d);
      const skewY = Math.atan2(b, a);
  
      const delta = Math.abs(skewX + skewY);
  
      if (delta < 0.00001 || Math.abs(PI_2 - delta) < 0.00001) {
        transform.rotation = skewY;
        transform.skew.x = transform.skew.y = 0;
      } else {
        transform.rotation = 0;
        transform.skew.x = skewX;
        transform.skew.y = skewY;
      }
  
      // next set scale
      transform.scale.x = Math.sqrt(a * a + b * b);
      transform.scale.y = Math.sqrt(c * c + d * d);
  
      // next set position
      transform.position.x = this.tx + (pivot.x * a + pivot.y * c);
      transform.position.y = this.ty + (pivot.x * b + pivot.y * d);
  
      return transform;
    };
    /**
     * 对某个点应用当前的变换矩阵
     * @param p 某个点
     * @returns {Point} 点 p 应用当前变换矩阵后得到的一个新的点
     */
    apply = (p: Point): Point => {
      const newPos = new Point();
  
      const x = p.x;
      const y = p.y;
  
      newPos.x = this.a * x + this.c * y + this.tx;
      newPos.y = this.b * x + this.d * y + this.ty;
  
      return newPos;
    };
  
    /**
     * 对某个点应用当前的变换矩阵的逆矩阵
     * @param p 某个点
     * @returns {Point} 点 p 应用当前变换矩阵的逆矩阵后得到的一个新的点
     */
    applyInverse = (p: Point): Point => {
      const newPos = new Point();
  
      const id = 1 / (this.a * this.d + this.c * -this.b);
  
      const x = p.x;
      const y = p.y;
  
      newPos.x = this.d * id * x + -this.c * id * y + (this.ty * this.c - this.tx * this.d) * id;
      newPos.y = this.a * id * y + -this.b * id * x + (-this.ty * this.a + this.tx * this.b) * id;
  
      return newPos;
    };
  
    /**
     * 将当前矩阵左乘一个矩阵
     */
    public prepend = (m: Matrix): Matrix => {
      const { a: a0, b: b0, c: c0, d: d0, tx: tx0, ty: ty0 } = m;
      const { a: a1, b: b1, c: c1, d: d1, tx: tx1, ty: ty1 } = this;
      this.a = a0 * a1 + c0 * b1;
      this.b = b0 * a1 + d0 * b1;
      this.c = a0 * c1 + c0 * d1;
      this.d = b0 * c1 + d0 * d1;
      this.tx = a0 * tx1 + c0 * ty1 + tx0;
      this.ty = b0 * tx1 + d0 * ty1 + ty0;
  
      return this;
    };
  
    public clone = (): Matrix => {
      const matrix = new Matrix();
  
      matrix.a = this.a;
      matrix.b = this.b;
      matrix.c = this.c;
      matrix.d = this.d;
      matrix.tx = this.tx;
      matrix.ty = this.ty;
  
      return matrix;
    };
  
    /**
     * Creates an array from the current Matrix object.
     * @param transpose - Whether we need to transpose the matrix or not
     * @param [out=new Float32Array(9)] - If provided the array will be assigned to out
     * @returns The newly created array which contains the matrix
     */
    public toArray = (transpose?: boolean, out?: Float32Array): Float32Array => {
      if (!this.array) {
        this.array = new Float32Array(9);
      }
  
      const array = out || this.array;
  
      if (transpose) {
        array[0] = this.a;
        array[1] = this.b;
        array[2] = 0;
        array[3] = this.c;
        array[4] = this.d;
        array[5] = 0;
        array[6] = this.tx;
        array[7] = this.ty;
        array[8] = 1;
      } else {
        array[0] = this.a;
        array[1] = this.c;
        array[2] = this.tx;
        array[3] = this.b;
        array[4] = this.d;
        array[5] = this.ty;
        array[6] = 0;
        array[7] = 0;
        array[8] = 1;
      }
  
      return array;
    };
  }