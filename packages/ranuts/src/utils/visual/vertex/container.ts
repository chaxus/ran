import { Vertex } from '@/utils/visual/vertex/vertex';
import { Transform } from '@/utils/visual/math';
import { CONTAINER } from '@/utils/visual/enums';
import type { CanvasRenderer } from '@/utils/visual/render/canvasRenderer';
import type { Point } from '@/utils/visual/vertex/point';
import type { BatchRenderer } from '@/utils/visual/render/batchRenderer';
import type { Batch } from '@/utils/visual/render/utils/batch/index';

// This class is the notion of a "group": it provides adding and removing children.
// The renderable classes (Graphics, Text, Sprite, …) extend it. It is not itself rendered —
// being only a group, it has no content of its own.
// It extends Vertex, since a group counts as a node.
export class Container extends Vertex {
  public isSort: boolean = false;
  public type = CONTAINER;
  /**
   * Every child
   */
  public readonly children: Container[] = [];
  /**
   * Marks whether worldTransform changed
   */
  protected worldId = 0;
  /**
   * Every batch
   */
  protected batches: Batch[] = [];
  /**
   * Number of batches
   */
  protected batchCount = 0;
  /**
   * Scene structure version (only meaningful on the root). Anything that changes what the
   * big array should look like — adding or removing a child, a Graphics redraw — bubbles to
   * the root and increments it, and the renderer uses that to decide whether to rebuild.
   */
  public structureVersion = 0;
  constructor() {
    super();
  }
  /**
   * Mark the scene structure as changed: bubble to the root and bump its version, so the next frame rebuilds the big array.
   */
  protected markStructureDirty = (): void => {
    let node: Container = this.parent ?? this;
    while (node.parent) {
      node = node.parent;
    }
    node.structureVersion++;
  };
  /**
   * @description: Add a child
   * @param {Container} child
   * @return {*}
   */
  public addChild = (child: Container): void => {
    child.parent?.removeChild(child); // detach the child from its previous parent
    this.children.push(child);
    child.parent = this; // point the child's parent at this container
    this.isSort = true;
    this.markStructureDirty();
  };
  /**
   * @description: Remove a child
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
   * @description: Sort children by z-index
   * @return {*}
   */
  public sortChildren = (): void => {
    if (!this.isSort) return;
    this.children.sort((a, b) => a.zIndex - b.zIndex);
    this.isSort = false;
  };
  /**
   * Render itself — a container has nothing to render, so this is empty
   */
  protected renderCanvas(_render: CanvasRenderer): void {
    // A group has no content of its own; subclasses such as Graphics override this
  }
  /**
   * Recursively render the whole tree rooted here
   */
  public renderCanvasRecursive = (render: CanvasRenderer): void => {
    // Matching buildArray in the WebGL / WebGPU backends: a subtree with worldAlpha <= 0 or marked invisible is skipped
    if (this.worldAlpha <= 0 || !this.visible) return;
    // Render itself first
    this.renderCanvas(render);
    // then the children
    for (let i = 0; i < this.children.length; i++) {
      const child = this.children[i];
      child.renderCanvasRecursive(render);
    }
  };
  /**
   * Recursively update this element's transform and every child's
   */
  public updateTransform = (): void => {
    // Sort children by z-index
    this.sortChildren();
    // Take the parent's transform, or build a default one when there is no parent
    const parentTransform = this.parent?.transform || new Transform();
    this.transform.updateTransform(parentTransform);
    this.worldAlpha = (this.parent?.worldAlpha || 1) * this.alpha;
    if (this.worldAlpha <= 0 || !this.visible) return;
    for (let i = 0; i < this.children.length; i++) {
      this.children[i].updateTransform();
    }
  };
  // containsPoint answers whether a point hit this instance; subclasses implement it too.
  // A Container has nothing to hit, so it simply returns false.
  public containsPoint = (p: Point): boolean => {
    if (!this.hitArea) return false;
    return this.hitArea.contains(p);
  };

  /**
   * Build its own batches. A group has no content of its own, so subclasses such as
   * Graphics override this. Both GPU backends reach it through BatchRenderer's buildArray.
   */
  public buildBatches(_batchRenderer: BatchRenderer): void {
    // a group has no content
  }

  /**
   * Update this node's batched vertices inside the big array
   */
  public updateBatches(_floatView: Float32Array): void {
    // a group has no content
  }
}
