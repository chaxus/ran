import { SyncHook } from '@/utils/subscribe';
import type { Container } from '@/utils/visual/vertex/container';
import type { ObservablePoint } from '@/utils/visual/vertex/point';
import { Transform } from '@/utils/visual/math/transform';
import type { Matrix } from '@/utils/visual/math/matrix';
import type { Cursor, FederatedEventMap } from '@/utils/visual/event';
import { DEG_TO_RAD, RAD_TO_DEG } from '@/utils/visual/math';
import type { Shape } from '@/utils/visual/shape';

export abstract class Vertex extends SyncHook {
  protected _zIndex = 0; // 节点的层级关系
  public parent: Container | undefined = undefined; // 节点的父子关系
  public visible = true;
  public transform = new Transform();
  public alpha = 1;
  public worldAlpha = 1;
  public hitArea: Shape | null = null;
  public cursor: Cursor = 'auto';

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
