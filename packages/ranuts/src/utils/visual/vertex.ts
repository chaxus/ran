import { SyncHook } from '@/utils/subscribe';
import { Container } from '@/utils/visual/container';
import { Transform } from '@/utils/visual/math/transform'
import { ObservablePoint } from '@/utils/visual/point';

export abstract class Vertex extends SyncHook {
  protected _zIndex = 0 // 节点的层级关系
  public parent: Container | undefined = undefined // 节点的父子关系
  public visible = true
  public transform = new Transform()
  public alpha = 1
  public worldAlpha = 1


  get zIndex(): number {
    return this._zIndex
  }

  set zIndex(value: number) {
    this._zIndex = value
    if (this.parent) {
      this.parent.isSort = true
    }
  }
  get position(): ObservablePoint {
    return this.transform.position
  }
  public updateTransform() {
    const parentTransform = this.parent?.transform || new Transform()
    this.transform.updateTransform(parentTransform)
    this.worldAlpha = this.alpha * (this.parent?.worldAlpha || 1)
  }
}

