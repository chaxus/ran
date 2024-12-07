import { BatchRenderer } from '@/utils/visual/render/batchRenderer';
import { BYTES_PER_VERTEX } from '@/utils/visual//enums';
import { fragmentShaderSource, vertexShaderSource } from '@/utils/visual/render/utils/webgpu/shaders';
import { toRgbArray } from '@/utils/visual/render/utils/index';
import type { IApplicationOptions } from '@/utils/visual/types';

export class WebGPURenderer extends BatchRenderer {
  private gpu: GPUCanvasContext;
  private device!: GPUDevice;
  private pipeline!: GPURenderPipeline;
  private renderPassDescriptor!: GPURenderPassDescriptor;
  private options: IApplicationOptions;

  /**
   * 顶点的 webGPU buffer
   */
  private gpuVertexBuffer!: GPUBuffer;

  /**
   * 顶点下标的 webGPU buffer
   */
  private gpuIndexBuffer!: GPUBuffer;

  /**
   * 投影矩阵的 webGPU buffer
   */
  private projectionMatBuffer!: GPUBuffer;

  /**
   * stage 的变换矩阵的 webGPU buffer
   */
  private stageMatBuffer!: GPUBuffer;

  /**
   * uniform 变量的 bind group
   */

  private uniformBindGroup!: GPUBindGroup;

  constructor(options: IApplicationOptions) {
    console.log('正在使用 %c webGPU ', 'color: #0072c6; background-color: #ffffff;font-size: 20px;', '渲染');

    super(options);

    this.options = options;

    this.gpu = this.canvasEle.getContext('webgpu') as GPUCanvasContext;

    this.curVertBufferLength = 256;
    this.curIndexBufferLength = 256;
  }

  public async init(): Promise<void> {
    await this.initDevice();

    this.initGpuBuffer();
    this.initRenderPassDescriptor();
    this.createPipeline();
    this.initUniformBindGroup();

    this.setRootTransform(1, 0, 0, 1, 0, 0);

    this.setProjectionMatrix();
  }

  protected draw(): void {
    const {
      device,
      renderPassDescriptor,
      gpuVertexBuffer,
      gpuIndexBuffer,
      gpu,
      uniformBindGroup,
      indexCount,
      pipeline,
    } = this;

    const commandEncoder = device.createCommandEncoder();
    const list = [...renderPassDescriptor.colorAttachments];
    if (list?.[0]?.view) {
      list[0].view = gpu.getCurrentTexture().createView();
    }
    const renderPass = commandEncoder.beginRenderPass(renderPassDescriptor);
    renderPass.setPipeline(pipeline);

    renderPass.setVertexBuffer(0, gpuVertexBuffer);
    renderPass.setIndexBuffer(gpuIndexBuffer, 'uint32');

    renderPass.setBindGroup(0, uniformBindGroup);

    renderPass.drawIndexed(indexCount);

    renderPass.end();

    const commandBuffer = commandEncoder.finish();

    device.queue.submit([commandBuffer]);
  }

  private initUniformBindGroup() {
    const device = this.device;

    this.stageMatBuffer = device.createBuffer({
      label: 'stage-matrix-uniform-buffer',
      size: 12 * Float32Array.BYTES_PER_ELEMENT,
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
    });

    this.projectionMatBuffer = device.createBuffer({
      label: 'projection-matrix-uniform-buffer',
      size: 12 * Float32Array.BYTES_PER_ELEMENT,
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
    });

    this.uniformBindGroup = this.device.createBindGroup({
      label: 'my-uniform-bind-group',
      layout: this.pipeline.getBindGroupLayout(0),
      entries: [
        {
          binding: 0,
          resource: { buffer: this.stageMatBuffer },
        },
        {
          binding: 1,
          resource: {
            buffer: this.projectionMatBuffer,
          },
        },
      ],
    });
  }

  private initGpuBuffer() {
    const device = this.device;

    this.gpuVertexBuffer = device.createBuffer({
      label: 'my-gpu-vertex-buffer',
      size: this.curVertBufferLength * BYTES_PER_VERTEX,
      usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
    });

    this.gpuIndexBuffer = device.createBuffer({
      label: 'my-gpu-index-buffer',
      size: this.curIndexBufferLength * Uint32Array.BYTES_PER_ELEMENT,
      usage: GPUBufferUsage.INDEX | GPUBufferUsage.COPY_DST,
    });
  }

  protected updateBuffer(): void {
    const device = this.device;

    if (this.vertexCount > this.curVertBufferLength) {
      this.gpuVertexBuffer.destroy();

      this.gpuVertexBuffer = device.createBuffer({
        label: 'my-gpu-vertex-buffer',
        size: this.vertexCount * BYTES_PER_VERTEX,
        usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
      });

      this.curVertBufferLength = this.vertexCount;
    }
    device.queue.writeBuffer(this.gpuVertexBuffer, 0, this.vertFloatView);

    if (this.indexCount > this.curIndexBufferLength) {
      this.gpuIndexBuffer.destroy();

      this.gpuIndexBuffer = device.createBuffer({
        label: 'my-gpu-index-buffer',
        size: this.indexCount * Uint32Array.BYTES_PER_ELEMENT,
        usage: GPUBufferUsage.INDEX | GPUBufferUsage.COPY_DST,
      });

      this.curIndexBufferLength = this.indexCount;
    }
    device.queue.writeBuffer(this.gpuIndexBuffer, 0, this.indexBuffer);
  }

  protected setRootTransform(a: number, b: number, c: number, d: number, tx: number, ty: number): void {
    this.device.queue.writeBuffer(
      this.stageMatBuffer,
      0,
      new Float32Array([
        a,
        b,
        0,
        0, // 矩阵第一列
        c,
        d,
        0,
        0, // 矩阵第二列
        tx,
        ty,
        1,
        0, // 矩阵第三列
      ]),
    );
  }

  protected setProjectionMatrix(): void {
    const width = this.canvasEle.width;
    const height = this.canvasEle.height;

    const scaleX = (1 / width) * 2;
    const scaleY = (1 / height) * 2;

    this.device.queue.writeBuffer(
      this.projectionMatBuffer,
      0,
      new Float32Array([
        scaleX,
        0,
        0,
        0, // 矩阵第一列
        0,
        -scaleY,
        0,
        0, // 矩阵第二列
        -1,
        1,
        1,
        0, // 矩阵第三列
      ]),
    );
  }

  /**
   * 初始化 pipeline
   */
  private createPipeline() {
    this.pipeline = this.device.createRenderPipeline({
      layout: 'auto',
      label: 'my-render-pipeline',
      vertex: {
        module: this.device.createShaderModule({
          code: vertexShaderSource,
          label: 'my-vert-shader-module',
        }),
        entryPoint: 'main',
        buffers: [
          {
            arrayStride: BYTES_PER_VERTEX,
            attributes: [
              {
                shaderLocation: 0, // @location(0) a_position
                format: 'float32x2', // 读 2 个 Float32，不用正交化
                offset: 0,
              },
              {
                shaderLocation: 1, // @location(1) a_color
                format: 'unorm8x4', // 读 4 个 UInt8 并且正交化
                offset: 2 * Float32Array.BYTES_PER_ELEMENT,
              },
            ],
          },
        ],
      },
      fragment: {
        module: this.device.createShaderModule({
          code: fragmentShaderSource,
          label: 'my-frag-shader-module',
        }),
        entryPoint: 'main',
        targets: [
          {
            // eslint-disable-next-line n/no-unsupported-features/node-builtins
            format: navigator.gpu.getPreferredCanvasFormat(),
            blend: {
              alpha: {
                srcFactor: 'one',
                dstFactor: 'one-minus-src-alpha',
                operation: 'add',
              },
              color: {
                srcFactor: 'one',
                dstFactor: 'one-minus-src-alpha',
                operation: 'add',
              },
            },
          },
        ],
      },
      primitive: {
        topology: 'triangle-list',
      },
    });
  }

  /**
   * 初始化 device
   */
  private async initDevice() {
    // eslint-disable-next-line n/no-unsupported-features/node-builtins
    const adapter = await navigator.gpu.requestAdapter();

    const device = await adapter?.requestDevice();
    if (!device) return;
    this.gpu.configure({
      device,
      // eslint-disable-next-line n/no-unsupported-features/node-builtins
      format: navigator.gpu.getPreferredCanvasFormat(),
      alphaMode: 'premultiplied',
    });

    this.device = device;
  }

  /**
   * 初始化 renderPassDescriptor
   */
  private initRenderPassDescriptor() {
    const { backgroundColor = '', backgroundAlpha = 1 } = this.options;

    const a = backgroundAlpha;

    const [r, g, b] = toRgbArray(backgroundColor).map((n) => n * a);

    this.renderPassDescriptor = {
      label: 'my-render-pass-descriptor',
      colorAttachments: [
        {
          view: this.gpu.getCurrentTexture().createView(),
          storeOp: 'store',
          loadOp: 'clear',
          clearValue: [r, g, b, a],
        },
      ],
    };
  }
}
