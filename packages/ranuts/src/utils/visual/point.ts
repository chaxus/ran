export class Point {
  public x: number
  public y: number
  constructor(x = 0, y = 0) {
    this.x = x
    this.y = y
  }

  set(x = 0, y = x):void {
    this.x = x
    this.y = y
  }
}

export class ObservablePoint {
  private _x: number
  private _y: number
  private cb: (...anyArgs: any[]) => any
  constructor(cb: (...anyArgs: any[]) => any, x = 0, y = 0) {
    this._x = x
    this._y = y
    this.cb = cb
  }

  set(x = 0, y = x):void {
    this._x = x
    this._y = y
    this.cb()
  }

  get x(): number {
    return this._x
  }

  set x(value: number) {
    if (this._x !== value) {
      this._x = value
      this.cb()
    }
  }

  get y(): number {
    return this._y
  }

  set y(value: number) {
    if (this._y !== value) {
      this._y = value
      this.cb()
    }
  }
}
