import { Vertex } from '@/utils/visual/vertex';
import type { CanvasRenderer } from '@/utils/visual/render/canvasRenderer';
import { Transform } from '@/utils/visual/math/transform';

export class Container extends Vertex {
  public readonly children: Container[] = []
  public isSort: boolean = false
  constructor() {
    super();
  }
  /**
   * @description: 添加子元素
   * @param {Container} child
   * @return {*}
   */
  public addChild = (child: Container): void => {
    if (child.parent) {
      child.parent.removeChild(child) // 将要添加的 child 从它的父元素的 children 中移除
    }
    this.children.push(child)
    child.parent = this // 将要添加的 child 的 parent 指向 this
    this.isSort = true // 添加了子元素之后，当前元素需要重新 sort
  }
  /**
   * @description:删除子元素
   * @param {Container} child
   * @return {void}
   */
  public removeChild = (child: Container): void => {
    for (let i = 0; i < this.children.length; i++) {
      if (this.children[i] === child) {
        this.children.splice(i, 1)
        child.parent = undefined
        return
      }
    }
  }
  /**
   * @description: 排序子元素
   * @return {*}
   */
  public sortChildren(): void {
    if (!this.isSort) {
      return
    }
    this.children.sort((a, b) => a.zIndex - b.zIndex)
    this.isSort = false
  }
  /**
  * 渲染自身，在 container 上面没有东西要渲染，所以这个函数的内容为空
  */
  protected renderCanvas(render: CanvasRenderer):void {
    // nothing
  }
  /**
  * 递归渲染以自身为根的整棵节点树
  */
  public renderCanvasRecursive(render: CanvasRenderer):void {
    if (!this.visible) {
      return
    }
    // 先渲染自身
    this.renderCanvas(render)
    // 渲染子节点
    for (let i = 0; i < this.children.length; i++) {
      const child = this.children[i]
      child.renderCanvasRecursive(render)
    }
  }
  /**
  * 递归更新当前元素以及所有子元素的 transform
  */
  public updateTransform():void {
    this.sortChildren()

    const parentTransform = this.parent?.transform || new Transform()
    const hasWorldTransformChanged =
      this.transform.updateTransform(parentTransform)

    this.worldAlpha = (this.parent?.worldAlpha || 1) * this.alpha

    if (this.worldAlpha <= 0 || !this.visible) {
      return
    }

    for (let i = 0, j = this.children.length; i < j; ++i) {
      const child = this.children[i]

      // 若当前元素的 worldTransform 改变了，那么其子元素的 worldTransform 需要重新计算
      if (hasWorldTransformChanged) {
        child.transform.shouldUpdateWorldTransform = true
      }

      child.updateTransform()
    }
  }
}

