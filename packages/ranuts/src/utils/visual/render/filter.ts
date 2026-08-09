import type { WebGLRenderTarget } from '@/utils/visual/render/renderTarget';

// Shared full-screen vertex shader — a clip-space quad passthrough that also derives the
// 0..1 sample UV. Filters supply only a fragment shader.
const FILTER_VERTEX = `
attribute vec2 a_pos;
varying vec2 v_uv;
void main() {
  v_uv = a_pos * 0.5 + 0.5;
  gl_Position = vec4(a_pos, 0.0, 1.0);
}`;

// Default fragment: copy the scene texture unchanged (a no-op filter / good base to extend).
const DEFAULT_FRAGMENT = `
precision mediump float;
uniform sampler2D u_texture;
varying vec2 v_uv;
void main() {
  gl_FragColor = texture2D(u_texture, v_uv);
}`;

type UniformValue = number | number[];

function compile(gl: WebGLRenderingContext, source: string, type: number): WebGLShader {
  const shader = gl.createShader(type) as WebGLShader;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const log = gl.getShaderInfoLog(shader);
    gl.deleteShader(shader);
    throw new Error(`Filter shader compile failed: ${log}`);
  }
  return shader;
}

/**
 * A full-screen post-processing pass. Sample the previous pass through `u_texture` (and
 * optionally `u_resolution`), transform it, and write the result. Compose several on a
 * renderer to build effects (colour grade, blur, invert, …).
 */
export class Filter {
  public uniforms: Record<string, UniformValue>;
  private readonly fragmentSource: string;
  private program: WebGLProgram | null = null;
  private aPos = -1;
  private locs = new Map<string, WebGLUniformLocation | null>();

  constructor(fragmentSource: string = DEFAULT_FRAGMENT, uniforms: Record<string, UniformValue> = {}) {
    this.fragmentSource = fragmentSource;
    this.uniforms = uniforms;
  }

  private ensureProgram(gl: WebGLRenderingContext): WebGLProgram {
    if (this.program) return this.program;
    const program = gl.createProgram() as WebGLProgram;
    gl.attachShader(program, compile(gl, FILTER_VERTEX, gl.VERTEX_SHADER));
    gl.attachShader(program, compile(gl, this.fragmentSource, gl.FRAGMENT_SHADER));
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      throw new Error(`Filter program link failed: ${gl.getProgramInfoLog(program)}`);
    }
    this.program = program;
    this.aPos = gl.getAttribLocation(program, 'a_pos');
    return program;
  }

  private loc(gl: WebGLRenderingContext, name: string): WebGLUniformLocation | null {
    if (!this.locs.has(name)) this.locs.set(name, gl.getUniformLocation(this.program as WebGLProgram, name));
    return this.locs.get(name) ?? null;
  }

  /**
   * Run the pass: read `inputTexture`, write to `output` (a render target, or `null` for the
   * canvas). `quadBuffer` is a shared [-1,1] quad (8 floats). Restores nothing — the renderer
   * re-binds its batch state afterwards.
   */
  public apply(
    gl: WebGLRenderingContext,
    quadBuffer: WebGLBuffer,
    inputTexture: WebGLTexture,
    output: WebGLRenderTarget | null,
    width: number,
    height: number,
  ): void {
    const program = this.ensureProgram(gl);

    if (output) {
      output.bind();
    } else {
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      gl.viewport(0, 0, width, height);
    }

    gl.useProgram(program);
    gl.bindBuffer(gl.ARRAY_BUFFER, quadBuffer);
    gl.enableVertexAttribArray(this.aPos);
    gl.vertexAttribPointer(this.aPos, 2, gl.FLOAT, false, 0, 0);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, inputTexture);
    const texLoc = this.loc(gl, 'u_texture');
    if (texLoc) gl.uniform1i(texLoc, 0);
    const resLoc = this.loc(gl, 'u_resolution');
    if (resLoc) gl.uniform2f(resLoc, width, height);

    for (const name in this.uniforms) {
      const location = this.loc(gl, name);
      if (!location) continue;
      const value = this.uniforms[name];
      if (typeof value === 'number') gl.uniform1f(location, value);
      else if (value.length === 2) gl.uniform2fv(location, value);
      else if (value.length === 3) gl.uniform3fv(location, value);
      else if (value.length === 4) gl.uniform4fv(location, value);
    }

    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  }

  public dispose(gl: WebGLRenderingContext): void {
    if (this.program) gl.deleteProgram(this.program);
    this.program = null;
    this.locs.clear();
  }
}

const COLOR_ADJUST_FRAGMENT = `
precision mediump float;
uniform sampler2D u_texture;
uniform float u_brightness;
uniform float u_contrast;
uniform float u_saturation;
varying vec2 v_uv;
void main() {
  vec4 c = texture2D(u_texture, v_uv);
  vec3 rgb = (c.rgb - 0.5) * u_contrast + 0.5 + u_brightness;
  float grey = dot(rgb, vec3(0.2125, 0.7154, 0.0721));
  rgb = mix(vec3(grey), rgb, u_saturation);
  gl_FragColor = vec4(clamp(rgb, 0.0, 1.0), c.a);
}`;

export interface ColorAdjustOptions {
  /** Additive brightness, 0 = unchanged. */
  brightness?: number;
  /** Multiplicative contrast, 1 = unchanged. */
  contrast?: number;
  /** Saturation, 1 = unchanged, 0 = greyscale, >1 = more saturated. */
  saturation?: number;
}

/**
 * A ready-made colour-grade filter: brightness, contrast and saturation. Mirrors the
 * `brightnessContrast` / `saturation` helpers in `ranuts/utils` on the GPU.
 */
export class ColorAdjustFilter extends Filter {
  constructor(options: ColorAdjustOptions = {}) {
    super(COLOR_ADJUST_FRAGMENT, {
      u_brightness: options.brightness ?? 0,
      u_contrast: options.contrast ?? 1,
      u_saturation: options.saturation ?? 1,
    });
  }
  public set brightness(v: number) {
    this.uniforms.u_brightness = v;
  }
  public set contrast(v: number) {
    this.uniforms.u_contrast = v;
  }
  public set saturation(v: number) {
    this.uniforms.u_saturation = v;
  }
}
