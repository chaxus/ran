import { Vertex } from '@/utils/visual/vertex/vertex';
import { Transform } from '@/utils/visual/math';
import { CONTAINER } from '@/utils/visual/enums';
import type { CanvasRenderer } from '@/utils/visual/render/canvasRenderer';
import type { Point } from '@/utils/visual/vertex/point';
import type { WebGLRenderer } from '@/utils/visual/render/webGlRenderer';
import type { BatchRenderer } from '@/utils/visual/render/batchRenderer';
import type { Batch } from '@/utils/visual/render/utils/batch/index';

// 这个类代表了‘组’的概念，它提供了添加子元素，移除子元素等的方法；
// 后续的要被渲染的一些类 (如 Graphics，Text，Sprite 等) 会继承于这个类；这个类本身不会被渲染 (因为它只是一个‘组’，它本身没有内容可以渲染)。
// 这个类继承于 Vertex 类，‘组’也算作‘节点’。
export class Container extends Vertex {
  public isSort: boolean = false;
  public type = CONTAINER;

  /**
   * 所有子元素
   */
  public readonly children: Container[] = [];

  /**
   * 用来标记 worldTransform 是否发生了改变
   */
  protected worldId = 0;

  /**
   * 所有 batch
   */
  protected batches: Batch[] = [];

  /**
   * batch 总数
   */
  protected batchCount = 0;
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
  public sortChildren = (): void => {
    if (!this.isSort) {
      return;
    }
    this.children.sort((a, b) => a.zIndex - b.zIndex);
    this.isSort = false;
  };
  /**
   * 渲染自身，在 container 上面没有东西要渲染，所以这个函数的内容为空
   */
  protected renderCanvas(render: CanvasRenderer): void {
    // nothing
    console.log('Container renderCanvas', render);
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
    this.transform.updateTransform(parentTransform);

    this.worldAlpha = (this.parent?.worldAlpha || 1) * this.alpha;

    if (this.worldAlpha <= 0 || !this.visible) {
      return;
    }

    for (let i = 0; i < this.children.length; i++) {
      this.children[i].updateTransform();
    }
  }
  // Container 类上挂载一个 containsPoint 函数，这个函数是用来判断某个点是否与当前类的实例产生了碰撞，Container 类的子类也会实现这个函数。
  // 由于 Container 自身没有可以碰撞的内容，所以它直接返回 false。
  public containsPoint(p: Point): boolean {
    if (!this.hitArea) {
      return false;
    }

    return this.hitArea.contains(p);
  }

  /**
   * 使用 webGL，渲染自身，在 container 上面没有东西要渲染，所以这个函数的内容为空
   */
  protected renderWebGL(renderer: WebGLRenderer): void {
    // nothing
    console.log('Container renderWebGL', renderer);
  }

  /**
   * 使用 webGL，递归渲染以自身为根的整棵节点树
   */
  public renderWebGLRecursive(renderer: WebGLRenderer): void {
    if (!this.visible) {
      return;
    }

    this.renderWebGL(renderer);

    for (let i = 0; i < this.children.length; i++) {
      this.children[i].renderWebGLRecursive(renderer);
    }
  }
  /**
   * 构建自身的 batch
   */
  public buildBatches(batchRenderer: BatchRenderer): void {
    // nothing
    console.log('Container buildBatches', batchRenderer);
  }

  /**
   * 更新自身的所有 batch 对应的大数组中的顶点
   */
  public updateBatches(floatView: Float32Array): void {
    // nothing
    console.log('Container updateBatches', floatView);
  }
}
