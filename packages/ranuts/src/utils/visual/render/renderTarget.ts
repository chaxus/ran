// A WebGL render target: an off-screen framebuffer backed by a colour texture. The scene is
// drawn into one of these so a Filter chain can post-process it before it reaches the canvas.
export class WebGLRenderTarget {
  public readonly framebuffer: WebGLFramebuffer;
  public readonly texture: WebGLTexture;
  public width = 0;
  public height = 0;

  constructor(private readonly gl: WebGLRenderingContext) {
    const gl2 = this.gl;
    this.texture = gl2.createTexture() as WebGLTexture;
    gl2.bindTexture(gl2.TEXTURE_2D, this.texture);
    gl2.texParameteri(gl2.TEXTURE_2D, gl2.TEXTURE_MIN_FILTER, gl2.LINEAR);
    gl2.texParameteri(gl2.TEXTURE_2D, gl2.TEXTURE_MAG_FILTER, gl2.LINEAR);
    gl2.texParameteri(gl2.TEXTURE_2D, gl2.TEXTURE_WRAP_S, gl2.CLAMP_TO_EDGE);
    gl2.texParameteri(gl2.TEXTURE_2D, gl2.TEXTURE_WRAP_T, gl2.CLAMP_TO_EDGE);

    this.framebuffer = gl2.createFramebuffer() as WebGLFramebuffer;
    gl2.bindFramebuffer(gl2.FRAMEBUFFER, this.framebuffer);
    gl2.framebufferTexture2D(gl2.FRAMEBUFFER, gl2.COLOR_ATTACHMENT0, gl2.TEXTURE_2D, this.texture, 0);
    gl2.bindFramebuffer(gl2.FRAMEBUFFER, null);
  }

  /** Resize the backing texture; a no-op when the size is unchanged. */
  public resize(width: number, height: number): void {
    if (width === this.width && height === this.height) return;
    this.width = width;
    this.height = height;
    const gl = this.gl;
    gl.bindTexture(gl.TEXTURE_2D, this.texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
  }

  /** Make this the active draw target and set the viewport to its size. */
  public bind(): void {
    const gl = this.gl;
    gl.bindFramebuffer(gl.FRAMEBUFFER, this.framebuffer);
    gl.viewport(0, 0, this.width, this.height);
  }

  public dispose(): void {
    this.gl.deleteFramebuffer(this.framebuffer);
    this.gl.deleteTexture(this.texture);
  }
}
