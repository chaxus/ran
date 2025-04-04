import { SyncHook } from 'ranuts/utils';
import type { Cursor, FederatedEventMap } from '../event/types';
import type { Shape } from '../shape/shape';
import { Transform } from '../transform/transform';
import type { Matrix } from '../transform/matrix';
import { DEG_TO_RAD, RAD_TO_DEG } from '../transform/enums';
import type { Container } from './container';
import type { ObservablePoint } from './point';
// 这个类代表了最原始的‘节点’的概念，所有可以被展示到 canvas 画布上的、各种类型的节点都会继承于这个类，这是一个抽象类，我们并不会直接实例化这个类。
// 这个类上面挂载了‘节点’的各种属性，比如：父元素、透明度、旋转角度、缩放、平移、节点是否可见等。
// 这个类还继承了 SyncHook 类，这个类是一个自定义的事件订阅/发布类，用于实现事件的订阅和发布。
export abstract class Vertex extends SyncHook {
  protected _zIndex = 0; // 节点的层级关系
  public parent: Container | undefined = undefined; // 节点的父子关系
  public visible = true;
  public transform = new Transform();
  public alpha = 1; // 节点当前的透明度
  public worldAlpha = 1; // 透明度会受到父节点的透明度影响，因此需要一个全局的透明度
  public hitArea: Shape | null = null;
  public cursor: Cursor = 'auto'; // 鼠标样式

  get zIndex(): number {
    return this._zIndex;
  }

  set zIndex(value: number) {
    this._zIndex = value;
    if (this.parent) {
      this.parent.isSort = true;
    }
  }

  get position(): ObservablePoint {
    return this.transform.position;
  }

  get localTransform(): Matrix {
    return this.transform.localTransform;
  }

  get worldTransform(): Matrix {
    return this.transform.worldTransform;
  }

  get x(): number {
    return this.position.x;
  }

  set x(value: number) {
    this.transform.position.x = value;
  }

  get y(): number {
    return this.position.y;
  }

  set y(value: number) {
    this.transform.position.y = value;
  }

  get scale(): ObservablePoint {
    return this.transform.scale;
  }

  get pivot(): ObservablePoint {
    return this.transform.pivot;
  }

  get skew(): ObservablePoint {
    return this.transform.skew;
  }

  get rotation(): number {
    return this.transform.rotation;
  }

  set rotation(value: number) {
    this.transform.rotation = value;
  }

  get angle(): number {
    return this.transform.rotation * RAD_TO_DEG;
  }

  set angle(value: number) {
    this.transform.rotation = value * DEG_TO_RAD;
  }

  public updateTransform(): void {
    const parentTransform = this.parent?.transform || new Transform();
    this.transform.updateTransform(parentTransform);
    this.worldAlpha = this.alpha * (this.parent?.worldAlpha || 1);
  }
  public addEventListener = <K extends keyof FederatedEventMap>(
    type: K,
    listener: (e: FederatedEventMap[K]) => unknown,
    options?: boolean | AddEventListenerOptions,
  ): void => {
    const capture = (typeof options === 'boolean' && options) || (typeof options === 'object' && options.capture);
    const realType = capture ? `${type}capture` : type;
    if (typeof options === 'object' && options.once) {
      this.once(realType, listener);
    } else {
      this.tap(realType, listener);
    }
  };
  public removeEventListener = <K extends keyof FederatedEventMap>(
    type: K,
    listener: (e: FederatedEventMap[K]) => unknown,
    capture?: boolean,
  ): void => {
    const realType = capture ? `${type}capture` : type;
    this.off(realType, listener);
  };
}
