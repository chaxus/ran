import { Renderer } from '@/utils/visual/render/render';
import { BatchPool } from '@/utils/visual/render/utils/webgl/batchPool';
import { initShader } from '@/utils/visual/render/utils/webgl/initShader';
import { toRgbArray } from '@/utils/visual/render/utils/index';
import type { IApplicationOptions } from '@/utils/visual/types';
import type { Container } from '@/utils/visual/vertex/container';

export class WebGLRenderer extends Renderer {
  public gl: WebGLRenderingContext;
  public batchPool: BatchPool;
  private program: WebGLProgram;
  private unifLoc: {
    u_root_transform: WebGLUniformLocation;
    u_projection_matrix: WebGLUniformLocation;
  };
  constructor(options: IApplicationOptions) {
    console.log('正在使用 %c webGL ', 'color: #881910; background-color: #ffffff;font-size: 20px;', '渲染');
    super(options);
    const opts: WebGLContextAttributes = {
      antialias: true,
    };
    this.gl = this.canvasEle.getContext('webgl', opts) as WebGLRenderingContext;

    this.program = initShader(this);

    const uRootTransformLoc = this.gl.getUniformLocation(this.program, 'u_root_transform') as WebGLUniformLocation;
    const uProjectionMatrixLoc = this.gl.getUniformLocation(
      this.program,
      'u_projection_matrix',
    ) as WebGLUniformLocation;
    this.unifLoc = {
      u_root_transform: uRootTransformLoc,
      u_projection_matrix: uProjectionMatrixLoc,
    };

    this.setProjectionMatrix();

    this.batchPool = new BatchPool(this);

    const { backgroundColor, backgroundAlpha } = options;
    const a = backgroundAlpha as number;
    const [r, g, b] = toRgbArray(backgroundColor as string);
    this.gl.clearColor(r * a, g * a, b * a, a);

    this.setRootTransform(1, 0, 0, 1, 0, 0);
  }

  /**
   * 设置投影矩阵
   */
  private setProjectionMatrix() {
    const width = this.canvasEle.width;
    const height = this.canvasEle.height;

    const gl = this.gl;

    const loc = this.unifLoc.u_projection_matrix;

    const scaleX = (1 / width) * 2;
    const scaleY = (1 / height) * 2;

    gl.uniformMatrix3fv(loc, false, new Float32Array([scaleX, 0, 0, 0, -scaleY, 0, -1, 1, 1]));
  }

  private setRootTransform(a: number, b: number, c: number, d: number, tx: number, ty: number) {
    const gl = this.gl;

    const loc = this.unifLoc.u_root_transform;

    gl.uniformMatrix3fv(loc, false, new Float32Array([a, b, 0, c, d, 0, tx, ty, 1]));
  }

  public render(rootContainer: Container): void {
    /**
     * update transform
     */
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

    /**
     * 清空画布并绘制
     */

    const gl = this.gl;

    gl.clear(gl.COLOR_BUFFER_BIT);

    BatchPool.testDrawCallCount = 0;

    rootContainer.renderWebGLRecursive(this);

    this.batchPool.flush();

    // console.log('total draw call count：', BatchPool.testDrawCallCount)
  }
}
