import { BatchRenderer } from '@/utils/visual/render/batchRenderer';
import { initShader, setupVertexLayout } from '@/utils/visual/render/utils/webgl/initShader';
import { toRgbArray } from '@/utils/visual/render/utils/index';
import type { IApplicationOptions } from '@/utils/visual/types';

// WebGL 后端与 WebGPU 后端共用 BatchRenderer 的批处理管线（三角剖分 → 打包大数组），
// 仅在 draw / updateBuffer / 矩阵 uniform 上使用各自的图形 API。
export class WebGLRenderer extends BatchRenderer {
  public gl: WebGLRenderingContext;
  private program: WebGLProgram;
  private glVertexBuffer: WebGLBuffer;
  private glIndexBuffer: WebGLBuffer;
  private unifLoc: {
    u_root_transform: WebGLUniformLocation;
    u_projection_matrix: WebGLUniformLocation;
  };

  constructor(options: IApplicationOptions) {
    super(options);

    if (options.debug) {
      console.log('正在使用 %c webGL ', 'color: #881910; background-color: #ffffff;font-size: 20px;', '渲染');
    }

    this.gl = this.canvasEle.getContext('webgl', { antialias: true }) as WebGLRenderingContext;

    // 共享批处理管线使用 Uint32 顶点索引，WebGL1 需要开启该扩展
    this.gl.getExtension('OES_element_index_uint');

    this.program = initShader(this);

    // 创建并绑定顶点 / 索引 buffer，设置顶点属性布局
    this.glVertexBuffer = this.gl.createBuffer() as WebGLBuffer;
    this.glIndexBuffer = this.gl.createBuffer() as WebGLBuffer;
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.glVertexBuffer);
    this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.glIndexBuffer);
    setupVertexLayout(this.gl, this.program);

    this.unifLoc = {
      u_root_transform: this.gl.getUniformLocation(this.program, 'u_root_transform') as WebGLUniformLocation,
      u_projection_matrix: this.gl.getUniformLocation(this.program, 'u_projection_matrix') as WebGLUniformLocation,
    };

    const a = (options.backgroundAlpha ?? 0) as number;
    const [r, g, b] = toRgbArray((options.backgroundColor ?? '') as string);
    this.gl.clearColor(r * a, g * a, b * a, a);

    this.setRootTransform(1, 0, 0, 1, 0, 0);
    this.setProjectionMatrix();
  }

  protected setProjectionMatrix(): void {
    const width = this.canvasEle.width;
    const height = this.canvasEle.height;

    const scaleX = (1 / width) * 2;
    const scaleY = (1 / height) * 2;

    this.gl.uniformMatrix3fv(
      this.unifLoc.u_projection_matrix,
      false,
      new Float32Array([scaleX, 0, 0, 0, -scaleY, 0, -1, 1, 1]),
    );
  }

  protected setRootTransform(a: number, b: number, c: number, d: number, tx: number, ty: number): void {
    this.gl.uniformMatrix3fv(this.unifLoc.u_root_transform, false, new Float32Array([a, b, 0, c, d, 0, tx, ty, 1]));
  }

  protected updateBuffer(): void {
    const gl = this.gl;

    gl.bindBuffer(gl.ARRAY_BUFFER, this.glVertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, this.vertFloatView, gl.DYNAMIC_DRAW);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.glIndexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer, gl.DYNAMIC_DRAW);
  }

  protected draw(): void {
    const gl = this.gl;
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawElements(gl.TRIANGLES, this.indexCount, gl.UNSIGNED_INT, 0);
  }
}
