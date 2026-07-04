import { Vertex } from '@/utils/visual/vertex/vertex';
import { Transform } from '@/utils/visual/math';
import { CONTAINER } from '@/utils/visual/enums';
import type { CanvasRenderer } from '@/utils/visual/render/canvasRenderer';
import type { Point } from '@/utils/visual/vertex/point';
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
  /**
   * 场景结构版本号（仅根节点上的值有意义）。任何会改变“大数组该长什么样”的操作
   * （增删子节点、Graphics 重绘）都会冒泡到根节点并使其 +1，渲染器据此决定是否重建大数组。
   */
  public structureVersion = 0;
  constructor() {
    super();
  }
  /**
   * 标记场景结构已变化：冒泡到根节点并递增其版本号，触发下一帧的大数组重建。
   */
  protected markStructureDirty = (): void => {
    let node: Container = this.parent ?? this;
    while (node.parent) {
      node = node.parent;
    }
    node.structureVersion++;
  };
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
    this.markStructureDirty();
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
        this.markStructureDirty();
        return;
      }
    }
  };
  /**
   * @description: 根据 z-index 排序子元素
   * @return {*}
   */
  public sortChildren = (): void => {
    if (!this.isSort) return;
    this.children.sort((a, b) => a.zIndex - b.zIndex);
    this.isSort = false;
  };
  /**
   * 渲染自身，在 container 上面没有东西要渲染，所以这个函数的内容为空
   */
  protected renderCanvas(_render: CanvasRenderer): void {
    // 组容器自身没有可渲染内容，子类（如 Graphics）会重写此方法
  }
  /**
   * 递归渲染以自身为根的整棵节点树
   */
  public renderCanvasRecursive = (render: CanvasRenderer): void => {
    // 与 WebGL / WebGPU 后端的 buildArray 保持一致：worldAlpha<=0 或不可见的子树直接跳过
    if (this.worldAlpha <= 0 || !this.visible) return;
    // 先渲染自身
    this.renderCanvas(render);
    // 渲染子节点
    for (let i = 0; i < this.children.length; i++) {
      const child = this.children[i];
      child.renderCanvasRecursive(render);
    }
  };
  /**
   * 递归更新当前元素以及所有子元素的 transform
   */
  public updateTransform = (): void => {
    // 根据 z-index 排序子元素
    this.sortChildren();
    // 获取父元素的 transform，如果没有，则创建一个默认的 transform
    const parentTransform = this.parent?.transform || new Transform();
    this.transform.updateTransform(parentTransform);
    this.worldAlpha = (this.parent?.worldAlpha || 1) * this.alpha;
    if (this.worldAlpha <= 0 || !this.visible) return;
    for (let i = 0; i < this.children.length; i++) {
      this.children[i].updateTransform();
    }
  };
  // Container 类上挂载一个 containsPoint 函数，这个函数是用来判断某个点是否与当前类的实例产生了碰撞，Container 类的子类也会实现这个函数。
  // 由于 Container 自身没有可以碰撞的内容，所以它直接返回 false。
  public containsPoint = (p: Point): boolean => {
    if (!this.hitArea) return false;
    return this.hitArea.contains(p);
  };

  /**
   * 构建自身的 batch。组容器自身没有可渲染内容，子类（如 Graphics）会重写此方法。
   * WebGL / WebGPU 后端统一通过 BatchRenderer 的 buildArray 递归调用本方法。
   */
  public buildBatches(_batchRenderer: BatchRenderer): void {
    // 组容器无内容
  }

  /**
   * 更新自身的所有 batch 对应的大数组中的顶点
   */
  public updateBatches(_floatView: Float32Array): void {
    // 组容器无内容
  }
}
