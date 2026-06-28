// 设置普通的二维数据点
export class Point {
  public x: number;
  public y: number;
  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }

  public set(x = 0, y = x): void {
    this.x = x;
    this.y = y;
  }
  public clone = (): Point => {
    return new Point(this.x, this.y);
  };
}
// 当二维的数据点发生变化时，需要通知并执行回调函数。
// 回调始终接收最新的 (x, y)，因为 Transform 的 onScaleChange / onSkewChange 依赖这两个参数；
// 若不传参，scale / skew 会被设成 undefined 进而让整个变换矩阵变成 NaN。
export class ObservablePoint {
  private _x: number;
  private _y: number;
  private cb: (x: number, y: number) => void;
  constructor(cb: (x: number, y: number) => void, x = 0, y = 0) {
    this._x = x;
    this._y = y;
    this.cb = cb;
  }

  set(x = 0, y = x): void {
    this._x = x;
    this._y = y;
    this.cb(this._x, this._y);
  }

  get x(): number {
    return this._x;
  }

  set x(value: number) {
    if (this._x !== value) {
      this._x = value;
      this.cb(this._x, this._y);
    }
  }

  get y(): number {
    return this._y;
  }

  set y(value: number) {
    if (this._y !== value) {
      this._y = value;
      this.cb(this._x, this._y);
    }
  }
}
