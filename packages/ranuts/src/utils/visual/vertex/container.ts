import { Vertex } from '@/utils/visual/vertex/vertex';
import type { CanvasRenderer } from '@/utils/visual/render/canvasRenderer';
import { Transform } from '@/utils/visual/math';
import type { Point } from '@/utils/visual/vertex/point';

export class Container extends Vertex {
  public readonly children: Container[] = [];
  public isSort: boolean = false;
  constructor() {
    super();
  }
  /**
   * @description: 添加子元素
   * @param {Container} child
   * @return {*}
   */
  public addChild = (child: Container): void => {
    child.parent?.removeChild(child); // 将要添加的 child 从它的父元素的 children 中移除

    this.children.push(child);
    child.parent = this; // 将要添加的 child 的 parent 指向 this
    this.isSort = true;
  };
  /**
   * @description:删除子元素
   * @param {Container} child
   * @return {void}
   */
  public removeChild = (child: Container): void => {
    for (let i = 0; i < this.children.length; i++) {
      if (this.children[i] === child) {
        this.children.splice(i, 1);
        child.parent = undefined;
        return;
      }
    }
  };
  /**
   * @description: 根据 z-index 排序子元素
   * @return {*}
   */
  public sortChildren(): void {
    if (!this.isSort) {
      return;
    }
    this.children.sort((a, b) => a.zIndex - b.zIndex);
    this.isSort = false;
  }
  /**
   * 渲染自身，在 container 上面没有东西要渲染，所以这个函数的内容为空
   */
  protected renderCanvas(render: CanvasRenderer): void {
    // nothing
  }
  /**
   * 递归渲染以自身为根的整棵节点树
   */
  public renderCanvasRecursive(render: CanvasRenderer): void {
    if (!this.visible) {
      return;
    }
    // 先渲染自身
    this.renderCanvas(render);
    // 渲染子节点
    for (let i = 0; i < this.children.length; i++) {
      const child = this.children[i];
      child.renderCanvasRecursive(render);
    }
  }
  /**
   * 递归更新当前元素以及所有子元素的 transform
   */
  public updateTransform(): void {
    // 根据 z-index 排序子元素
    this.sortChildren();
    // 获取父元素的 transform，如果没有，则创建一个默认的 transform
    const parentTransform = this.parent?.transform || new Transform();
    const hasWorldTransformChanged = this.transform.updateTransform(parentTransform);

    this.worldAlpha = (this.parent?.worldAlpha || 1) * this.alpha;

    if (this.worldAlpha <= 0 || !this.visible) {
      return;
    }

    for (let i = 0, j = this.children.length; i < j; ++i) {
      const child = this.children[i];

      // 若当前元素的 worldTransform 改变了，那么其子元素的 worldTransform 需要重新计算
      if (hasWorldTransformChanged) {
        child.transform.shouldUpdateWorldTransform = true;
      }

      child.updateTransform();
    }
  }
  // Container 类上挂载一个 containsPoint 函数，这个函数是用来判断某个点是否与当前类的实例产生了碰撞，Container 类的子类也会实现这个函数。
  // 由于 Container 自身没有可以碰撞的内容，所以它直接返回 false。
  public containsPoint(p: Point): boolean {
    if (!this.hitArea) {
      return false
    }

    return this.hitArea.contains(p)
  }
}
