import { BYTES_PER_VERTEX } from '@/utils/visual/enums';
import type { WebGLRenderer } from '@/utils/visual/render/webGlRenderer';
import { fragmentShaderSource, vertexShaderSource } from '@/utils/visual/render/utils/webgl/shaders';

const createShader = (gl: WebGLRenderingContext, type: number, source: string): WebGLShader => {
  const shader = gl.createShader(type) as WebGLShader;
  gl.shaderSource(shader, source);

  gl.compileShader(shader);
  const compiled = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
  if (compiled) {
    return shader;
  } else {
    const err = gl.getShaderInfoLog(shader);
    gl.deleteShader(shader);
    console.error(`shader compilation failed: ${err}`);
    throw new Error(`shader compilation failed: ${err}`);
  }
};

const createProgram = (gl: WebGLRenderingContext, vertexShader: WebGLShader, fragmentShader: WebGLShader) => {
  const program = gl.createProgram() as WebGLProgram;
  if (!program) {
    console.error(`failed to create the program`);
    throw new Error(`failed to create the program`);
  }

  gl.attachShader(program, vertexShader); // attachShader works out the shader type itself
  gl.attachShader(program, fragmentShader);

  gl.linkProgram(program);
  // Check the link result
  const linked = gl.getProgramParameter(program, gl.LINK_STATUS);
  if (!linked) {
    const err = gl.getProgramInfoLog(program);
    console.error(`link failed: ${err}`);
    gl.deleteProgram(program);
    gl.deleteShader(vertexShader);
    gl.deleteShader(fragmentShader);
    throw new Error(`link failed: ${err}`);
  }

  gl.useProgram(program);

  return program;
};

/**
 * Set the vertex attribute layout. The target ARRAY_BUFFER must already be bound.
 * The vertex format matches the shared batching pipeline (BatchRenderer):
 * position (2×Float32) + colour (4×Uint8, normalised), stride = BYTES_PER_VERTEX.
 */
export const setupVertexLayout = (gl: WebGLRenderingContext, program: WebGLProgram): void => {
  const aPositionLoc = gl.getAttribLocation(program, `a_position`);
  gl.vertexAttribPointer(
    aPositionLoc, // location of the attribute
    2, // read 2 components
    gl.FLOAT, // type
    false, // no normalisation
    BYTES_PER_VERTEX, // stride (12 bytes)
    0, // byte offset within each vertex
  );
  gl.enableVertexAttribArray(aPositionLoc);

  const aColorLoc = gl.getAttribLocation(program, `a_color`);
  gl.vertexAttribPointer(
    aColorLoc, // location of the attribute
    4, // read 4 components
    gl.UNSIGNED_BYTE, // type
    true, // normalise
    BYTES_PER_VERTEX, // stride (12 bytes)
    8, // byte offset within each vertex
  );
  gl.enableVertexAttribArray(aColorLoc);
};

export const initShader = (renderer: WebGLRenderer): WebGLProgram => {
  const gl = renderer.gl;

  const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
  const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);

  const program = createProgram(gl, vertexShader, fragmentShader);

  // Blend mode: premultiplied alpha, matching the WebGPU backend
  gl.enable(gl.BLEND);
  gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

  return program;
};
