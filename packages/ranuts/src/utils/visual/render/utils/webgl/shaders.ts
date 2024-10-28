export const vertexShaderSource = `
precision highp float;
attribute vec2 a_position;
attribute vec4 a_color;
varying vec4 v_color;
uniform mat3 u_root_transform;
uniform mat3 u_projection_matrix;
void main(){
  v_color = a_color;
  gl_Position = vec4((u_projection_matrix * u_root_transform * vec3(a_position, 1.0)).xy, 0.0, 1.0);
}
`.trim();

export const fragmentShaderSource = `
precision mediump float;
varying vec4 v_color;
void main(){
  gl_FragColor = v_color;
}
`.trim();
