import { BYTES_PER_VERTEX, MAX_VERTEX_COUNT } from '@/utils/visual/enums';
import type { WebGLRenderer } from '@/utils/visual/render/webGLRenderer';

export interface Batch {
  vertices: Float32Array; // 顶点数组
  vertexIndices: Uint16Array; // 顶点下标数组
  rgba: number; // rgba 的小端序形式
}

export class BatchPool {
  renderer: WebGLRenderer;
  private vertexCount = 0;
  private vertexIndexCount = 0;
  private batches: Batch[] = [];
  private batchesCount = 0;

  // 这是一个测试属性
  public static testDrawCallCount = 0;

  private vertexBufferFloatView: Float32Array;
  private vertexBufferIntView: Uint32Array;
  private vertexBufferPool: Record<number, { float32View: Float32Array; uint32View: Uint32Array }> = {};
  private vertexIndexBuffer: Uint16Array;
  private vertexIndexBufferPool: Record<number, Uint16Array> = {};

  private curVertexBufferSize = 0;
  private curVertexIndexBufferSize = 0;

  private curElementCount = 0;

  constructor(renderer: WebGLRenderer) {
    this.renderer = renderer;

    const arrayBuffer = new ArrayBuffer(256 * BYTES_PER_VERTEX);

    this.vertexBufferFloatView = new Float32Array(arrayBuffer);
    this.vertexBufferIntView = new Uint32Array(arrayBuffer);
    this.vertexIndexBuffer = new Uint16Array(256);

    this.vertexBufferPool[256] = {
      float32View: this.vertexBufferFloatView,
      uint32View: this.vertexBufferIntView,
    };
    this.vertexIndexBufferPool[256] = this.vertexIndexBuffer;
  }

  private setBuffer(vertexCount: number, vertexIndexCount: number) {
    let i = 256;
    while (vertexCount > i) {
      i *= 2;
    }

    if (this.vertexBufferPool[i]) {
      const { float32View, uint32View } = this.vertexBufferPool[i];
      this.vertexBufferFloatView = float32View;
      this.vertexBufferIntView = uint32View;
    } else {
      const arrayBuffer = new ArrayBuffer(i * BYTES_PER_VERTEX);
      this.vertexBufferFloatView = new Float32Array(arrayBuffer);
      this.vertexBufferIntView = new Uint32Array(arrayBuffer);

      this.vertexBufferPool[i] = {
        float32View: this.vertexBufferFloatView,
        uint32View: this.vertexBufferIntView,
      };
    }

    let j = 256;
    while (vertexIndexCount > j) {
      j *= 2;
    }

    if (this.vertexIndexBufferPool[j]) {
      this.vertexIndexBuffer = this.vertexIndexBufferPool[j];
    } else {
      this.vertexIndexBuffer = new Uint16Array(j);

      this.vertexIndexBufferPool[j] = this.vertexIndexBuffer;
    }
  }
  public push(batch: Batch): void {
    if (batch.vertices.length / 2 + this.vertexCount > MAX_VERTEX_COUNT) {
      this.flush();
    }

    this.vertexCount += batch.vertices.length / 2;
    this.vertexIndexCount += batch.vertexIndices.length;
    this.batches[this.batchesCount] = batch;
    this.batchesCount++;
  }
  private draw() {
    BatchPool.testDrawCallCount++;
    const gl = this.renderer.gl;
    gl.drawElements(gl.TRIANGLES, this.curElementCount, gl.UNSIGNED_SHORT, 0);
  }
  private packData() {
    let l1 = 0;
    let l2 = 0;
    for (let i = 0; i < this.batchesCount; i++) {
      const { vertices, vertexIndices, rgba } = this.batches[i];

      const curVertexCount = l1 / 3;

      for (let j = 0; j < vertices.length / 2; j++) {
        this.vertexBufferFloatView[l1] = vertices[j * 2];
        this.vertexBufferFloatView[l1 + 1] = vertices[j * 2 + 1];

        this.vertexBufferIntView[l1 + 2] = rgba;

        l1 += 3;
      }

      for (let j = 0; j < vertexIndices.length; j++) {
        this.vertexIndexBuffer[l2] = vertexIndices[j] + curVertexCount;
        l2++;
      }
    }

    const gl = this.renderer.gl;

    if (l1 > this.curVertexBufferSize) {
      gl.bufferData(gl.ARRAY_BUFFER, this.vertexBufferFloatView, gl.STATIC_DRAW);

      this.curVertexBufferSize = l1;
    } else {
      gl.bufferSubData(gl.ARRAY_BUFFER, 0, this.vertexBufferFloatView);
    }

    if (l2 > this.curVertexIndexBufferSize) {
      gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this.vertexIndexBuffer, gl.STATIC_DRAW);
      this.curVertexIndexBufferSize = l2;
    } else {
      gl.bufferSubData(gl.ELEMENT_ARRAY_BUFFER, 0, this.vertexIndexBuffer);
    }

    this.curElementCount = l2;
  }
  public flush(): void {
    if (this.batchesCount === 0) {
      return;
    }

    this.setBuffer(this.vertexCount, this.vertexIndexCount);

    this.packData();

    this.draw();

    // flush 完了后，将一些数据初始化
    this.vertexCount = 0;
    this.vertexIndexCount = 0;
    this.batches.length = 0;
    this.batchesCount = 0;
  }
}
