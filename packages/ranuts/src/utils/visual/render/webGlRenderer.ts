import { BatchRenderer } from '@/utils/visual/render/batchRenderer';
import { initShader, setupVertexLayout } from '@/utils/visual/render/utils/webgl/initShader';
import { toRgbArray } from '@/utils/visual/render/utils/index';
import type { IApplicationOptions } from '@/utils/visual/types';

// The WebGL and WebGPU backends share BatchRenderer's batching pipeline (triangulate → pack
// the big array); only draw / updateBuffer / matrix uniforms use each one's own graphics API.
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
      console.log('rendering with %c webGL ', 'color: #881910; background-color: #ffffff;font-size: 20px;', '');
    }

    this.gl = this.canvasEle.getContext('webgl', { antialias: true }) as WebGLRenderingContext;

    // The shared pipeline uses Uint32 vertex indices, which WebGL1 needs this extension for
    this.gl.getExtension('OES_element_index_uint');

    this.program = initShader(this);

    // Create and bind the vertex / index buffers and set the attribute layout
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
