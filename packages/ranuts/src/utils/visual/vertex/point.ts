// A plain 2D point
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
// A change to the point notifies its callback.
// The callback always receives the latest (x, y), because Transform's onScaleChange /
// onSkewChange depend on both: without them, scale / skew end up undefined and the whole
// transform matrix becomes NaN.
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
