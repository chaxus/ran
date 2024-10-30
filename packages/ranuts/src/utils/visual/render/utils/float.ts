const defaultMaxLen = 2 ** 4; // 16

export class CustomFloatArray {
  private _oldLength = -1;
  private _length = 0;
  private curMaxLen = defaultMaxLen;
  private float32 = new Float32Array(defaultMaxLen);
  private _data!: Float32Array;

  /**
   * 获取长度
   */
  get length(): number {
    return this._length;
  }

  /**
   * 拼接一个 number 数组
   */
  public concat(arr: number[]): void {
    const newLen = this._length + arr.length;

    while (newLen > this.curMaxLen) {
      this.expandCapacity();
    }

    for (let i = 0; i < arr.length; i++) {
      this.float32[this._length] = arr[i];
      this._length++;
    }
  }

  /**
   * 插入数据
   * @param num 要插入的数
   */
  public push(num: number): void {
    if (this._length >= this.curMaxLen) {
      this.expandCapacity();
    }

    this.float32[this._length] = num;
    this._length++;
  }

  /**
   * 扩容
   */
  public expandCapacity(): void {
    this.curMaxLen *= 2;

    const newFloat32 = new Float32Array(this.curMaxLen);
    newFloat32.set(this.float32);
    this.float32 = newFloat32;
  }

  /**
   * 以从 0 到 this.length 的这段 buffer 为底层，建立 Float32Array 视图并返回
   */
  get data(): Float32Array {
    if (this._oldLength !== this._length) {
      this._data = new Float32Array(this.float32.buffer, 0, this._length);
      this._oldLength = this._length;
    }
    return this._data;
  }

  /**
   * 清空
   */
  public clear(): void {
    // 并不会真的清空
    this._length = 0;
  }
}

export class CustomIntArray {
  private _oldLength = -1;
  private _length = 0;
  private curMaxLen = 2 ** 3;
  private int32 = new Uint32Array(2 ** 3);
  private _data!: Uint32Array;

  /**
   * 获取长度
   */
  get length(): number {
    return this._length;
  }

  /**
   * 拼接一个 number 数组
   */
  public concat(arr: number[]): void {
    const newLen = this.length + arr.length;

    while (newLen > this.curMaxLen) {
      this.expandCapacity();
    }

    for (let i = 0; i < arr.length; i++) {
      this.int32[this._length] = arr[i];
      this._length++;
    }
  }

  /**
   * 拼接一个UInt16数组
   */
  public concatUInt16(uint16: Uint32Array): void {
    const newLen = this.length + uint16.length;

    while (newLen > this.curMaxLen) {
      this.expandCapacity();
    }

    this.int32.set(uint16, this._length);

    this._length = newLen;
  }

  /**
   * 扩容
   */
  public expandCapacity(): void {
    this.curMaxLen *= 2;

    const newUInt16 = new Uint32Array(this.curMaxLen);
    newUInt16.set(this.int32);
    this.int32 = newUInt16;
  }

  /**
   * 以从 0 到 this.length 的这段 buffer 为底层，建立 Uint32Array 视图并返回
   */
  get data(): Uint32Array {
    if (this._oldLength !== this._length) {
      this._data = new Uint32Array(this.int32.buffer, 0, this._length);
      this._oldLength = this._length;
    }

    return this._data;
  }

  /**
   * 清空
   */
  public clear(): void {
    // 并不会真的清空
    this._length = 0;
  }
}
