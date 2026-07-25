import type { BatchRenderer } from '@/utils/visual/render/batchRenderer';
import type { Container } from '@/utils/visual/vertex/container';
import type { Fill } from '@/utils/visual/style';
import { BYTES_PER_VERTEX } from '@/utils/visual/enums';
import type { Graphics } from '@/utils/visual/graphics';
/**
 * Build the big array
 */
export const buildArray = (batchRenderer: BatchRenderer, container: Container): void => {
  if (container.worldAlpha <= 0 || !container.visible) {
    return;
  }

  container.buildBatches(batchRenderer);

  const children = container.children;

  for (let i = 0; i < children.length; i++) {
    buildArray(batchRenderer, children[i]);
  }
};

/**
 * Update the big array
 */
export const updateArray = (floatView: Float32Array, container: Container): void => {
  if (container.worldAlpha <= 0 || !container.visible) {
    return;
  }

  container.updateBatches(floatView);

  const children = container.children;

  for (let i = 0; i < children.length; i++) {
    updateArray(floatView, children[i]);
  }
};

export abstract class Batch {
  /**
   * Vertex count
   */
  vertexCount = 0;

  /**
   * Index count
   */
  indexCount = 0;

  /**
   * rgba packed little-endian
   */
  rgba = 0;

  /**
   * Where this batch's vertices start in the big array
   */
  vertexStart = 0;

  /**
   * Where this batch's indices start in the big array
   */
  indexStart = 0;

  /**
   * Write the vertex data into the big array
   */
  public abstract packVertices(floatView: Float32Array, intView: Uint32Array): void;

  /**
   * Write the index data into the big array
   */
  public abstract packIndices(int32: Uint32Array): void;

  /**
   * Update the vertex positions inside the big array
   */
  public abstract updateVertices(floatView: Float32Array): void;
}

export class BatchPart {
  public style: Fill;
  public vertexStart = 0;
  public indexStart = 0;
  public vertexCount = 0;
  public indexCount = 0;
  constructor(style: Fill) {
    this.style = style;
  }
  public start(vertexStart: number, indexStart: number): void {
    this.vertexStart = vertexStart;
    this.indexStart = indexStart;
  }
  public end(vertexCount: number, indexCount: number): void {
    this.vertexCount = vertexCount;
    this.indexCount = indexCount;
  }
}

export abstract class BatchPool {
  protected idx = 0;
  public abstract getOne(): Batch;
  reset(): void {
    this.idx = 0;
  }
}

export class GraphicsBatchPool extends BatchPool {
  private batches: GraphicsBatch[] = [];
  constructor() {
    super();
  }
  public getOne(): GraphicsBatch {
    if (!this.batches[this.idx]) {
      this.batches[this.idx] = new GraphicsBatch();
    }
    return this.batches[this.idx++];
  }
}

export class GraphicsBatch extends Batch {
  /**
   * Where this part's vertices start in geometry.vertices
   */
  public vertexOffset = 0;

  /**
   * Where this part's indices start in geometry.indices
   */
  public indexOffset = 0;

  /**
   * The Graphics instance this belongs to
   */
  graphics!: Graphics;

  packVertices(floatView: Float32Array, intView: Uint32Array): void {
    const step = BYTES_PER_VERTEX / 4;

    const vertices = this.graphics.geometry.vertices.data;

    const offset = this.vertexOffset;

    for (let i = 0; i < this.vertexCount; i++) {
      const x = vertices[(offset + i) * 2]; // position.x
      const y = vertices[(offset + i) * 2 + 1]; // position.y

      const { a, b, c, d, tx, ty } = this.graphics.worldTransform;

      const realX = a * x + c * y + tx;
      const realY = b * x + d * y + ty;

      const vertPos = (this.vertexStart + i) * step;

      floatView[vertPos] = realX;
      floatView[vertPos + 1] = realY;

      intView[vertPos + 2] = this.rgba; // color
    }
  }

  packIndices(int32: Uint32Array): void {
    const indices = this.graphics.geometry.indices.data;

    const offset = this.indexOffset;

    for (let i = 0; i < this.indexCount; i++) {
      int32[this.indexStart + i] = indices[i + offset] + this.vertexStart;
    }
  }

  updateVertices(floatView: Float32Array): void {
    const step = BYTES_PER_VERTEX / 4;

    const vertices = this.graphics.geometry.vertices.data;

    const offset = this.vertexOffset;

    const { a, b, c, d, tx, ty } = this.graphics.worldTransform;

    for (let i = 0; i < this.vertexCount; i++) {
      const x = vertices[(offset + i) * 2]; // position.x
      const y = vertices[(offset + i) * 2 + 1]; // position.y

      const vertPos = (this.vertexStart + i) * step;

      floatView[vertPos] = a * x + c * y + tx;
      floatView[vertPos + 1] = b * x + d * y + ty;
    }
  }
}

class BatchPools {
  private batchesMap: Record<string, BatchPool> = {
    graphics: new GraphicsBatchPool(),
  };
  public get(type: string) {
    return this.batchesMap[type].getOne();
  }
  public reset() {
    Object.values(this.batchesMap).forEach((pool) => {
      pool.reset();
    });
  }
}

export const batchPool = new BatchPools();
