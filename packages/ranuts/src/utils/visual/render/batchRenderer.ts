import { Renderer } from '@/utils/visual/render/render';
import { BYTES_PER_VERTEX } from '@/utils/visual/enums';
import { batchPool, buildArray, updateArray } from '@/utils/visual/render/utils/batch';
import type { Container } from '@/utils/visual/vertex/container';
import type { Batch } from '@/utils/visual/render/utils/batch';
import type { IApplicationOptions } from '@/utils/visual/types';

export abstract class BatchRenderer extends Renderer {
  /**
   * The scene structure version at the last rebuild, held per renderer instance. When it
   * differs from the root's structureVersion the scene changed (a node was added or removed,
   * or a shape redrawn) and the big array must be rebuilt; otherwise only per-frame transform
   * updates are needed. Starting at -1 guarantees a build on the first frame. Comparing
   * versions rather than consuming a dirty flag lets several renderers share one scene.
   */
  protected builtVersion = -1;

  /**
   * Vertex count
   */
  protected vertexCount = 0;

  /**
   * Index count
   */
  protected indexCount = 0;

  protected batches: Array<Batch | undefined> = [];
  protected batchesCount = 0;

  /**
   * Float32 view over the vertex array
   */
  protected vertFloatView: Float32Array;

  /**
   * Uint32 view over the vertex array
   */
  protected vertIntView: Uint32Array;

  /**
   * Index array
   */
  protected indexBuffer: Uint32Array;

  /**
   * Current length of the WebGL/WebGPU vertex buffer
   */
  protected curVertBufferLength = 0;

  /**
   * Current length of the WebGL/WebGPU index buffer
   */
  protected curIndexBufferLength = 0;

  constructor(options: IApplicationOptions) {
    super(options);

    const arrayBuffer = new ArrayBuffer(256 * BYTES_PER_VERTEX);

    this.vertFloatView = new Float32Array(arrayBuffer);
    this.vertIntView = new Uint32Array(arrayBuffer);

    this.indexBuffer = new Uint32Array(256);
  }

  public addBatch(batch: Batch): void {
    batch.vertexStart = this.vertexCount;
    batch.indexStart = this.indexCount;

    this.vertexCount += batch.vertexCount;
    this.indexCount += batch.indexCount;
    this.batches[this.batchesCount] = batch;
    this.batchesCount++;
  }

  protected startBuild(): void {
    this.vertexCount = 0;
    this.indexCount = 0;
    this.batchesCount = 0;
    batchPool.reset();
  }

  protected buildEnd(): void {
    this.resizeBufferIfNeeded();
    this.packData();
  }

  /**
   * Allocate a bigger typed array when the current one can no longer hold the data
   */
  protected resizeBufferIfNeeded(): void {
    if (this.vertexCount * BYTES_PER_VERTEX > this.vertFloatView.byteLength) {
      const arrayBuffer = new ArrayBuffer(this.vertexCount * BYTES_PER_VERTEX);
      this.vertFloatView = new Float32Array(arrayBuffer);
      this.vertIntView = new Uint32Array(arrayBuffer);
    }

    if (this.indexCount > this.indexBuffer.length) {
      this.indexBuffer = new Uint32Array(this.indexCount);
    }
  }

  /**
   * Pack the data into the big array
   */
  protected packData(): void {
    for (let i = 0; i < this.batchesCount; i++) {
      const batch = this.batches[i];

      this.batches[i] = undefined;

      batch?.packVertices(this.vertFloatView, this.vertIntView);
      batch?.packIndices(this.indexBuffer);
    }
  }

  /**
   * Draw via the WebGL or WebGPU drawing API
   */
  protected abstract draw(): void;

  /**
   * Update the vertex and index buffers
   */
  protected abstract updateBuffer(): void;

  /**
   * Set the projection matrix, which adapts to the canvas element's size
   */
  protected abstract setProjectionMatrix(): void;

  /**
   * Update the uniform holding the stage's transform
   */
  protected abstract setRootTransform(a: number, b: number, c: number, d: number, tx: number, ty: number): void;

  /**
   * Update the children's transforms
   */
  protected updateChildrenTransform(rootContainer: Container): void {
    rootContainer.sortChildren();

    const dirty = rootContainer.transform.shouldUpdateLocalTransform;

    rootContainer.transform.updateLocalTransform();

    if (dirty) {
      const { a, b, c, d, tx, ty } = rootContainer.transform.localTransform;
      this.setRootTransform(a, b, c, d, tx, ty);
    }

    rootContainer.worldAlpha = rootContainer.alpha;

    const children = rootContainer.children;
    for (let i = 0; i < children.length; i++) {
      children[i].updateTransform();
    }
  }

  /**
   * Update node positions and render
   */
  public render(rootContainer: Container): void {
    this.updateChildrenTransform(rootContainer);

    /**
     * Rebuild the big array when the scene structure changed; otherwise only update vertex positions
     */
    if (this.builtVersion !== rootContainer.structureVersion) {
      this.startBuild();

      buildArray(this, rootContainer);

      this.buildEnd();

      this.builtVersion = rootContainer.structureVersion;
    } else {
      updateArray(this.vertFloatView, rootContainer);
    }

    this.updateBuffer();

    this.draw();
  }
}
