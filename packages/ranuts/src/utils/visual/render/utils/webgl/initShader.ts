import { BYTES_PER_VERTEX } from '@/utils/visual/enums';
import type { WebGLRenderer } from '@/utils/visual/render/webGLRenderer';
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
    console.error(`编译 shader 错误：${err}`);
    throw new Error(`编译 shader 错误：${err}`);
  }
};

const createProgram = (gl: WebGLRenderingContext, vertexShader: WebGLShader, fragmentShader: WebGLShader) => {
  const program = gl.createProgram() as WebGLProgram;
  if (!program) {
    console.error(`创建 program 失败`);
    throw new Error(`创建 program 失败`);
  }

  gl.attachShader(program, vertexShader); // 内部会判断是 vertexShader 还是 fragmentShader
  gl.attachShader(program, fragmentShader);

  gl.linkProgram(program);
  // 检查 link 结果
  const linked = gl.getProgramParameter(program, gl.LINK_STATUS);
  if (!linked) {
    const err = gl.getProgramInfoLog(program);
    console.error(`link 出错：${err}`);
    gl.deleteProgram(program);
    gl.deleteShader(vertexShader);
    gl.deleteShader(fragmentShader);
    throw new Error(`link 出错：${err}`);
  }

  gl.useProgram(program);

  return program;
};

const setVertexAttribPointer = (gl: WebGLRenderingContext, program: WebGLProgram) => {
  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, gl.createBuffer());

  const aPositionLoc = gl.getAttribLocation(program, `a_position`);
  gl.vertexAttribPointer(
    aPositionLoc, // attribute 变量的 location
    2, // 读 2 个单元
    gl.FLOAT, //类型
    false, //不需要正交化
    BYTES_PER_VERTEX, //跨度 (12 个 byte)
    0, // 从每组的第几个字节开始读
  );
  gl.enableVertexAttribArray(aPositionLoc);

  const aColorLoc = gl.getAttribLocation(program, `a_color`);
  gl.vertexAttribPointer(
    aColorLoc, // attribute 变量的 location
    4, // 读 4 个单元
    gl.UNSIGNED_BYTE, //类型
    true, //需要正交化
    BYTES_PER_VERTEX, //跨度 (12 个 byte)
    8, // 从每组的第几个字节开始读
  );
  gl.enableVertexAttribArray(aColorLoc);
};

export const initShader = (renderer: WebGLRenderer): WebGLProgram => {
  const gl = renderer.gl;

  const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
  const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);

  const program = createProgram(gl, vertexShader, fragmentShader);

  setVertexAttribPointer(gl, program);

  // 指定混合模式
  gl.enable(gl.BLEND);
  gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

  return program;
};
