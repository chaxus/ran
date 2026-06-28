import { Renderer } from '@/utils/visual/render/render';
import { BYTES_PER_VERTEX } from '@/utils/visual/enums';
import { batchPool, buildArray, updateArray } from '@/utils/visual/render/utils/batch';
import type { Container } from '@/utils/visual/vertex/container';
import type { Batch } from '@/utils/visual/render/utils/batch';
import type { IApplicationOptions } from '@/utils/visual/types';

export abstract class BatchRenderer extends Renderer {
  /**
   * 上次构建大数组时的场景结构版本号（每个渲染器实例独立）。与根节点的 structureVersion
   * 不一致时说明场景结构变了（增删节点 / 重绘），需要重建；否则只做逐帧 transform 更新。
   * 初值 -1 保证首帧一定构建。基于版本号对比，多个渲染器共享同一场景也不会互相“消费”脏标记。
   */
  protected builtVersion = -1;

  /**
   * 顶点个数
   */
  protected vertexCount = 0;

  /**
   * 顶点下标个数
   */
  protected indexCount = 0;

  protected batches: Array<Batch | undefined> = [];
  protected batchesCount = 0;

  /**
   * 顶点数组 float32 视图
   */
  protected vertFloatView: Float32Array;

  /**
   * 顶点数组 Uint32 视图
   */
  protected vertIntView: Uint32Array;

  /**
   * 顶点下标数组
   */
  protected indexBuffer: Uint32Array;

  /**
   * 当前的 webGL｜webGPU vertex buffer 的长度
   */
  protected curVertBufferLength = 0;

  /**
   * 当前的 webGL｜webGPU index buffer 的长度
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
   * 如果现有的 typed array 放不下了，则新建一个
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
   * 将数据打包到大数组里
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
   * 调用 webGL 或 webGPU 的绘制 api 将内容绘制出来
   */
  protected abstract draw(): void;

  /**
   * 更新更新 vertex buffer 和 index buffer
   */
  protected abstract updateBuffer(): void;

  /**
   * 设置投影矩阵，这是为了适配 canvas 元素的尺寸
   */
  protected abstract setProjectionMatrix(): void;

  /**
   * 更新 stage 的 transform 对应的 uniform 变量
   */
  protected abstract setRootTransform(a: number, b: number, c: number, d: number, tx: number, ty: number): void;

  /**
   * 更新子节点的 transform
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
   * 更新节点的位置信息并渲染
   */
  public render(rootContainer: Container): void {
    this.updateChildrenTransform(rootContainer);

    /**
     * 场景结构变化时重建大数组，否则只更新顶点位置
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
